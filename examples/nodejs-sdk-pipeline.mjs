/**
 * @file nodejs-sdk-pipeline.mjs
 * @description Production-ready Node.js pipeline demonstrating multi-Actor orchestration
 * across the GMPSignal 40-Actor Enterprise Intelligence Suite using the Apify REST API v2.
 * Executes B2B Domain Tech-Stack Enrichment, Global KYB Sanctions Screening, and
 * Multi-Exchange Crypto OrderBook Arbitrage in parallel or sequence.
 */

const APIFY_API_TOKEN = process.env.APIFY_TOKEN || '';

/**
 * Executes a GMPSignal Apify Actor synchronously and returns its dataset items.
 *
 * @param {string} actorSlug - The GMPSignal Actor slug (e.g., "gmpsignal~b2b-company-techstack-contacts-enricher").
 * @param {Object} inputPayload - JSON input configuration for the Actor run.
 * @returns {Promise<Array<Object>>} Resolved dataset items returned by the Actor.
 */
async function runGmpsignalActor(actorSlug, inputPayload) {
    if (!APIFY_API_TOKEN) {
        throw new Error('Missing APIFY_TOKEN environment variable. Export APIFY_TOKEN before running.');
    }

    const endpoint = `https://api.apify.com/v2/acts/${encodeURIComponent(actorSlug)}/run-sync-get-dataset-items?token=${encodeURIComponent(APIFY_API_TOKEN)}`;
    const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(inputPayload)
    });

    if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`Apify Actor ${actorSlug} failed (${response.status}): ${errorBody}`);
    }

    return await response.json();
}

/**
 * Orchestrates an end-to-end B2B Lead Enrichment + KYB Compliance + Quant Arbitrage workflow.
 *
 * @returns {Promise<void>}
 */
async function main() {
    console.log('[GMPSignal Pipeline] Starting multi-Actor intelligence workflow...');

    const [b2bLeads, kybScreening, cryptoArbitrage] = await Promise.all([
        runGmpsignalActor('gmpsignal~b2b-company-techstack-contacts-enricher', {
            domains: ['stripe.com', 'apify.com'],
            extractContacts: true,
            detectTechStack: true,
            maxPagesPerDomain: 1,
            maxResults: 2
        }),
        runGmpsignalActor('gmpsignal~global-sanctions-pep-gleif-kyb-screener', {
            entities: ['Stripe', 'Sberbank'],
            includeGleifLei: true,
            includeSanctionsMatch: true,
            maxResults: 5
        }),
        runGmpsignalActor('gmpsignal~crypto-orderbook-arbitrage-scanner', {
            symbols: ['BTCUSDT', 'ETHUSDT', 'SOLUSDT'],
            exchanges: ['binance', 'bybit', 'kraken', 'coinbase'],
            maxResults: 5
        })
    ]);

    console.log(`[1/3] B2B Enriched Domains: ${b2bLeads.length} records`);
    console.log(`[2/3] KYB & Sanctions Entities Screened: ${kybScreening.length} records`);
    console.log(`[3/3] Crypto Arbitrage Spreads Analyzed: ${cryptoArbitrage.length} records`);

    console.log(JSON.stringify({
        timestamp: new Date().toISOString(),
        b2bSample: b2bLeads[0] || null,
        kybSample: kybScreening[0] || null,
        arbitrageSample: cryptoArbitrage[0] || null
    }, null, 2));
}

if (import.meta.url === `file://${process.argv[1]}`) {
    main().catch((err) => {
        console.error('[GMPSignal Pipeline Error]', err.message);
        process.exitCode = 1;
    });
}

export { runGmpsignalActor };
