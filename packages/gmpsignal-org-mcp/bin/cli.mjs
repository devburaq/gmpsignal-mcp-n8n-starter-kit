#!/usr/bin/env node
/**
 * @file cli.mjs
 * @description Official Model Context Protocol (MCP) JSON-RPC 2.0 stdio server and CLI launcher
 * for the GMPSignal 40-Actor Enterprise Data, Quantitative Crypto, Prediction Markets,
 * B2B Enrichment, KYB/Sanctions, Cybersecurity & Regulatory Intelligence Suite on Apify.
 * Supports full offline/container introspection (initialize, tools/list, resources/list,
 * prompts/list) for Glama.ai / Smithery.ai inspections and executes live Apify Actor runs on tools/call.
 */

import readline from 'node:readline';
import { GMPSIGNAL_SUITES, resolveActorsForSuite, buildMcpServerConfig } from '../index.mjs';

/**
 * Detailed MCP Tool schemas for GMPSignal's Flagship & Regional Apify Intelligence Actors.
 * @type {Array<{name: string, actorSlug: string, description: string, inputSchema: Object}>}
 */
const MCP_TOOL_DEFINITIONS = [
    {
        name: 'dex_token_scanner_security_auditor',
        actorSlug: 'gmpsignal~dex-token-scanner-security-auditor',
        description: 'Scan DEX tokens across Solana, Ethereum, Base, Arbitrum, and BSC using DexScreener and GoPlus Security APIs to detect honeypots, mint/freeze authority, buy/sell taxes, and liquidity locks.',
        inputSchema: {
            type: 'object',
            properties: {
                chainId: { type: 'string', description: 'Target blockchain network (e.g., solana, ethereum, base, arbitrum, bsc).', default: 'solana' },
                searchQuery: { type: 'string', description: 'Token symbol, name, or contract/pair address to audit.', default: 'SOL' },
                minLiquidityUsd: { type: 'number', description: 'Minimum pool liquidity in USD.', default: 10000 },
                maxResults: { type: 'integer', description: 'Maximum number of audited token pairs to return.', default: 15 }
            },
            required: []
        }
    },
    {
        name: 'crypto_orderbook_arbitrage_scanner',
        actorSlug: 'gmpsignal~crypto-orderbook-arbitrage-scanner',
        description: 'Analyze live Level-2 order book depth, $10k/$50k/$100k execution slippage, and cross-exchange arbitrage spreads across Binance, Bybit, Kraken, Coinbase, OKX, and KuCoin.',
        inputSchema: {
            type: 'object',
            properties: {
                symbols: { type: 'array', items: { type: 'string' }, description: 'Trading pairs to scan (e.g., BTCUSDT, ETHUSDT, SOLUSDT).', default: ['BTCUSDT', 'ETHUSDT'] },
                exchanges: { type: 'array', items: { type: 'string' }, description: 'Exchanges to compare.', default: ['binance', 'bybit', 'kraken', 'coinbase'] },
                maxResults: { type: 'integer', description: 'Maximum order book records to return.', default: 20 }
            },
            required: []
        }
    },
    {
        name: 'multichain_wallet_aml_risk_screener',
        actorSlug: 'gmpsignal~multichain-wallet-aml-risk-screener',
        description: 'Screen EVM and Solana wallet addresses for native balances, transaction velocity, mixer exposure, sanctions flags, and automated AML risk scores.',
        inputSchema: {
            type: 'object',
            properties: {
                addresses: { type: 'array', items: { type: 'string' }, description: 'Wallet addresses to screen.' },
                chains: { type: 'array', items: { type: 'string' }, description: 'Chains to query (ethereum, base, arbitrum, polygon, bsc, solana).', default: ['ethereum'] },
                maxTransactions: { type: 'integer', description: 'Maximum recent transactions to inspect per wallet.', default: 10 }
            },
            required: ['addresses']
        }
    },
    {
        name: 'defi_yield_tvl_stablecoin_monitor',
        actorSlug: 'gmpsignal~defi-yield-tvl-stablecoin-monitor',
        description: 'Monitor DeFi yield farming APY pools, multi-chain protocol TVL momentum, and stablecoin peg health using live DeFiLlama intelligence.',
        inputSchema: {
            type: 'object',
            properties: {
                mode: { type: 'string', description: 'Query mode: yield_pools, protocol_tvl, or stablecoins.', default: 'yield_pools' },
                chains: { type: 'array', items: { type: 'string' }, description: 'Chains to filter (e.g., Ethereum, Solana, Arbitrum, Base).', default: ['Ethereum', 'Solana'] },
                minTvlUsd: { type: 'number', description: 'Minimum pool TVL in USD.', default: 1000000 },
                maxResults: { type: 'integer', description: 'Maximum records to return.', default: 25 }
            },
            required: []
        }
    },
    {
        name: 'prediction_markets_polymarket_kalshi_scanner',
        actorSlug: 'gmpsignal~prediction-markets-polymarket-kalshi-scanner',
        description: 'Fetch real-time implied probabilities, yes/no odds, trading volume, liquidity, and arbitrage opportunities across Polymarket, Kalshi, and Manifold Markets.',
        inputSchema: {
            type: 'object',
            properties: {
                sources: { type: 'array', items: { type: 'string' }, description: 'Prediction market venues (polymarket, kalshi, manifold).', default: ['polymarket', 'kalshi'] },
                keyword: { type: 'string', description: 'Optional keyword filter for market questions.', default: '' },
                minVolumeUsd: { type: 'number', description: 'Minimum market volume in USD.', default: 1000 },
                maxResults: { type: 'integer', description: 'Maximum prediction markets to return.', default: 25 }
            },
            required: []
        }
    },
    {
        name: 'b2b_company_techstack_contacts_enricher',
        actorSlug: 'gmpsignal~b2b-company-techstack-contacts-enricher',
        description: 'Enrich B2B company domains with decision-maker emails, phone numbers, social profiles, 38+ technology stack fingerprints, MX/SPF/DMARC security posture, and RDAP registration data.',
        inputSchema: {
            type: 'object',
            properties: {
                domains: { type: 'array', items: { type: 'string' }, description: 'Company domains to enrich (e.g., stripe.com, apify.com).' },
                extractContacts: { type: 'boolean', description: 'Extract emails, phones, and social links.', default: true },
                detectTechStack: { type: 'boolean', description: 'Detect frontend, analytics, CRM, and infrastructure technologies.', default: true },
                maxResults: { type: 'integer', description: 'Maximum enriched domain records to return.', default: 10 }
            },
            required: ['domains']
        }
    },
    {
        name: 'global_sanctions_pep_gleif_kyb_screener',
        actorSlug: 'gmpsignal~global-sanctions-pep-gleif-kyb-screener',
        description: 'Screen corporate entities and individuals against GLEIF Legal Entity Identifiers (LEI), OFAC/UN/EU global sanctions lists, and PEP compliance databases.',
        inputSchema: {
            type: 'object',
            properties: {
                entities: { type: 'array', items: { type: 'string' }, description: 'Company or individual names to screen for KYB/AML compliance.' },
                includeGleifLei: { type: 'boolean', description: 'Query official GLEIF LEI corporate registry.', default: true },
                includeSanctionsMatch: { type: 'boolean', description: 'Screen against global sanctions and watchlists.', default: true },
                maxResults: { type: 'integer', description: 'Maximum compliance records to return.', default: 15 }
            },
            required: ['entities']
        }
    },
    {
        name: 'cyber_cve_kev_epss_vulnerability_scanner',
        actorSlug: 'gmpsignal~cyber-cve-kev-epss-vulnerability-scanner',
        description: 'Correlate CISA Known Exploited Vulnerabilities (KEV), FIRST.org 30-day EPSS exploitation probabilities, and NVD CVSS v3 severity scores for DevSecOps prioritization.',
        inputSchema: {
            type: 'object',
            properties: {
                mode: { type: 'string', description: 'Scan mode: cisa_kev or specific_cves.', default: 'cisa_kev' },
                vendorFilter: { type: 'string', description: 'Optional vendor or product filter (e.g., Microsoft, Cisco, Linux).', default: '' },
                minEpssScore: { type: 'number', description: 'Minimum 30-day EPSS exploitation probability (0.0 to 1.0).', default: 0.05 },
                maxResults: { type: 'integer', description: 'Maximum CVE records to return.', default: 25 }
            },
            required: []
        }
    },
    {
        name: 'startup_vc_dealflow_yc_github_radar',
        actorSlug: 'gmpsignal~startup-vc-dealflow-yc-github-radar',
        description: 'Discover high-traction startups and open-source developer tools across Y Combinator (YC), GitHub Trending repositories, and Hacker News launches.',
        inputSchema: {
            type: 'object',
            properties: {
                sources: { type: 'array', items: { type: 'string' }, description: 'Deal-flow sources (yc_companies, github_trending, hackernews_launch).', default: ['yc_companies', 'github_trending', 'hackernews_launch'] },
                keyword: { type: 'string', description: 'Optional industry or technology keyword filter.', default: '' },
                maxResults: { type: 'integer', description: 'Maximum startup/repository records to return.', default: 25 }
            },
            required: []
        }
    },
    {
        name: 'academic_patent_research_citation_intelligence',
        actorSlug: 'gmpsignal~academic-patent-research-citation-intelligence',
        description: 'Search peer-reviewed scientific papers, citation velocity, DOI metadata, and open-access PDFs across OpenAlex, Semantic Scholar, Crossref, and arXiv.',
        inputSchema: {
            type: 'object',
            properties: {
                query: { type: 'string', description: 'Scientific research topic, keyword, or author query.', default: 'autonomous AI agents' },
                sources: { type: 'array', items: { type: 'string' }, description: 'Academic databases (openalex, semantic_scholar, arxiv, crossref).', default: ['openalex', 'semantic_scholar', 'arxiv'] },
                minYear: { type: 'integer', description: 'Minimum publication year.', default: 2024 },
                maxResults: { type: 'integer', description: 'Maximum papers to return.', default: 20 }
            },
            required: ['query']
        }
    },
    {
        name: 'shopify_global_store_products_scraper',
        actorSlug: 'gmpsignal~shopify-global-store-products-scraper',
        description: 'Extract complete product catalogs, SKU variants, stock availability, compare-at prices, and discount percentages from any global Shopify store domain.',
        inputSchema: {
            type: 'object',
            properties: {
                stores: { type: 'array', items: { type: 'string' }, description: 'Shopify store domains (e.g., allbirds.com, kyliecosmetics.com).', default: ['allbirds.com', 'kyliecosmetics.com'] },
                searchKeyword: { type: 'string', description: 'Optional keyword filter for product title or tags.', default: '' },
                onlyInStock: { type: 'boolean', description: 'Return only in-stock products.', default: false },
                maxProductsPerStore: { type: 'integer', description: 'Maximum products per store.', default: 15 },
                maxResults: { type: 'integer', description: 'Maximum total products to return.', default: 30 }
            },
            required: ['stores']
        }
    },
    {
        name: 'sec_edgar_filings_scraper',
        actorSlug: 'gmpsignal~sec-edgar-filings',
        description: 'Fetch official US SEC EDGAR corporate filings (10-K, 10-Q, 8-K, Form 4 insider transactions) by ticker, CIK, or form type.',
        inputSchema: {
            type: 'object',
            properties: {
                tickers: { type: 'array', items: { type: 'string' }, description: 'Stock tickers or CIK codes (e.g., AAPL, NVDA, MSFT).', default: ['AAPL', 'NVDA'] },
                forms: { type: 'array', items: { type: 'string' }, description: 'SEC form types (e.g., 10-K, 10-Q, 8-K, 4).', default: ['10-K', '10-Q', '8-K'] },
                maxResults: { type: 'integer', description: 'Maximum filings to return.', default: 25 }
            },
            required: []
        }
    },
    {
        name: 'eu_ted_public_tenders_scraper',
        actorSlug: 'gmpsignal~eu-ted-tenders-scraper',
        description: 'Search European Union Tenders Electronic Daily (TED) public procurement notices, CPV codes, contracting authorities, and official PDF/HTML links.',
        inputSchema: {
            type: 'object',
            properties: {
                searchQuery: { type: 'string', description: 'Procurement keyword or CPV topic.', default: 'software' },
                maxResults: { type: 'integer', description: 'Maximum tender notices to return.', default: 25 }
            },
            required: []
        }
    },
    {
        name: 'fda_warning_letters_compliance_scraper',
        actorSlug: 'gmpsignal~fda-warning-letters-scraper',
        description: 'Monitor US FDA pharmaceutical, medical device, biologics, and food GMP inspection warning letters and violation categories.',
        inputSchema: {
            type: 'object',
            properties: {
                searchKeyword: { type: 'string', description: 'Optional company name or violation keyword.', default: '' },
                maxResults: { type: 'integer', description: 'Maximum warning letters to return.', default: 25 }
            },
            required: []
        }
    },
    {
        name: 'fda_recalls_enforcement_monitor',
        actorSlug: 'gmpsignal~fda-recalls-enforcement',
        description: 'Query official US openFDA drug, medical device, and food recall enforcement reports.',
        inputSchema: {
            type: 'object',
            properties: {
                category: { type: 'string', description: 'Recall category (drug, device, food).', default: 'drug' },
                maxResults: { type: 'integer', description: 'Maximum recall reports to return.', default: 25 }
            },
            required: []
        }
    },
    {
        name: 'earthquake_monitor_usgs_emsc_afad',
        actorSlug: 'gmpsignal~earthquake-monitor-usgs-emsc-afad',
        description: 'Track cross-verified global and regional seismic events in real time across USGS, EMSC, and AFAD networks.',
        inputSchema: {
            type: 'object',
            properties: {
                minMagnitude: { type: 'string', description: 'Minimum Richter magnitude threshold (e.g., "3.0", "4.5").', default: '4.5' },
                maxResults: { type: 'integer', description: 'Maximum seismic events to return.', default: 25 }
            },
            required: []
        }
    }
];

