#!/usr/bin/env bash
set -euo pipefail

CODEX_HOME_DIR="${CODEX_HOME:-$HOME/.codex}"
STAMP="$(date +%Y%m%d-%H%M%S)"
BACKUP_DIR="$CODEX_HOME_DIR/backups/iaigc-fun-plugin-$STAMP"

mkdir -p "$BACKUP_DIR"

AUTH_SRC="$CODEX_HOME_DIR/auth.json"
CONFIG_SRC="$CODEX_HOME_DIR/config.toml"
AUTH_BAK="$BACKUP_DIR/auth.json.bak"
CONFIG_BAK="$BACKUP_DIR/config.toml.bak"
ROLLBACK="$BACKUP_DIR/rollback.sh"

if [[ -f "$AUTH_SRC" ]]; then
  cp "$AUTH_SRC" "$AUTH_BAK"
fi

if [[ -f "$CONFIG_SRC" ]]; then
  cp "$CONFIG_SRC" "$CONFIG_BAK"
fi

cat > "$ROLLBACK" <<'EOF'
#!/usr/bin/env bash
set -euo pipefail

BACKUP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CODEX_HOME_DIR="${CODEX_HOME:-$HOME/.codex}"

if [[ -f "$BACKUP_DIR/auth.json.bak" ]]; then
  cp "$BACKUP_DIR/auth.json.bak" "$CODEX_HOME_DIR/auth.json"
fi

if [[ -f "$BACKUP_DIR/config.toml.bak" ]]; then
  cp "$BACKUP_DIR/config.toml.bak" "$CODEX_HOME_DIR/config.toml"
fi

echo "Restored Codex state from $BACKUP_DIR"
EOF

chmod 700 "$BACKUP_DIR"
chmod 600 "$BACKUP_DIR"/* 2>/dev/null || true
chmod 700 "$ROLLBACK"

echo "backup_dir=$BACKUP_DIR"
[[ -f "$AUTH_BAK" ]] && echo "auth_backup=$AUTH_BAK" || echo "auth_backup=missing-source"
[[ -f "$CONFIG_BAK" ]] && echo "config_backup=$CONFIG_BAK" || echo "config_backup=missing-source"
echo "rollback=$ROLLBACK"
