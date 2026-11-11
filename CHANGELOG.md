# Changelog

All notable changes to `@gmpsignal/mcp-server` and `gmpsignal-mcp` are documented in this file.

## [1.4.0] - 2026-11-11

### Added
- **Glama Grade `A` Tool Architecture:** Consolidated the default MCP tool surface into **18 high-precision `verb_noun` tools** (16 domain tools + 2 meta tools: `list_available_intelligence_actors` for zero-cost vertical discovery and `fetch_actor_dataset_page` for dataset pagination).
- **MCP 2025-03-26 Tool Annotations:** Added `annotations` (`title`, `readOnlyHint: true`, `destructiveHint: false`, `idempotentHint: true`, `openWorldHint: true`) and strict `enum`, `minimum`, and `maximum` JSON Schema bounds across all 18 tools.

## [1.3.1] - 2026-11-09

### Added
- **Postman Collection v2.1:** Added `postman/gmpsignal-40-actors.postman_collection.json` covering all 40 Apify Actors with default payloads.
- **OpenAPI 3.1.0 Specifications:** Added `openapi/openapi.json` (all 40 Actors) and `openapi/openapi-gpt-actions.json` (16 Flagship Actors for OpenAI Custom GPT Actions).
- **GHCR Docker Container:** Automated `ghcr.io/devburaq/gmpsignal-mcp-n8n-starter-kit:latest` builds via GitHub Actions.

## [1.3.0] - 2026-11-09

### Added
- **Official Anthropic MCP Registry:** Published `io.github.devburaq/gmpsignal-mcp-server` (`server.json`) to `https://registry.modelcontextprotocol.io` via GitHub OIDC.

## [1.2.0] - 2026-11-09

### Added
- **Native JSON-RPC 2.0 `stdio` MCP Server:** Implemented zero-dependency `initialize`, `tools/list`, `resources/list`, `prompts/list`, and `tools/call` handler with root `Dockerfile` for Glama.ai inspection.

## [1.0.0] - 2026-11-08

### Added
- Initial release of `@gmpsignal/mcp-server`, `gmpsignal-mcp`, Clay.com HTTP API recipes, 4 n8n workflows, and Node.js/Python SDK pipelines.
