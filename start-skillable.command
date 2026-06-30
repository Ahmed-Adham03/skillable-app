#!/bin/zsh
DIR="$(cd "$(dirname "$0")" && pwd)"
exec "$DIR/scripts/start-skillable.command" "$@"
