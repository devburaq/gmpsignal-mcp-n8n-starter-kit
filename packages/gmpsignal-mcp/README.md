# GMPSignal — 40 Enterprise Data, Crypto, Quant, B2B, KYB, Cyber & Regulatory APIs (MCP Server, Clay, n8n & SDK)

[![NPM @gmpsignal/mcp-server](https://img.shields.io/npm/v/@gmpsignal/mcp-server?label=%40gmpsignal%2Fmcp-server&color=0ea5e9)](https://www.npmjs.com/package/@gmpsignal/mcp-server)
[![NPM gmpsignal-mcp](https://img.shields.io/npm/v/gmpsignal-mcp?label=gmpsignal-mcp&color=6366f1)](https://www.npmjs.com/package/gmpsignal-mcp)
[![devburaq/gmpsignal-mcp-n8n-starter-kit MCP server](https://glama.ai/mcp/servers/devburaq/gmpsignal-mcp-n8n-starter-kit/badges/score.svg)](https://glama.ai/mcp/servers/devburaq/gmpsignal-mcp-n8n-starter-kit)
[![smithery badge](https://smithery.ai/badge/@devburaq/gmpsignal-mcp-n8n-starter-kit)](https://smithery.ai/server/@devburaq/gmpsignal-mcp-n8n-starter-kit)
[![Verify MCP Suite](https://github.com/devburaq/gmpsignal-mcp-n8n-starter-kit/actions/workflows/verify-mcp-suite.yml/badge.svg)](https://github.com/devburaq/gmpsignal-mcp-n8n-starter-kit/actions)
[![Apify Store Publisher](https://img.shields.io/badge/Apify_Store-40_Actors_%28%40gmpsignal%29-10b981)](https://apify.com/gmpsignal)
[![Live API & MCP Portal](https://img.shields.io/badge/Live_Portal-Interactive_Catalog_%26_MCP_Builder-f59e0b)](https://devburaq.github.io/gmpsignal-portal/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)

Official Model Context Protocol (**MCP**) Server, **Clay.com** HTTP API enrichment templates, **n8n** workflows, and **Python / Node.js SDK** starter kit for the **40 production-grade Apify Actors** built by **[`gmpsignal`](https://apify.com/gmpsignal)**.

Connect real-time **On-Chain Crypto & DeFi**, **Prediction Markets (Polymarket/Kalshi)**, **B2B Domain & Tech Stack Enrichment**, **Global Corporate KYB & OFAC/UN Sanctions**, **CISA KEV & EPSS Cybersecurity**, **YC Startup DealFlow**, **OpenAlex Scientific R&D**, **Global Shopify E-Commerce**, **US/EU Regulatory Filings**, and **Balkan/Turkish Market Intelligence** directly into **Claude Desktop, Cursor, Windsurf, Smithery, Glama, Clay.com, n8n, Make, LangChain, and Node.js**.

- **Interactive 40-Actor Catalog & MCP Config Builder:** [https://devburaq.github.io/gmpsignal-portal/](https://devburaq.github.io/gmpsignal-portal/)
- **Apify Store Profile (`@gmpsignal`):** [https://apify.com/gmpsignal](https://apify.com/gmpsignal)
- **NPM Organization Package:** [`@gmpsignal/mcp-server`](https://www.npmjs.com/package/@gmpsignal/mcp-server) (`v1.3.0`)
- **AI / LLM Index (`llms.txt` & `llms-full.txt`):** [llms.txt](https://devburaq.github.io/gmpsignal-portal/llms.txt) · [llms-full.txt](https://devburaq.github.io/gmpsignal-portal/llms-full.txt)

---

## 1. Quick Start: Claude Desktop, Cursor & Windsurf MCP Integration

### Option A: One-Line Official NPM Launcher (`@gmpsignal/mcp-server`)

Add the following to your `claude_desktop_config.json` or `.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "gmpsignal": {
      "command": "npx",
      "args": ["-y", "@gmpsignal/mcp-server", "--suite", "flagship"],
      "env": {
        "APIFY_TOKEN": "<YOUR_APIFY_API_TOKEN>"
      }
    }
  }
}
```

Available `--suite` presets:
- `flagship` *(Default — 11 top global Crypto, Quant, Prediction Markets, B2B, KYB, Cyber, VC, R&D, and Shopify Actors)*
- `crypto` *(6 DEX Security, OrderBook Arbitrage, Wallet AML, DeFi Yield/TVL, and Prediction Market Actors)*
- `b2b` *(4 B2B Tech-Stack & Contacts, Shopify Catalog, VC Deal-Flow, and Jobs Actors)*
- `compliance` *(8 Global KYB/Sanctions, CISA KEV + EPSS Cyber, OpenAlex R&D, SEC EDGAR, FDA, and EU TED Actors)*
- `regional` *(22 Seismic, Central Bank FX, Balkan Classifieds, and Regional Mobility Actors)*
- `all` *(All 40 GMPSignal Actors)*

### Option B: Direct `@apify/actors-mcp-server` Configuration

Copy [`mcp/claude_desktop_config.json`](./mcp/claude_desktop_config.json) or [`mcp/cursor_mcp.json`](./mcp/cursor_mcp.json):

```json
{
  "mcpServers": {
    "gmpsignal-intelligence-suite": {
      "command": "npx",
      "args": [
        "-y",
        "@apify/actors-mcp-server",
        "--actors",
        "gmpsignal/dex-token-scanner-security-auditor,gmpsignal/crypto-orderbook-arbitrage-scanner,gmpsignal/multichain-wallet-aml-risk-screener,gmpsignal/defi-yield-tvl-stablecoin-monitor,gmpsignal/prediction-markets-polymarket-kalshi-scanner,gmpsignal/b2b-company-techstack-contacts-enricher,gmpsignal/global-sanctions-pep-gleif-kyb-screener,gmpsignal/cyber-cve-kev-epss-vulnerability-scanner,gmpsignal/startup-vc-dealflow-yc-github-radar,gmpsignal/academic-patent-research-citation-intelligence,gmpsignal/shopify-global-store-products-scraper"
      ],
      "env": {
        "APIFY_TOKEN": "<YOUR_APIFY_API_TOKEN>"
      }
    }
  }
}
```

### MCP Directory Manifests (`Anthropic Registry`, `Smithery`, `Glama`, `PulseMCP`)
- [`server.json`](./server.json) — Official **Anthropic / Model Context Protocol Registry** manifest (`io.github.devburaq/gmpsignal-mcp-server`).
- [`smithery.yaml`](./smithery.yaml) — Official **Smithery.ai** stdio & config schema manifest.
- [`glama.json`](./glama.json) — Official **Glama.ai** MCP Server specification.
- [`mcp/mcp-registry.json`](./mcp/mcp-registry.json) — Complete **40-Actor Suite Registry** organized into 4 intelligence verticals.

---

## 2. Clay.com HTTP API Enrichment Recipes

Import or copy [`clay/clay-enrichment-recipes.json`](./clay/clay-enrichment-recipes.json) into **Clay.com** HTTP API columns for instant B2B and compliance enrichment:
1. **B2B Domain Tech-Stack, Contacts & Social Enricher** (`gmpsignal~b2b-company-techstack-contacts-enricher`)
2. **Global Sanctions, PEP & GLEIF LEI KYB Screener** (`gmpsignal~global-sanctions-pep-gleif-kyb-screener`)
3. **Shopify Store Products, Variants & Discount Auditor** (`gmpsignal~shopify-global-store-products-scraper`)
4. **Startup & VC Deal-Flow Radar (YC + GitHub + HN)** (`gmpsignal~startup-vc-dealflow-yc-github-radar`)

---

## 3. Ready-to-Import `n8n` Automation Workflows

Import any of the JSON files inside [`n8n-workflows/`](./n8n-workflows/) directly into your **n8n** workspace (**Workflows -> Import from File**):

1. [`1-dex-token-rugpull-telegram-alert.json`](./n8n-workflows/1-dex-token-rugpull-telegram-alert.json) — Scans trending DEX tokens on Solana/Ethereum/Base via `gmpsignal/dex-token-scanner-security-auditor`, filters out honeypots via GoPlus Security, and posts high-liquidity safe tokens to Telegram/Slack.
2. [`2-b2b-domain-techstack-crm-enrichment.json`](./n8n-workflows/2-b2b-domain-techstack-crm-enrichment.json) — Enriches inbound B2B domains with 38+ tech stack signatures, MX email provider (Google Workspace vs. Microsoft 365), DMARC security posture, RDAP domain age, and LinkedIn/X links via `gmpsignal/b2b-company-techstack-contacts-enricher`.
3. [`3-polymarket-kalshi-prediction-odds-monitor.json`](./n8n-workflows/3-polymarket-kalshi-prediction-odds-monitor.json) — Polls `gmpsignal/prediction-markets-polymarket-kalshi-scanner` every 15 minutes to track macro, crypto, and election implied probabilities across Polymarket, Kalshi, and Manifold.
4. [`4-cisa-kev-epss-secops-slack-alert.json`](./n8n-workflows/4-cisa-kev-epss-secops-slack-alert.json) — Daily DevSecOps workflow calling `gmpsignal/cyber-cve-kev-epss-vulnerability-scanner` to alert security teams on active ransomware CVEs (`inCisaKev: true`) and high 30-day EPSS exploit scores.

---

## 4. Node.js & Python AI Agent SDK Pipelines

- [`examples/nodejs-sdk-pipeline.mjs`](./examples/nodejs-sdk-pipeline.mjs) — Zero-dependency Node.js ESM pipeline running B2B Enrichment, Global KYB Sanctions Screening, and Crypto OrderBook Arbitrage concurrently via Apify REST API v2.
- [`examples/python_ai_agent_pipeline.py`](./examples/python_ai_agent_pipeline.py) — Zero-dependency Python 3 / LangChain / CrewAI tool wrapper calling Prediction Markets, CISA KEV + EPSS Cybersecurity, and OpenAlex Scientific R&D Actors.

---

## 5. Flagship B2B, Crypto, Quant & Regulatory Actors Catalog

| Vertical | Actor Title | Apify Store Slug | Hosted MCP Endpoint |
|---|---|---|---|
| **Crypto DEX & Security** | DEX Token Scanner & Rugpull Security Auditor | `gmpsignal/dex-token-scanner-security-auditor` | `https://mcp.apify.com?actors=gmpsignal/dex-token-scanner-security-auditor` |
| **Crypto Quant & L2** | Crypto Order Book, Slippage & Funding Arbitrage | `gmpsignal/crypto-orderbook-arbitrage-scanner` | `https://mcp.apify.com?actors=gmpsignal/crypto-orderbook-arbitrage-scanner` |
| **Web3 AML & KYT** | Multi-Chain Wallet Portfolio & AML Risk Screener | `gmpsignal/multichain-wallet-aml-risk-screener` | `https://mcp.apify.com?actors=gmpsignal/multichain-wallet-aml-risk-screener` |
| **DeFi & Stablecoins** | DeFi Yield Farming, Protocol TVL & Stablecoin Monitor | `gmpsignal/defi-yield-tvl-stablecoin-monitor` | `https://mcp.apify.com?actors=gmpsignal/defi-yield-tvl-stablecoin-monitor` |
| **Prediction Markets** | Polymarket, Kalshi & Manifold Prediction Markets API | `gmpsignal/prediction-markets-polymarket-kalshi-scanner` | `https://mcp.apify.com?actors=gmpsignal/prediction-markets-polymarket-kalshi-scanner` |
| **B2B Sales & Clay** | B2B Domain Tech Stack, Contacts, DNS & SSL Enricher | `gmpsignal/b2b-company-techstack-contacts-enricher` | `https://mcp.apify.com?actors=gmpsignal/b2b-company-techstack-contacts-enricher` |
| **Corporate KYB & Sanctions** | Global Corporate KYB, GLEIF LEI & Sanctions Screen | `gmpsignal/global-sanctions-pep-gleif-kyb-screener` | `https://mcp.apify.com?actors=gmpsignal/global-sanctions-pep-gleif-kyb-screener` |
| **Cybersecurity & SecOps** | CVE Vulnerability, CISA KEV, EPSS & Exploit Scanner | `gmpsignal/cyber-cve-kev-epss-vulnerability-scanner` | `https://mcp.apify.com?actors=gmpsignal/cyber-cve-kev-epss-vulnerability-scanner` |
| **VC & Startup DealFlow** | YC Startups, GitHub Trending & HN DealFlow Radar | `gmpsignal/startup-vc-dealflow-yc-github-radar` | `https://mcp.apify.com?actors=gmpsignal/startup-vc-dealflow-yc-github-radar` |
| **Scientific R&D & RAG** | OpenAlex Scientific Papers, Citations & R&D Monitor | `gmpsignal/academic-patent-research-citation-intelligence` | `https://mcp.apify.com?actors=gmpsignal/academic-patent-research-citation-intelligence` |
| **Global E-Commerce** | Shopify Store Products, Variants & Pricing Scraper | `gmpsignal/shopify-global-store-products-scraper` | `https://mcp.apify.com?actors=gmpsignal/shopify-global-store-products-scraper` |
| **US SEC Filings** | SEC EDGAR Filings & Insider Trades | `gmpsignal/sec-edgar-filings` | `https://mcp.apify.com?actors=gmpsignal/sec-edgar-filings` |
| **EU Public Tenders** | EU Public Procurement & Tenders (TED) | `gmpsignal/eu-ted-tenders-scraper` | `https://mcp.apify.com?actors=gmpsignal/eu-ted-tenders-scraper` |
| **FDA Compliance** | FDA Warning Letters & Compliance Scraper | `gmpsignal/fda-warning-letters-scraper` | `https://mcp.apify.com?actors=gmpsignal/fda-warning-letters-scraper` |
| **FDA Recalls** | FDA Recalls & Enforcement Reports | `gmpsignal/fda-recalls-enforcement` | `https://mcp.apify.com?actors=gmpsignal/fda-recalls-enforcement` |
| **Global Seismic** | Global & Turkey Earthquake Monitor (USGS + EMSC + AFAD) | `gmpsignal/earthquake-monitor-usgs-emsc-afad` | `https://mcp.apify.com?actors=gmpsignal/earthquake-monitor-usgs-emsc-afad` |
