# Security Policy

## Supported Versions

The following versions of `@gmpsignal/mcp-server` and `gmpsignal-mcp` receive active security updates:

| Version | Supported |
| :--- | :--- |
| `1.4.x` | Yes |
| `1.3.x` | Yes |
| `< 1.3.0` | No |

## Security Architecture & Zero-Credential Introspection

- **Read-Only Tool Annotations:** All 18 MCP tools exposed by `@gmpsignal/mcp-server` carry `readOnlyHint: true` and `destructiveHint: false` annotations.
- **Zero-Credential Offline Introspection:** Containerized or local `initialize`, `tools/list`, `resources/list`, and `prompts/list` JSON-RPC 2.0 requests execute offline without requiring `APIFY_TOKEN`.
- **Credential Isolation:** When executing live Apify Actors via `tools/call`, the `APIFY_TOKEN` environment variable is transmitted strictly over TLS 1.3 (`https://api.apify.com/v2`) and is never logged or persisted to disk.

## Reporting a Vulnerability

If you discover a security vulnerability within this repository or any of the 40 GMPSignal Apify Actors:

1. Please **do not** open a public GitHub issue containing sensitive exploit details.
2. Report the finding via GitHub Security Advisories (`https://github.com/devburaq/gmpsignal-mcp-n8n-starter-kit/security/advisories/new`) or email `7777nft@gmail.com`.
3. Include a minimal reproduction payload and the affected tool or Actor slug. We acknowledge all reports within 24 hours and publish patches within 72 hours.
