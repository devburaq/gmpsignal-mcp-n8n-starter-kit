#!/usr/bin/env node
/**
 * @file cli.mjs
 * @description Official Model Context Protocol (MCP) JSON-RPC 2.0 stdio server and CLI launcher
 * for the GMPSignal 40-Actor Enterprise Data, Quantitative Crypto, Prediction Markets,
 * B2B Enrichment, KYB/Sanctions, Cybersecurity & Regulatory Intelligence Suite on Apify.
 *
 * Exposes 18 high-precision verb_noun tools by default (16 domain intelligence tools + 2 meta
 * discovery and dataset pagination tools) to maximize LLM tool-selection accuracy and Glama TDQS,
 * while also supporting `--suite all` to expose all 40 individual Actor tools directly.
 */

import readline from 'node:readline';
import { GMPSIGNAL_SUITES, resolveActorsForSuite, buildMcpServerConfig } from '../index.mjs';

/**
 * Standard read-only MCP tool annotations for non-destructive external data queries.
 * @param {string} title - Human-readable tool title.
 * @returns {Object} MCP tool annotations object.
 */
function createReadOnlyAnnotations(title) {
    return {
        title,
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true
    };
}

/**
 * Curated 18-Tool High-Precision MCP Toolset (16 verb_noun domain tools + 2 meta/pagination tools).
 * Designed specifically to eliminate tool-selection ambiguity, provide discovery and pagination
 * utilities, and route cleanly to all 40 underlying GMPSignal Apify Actors.
 *
 * @type {Array<{name: string, actorSlug: string, description: string, annotations: Object, inputSchema: Object, resolveActorAndInput?: Function}>}
 */