/**
 * Executes an Apify Actor synchronously via REST API v2 when a tool is invoked.
 *
 * @param {string} actorSlug - Target Apify Actor slug (`gmpsignal~...`).
 * @param {Object} args - Tool input arguments.
 * @returns {Promise<Array<Object>>} Dataset items returned by the Actor run.
 */
async function invokeApifyActor(actorSlug, args) {
    const token = process.env.APIFY_TOKEN || '';
    if (!token) {
        throw new Error('APIFY_TOKEN environment variable is required to execute live Apify Actor runs. Get your token at https://console.apify.com/settings/integrations');
    }
    const url = `https://api.apify.com/v2/acts/${encodeURIComponent(actorSlug)}/run-sync-get-dataset-items?token=${encodeURIComponent(token)}`;
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(args || {})
    });
    if (!response.ok) {
        const errBody = await response.text();
        throw new Error(`Apify Actor ${actorSlug} returned HTTP ${response.status}: ${errBody}`);
    }
    return await response.json();
}

/**
 * Sends a JSON-RPC 2.0 response over stdout.
 *
 * @param {string|number|null} id - Request ID.
 * @param {Object} result - Result payload.
 */
function sendJsonRpcResult(id, result) {
    const payload = {
        jsonrpc: '2.0',
        id,
        result
    };
    process.stdout.write(`${JSON.stringify(payload)}\n`);
}

