#!/bin/zsh
# Prompts for a secret without echoing it and stores it in .env.local.
# Usage: zsh scripts/set-env-key.zsh TYPESAFE_API_KEY
set -eu
cd -- "${0:A:h}/.."
name=${1:-}
if [[ ! "$name" =~ '^[A-Z][A-Z0-9_]*$' ]]; then
  print -u2 'Usage: zsh scripts/set-env-key.zsh VARIABLE_NAME'
  exit 1
fi
if [[ ! -t 0 ]]; then
  print -u2 'Run this in your own terminal so the key can be entered privately.'
  exit 1
fi
read -rs "secret?$name (hidden): "
print ''
if [[ -z "$secret" || "$secret" == *$'\n'* || "$secret" == *$'\r'* ]]; then
  unset secret
  print -u2 'A nonempty, single-line value is required.'
  exit 1
fi
umask 077
touch .env.local
tmp=$(mktemp .env.local.XXXXXX)
grep -v "^$name=" .env.local > "$tmp" || true
printf '%s=%s\n' "$name" "$secret" >> "$tmp"
mv "$tmp" .env.local
chmod 600 .env.local
unset secret
print "Saved $name in .env.local."