const CORE_MCP_TOOLS = [
    {
        name: 'scan_dex_token_security',
        actorSlug: 'gmpsignal~dex-token-scanner-security-auditor',
        description: 'Scan decentralized exchange (DEX) token pairs across Solana, Ethereum, Base, Arbitrum, and BSC using DexScreener and GoPlus Security APIs to detect honeypots, mint/freeze authority, buy/sell taxes, and liquidity locks. Returns audited token pairs with riskLevel and security flags.',
        annotations: createReadOnlyAnnotations('Scan DEX Token & Smart Contract Security'),
        inputSchema: {
            type: 'object',
            additionalProperties: false,
            properties: {
                chainId: {
                    type: 'string',
                    enum: ['solana', 'ethereum', 'base', 'arbitrum', 'bsc', 'polygon'],
                    description: 'Target blockchain network identifier.',
                    default: 'solana'
                },
                searchQuery: {
                    type: 'string',
                    minLength: 1,
                    maxLength: 120,
                    description: 'Token ticker symbol (e.g., SOL, PEPE), token name, or smart contract address to audit.',
                    default: 'SOL'
                },
                minLiquidityUsd: {
                    type: 'number',
                    minimum: 0,
                    maximum: 1000000000,
                    description: 'Minimum DEX pool liquidity threshold in USD.',
                    default: 10000
                },
                maxResults: {
                    type: 'integer',
                    minimum: 1,
                    maximum: 100,
                    description: 'Maximum number of audited token records to return (1 to 100).',
                    default: 15
                }
            },
            required: ['searchQuery']
        }
    },
    {
        name: 'analyze_crypto_orderbook_arbitrage',
        actorSlug: 'gmpsignal~crypto-orderbook-arbitrage-scanner',
        description: 'Analyze live Level-2 cryptocurrency order book depth, $10k/$50k/$100k execution slippage basis points, and cross-exchange arbitrage spreads across Binance, Bybit, Kraken, Coinbase, OKX, and KuCoin.',
        annotations: createReadOnlyAnnotations('Analyze Crypto Order Book Depth & Arbitrage Spreads'),
        inputSchema: {
            type: 'object',
            additionalProperties: false,
            properties: {
                symbols: {
                    type: 'array',
                    items: { type: 'string', minLength: 3, maxLength: 20 },
                    minItems: 1,
                    maxItems: 20,
                    description: 'Trading pair symbols in uppercase (e.g., ["BTCUSDT", "ETHUSDT", "SOLUSDT"]).',
                    default: ['BTCUSDT', 'ETHUSDT']
                },
                exchanges: {
                    type: 'array',
                    items: {
                        type: 'string',
                        enum: ['binance', 'bybit', 'kraken', 'coinbase', 'okx', 'kucoin']
                    },
                    minItems: 2,
                    maxItems: 6,
                    description: 'Spot exchanges to compare for order book depth and arbitrage.',
                    default: ['binance', 'bybit', 'kraken', 'coinbase']
                },
                maxResults: {
                    type: 'integer',
                    minimum: 1,
                    maximum: 100,
                    description: 'Maximum number of order book and spread records to return.',
                    default: 20
                }
            },
            required: ['symbols']
        }
    },
    {
        name: 'screen_wallet_aml_risk',
        actorSlug: 'gmpsignal~multichain-wallet-aml-risk-screener',
        description: 'Screen EVM and Solana wallet addresses for native asset balances, recent transaction velocity, tornado/mixer exposure, OFAC sanctions flags, and automated anti-money-laundering (AML) risk scores (0-100).',
        annotations: createReadOnlyAnnotations('Screen Multi-Chain Wallet AML & Sanctions Risk'),
        inputSchema: {
            type: 'object',
            additionalProperties: false,
            properties: {
                addresses: {
                    type: 'array',
                    items: { type: 'string', minLength: 20, maxLength: 80 },
                    minItems: 1,
                    maxItems: 25,
                    description: 'EVM (0x...) or Solana base58 wallet addresses to screen.'
                },
                chains: {
                    type: 'array',
                    items: {
                        type: 'string',
                        enum: ['ethereum', 'base', 'arbitrum', 'polygon', 'bsc', 'solana']
                    },
                    minItems: 1,
                    maxItems: 6,
                    description: 'Blockchain networks to inspect for the provided addresses.',
                    default: ['ethereum', 'base']
                },
                maxTransactions: {
                    type: 'integer',
                    minimum: 1,
                    maximum: 50,
                    description: 'Maximum number of recent transactions to inspect per wallet address.',
                    default: 10
                }
            },
            required: ['addresses']
        }
    },
    {
        name: 'monitor_defi_yield_and_tvl',
        actorSlug: 'gmpsignal~defi-yield-tvl-stablecoin-monitor',
        description: 'Monitor decentralized finance (DeFi) yield farming APY pools, multi-chain protocol Total Value Locked (TVL) momentum, and stablecoin peg deviations using live DeFiLlama intelligence.',
        annotations: createReadOnlyAnnotations('Monitor DeFi Yield Pools, Protocol TVL & Stablecoin Pegs'),
        inputSchema: {
            type: 'object',
            additionalProperties: false,
            properties: {
                mode: {
                    type: 'string',
                    enum: ['yield_pools', 'protocol_tvl', 'stablecoins'],
                    description: 'Dataset view to query: yield_pools (APY rankings), protocol_tvl (protocol TVL flows), or stablecoins (peg health).',
                    default: 'yield_pools'
                },
                chains: {
                    type: 'array',
                    items: {
                        type: 'string',
                        enum: ['Ethereum', 'Solana', 'Arbitrum', 'Base', 'Polygon', 'BSC', 'Avalanche']
                    },
                    minItems: 1,
                    maxItems: 7,
                    description: 'Blockchain ecosystems to include in the DeFi scan.',
                    default: ['Ethereum', 'Solana', 'Base']
                },
                minTvlUsd: {
                    type: 'number',
                    minimum: 0,
                    maximum: 10000000000,
                    description: 'Minimum pool or protocol TVL in USD.',
                    default: 1000000
                },
                maxResults: {
                    type: 'integer',
                    minimum: 1,
                    maximum: 100,
                    description: 'Maximum number of DeFi records to return.',
                    default: 25
                }
            },
            required: ['mode']
        }
    },
    {
        name: 'query_prediction_market_odds',
        actorSlug: 'gmpsignal~prediction-markets-polymarket-kalshi-scanner',
        description: 'Query real-time implied probabilities, Yes/No contract prices, 24h trading volume, order book liquidity, and cross-venue arbitrage spreads across Polymarket, Kalshi, and Manifold Markets.',
        annotations: createReadOnlyAnnotations('Query Polymarket, Kalshi & Manifold Prediction Odds'),
        inputSchema: {
            type: 'object',
            additionalProperties: false,
            properties: {
                sources: {
                    type: 'array',
                    items: {
                        type: 'string',
                        enum: ['polymarket', 'kalshi', 'manifold']
                    },
                    minItems: 1,
                    maxItems: 3,
                    description: 'Prediction market exchanges to query.',
                    default: ['polymarket', 'kalshi']
                },
                keyword: {
                    type: 'string',
                    maxLength: 100,
                    description: 'Optional topic or event keyword filter (e.g., "Fed", "Bitcoin", "Election").',
                    default: ''
                },
                minVolumeUsd: {
                    type: 'number',
                    minimum: 0,
                    maximum: 100000000,
                    description: 'Minimum total market trading volume in USD.',
                    default: 1000
                },
                maxResults: {
                    type: 'integer',
                    minimum: 1,
                    maximum: 100,
                    description: 'Maximum number of prediction market contracts to return.',
                    default: 25
                }
            },
            required: ['sources']
        }
    },
    {
        name: 'enrich_b2b_company_domain',
        actorSlug: 'gmpsignal~b2b-company-techstack-contacts-enricher',
        description: 'Enrich B2B company domains with verified decision-maker emails, phone numbers, LinkedIn/X social links, 38+ technology stack fingerprints (CRM, analytics, cloud, payments), MX email provider, SPF/DMARC security posture, and RDAP domain age.',
        annotations: createReadOnlyAnnotations('Enrich B2B Company Domain Tech Stack, Contacts & DNS'),
        inputSchema: {
            type: 'object',
            additionalProperties: false,
            properties: {
                domains: {
                    type: 'array',
                    items: { type: 'string', minLength: 3, maxLength: 253 },
                    minItems: 1,
                    maxItems: 25,
                    description: 'Root company domains to enrich (e.g., ["stripe.com", "apify.com"]).'
                },
                extractContacts: {
                    type: 'boolean',
                    description: 'Whether to extract email addresses, phone numbers, and social profile URLs.',
                    default: true
                },
                detectTechStack: {
                    type: 'boolean',
                    description: 'Whether to fingerprint 38+ web, cloud, CRM, and payment technologies.',
                    default: true
                },
                maxResults: {
                    type: 'integer',
                    minimum: 1,
                    maximum: 50,
                    description: 'Maximum number of enriched company profiles to return.',
                    default: 10
                }
            },
            required: ['domains']
        }
    },
    {
        name: 'screen_global_sanctions_and_kyb',
        actorSlug: 'gmpsignal~global-sanctions-pep-gleif-kyb-screener',
        description: 'Screen corporate legal entities and individuals against the official GLEIF Legal Entity Identifier (LEI) registry, OFAC SDN, UN Security Council, EU consolidated sanctions lists, and Politically Exposed Persons (PEP) databases.',
        annotations: createReadOnlyAnnotations('Screen Global Corporate KYB, GLEIF LEI & OFAC/UN Sanctions'),
        inputSchema: {
            type: 'object',
            additionalProperties: false,
            properties: {
                entities: {
                    type: 'array',
                    items: { type: 'string', minLength: 2, maxLength: 160 },
                    minItems: 1,
                    maxItems: 25,
                    description: 'Organization names or individual full names to screen for KYB/AML compliance.'
                },
                includeGleifLei: {
                    type: 'boolean',
                    description: 'Whether to resolve official GLEIF Legal Entity Identifier (LEI) registration records.',
                    default: true
                },
                includeSanctionsMatch: {
                    type: 'boolean',
                    description: 'Whether to check OFAC, UN, EU, and PEP sanctions watchlists.',
                    default: true
                },
                maxResults: {
                    type: 'integer',
                    minimum: 1,
                    maximum: 50,
                    description: 'Maximum number of KYB and sanctions screening records to return.',
                    default: 15
                }
            },
            required: ['entities']
        }
    },
    {
        name: 'scan_cve_kev_epss_vulnerabilities',
        actorSlug: 'gmpsignal~cyber-cve-kev-epss-vulnerability-scanner',
        description: 'Correlate Common Vulnerabilities and Exposures (CVEs) against the CISA Known Exploited Vulnerabilities (KEV) catalog, FIRST.org 30-day Exploit Prediction Scoring System (EPSS) probabilities, and NVD CVSS v3 severity metrics.',
        annotations: createReadOnlyAnnotations('Scan CVE Vulnerabilities, CISA KEV & EPSS Exploit Scores'),
        inputSchema: {
            type: 'object',
            additionalProperties: false,
            properties: {
                cveIds: {
                    type: 'array',
                    items: { type: 'string', pattern: '^CVE-[0-9]{4}-[0-9]{4,}$' },
                    maxItems: 50,
                    description: 'Optional list of specific CVE identifiers (e.g., ["CVE-2024-3094", "CVE-2023-44487"]). Leave empty to scan latest CISA KEV additions.',
                    default: []
                },
                vendorFilter: {
                    type: 'string',
                    maxLength: 80,
                    description: 'Optional vendor or product filter (e.g., "Microsoft", "Cisco", "Fortinet", "Linux").',
                    default: ''
                },
                minEpssScore: {
                    type: 'number',
                    minimum: 0,
                    maximum: 1,
                    description: 'Minimum 30-day FIRST.org EPSS exploitation probability between 0.0 and 1.0.',
                    default: 0.1
                },
                maxResults: {
                    type: 'integer',
                    minimum: 1,
                    maximum: 100,
                    description: 'Maximum number of prioritized vulnerability records to return.',
                    default: 25
                }
            },
            required: []
        }
    },
    {
        name: 'discover_startup_vc_dealflow',
        actorSlug: 'gmpsignal~startup-vc-dealflow-yc-github-radar',
        description: 'Discover high-traction early-stage startups and open-source developer tools across Y Combinator (YC) cohorts, GitHub Trending repositories, and Hacker News Show/Launch discussions.',
        annotations: createReadOnlyAnnotations('Discover YC Startups, GitHub Trending & HN Deal-Flow'),
        inputSchema: {
            type: 'object',
            additionalProperties: false,
            properties: {
                sources: {
                    type: 'array',
                    items: {
                        type: 'string',
                        enum: ['yc', 'github', 'hackernews']
                    },
                    minItems: 1,
                    maxItems: 3,
                    description: 'Venture deal-flow signal sources to aggregate.',
                    default: ['yc', 'github', 'hackernews']
                },
                query: {
                    type: 'string',
                    maxLength: 100,
                    description: 'Sector, technology, or batch keyword (e.g., "AI agent", "MCP", "Fintech").',
                    default: 'AI'
                },
                maxResults: {
                    type: 'integer',
                    minimum: 1,
                    maximum: 100,
                    description: 'Maximum number of startup and repository traction records to return.',
                    default: 25
                }
            },
            required: ['sources']
        }
    },
    {
        name: 'search_scientific_literature_citations',
        actorSlug: 'gmpsignal~academic-patent-research-citation-intelligence',
        description: 'Search peer-reviewed scientific papers, preprints, citation velocity, author h-index metrics, DOIs, OpenAccess PDFs, and abstracts across OpenAlex, Semantic Scholar, Crossref, and arXiv.',
        annotations: createReadOnlyAnnotations('Search Scientific Papers, Citations & R&D Literature'),
        inputSchema: {
            type: 'object',
            additionalProperties: false,
            properties: {
                query: {
                    type: 'string',
                    minLength: 2,
                    maxLength: 200,
                    description: 'Research topic, paper title, author name, or DOI to search.',
                    default: 'Large Language Model Agents'
                },
                minCitations: {
                    type: 'integer',
                    minimum: 0,
                    maximum: 100000,
                    description: 'Minimum citation count threshold.',
                    default: 5
                },
                fromYear: {
                    type: 'integer',
                    minimum: 1990,
                    maximum: 2030,
                    description: 'Earliest publication year to include.',
                    default: 2023
                },
                maxResults: {
                    type: 'integer',
                    minimum: 1,
                    maximum: 100,
                    description: 'Maximum number of academic publication records to return.',
                    default: 20
                }
            },
            required: ['query']
        }
    },
    {
        name: 'extract_shopify_store_catalog',
        actorSlug: 'gmpsignal~shopify-global-store-products-scraper',
        description: 'Extract complete e-commerce product catalogs, SKU variant pricing, compare-at discount percentages, inventory stock status, vendor tags, and image URLs from any Shopify-powered store.',
        annotations: createReadOnlyAnnotations('Extract Shopify Store Products, Variants & Pricing'),
        inputSchema: {
            type: 'object',
            additionalProperties: false,
            properties: {
                stores: {
                    type: 'array',
                    items: { type: 'string', minLength: 3, maxLength: 253 },
                    minItems: 1,
                    maxItems: 20,
                    description: 'Shopify store domains or URLs to scrape (e.g., ["allbirds.com", "gymshark.com"]).'
                },
                collectionHandle: {
                    type: 'string',
                    maxLength: 100,
                    description: 'Optional Shopify collection slug filter (leave empty for all store products).',
                    default: ''
                },
                maxProductsPerStore: {
                    type: 'integer',
                    minimum: 1,
                    maximum: 250,
                    description: 'Maximum number of products to extract per Shopify domain.',
                    default: 25
                }
            },
            required: ['stores']
        }
    },
    {
        name: 'search_sec_edgar_filings',
        actorSlug: 'gmpsignal~sec-edgar-filings',
        description: 'Search official U.S. Securities and Exchange Commission (SEC) EDGAR corporate filings including 10-K annual reports, 10-Q quarterly reports, 8-K current events, and Form 4 insider transactions.',
        annotations: createReadOnlyAnnotations('Search US SEC EDGAR Corporate Filings & Form 4 Trades'),
        inputSchema: {
            type: 'object',
            additionalProperties: false,
            properties: {
                tickers: {
                    type: 'array',
                    items: { type: 'string', minLength: 1, maxLength: 12 },
                    minItems: 1,
                    maxItems: 25,
                    description: 'Public company stock tickers or CIK numbers (e.g., ["NVDA", "AAPL", "MSFT"]).',
                    default: ['NVDA', 'AAPL']
                },
                forms: {
                    type: 'array',
                    items: {
                        type: 'string',
                        enum: ['10-K', '10-Q', '8-K', '4', '13F-HR', 'S-1', 'DEF 14A']
                    },
                    minItems: 1,
                    maxItems: 7,
                    description: 'SEC EDGAR form types to retrieve.',
                    default: ['10-K', '10-Q', '8-K', '4']
                },
                maxFilingsPerCompany: {
                    type: 'integer',
                    minimum: 1,
                    maximum: 100,
                    description: 'Maximum filings to return per ticker.',
                    default: 10
                }
            },
            required: ['tickers']
        }
    },
    {
        name: 'search_eu_ted_public_tenders',
        actorSlug: 'gmpsignal~eu-ted-tenders-scraper',
        description: 'Search European Union Tenders Electronic Daily (TED) public procurement notices, government contract awards, CPV industry classifications, contracting authorities, and official tender documents.',
        annotations: createReadOnlyAnnotations('Search European Union TED Public Procurement & Tenders'),
        inputSchema: {
            type: 'object',
            additionalProperties: false,
            properties: {
                query: {
                    type: 'string',
                    minLength: 2,
                    maxLength: 120,
                    description: 'Procurement keyword, sector, or CPV description (e.g., "cloud infrastructure", "cybersecurity").',
                    default: 'software'
                },
                countries: {
                    type: 'array',
                    items: { type: 'string', minLength: 2, maxLength: 3 },
                    maxItems: 15,
                    description: 'ISO country codes to filter (e.g., ["DEU", "FRA", "NLD", "ESP"]).',
                    default: ['DEU', 'FRA']
                },
                maxResults: {
                    type: 'integer',
                    minimum: 1,
                    maximum: 100,
                    description: 'Maximum number of EU tender notices to return.',
                    default: 20
                }
            },
            required: ['query']
        }
    },
    {
        name: 'search_fda_and_product_safety_compliance',
        actorSlug: 'gmpsignal~fda-recalls-enforcement',
        description: 'Search U.S. FDA regulatory enforcement actions, pharmaceutical/device/food recalls, FDA GMP inspection Warning Letters, or global CPSC and EU Safety Gate consumer product recalls.',
        annotations: createReadOnlyAnnotations('Search FDA Recalls, Warning Letters & Global Product Safety'),
        inputSchema: {
            type: 'object',
            additionalProperties: false,
            properties: {
                datasetType: {
                    type: 'string',
                    enum: ['fda_recalls', 'fda_warning_letters', 'global_consumer_recalls'],
                    description: 'Distinct regulatory dataset: fda_recalls (openFDA Class I-III recalls), fda_warning_letters (FDA GMP inspection letters), or global_consumer_recalls (US CPSC, USDA FSIS & EU Safety Gate).',
                    default: 'fda_recalls'
                },
                category: {
                    type: 'string',
                    enum: ['drug', 'device', 'food'],
                    description: 'Product category when datasetType is fda_recalls.',
                    default: 'drug'
                },
                searchQuery: {
                    type: 'string',
                    maxLength: 100,
                    description: 'Optional company name, active ingredient, violation subject, or hazard keyword.',
                    default: ''
                },
                maxResults: {
                    type: 'integer',
                    minimum: 1,
                    maximum: 100,
                    description: 'Maximum number of regulatory compliance records to return.',
                    default: 20
                }
            },
            required: ['datasetType']
        },
        resolveActorAndInput: (args) => {
            if (args.datasetType === 'fda_warning_letters') {
                return {
                    actorSlug: 'gmpsignal~fda-warning-letters-scraper',
                    input: { searchQuery: args.searchQuery || '', maxResults: args.maxResults || 20 }
                };
            }
            if (args.datasetType === 'global_consumer_recalls') {
                return {
                    actorSlug: 'gmpsignal~global-product-recalls',
                    input: { sources: ['cpsc', 'eu'], keyword: args.searchQuery || '', maxItems: args.maxResults || 20 }
                };
            }
            return {
                actorSlug: 'gmpsignal~fda-recalls-enforcement',
                input: { category: args.category || 'drug', search: args.searchQuery || '', limit: args.maxResults || 20 }
            };
        }
    },
    {
        name: 'monitor_global_seismic_events',
        actorSlug: 'gmpsignal~earthquake-monitor-usgs-emsc-afad',
        description: 'Monitor real-time global and regional earthquake events, Richter magnitudes, hypocenter depths, epicenters, and tsunami alerts across USGS, EMSC (Euro-Med), and AFAD seismic networks.',
        annotations: createReadOnlyAnnotations('Monitor Global & Regional Seismic Earthquakes (USGS, EMSC, AFAD)'),
        inputSchema: {
            type: 'object',
            additionalProperties: false,
            properties: {
                network: {
                    type: 'string',
                    enum: ['multi_network_global', 'emsc_euro_med', 'afad_turkey'],
                    description: 'Seismic authority feed: multi_network_global (USGS + EMSC + AFAD cross-verified), emsc_euro_med (European-Mediterranean), or afad_turkey (AFAD official feed).',
                    default: 'multi_network_global'
                },
                minMagnitude: {
                    type: 'number',
                    minimum: 1.0,
                    maximum: 9.5,
                    description: 'Minimum earthquake Richter magnitude threshold.',
                    default: 4.0
                },
                maxResults: {
                    type: 'integer',
                    minimum: 1,
                    maximum: 100,
                    description: 'Maximum number of seismic events to return.',
                    default: 25
                }
            },
            required: ['network']
        },
        resolveActorAndInput: (args) => {
            if (args.network === 'emsc_euro_med') {
                return {
                    actorSlug: 'gmpsignal~europe-mediterranean-earthquakes-emsc-official-data',
                    input: { minMagnitude: args.minMagnitude || 3.0, maxItems: args.maxResults || 25 }
                };
            }
            if (args.network === 'afad_turkey') {
                return {
                    actorSlug: 'gmpsignal~turkey-earthquakes-afad-official-data',
                    input: { minMagnitude: args.minMagnitude || 3.0, maxItems: args.maxResults || 25 }
                };
            }
            return {
                actorSlug: 'gmpsignal~earthquake-monitor-usgs-emsc-afad',
                input: { minMagnitude: String(args.minMagnitude || '4.5'), maxItems: args.maxResults || 25 }
            };
        }
    },
    {
        name: 'query_european_and_regional_markets',
        actorSlug: 'gmpsignal~german-jobs-scraper',
        description: 'Query European labor market vacancies (German Arbeitsagentur), Southeast European marketplace listings (Croatia, Slovenia, Bosnia, Serbia, North Macedonia, Albania), or Turkish central bank FX, bullion, fuel, real estate, and mobility datasets.',
        annotations: createReadOnlyAnnotations('Query European Jobs, Balkan Marketplaces & Regional Macro Data'),
        inputSchema: {
            type: 'object',
            additionalProperties: false,
            properties: {
                dataset: {
                    type: 'string',
                    enum: [
                        'german_jobs_arbeitsagentur',
                        'croatia_njuskalo_classifieds',
                        'slovenia_bolha_classifieds',
                        'bosnia_olx_classifieds',
                        'serbia_kupujemprodajem_classifieds',
                        'serbia_halooglasi_classifieds',
                        'balkan_pazar3_merrjep_classifieds',
                        'central_bank_tcmb_fx_rates',
                        'gold_and_bullion_bank_spreads',
                        'regional_crypto_exchange_tickers',
                        'retail_fuel_prices_81_provinces',
                        'real_estate_property_listings',
                        'domestic_flight_fares',
                        'intercity_bus_routes',
                        'aegean_greek_islands_ferries',
                        'airport_car_rental_rates',
                        'hotels_ratings_and_amenities',
                        'meteorological_weather_forecast',
                        'emergency_on_duty_pharmacies',
                        'global_astronomical_prayer_times',
                        'social_forum_trending_entries'
                    ],
                    description: 'Target regional marketplace, labor, or macroeconomic dataset to query.',
                    default: 'german_jobs_arbeitsagentur'
                },
                query: {
                    type: 'string',
                    maxLength: 120,
                    description: 'Optional search keyword, city name, or currency/asset filter.',
                    default: ''
                },
                maxResults: {
                    type: 'integer',
                    minimum: 1,
                    maximum: 100,
                    description: 'Maximum number of records to return.',
                    default: 20
                }
            },
            required: ['dataset']
        },
        resolveActorAndInput: (args) => {
            const map = {
                german_jobs_arbeitsagentur: 'gmpsignal~german-jobs-scraper',
                croatia_njuskalo_classifieds: 'gmpsignal~njuskalo-scraper',
                slovenia_bolha_classifieds: 'gmpsignal~bolha-scraper',
                bosnia_olx_classifieds: 'gmpsignal~olx-ba-scraper',
                serbia_kupujemprodajem_classifieds: 'gmpsignal~kupujemprodajem-scraper',
                serbia_halooglasi_classifieds: 'gmpsignal~halooglasi-serbia-scraper',
                balkan_pazar3_merrjep_classifieds: 'gmpsignal~pazar3-merrjep-balkan-scraper',
                central_bank_tcmb_fx_rates: 'gmpsignal~tcmb-exchange-rates-official-turkish-central-bank-fx',
                gold_and_bullion_bank_spreads: 'gmpsignal~turkey-gold-prices',
                regional_crypto_exchange_tickers: 'gmpsignal~turkey-crypto-exchange-prices',
                retail_fuel_prices_81_provinces: 'gmpsignal~turkey-fuel-prices-81-provinces-daily-benzin-motorin-lpg',
                real_estate_property_listings: 'gmpsignal~hepsiemlak-scraper-turkey-real-estate-listings',
                domestic_flight_fares: 'gmpsignal~turkey-domestic-flight-prices',
                intercity_bus_routes: 'gmpsignal~turkey-bus-routes-prices',
                aegean_greek_islands_ferries: 'gmpsignal~turkey-greek-islands-ferry-schedules',
                airport_car_rental_rates: 'gmpsignal~turkey-car-rental-prices-city-airport-index',
                hotels_ratings_and_amenities: 'gmpsignal~turkey-hotels-explorer-ratings-amenities',
                meteorological_weather_forecast: 'gmpsignal~turkey-weather-mgm-official',
                emergency_on_duty_pharmacies: 'gmpsignal~turkey-on-duty-pharmacies-nobetci-eczane-daily',
                global_astronomical_prayer_times: 'gmpsignal~islamic-prayer-times-worldwide-monthly-calendars',
                social_forum_trending_entries: 'gmpsignal~eksi-sozluk-scraper-entries-trending'
            };
            const actorSlug = map[args.dataset] || 'gmpsignal~german-jobs-scraper';
            const input = { maxItems: args.maxResults || 20, maxResults: args.maxResults || 20 };
            if (args.query) {
                input.query = args.query;
                input.search = args.query;
                input.keyword = args.query;
            }
            return { actorSlug, input };
        }
    },
    {
        name: 'list_available_intelligence_actors',
        actorSlug: 'meta~discovery',
        description: 'Discover, search, and filter all 40 GMPSignal Apify Actors by intelligence vertical (crypto, b2b, compliance, regional), keyword, and Pay-Per-Event pricing without consuming API credits.',
        annotations: createReadOnlyAnnotations('Discover & Filter All 40 GMPSignal Intelligence Actors'),
        inputSchema: {
            type: 'object',
            additionalProperties: false,
            properties: {
                suite: {
                    type: 'string',
                    enum: ['all', 'flagship', 'crypto', 'b2b', 'compliance', 'regional'],
                    description: 'Vertical suite filter to inspect.',
                    default: 'all'
                },
                keyword: {
                    type: 'string',
                    maxLength: 80,
                    description: 'Optional keyword to filter Actor slugs or descriptions.',
                    default: ''
                }
            },
            required: []
        }
    },
    {
        name: 'fetch_actor_dataset_page',
        actorSlug: 'meta~pagination',
        description: 'Paginate, slice, or retrieve structured JSON items from any historical Apify Actor run dataset by datasetId or execute any specific GMPSignal Actor slug with offset and limit pagination controls.',
        annotations: createReadOnlyAnnotations('Paginate & Retrieve Actor Dataset Records'),
        inputSchema: {
            type: 'object',
            additionalProperties: false,
            properties: {
                datasetId: {
                    type: 'string',
                    minLength: 5,
                    maxLength: 64,
                    description: 'Existing Apify datasetId to paginate (if already executed), or leave empty to run actorSlug.'
                },
                actorSlug: {
                    type: 'string',
                    maxLength: 100,
                    description: 'Optional GMPSignal Actor slug (e.g., "gmpsignal/dex-token-scanner-security-auditor") if fetching fresh paginated items.'
                },
                offset: {
                    type: 'integer',
                    minimum: 0,
                    maximum: 100000,
                    description: 'Zero-based item offset for dataset pagination.',
                    default: 0
                },
                limit: {
                    type: 'integer',
                    minimum: 1,
                    maximum: 250,
                    description: 'Maximum number of dataset items to return in this page (1 to 250).',
                    default: 25
                }
            },
            required: []
        }
    }
];

