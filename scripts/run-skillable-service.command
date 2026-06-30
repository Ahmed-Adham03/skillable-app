#!/bin/zsh
set -euo pipefail

export PATH="/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:$PATH"

SERVICE="${1:-}"
ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
RUN_DIR="$ROOT_DIR/.skillable-run"
LOG_DIR="$RUN_DIR/logs"

fail() {
  echo "ERROR: $1" >&2
  exit 1
}

require_file() {
  [[ -f "$1" ]] || fail "Missing required file: $1"
}

require_executable() {
  [[ -x "$1" ]] || fail "Missing executable: $1"
}

print_banner() {
  local title="$1"
  local url="$2"
  local log_file="$3"
  local color="$4"
  local reset="\\033[0m"
  local bold="\\033[1m"

  printf "\\033]0;%s\\007" "$title"
  printf "${color}${bold}"
  echo "============================================================"
  echo "$title"
  echo "URL: $url"
  echo "Log: $log_file"
  echo "============================================================"
  printf "${reset}"
  echo ""
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

mkdir -p "$LOG_DIR"

case "$SERVICE" in
  frontend)
    require_file "$ROOT_DIR/package.json"
    require_file "$ROOT_DIR/package-lock.json"
    kill_port 3000
    cd "$ROOT_DIR"
    print_banner "Skillable Frontend UI :3000" "http://localhost:3000" "$LOG_DIR/frontend.log" "\\033[34m"
    FORCE_COLOR=1 BROWSER=none HOST=0.0.0.0 npm start 2>&1 | tee "$LOG_DIR/frontend.log"
    exit "${pipestatus[1]}"
    ;;

  backend)
    require_file "$ROOT_DIR/backend/app/main.py"
    require_executable "$ROOT_DIR/backend/.venv/bin/uvicorn"
    kill_port 8000
    cd "$ROOT_DIR/backend"
    print_banner "Skillable Main API :8000" "http://127.0.0.1:8000" "$LOG_DIR/backend.log" "\\033[32m"
    source .venv/bin/activate
    uvicorn app.main:app --reload --host 0.0.0.0 --port 8000 --use-colors 2>&1 | tee "$LOG_DIR/backend.log"
    exit "${pipestatus[1]}"
    ;;

  authenticator)
    require_file "$ROOT_DIR/authenticatorApi/app/main.py"
    require_executable "$ROOT_DIR/authenticatorApi/.venv/bin/uvicorn"
    kill_port 9100
    cd "$ROOT_DIR/authenticatorApi"
    print_banner "Skillable Auth Codes :9100" "http://127.0.0.1:9100" "$LOG_DIR/authenticator.log" "\\033[33m"
    source .venv/bin/activate
    uvicorn app.main:app --reload --host 0.0.0.0 --port 9100 --use-colors 2>&1 | tee "$LOG_DIR/authenticator.log"
    exit "${pipestatus[1]}"
    ;;

  matching)
    require_file "$ROOT_DIR/skillMatchingApi/app/main.py"
    require_executable "$ROOT_DIR/skillMatchingApi/.venv/bin/uvicorn"
    kill_port 9000
    cd "$ROOT_DIR/skillMatchingApi"
    print_banner "Skillable Matching API :9000" "http://127.0.0.1:9000" "$LOG_DIR/matching.log" "\\033[35m"
    source .venv/bin/activate
    uvicorn app.main:app --reload --host 0.0.0.0 --port 9000 --use-colors 2>&1 | tee "$LOG_DIR/matching.log"
    exit "${pipestatus[1]}"
    ;;

  *)
    fail "Unknown service '$SERVICE'. Use: frontend, backend, authenticator, or matching."
    ;;
esac
