/**
 * @file index.mjs
 * @description Programmatic SDK and Suite Registry for the GMPSignal 50-Actor Enterprise
 * Data & Model Context Protocol (MCP) Intelligence Suite on Apify.
 */

/**
 * Curated Actor suites organized by vertical use case (50 Total Production Actors).
 * @type {Record<string, Array<string>>}
 */
export const GMPSIGNAL_SUITES = {
    flagship: [
        'gmpsignal/dex-token-scanner-security-auditor',
        'gmpsignal/crypto-orderbook-arbitrage-scanner',
        'gmpsignal/multichain-wallet-aml-risk-screener',
        'gmpsignal/defi-yield-tvl-stablecoin-monitor',
        'gmpsignal/prediction-markets-polymarket-kalshi-scanner',
        'gmpsignal/b2b-company-techstack-contacts-enricher',
        'gmpsignal/global-sanctions-pep-gleif-kyb-screener',
        'gmpsignal/cyber-cve-kev-epss-vulnerability-scanner',
        'gmpsignal/startup-vc-dealflow-yc-github-radar',
        'gmpsignal/academic-patent-research-citation-intelligence',
        'gmpsignal/shopify-global-store-products-scraper',
        'gmpsignal/global-trademark-brand-ip-monitor',
        'gmpsignal/ai-model-mcp-package-supply-chain-radar',
        'gmpsignal/us-uk-gov-contracts-procurement-scraper',
        'gmpsignal/clinical-trials-fda-drug-pipeline-tracker',
        'gmpsignal/global-supply-chain-port-aviation-disruption-monitor',
        'gmpsignal/global-central-bank-macro-rates-inflation-tracker',
        'gmpsignal/b2b-email-deliverability-dmarc-spf-bimi-auditor',
        'gmpsignal/hackernews-devto-tech-launch-sentiment-radar',
        'gmpsignal/sec-13f-institutional-whale-insider-tracker',
        'gmpsignal/wikidata-wikipedia-corporate-knowledge-graph-enricher'
    ],
    crypto: [
        'gmpsignal/dex-token-scanner-security-auditor',
        'gmpsignal/crypto-orderbook-arbitrage-scanner',
        'gmpsignal/multichain-wallet-aml-risk-screener',
        'gmpsignal/defi-yield-tvl-stablecoin-monitor',
        'gmpsignal/prediction-markets-polymarket-kalshi-scanner',
        'gmpsignal/turkey-crypto-exchange-prices',
        'gmpsignal/global-central-bank-macro-rates-inflation-tracker',
        'gmpsignal/sec-13f-institutional-whale-insider-tracker'
    ],
    b2b: [
        'gmpsignal/b2b-company-techstack-contacts-enricher',
        'gmpsignal/shopify-global-store-products-scraper',
        'gmpsignal/startup-vc-dealflow-yc-github-radar',
        'gmpsignal/german-jobs-scraper',
        'gmpsignal/b2b-email-deliverability-dmarc-spf-bimi-auditor',
        'gmpsignal/hackernews-devto-tech-launch-sentiment-radar',
        'gmpsignal/wikidata-wikipedia-corporate-knowledge-graph-enricher',
        'gmpsignal/ai-model-mcp-package-supply-chain-radar'
    ],
    compliance: [
        'gmpsignal/global-sanctions-pep-gleif-kyb-screener',
        'gmpsignal/cyber-cve-kev-epss-vulnerability-scanner',
        'gmpsignal/academic-patent-research-citation-intelligence',
        'gmpsignal/sec-edgar-filings',
        'gmpsignal/fda-warning-letters-scraper',
        'gmpsignal/fda-recalls-enforcement',
        'gmpsignal/eu-ted-tenders-scraper',
        'gmpsignal/global-product-recalls',
        'gmpsignal/global-trademark-brand-ip-monitor',
        'gmpsignal/us-uk-gov-contracts-procurement-scraper',
        'gmpsignal/clinical-trials-fda-drug-pipeline-tracker',
        'gmpsignal/global-supply-chain-port-aviation-disruption-monitor'
    ],
    regional: [
        'gmpsignal/earthquake-monitor-usgs-emsc-afad',
        'gmpsignal/europe-mediterranean-earthquakes-emsc-official-data',
        'gmpsignal/turkey-earthquakes-afad-official-data',
        'gmpsignal/islamic-prayer-times-worldwide-monthly-calendars',
        'gmpsignal/njuskalo-scraper',
        'gmpsignal/bolha-scraper',
        'gmpsignal/olx-ba-scraper',
        'gmpsignal/halooglasi-serbia-scraper',
        'gmpsignal/kupujemprodajem-scraper',
        'gmpsignal/pazar3-merrjep-balkan-scraper',
        'gmpsignal/tcmb-exchange-rates-official-turkish-central-bank-fx',
        'gmpsignal/turkey-gold-prices',
        'gmpsignal/turkey-weather-mgm-official',
        'gmpsignal/turkey-on-duty-pharmacies-nobetci-eczane-daily',
        'gmpsignal/turkey-fuel-prices-81-provinces-daily-benzin-motorin-lpg',
        'gmpsignal/turkey-car-rental-prices-city-airport-index',
        'gmpsignal/turkey-hotels-explorer-ratings-amenities',
        'gmpsignal/turkey-domestic-flight-prices',
        'gmpsignal/eksi-sozluk-scraper-entries-trending',
        'gmpsignal/turkey-greek-islands-ferry-schedules',
        'gmpsignal/turkey-bus-routes-prices',
        'gmpsignal/hepsiemlak-scraper-turkey-real-estate-listings'
    ]
};

/**
 * Resolves the unique list of GMPSignal Actor slugs for a given suite name.
 *
 * @param {string} suiteName - Suite identifier ('flagship', 'crypto', 'b2b', 'compliance', 'regional', or 'all').
 * @returns {Array<string>} Array of full Apify Actor slugs (`gmpsignal/<slug>`).
 */
export function resolveActorsForSuite(suiteName = 'flagship') {
    const normalized = String(suiteName || 'flagship').toLowerCase().trim();
    if (normalized === 'all') {
        const unique = new Set([
            ...GMPSIGNAL_SUITES.crypto,
            ...GMPSIGNAL_SUITES.b2b,
            ...GMPSIGNAL_SUITES.compliance,
            ...GMPSIGNAL_SUITES.regional
        ]);
        return Array.from(unique);
    }
    return GMPSIGNAL_SUITES[normalized] || GMPSIGNAL_SUITES.flagship;
}

/**
 * Builds a complete Claude Desktop / Cursor MCP configuration object.
 *
 * @param {string} suiteName - Target suite identifier.
 * @param {string} apiTokenPlaceholder - Placeholder or actual Apify API token.
 * @returns {Object} JSON-serializable MCP configuration object.
 */
export function buildMcpServerConfig(suiteName = 'flagship', apiTokenPlaceholder = '<YOUR_APIFY_API_TOKEN>') {
    const sc = typeof suiteName === 'object' ? (suiteName.suite || 'flagship') : suiteName;
    const tok = typeof suiteName === 'object' ? (suiteName.apifyToken || apiTokenPlaceholder) : apiTokenPlaceholder;
    const actors = resolveActorsForSuite(sc);
    return {
        mcpServers: {
            [`gmpsignal-${sc}`]: {
                command: 'npx',
                args: [
                    '-y',
                    '@apify/actors-mcp-server',
                    '--actors',
                    actors.join(',')
                ],
                env: {
                    APIFY_TOKEN: tok
                }
            }
        }
    };
}