/**
 * Sends a JSON-RPC 2.0 error over stdout.
 *
 * @param {string|number|null} id - Request ID.
 * @param {number} code - JSON-RPC error code.
 * @param {string} message - Error description.
 */
function sendJsonRpcError(id, code, message) {
    const payload = {
        jsonrpc: '2.0',
        id,
        error: {
            code,
            message
        }
    };
    process.stdout.write(`${JSON.stringify(payload)}\n`);
}

/**
 * Handles an incoming JSON-RPC 2.0 message from the MCP host or inspection harness.
 *
 * @param {Object} message - Parsed JSON-RPC 2.0 message.
 * @returns {Promise<void>}
 */
async function handleJsonRpcMessage(message) {
    if (!message || typeof message !== 'object') {
        return;
    }

    const { id, method, params } = message;

    if (method === 'initialize') {
        sendJsonRpcResult(id, {
            protocolVersion: (params && params.protocolVersion) ? params.protocolVersion : '2024-11-05',
            capabilities: {
                tools: { listChanged: false },
                resources: { subscribe: false, listChanged: false },
                prompts: { listChanged: false }
            },
            serverInfo: {
                name: 'gmpsignal-mcp-server',
                version: '1.1.0'
            }
        });
        return;
    }

    if (method === 'notifications/initialized' || method === 'initialized') {
        return;
    }

    if (method === 'ping') {
        sendJsonRpcResult(id, {});
        return;
    }

    if (method === 'tools/list') {
        sendJsonRpcResult(id, {
            tools: MCP_TOOL_DEFINITIONS.map((t) => ({
                name: t.name,
                description: t.description,
                inputSchema: t.inputSchema
            }))
        });
        return;
    }

    if (method === 'resources/list') {
        sendJsonRpcResult(id, {
            resources: [
                {
                    uri: 'mcp://gmpsignal/actors-catalog',
                    name: 'GMPSignal 40-Actor Enterprise Intelligence Suite Catalog',
                    description: 'Complete list of 40 Apify Actors organized across Crypto/Quant, B2B/E-Commerce, KYB/Cyber/Regulatory, and Regional suites.',
                    mimeType: 'application/json'
                }
            ]
        });
        return;
    }

    if (method === 'resources/read') {
        const uri = params && params.uri ? params.uri : 'mcp://gmpsignal/actors-catalog';
        sendJsonRpcResult(id, {
            contents: [
                {
                    uri,
                    mimeType: 'application/json',
                    text: JSON.stringify(GMPSIGNAL_SUITES, null, 2)
                }
            ]
        });
        return;
    }

    if (method === 'prompts/list') {
        sendJsonRpcResult(id, {
            prompts: [
                {
                    name: 'crypto_token_due_diligence',
                    description: 'Perform smart-contract rugpull auditing and multi-exchange order book slippage analysis on a target crypto token.',
                    arguments: [
                        { name: 'tokenSymbol', description: 'Token symbol or contract address (e.g., SOL, PEPE).', required: true },
                        { name: 'chainId', description: 'Blockchain network (e.g., solana, ethereum, base).', required: false }
                    ]
                },
                {
                    name: 'b2b_lead_and_kyb_compliance_check',
                    description: 'Enrich a company domain with tech-stack and contacts while screening the corporate entity against GLEIF LEI and global sanctions.',
                    arguments: [
                        { name: 'domain', description: 'Company website domain (e.g., stripe.com).', required: true },
                        { name: 'companyName', description: 'Legal entity name for KYB screening.', required: true }
                    ]
                }
            ]
        });
        return;
    }

    if (method === 'prompts/get') {
        const promptName = params && params.name ? params.name : 'crypto_token_due_diligence';
        const promptArgs = (params && params.arguments) || {};
        sendJsonRpcResult(id, {
            description: `GMPSignal automated workflow prompt for ${promptName}`,
            messages: [
                {
                    role: 'user',
                    content: {
                        type: 'text',
                        text: `Execute the GMPSignal MCP tools for ${promptName} with parameters: ${JSON.stringify(promptArgs)}`
                    }
                }
            ]
        });
        return;
    }

    if (method === 'tools/call') {
        const toolName = params && params.name;
        const toolArgs = (params && params.arguments) || {};
        const toolDef = MCP_TOOL_DEFINITIONS.find((t) => t.name === toolName);
        if (!toolDef) {
            sendJsonRpcError(id, -32602, `Unknown GMPSignal MCP tool: ${toolName}`);
            return;
        }
        try {
            const items = await invokeApifyActor(toolDef.actorSlug, toolArgs);
            sendJsonRpcResult(id, {
                content: [
                    {
                        type: 'text',
                        text: JSON.stringify(items, null, 2)
                    }
                ],
                isError: false
            });
        } catch (err) {
            sendJsonRpcResult(id, {
                content: [
                    {
                        type: 'text',
                        text: `Error executing ${toolDef.actorSlug}: ${err.message}`
                    }
                ],
                isError: true
            });
        }
        return;
    }

    if (id !== undefined && id !== null) {
        sendJsonRpcError(id, -32601, `Method not found: ${method}`);
    }
}

