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
    echo "Starting Skillable Frontend on http://localhost:3000"
    BROWSER=none HOST=0.0.0.0 npm start 2>&1 | tee "$LOG_DIR/frontend.log"
    exit "${pipestatus[1]}"
    ;;

  backend)
    require_file "$ROOT_DIR/backend/app/main.py"
    require_executable "$ROOT_DIR/backend/.venv/bin/uvicorn"
    kill_port 8000
    cd "$ROOT_DIR/backend"
    echo "Starting Skillable Backend on http://127.0.0.1:8000"
    source .venv/bin/activate
    uvicorn app.main:app --reload --host 0.0.0.0 --port 8000 2>&1 | tee "$LOG_DIR/backend.log"
    exit "${pipestatus[1]}"
    ;;

  authenticator)
    require_file "$ROOT_DIR/authenticatorApi/app/main.py"
    require_executable "$ROOT_DIR/authenticatorApi/.venv/bin/uvicorn"
    kill_port 9100
    cd "$ROOT_DIR/authenticatorApi"
    echo "Starting Skillable Authenticator on http://127.0.0.1:9100"
    source .venv/bin/activate
    uvicorn app.main:app --reload --host 0.0.0.0 --port 9100 2>&1 | tee "$LOG_DIR/authenticator.log"
    exit "${pipestatus[1]}"
    ;;

  matching)
    require_file "$ROOT_DIR/skillMatchingApi/app/main.py"
    require_executable "$ROOT_DIR/skillMatchingApi/.venv/bin/uvicorn"
    kill_port 9000
    cd "$ROOT_DIR/skillMatchingApi"
    echo "Starting Skillable Matching on http://127.0.0.1:9000"
    source .venv/bin/activate
    uvicorn app.main:app --reload --host 0.0.0.0 --port 9000 2>&1 | tee "$LOG_DIR/matching.log"
    exit "${pipestatus[1]}"
    ;;

  *)
    fail "Unknown service '$SERVICE'. Use: frontend, backend, authenticator, or matching."
    ;;
esac
