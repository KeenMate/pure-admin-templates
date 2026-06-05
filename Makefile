# @keenmate/pureadmin templates - Makefile
#
# Publish/pack delegate to the CLI (npx @keenmate/pureadmin). The CLI does
# proper target resolution (--server prod → looks up config.targets.prod),
# integrity verification, and API-key resolution. The standalone publish.js
# / pack.js scripts predate `templates publish` and are no longer used.

.PHONY: help publish pack checksums clean

# Optional: target a single template, e.g. `make publish TPL=svelte-spa`
TPL ?=
# Optional: pass to the CLI as --server, e.g. `make publish SERVER=prod` or
# `make publish SERVER=http://localhost:8888`. Accepts target names from
# config.targets in .pureadmin.json / pureadmin.json / ~/.pureadmin.json,
# or a raw URL with scheme.
SERVER ?=
SERVER_ARG = $(if $(SERVER),--server $(SERVER),)

# Use the locally-developed CLI if PUREADMIN_CLI points at it, otherwise
# fall back to the published npm package.
PUREADMIN_CLI ?=
CLI = $(if $(PUREADMIN_CLI),npx --prefix $(PUREADMIN_CLI) pureadmin,npx @keenmate/pureadmin)

help:
	@echo "@keenmate/pureadmin templates - Available Commands:"
	@echo ""
	@echo "  make publish              - Pack + upload all templates to pureadmin.io"
	@echo "  make publish TPL=name     - Publish a single template (e.g. TPL=svelte-spa)"
	@echo "  make publish SERVER=prod  - Resolve --server via config.targets, or pass a raw URL"
	@echo "  make pack                 - Pack all templates into dist/ (no upload)"
	@echo "  make pack TPL=name        - Pack a single template"
	@echo "  make checksums            - Recompute SHA-256 checksums in source template.json"
	@echo "  make checksums TPL=name   - Recompute checksums for one template"
	@echo "  make clean                - Remove dist/"
	@echo ""
	@echo "  PUREADMIN_CLI=../pure-admin-cli make publish    - Use a local CLI checkout"
	@echo ""

publish:
	$(CLI) templates publish $(TPL) $(SERVER_ARG)

pack:
	$(CLI) templates pack $(TPL) $(SERVER_ARG)

# update-checksums.js writes hashes back into the source template.json
# files in-repo. The CLI's `templates pack` only injects checksums into the
# packed zip's manifest — so this remains a separate, local-only step.
checksums:
	node scripts/update-checksums.js $(TPL)

clean:
	rm -rf dist
