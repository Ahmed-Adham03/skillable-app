#!/bin/zsh
set -euo pipefail

export PATH="/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:$PATH"

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
RUN_DIR="$ROOT_DIR/.skillable-run"
CHECK_ONLY=0

if [[ "${1:-}" == "--check" ]]; then
  CHECK_ONLY=1
fi

fail() {
  echo "ERROR: $1" >&2
  exit 1
}

info() {
  echo "✓ $1"
}

require_command() {
  command -v "$1" >/dev/null 2>&1 || fail "Missing command: $1"
}

require_dir() {
  [[ -d "$1" ]] || fail "Missing required directory: $1"
}

require_file() {
  [[ -f "$1" ]] || fail "Missing required file: $1"
}

require_executable() {
  [[ -x "$1" ]] || fail "Missing executable: $1"
}

kill_port() {
  local port="$1"
  local pids
  pids="$(lsof -ti tcp:"$port" 2>/dev/null || true)"
  if [[ -n "$pids" ]]; then
    echo "Clearing port $port..."
    echo "$pids" | xargs kill -TERM 2>/dev/null || true
    sleep 1
    pids="$(lsof -ti tcp:"$port" 2>/dev/null || true)"
    if [[ -n "$pids" ]]; then
      echo "$pids" | xargs kill -KILL 2>/dev/null || true
      sleep 1
    fi
  fi
}

write_runner() {
  local filename="$1"
  local title="$2"
  local dir="$3"
  local command="$4"
  local url="$5"
  local logfile="$6"
  local runner="$RUN_DIR/$filename"

  cat > "$runner" <<EOF
#!/bin/zsh
set -e
export PATH="/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:\$PATH"
printf '\\033]0;$title\\007'
cd "$dir" || exit 1
echo "=============================================="
echo "$title"
echo "Directory: $dir"
echo "URL:       $url"
echo "Log:       $logfile"
echo "=============================================="
echo ""
$command 2>&1 | tee "$logfile"
status=\${pipestatus[1]}
echo ""
echo "$title stopped with exit code \$status."
echo "Log saved at: $logfile"
echo "Press Enter to close this terminal."
read _
exit \$status
EOF
  chmod +x "$runner"
}

open_runner() {
  local runner="$1"
  osascript <<APPLESCRIPT
tell application "Terminal"
  activate
  do script "$runner"
end tell
APPLESCRIPT
}

echo "Skillable startup preflight"
echo "Project: $ROOT_DIR"
echo ""

require_command osascript
require_command lsof
require_command npm
require_command tee

require_dir "$ROOT_DIR/src"
require_dir "$ROOT_DIR/backend"
require_dir "$ROOT_DIR/authenticatorApi"
require_dir "$ROOT_DIR/skillMatchingApi"
require_file "$ROOT_DIR/package.json"
require_file "$ROOT_DIR/package-lock.json"
require_file "$ROOT_DIR/backend/app/main.py"
require_file "$ROOT_DIR/authenticatorApi/app/main.py"
require_file "$ROOT_DIR/skillMatchingApi/app/main.py"

require_executable "$ROOT_DIR/backend/.venv/bin/uvicorn"
require_executable "$ROOT_DIR/authenticatorApi/.venv/bin/uvicorn"
require_executable "$ROOT_DIR/skillMatchingApi/.venv/bin/uvicorn"

info "Required commands, folders, and virtualenv executables exist."

if [[ "$CHECK_ONLY" == "1" ]]; then
  info "Preflight check passed. No services were started."
  exit 0
fi

mkdir -p "$RUN_DIR/logs"

kill_port 3000
kill_port 8000
kill_port 9000
kill_port 9100

info "App ports are clear."

write_runner \
  "frontend.command" \
  "Skillable Frontend :3000" \
  "$ROOT_DIR" \
  "FORCE_COLOR=1 BROWSER=none HOST=0.0.0.0 npm start" \
  "http://localhost:3000" \
  "$RUN_DIR/logs/frontend.log"

write_runner \
  "backend.command" \
  "Skillable Backend :8000" \
  "$ROOT_DIR/backend" \
  "source .venv/bin/activate && uvicorn app.main:app --reload --host 0.0.0.0 --port 8000 --use-colors" \
  "http://127.0.0.1:8000" \
  "$RUN_DIR/logs/backend.log"

write_runner \
  "authenticator.command" \
  "Skillable Authenticator :9100" \
  "$ROOT_DIR/authenticatorApi" \
  "source .venv/bin/activate && uvicorn app.main:app --reload --host 0.0.0.0 --port 9100 --use-colors" \
  "http://127.0.0.1:9100" \
  "$RUN_DIR/logs/authenticator.log"

write_runner \
  "matching.command" \
  "Skillable Matching :9000" \
  "$ROOT_DIR/skillMatchingApi" \
  "source .venv/bin/activate && uvicorn app.main:app --reload --host 0.0.0.0 --port 9000 --use-colors" \
  "http://127.0.0.1:9000" \
  "$RUN_DIR/logs/matching.log"

open_runner "$RUN_DIR/frontend.command"
open_runner "$RUN_DIR/backend.command"
open_runner "$RUN_DIR/authenticator.command"
open_runner "$RUN_DIR/matching.command"

echo ""
info "Skillable services are opening in four separate Terminal windows."
echo "Frontend:       http://localhost:3000"
echo "Backend API:    http://127.0.0.1:8000"
echo "Code API:       http://127.0.0.1:9100"
echo "Matching API:   http://127.0.0.1:9000"
echo ""
echo "Logs are saved in: $RUN_DIR/logs"