/**
 * Executes a GMPSignal Apify Actor via the Apify REST API v2 and returns the dataset items.
 *
 * @param {string} actorSlug - The Apify Actor identifier (e.g., gmpsignal~dex-token-scanner-security-auditor).
 * @param {Object} inputPayload - Input parameters for the Actor run.
 * @returns {Promise<Array<Object>>} Array of structured dataset items.
 */
async function executeApifyActor(actorSlug, inputPayload = {}) {
    const token = process.env.APIFY_TOKEN || '';
    if (!token) {
        throw new Error(
            'Missing APIFY_TOKEN environment variable. Set APIFY_TOKEN in your MCP client configuration to run live Apify Actors.'
        );
    }

    const normalizedSlug = actorSlug.replace('/', '~');
    const endpoint = `https://api.apify.com/v2/acts/${encodeURIComponent(normalizedSlug)}/run-sync-get-dataset-items?token=${encodeURIComponent(token)}`;
    const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
        },
        body: JSON.stringify(inputPayload || {})
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Apify API HTTP ${response.status}: ${errorText.slice(0, 300)}`);
    }

    return response.json();
}

/**
 * Fetches a paginated slice of an existing Apify Dataset by datasetId.
 *
 * @param {string} datasetId - Apify Dataset ID.
 * @param {number} offset - Pagination offset.
 * @param {number} limit - Pagination limit.
 * @returns {Promise<Array<Object>>} Paginated dataset items.
 */
async function fetchDatasetItemsPage(datasetId, offset = 0, limit = 25) {
    const token = process.env.APIFY_TOKEN || '';
    const tokenParam = token ? `&token=${encodeURIComponent(token)}` : '';
    const url = `https://api.apify.com/v2/datasets/${encodeURIComponent(datasetId)}/items?clean=true&offset=${Number(offset) || 0}&limit=${Number(limit) || 25}${tokenParam}`;
    const response = await fetch(url, { headers: { Accept: 'application/json' } });
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Apify Dataset API HTTP ${response.status}: ${errorText.slice(0, 300)}`);
    }
    return response.json();
}

/**
 * Starts the native JSON-RPC 2.0 MCP Server over stdio.
 * Responds to `initialize`, `notifications/initialized`, `ping`, `tools/list`, `tools/call`,
 * `resources/list`, and `prompts/list` so container inspections (Glama.ai, Smithery.ai)
 * and MCP clients (Claude Desktop, Cursor, Windsurf, VS Code) work out of the box.
 */
function startStdioMcpServer() {
    const rl = readline.createInterface({
        input: process.stdin,
        terminal: false
    });

    /**
     * Writes a JSON-RPC 2.0 response message to stdout.
     *
     * @param {string|number|null} id - Request identifier.
     * @param {Object} result - Result payload.
     */
    const sendResult = (id, result) => {
        const payload = JSON.stringify({ jsonrpc: '2.0', id, result });
        process.stdout.write(`${payload}\n`);
    };

    /**
     * Writes a JSON-RPC 2.0 error message to stdout.
     *
     * @param {string|number|null} id - Request identifier.
     * @param {number} code - JSON-RPC error code.
     * @param {string} message - Error description.
     */
    const sendError = (id, code, message) => {
        const payload = JSON.stringify({
            jsonrpc: '2.0',
            id,
            error: { code, message }
        });
        process.stdout.write(`${payload}\n`);
    };

    rl.on('line', async (line) => {
        const trimmed = line.trim();
        if (!trimmed) {
            return;
        }

        let msg;
        try {
            msg = JSON.parse(trimmed);
        } catch {
            return;
        }

        const { id, method, params } = msg;

        if (id === undefined || id === null) {
            return;
        }

        try {
            if (method === 'initialize') {
                const requestedProtocol = params?.protocolVersion || '2024-11-05';
                sendResult(id, {
                    protocolVersion: requestedProtocol,
                    capabilities: {
                        tools: { listChanged: false },
                        resources: { subscribe: false, listChanged: false },
                        prompts: { listChanged: false }
                    },
                    serverInfo: {
                        name: 'gmpsignal-mcp',
                        version: '1.4.0'
                    }
                });
                return;
            }

            if (method === 'ping') {
                sendResult(id, {});
                return;
            }

            if (method === 'tools/list') {
                sendResult(id, {
                    tools: CORE_MCP_TOOLS.map((tool) => ({
                        name: tool.name,
                        description: tool.description,
                        annotations: tool.annotations,
                        inputSchema: tool.inputSchema
                    }))
                });
                return;
            }

            if (method === 'resources/list') {
                sendResult(id, {
                    resources: [
                        {
                            uri: 'https://devburaq.github.io/gmpsignal-portal/llms-full.txt',
                            name: 'GMPSignal 40-Actor Technical Specification (llms-full.txt)',
                            description: 'Complete input/output schema and pricing reference for all 40 GMPSignal Apify Actors.',
                            mimeType: 'text/plain'
                        },
                        {
                            uri: 'https://devburaq.github.io/gmpsignal-portal/openapi.json',
                            name: 'GMPSignal 40-Actor OpenAPI 3.1.0 Specification',
                            description: 'Complete OpenAPI 3.1.0 REST specification for all 40 GMPSignal Apify Actors.',
                            mimeType: 'application/json'
                        }
                    ]
                });
                return;
            }

            if (method === 'prompts/list') {
                sendResult(id, {
                    prompts: [
                        {
                            name: 'crypto_alpha_and_security_scan',
                            description: 'Scan trending DEX tokens for GoPlus rugpull risks and check cross-exchange order book slippage.'
                        },
                        {
                            name: 'b2b_domain_and_kyb_compliance_check',
                            description: 'Enrich a target company domain with tech-stack/contacts and screen the entity against GLEIF LEI and OFAC/UN sanctions.'
                        }
                    ]
                });
                return;
            }

            if (method === 'tools/call') {
                const toolName = params?.name;
                const toolArgs = params?.arguments || {};

                if (toolName === 'list_available_intelligence_actors') {
                    const suiteKey = toolArgs.suite || 'all';
                    const kw = (toolArgs.keyword || '').toLowerCase().trim();
                    const actors = resolveActorsForSuite(suiteKey).filter((slug) => !kw || slug.toLowerCase().includes(kw));
                    sendResult(id, {
                        content: [
                            {
                                type: 'text',
                                text: JSON.stringify(
                                    {
                                        suite: suiteKey,
                                        totalMatchedActors: actors.length,
                                        actors,
                                        portalUrl: 'https://devburaq.github.io/gmpsignal-portal/'
                                    },
                                    null,
                                    2
                                )
                            }
                        ],
                        isError: false
                    });
                    return;
                }

                if (toolName === 'fetch_actor_dataset_page') {
                    const offset = Number(toolArgs.offset) || 0;
                    const limit = Math.min(250, Math.max(1, Number(toolArgs.limit) || 25));
                    if (toolArgs.datasetId) {
                        const pageItems = await fetchDatasetItemsPage(toolArgs.datasetId, offset, limit);
                        sendResult(id, {
                            content: [{ type: 'text', text: JSON.stringify({ offset, limit, count: pageItems.length, items: pageItems }, null, 2) }],
                            isError: false
                        });
                        return;
                    }
                    if (toolArgs.actorSlug) {
                        const allItems = await executeApifyActor(toolArgs.actorSlug, { maxItems: offset + limit, maxResults: offset + limit });
                        const sliced = Array.isArray(allItems) ? allItems.slice(offset, offset + limit) : [];
                        sendResult(id, {
                            content: [{ type: 'text', text: JSON.stringify({ offset, limit, count: sliced.length, items: sliced }, null, 2) }],
                            isError: false
                        });
                        return;
                    }
                    throw new Error('Provide either datasetId or actorSlug to fetch_actor_dataset_page.');
                }

                const tool = CORE_MCP_TOOLS.find((t) => t.name === toolName);
                let targetActorSlug = tool?.actorSlug;
                let targetInput = toolArgs;

                if (tool?.resolveActorAndInput) {
                    const resolved = tool.resolveActorAndInput(toolArgs);
                    targetActorSlug = resolved.actorSlug;
                    targetInput = resolved.input;
                } else if (!targetActorSlug && toolName) {
                    targetActorSlug = `gmpsignal~${toolName.replace(/_/g, '-')}`;
                }

                if (!targetActorSlug) {
                    sendError(id, -32602, `Unknown tool: ${toolName}`);
                    return;
                }

                try {
                    const items = await executeApifyActor(targetActorSlug, targetInput);
                    sendResult(id, {
                        content: [
                            {
                                type: 'text',
                                text: JSON.stringify(items, null, 2)
                            }
                        ],
                        isError: false
                    });
                } catch (execError) {
                    sendResult(id, {
                        content: [
                            {
                                type: 'text',
                                text: `Tool execution error (${toolName} -> ${targetActorSlug}): ${execError.message}`
                            }
                        ],
                        isError: true
                    });
                }
                return;
            }

            sendError(id, -32601, `Method not found: ${method}`);
        } catch (err) {
            sendError(id, -32603, err.message || 'Internal JSON-RPC error');
        }
    });
}

/**
 * Parses CLI arguments and executes the requested command.
 */
function main() {
    const rawArgs = process.argv.slice(2);
    let suite = 'flagship';
    let printConfig = false;
    let listSuites = false;

    for (let i = 0; i < rawArgs.length; i++) {
        const arg = rawArgs[i];
        if (arg === '--suite' && rawArgs[i + 1]) {
            suite = rawArgs[i + 1];
            i++;
        } else if (arg === '--print-config') {
            printConfig = true;
        } else if (arg === '--list' || arg === '--help' || arg === '-h') {
            listSuites = true;
        }
    }

    if (listSuites) {
        console.log('GMPSignal MCP Server & CLI Launcher (v1.4.0)\n');
        console.log('Available Suites (--suite <name>):');
        for (const [key, value] of Object.entries(GMPSIGNAL_SUITES)) {
            console.log(`  - ${key.padEnd(12)} (${value.actors.length} Actors): ${value.title}`);
        }
        const allActors = resolveActorsForSuite('all');
        console.log(`  - all          (${allActors.length} Actors): Complete 40-Actor GMPSignal Portfolio\n`);
        console.log('Usage:');
        console.log('  npx -y @gmpsignal/mcp-server                       # Start MCP stdio server (18 verb_noun + meta tools)');
        console.log('  npx -y @gmpsignal/mcp-server --print-config        # Print claude_desktop_config.json snippet');
        process.exit(0);
    }

    if (printConfig) {
        const config = buildMcpServerConfig({
            suite,
            apifyToken: process.env.APIFY_TOKEN || '<YOUR_APIFY_API_TOKEN>'
        });
        console.log(JSON.stringify(config, null, 2));
        process.exit(0);
    }

    startStdioMcpServer();
}

main();
