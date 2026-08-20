#!/bin/bash
# Run this script from the repo root, or stand-alone from this directory.
cd "$(dirname "$0")" || exit 1

set -a
source ../../../.env
set +a

fnm exec --using=22 -- promptfoo eval -c promptfooconfig.yaml "$@"