/**
 * Parses CLI flags or starts the native JSON-RPC 2.0 MCP server over stdio.
 */
function main() {
    const argv = process.argv.slice(2);
    let suite = 'flagship';
    let listOnly = false;
    let printConfig = false;

    for (let i = 0; i < argv.length; i += 1) {
        const arg = argv[i];
        if (arg === '--suite' && argv[i + 1]) {
            suite = argv[i + 1];
            i += 1;
        } else if (arg === '--list') {
            listOnly = true;
        } else if (arg === '--print-config') {
            printConfig = true;
        }
    }

    if (listOnly) {
        console.log('GMPSignal 40-Actor Intelligence Suites (https://apify.com/gmpsignal):');
        for (const [suiteKey, actorList] of Object.entries(GMPSIGNAL_SUITES)) {
            console.log(`\n[${suiteKey.toUpperCase()}] (${actorList.length} Actors):`);
            for (const slug of actorList) {
                console.log(`  - ${slug}`);
            }
        }
        return;
    }

    if (printConfig) {
        const configObj = buildMcpServerConfig(suite);
        console.log(JSON.stringify(configObj, null, 2));
        return;
    }

    const rl = readline.createInterface({
        input: process.stdin,
        terminal: false
    });

    rl.on('line', (line) => {
        const trimmed = line.trim();
        if (!trimmed) return;
        try {
            const parsed = JSON.parse(trimmed);
            handleJsonRpcMessage(parsed).catch((err) => {
                if (parsed && parsed.id !== undefined) {
                    sendJsonRpcError(parsed.id, -32603, err.message);
                }
            });
        } catch (_err) {
            sendJsonRpcError(null, -32700, 'Parse error');
        }
    });
}

main();
