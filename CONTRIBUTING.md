# Contributing to GMPSignal MCP, Clay, n8n & SDK Starter Kit

Thank you for contributing to the **GMPSignal 40-Actor Enterprise Intelligence Suite** (`@gmpsignal/mcp-server`).

## Development & Verification Workflow

1. **Prerequisites:**
   - Node.js `>= 18.0.0` (Node.js `20 LTS` or `22 LTS` recommended)
   - Python `>= 3.10` (for verifying SDK examples)

2. **Local Validation Commands:**
   ```bash
   # Verify syntax of the MCP Server & Node.js SDK
   node --check packages/gmpsignal-mcp/bin/cli.mjs
   node --check packages/gmpsignal-mcp/index.mjs
   node --check examples/nodejs-sdk-pipeline.mjs

   # Test zero-credential MCP JSON-RPC 2.0 stdio introspection
   printf '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"local-test","version":"1.0.0"}}}\n{"jsonrpc":"2.0","id":2,"method":"tools/list","params":{}}\n' | node packages/gmpsignal-mcp/bin/cli.mjs
   ```

3. **Coding Standards:**
   - All JavaScript and Python files must include descriptive English DocBlock comments.
   - Maintain zero external runtime dependencies in `packages/gmpsignal-mcp` and `packages/gmpsignal-org-mcp` so `npx -y @gmpsignal/mcp-server` starts instantaneously.
   - Keep `packages/gmpsignal-mcp` and `packages/gmpsignal-org-mcp` synchronized before opening a Pull Request.
