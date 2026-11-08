# GMPSignal — Apify AI Agent, MCP Server, Clay & n8n Automation Starter Kit

Official integration starter kit for the **40 production-grade Apify Actors** built by **`gmpsignal`**. Connect real-time **On-Chain Crypto & DeFi**, **Prediction Markets (Polymarket/Kalshi)**, **B2B Domain & Tech Stack Enrichment**, **Global Corporate KYB & OFAC/UN Sanctions**, **CISA KEV & EPSS Cybersecurity**, **YC Startup DealFlow**, **OpenAlex Scientific R&D**, **Global Shopify E-Commerce**, **US/EU Regulatory Filings**, and **Balkan/Turkish Market Intelligence** directly into **Claude Desktop, Cursor, Windsurf, Smithery, Glama, Clay.com, n8n, Make, LangChain, and Node.js**.

---

## 1. Quick Start: Claude Desktop & Cursor MCP Integration

Copy [`mcp/claude_desktop_config.json`](./mcp/claude_desktop_config.json) into your `claude_desktop_config.json` (or [`.cursor/mcp.json`](./mcp/cursor_mcp.json)) and replace `<YOUR_APIFY_API_TOKEN>` with your Apify API token:

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

### MCP Directory Manifests (`Smithery`, `Glama`, `PulseMCP`)
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
