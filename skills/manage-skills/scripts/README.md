# Bundled management CLI

Run `skills.mjs` with Bun. It bundles commander 15.1.0 (MIT) and yaml 2.9.1
(ISC); see `THIRD-PARTY-NOTICES.txt`. No project `node_modules` is needed.
`skills-source.mjs` is the editable source, not the runtime entry point.

## Maintainer rebuild

With Bun and the exact dependency versions above already installed in the
maintainer environment, run from this directory:

```bash
bun build skills-source.mjs --target=node --format=esm --minify \
  --legal-comments=inline --outfile=skills.mjs
```

Rebuilding is a development task, not runtime setup. Update the notices when
changing dependencies. The source directory managed by the CLI is a caller input
(`--source`); it is unrelated to the directory where this script is installed.
