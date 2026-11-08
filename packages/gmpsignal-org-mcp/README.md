# `gmpsignal-mcp` — Official MCP Server Launcher for GMPSignal's 40 Apify Intelligence APIs

Connect **40 production-grade JSON APIs & Apify Actors** by **[GMPSignal (`@gmpsignal`)](https://apify.com/gmpsignal)** directly into **Claude Desktop, Cursor, Windsurf, and MCP-compatible AI Agents** with a single command.

---

## Quick Usage

### 1. Print Ready-to-Paste Claude Desktop / Cursor MCP Config
```bash
npx gmpsignal-mcp --print-config --suite flagship
```

### 2. List All 40 Actors by Vertical Suite
```bash
npx gmpsignal-mcp --list
```

### 3. Run Directly as an MCP Server in `claude_desktop_config.json` or `.cursor/mcp.json`
```json
{
  "mcpServers": {
    "gmpsignal": {
      "command": "npx",
      "args": ["-y", "gmpsignal-mcp", "--suite", "flagship"],
      "env": {
        "APIFY_TOKEN": "<YOUR_APIFY_API_TOKEN>"
      }
    }
  }
}
```

---

## Available `--suite` Presets

| Suite Name | Included Intelligence Tools |
|---|---|
| `flagship` *(Default)* | Top 11 global Actors: DEX Security Auditor, Crypto OrderBook Arbitrage, Multi-Chain Wallet AML, DeFi Yield/TVL, Polymarket/Kalshi Odds, B2B Tech-Stack & Contacts, Global Sanctions/GLEIF KYB, CISA KEV + EPSS Cyber, YC/GitHub Startup Radar, OpenAlex Scientific R&D, and Shopify Store Scraper |
| `crypto` | 6 Quantitative Crypto, DeFi, OrderBook, Wallet AML & Prediction Market Actors |
| `b2b` | 4 B2B Lead Enrichment, Shopify E-Commerce, VC Deal-Flow & European Jobs Actors |
| `compliance` | 8 KYB/Sanctions, CISA KEV Cybersecurity, OpenAlex R&D, SEC EDGAR, FDA & EU TED Actors |
| `regional` | 22 Seismic, Central Bank FX, Balkan Marketplace & Regional Mobility Actors |
| `all` | All 40 GMPSignal Apify Actors |
