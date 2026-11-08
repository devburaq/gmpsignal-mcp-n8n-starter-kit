"""
GMPSignal Enterprise Intelligence Suite — Python / LangChain / CrewAI Integration Module.

Provides a zero-dependency Python client and LangChain-compatible tool wrapper
for invoking any of the 40 GMPSignal Apify Actors synchronously via REST API v2.
"""

import json
import os
import urllib.error
import urllib.parse
import urllib.request
from typing import Any, Dict, List


def run_gmpsignal_actor(actor_slug: str, input_payload: Dict[str, Any], api_token: str = "") -> List[Dict[str, Any]]:
    """
    Execute a GMPSignal Apify Actor synchronously and return its dataset items.

    Args:
        actor_slug: The Apify Actor identifier (e.g. 'gmpsignal~dex-token-scanner-security-auditor').
        input_payload: Dictionary containing the Actor input parameters.
        api_token: Apify API token. Defaults to the APIFY_TOKEN environment variable.

    Returns:
        List of structured JSON records produced by the Actor run.
    """
    token = api_token or os.environ.get("APIFY_TOKEN", "")
    if not token:
        raise ValueError("Missing Apify API token. Set APIFY_TOKEN environment variable or pass api_token.")

    encoded_slug = urllib.parse.quote(actor_slug, safe="~")
    encoded_token = urllib.parse.quote(token, safe="")
    url = f"https://api.apify.com/v2/acts/{encoded_slug}/run-sync-get-dataset-items?token={encoded_token}"

    body_bytes = json.dumps(input_payload).encode("utf-8")
    request = urllib.request.Request(
        url=url,
        data=body_bytes,
        headers={
            "Content-Type": "application/json",
            "Accept": "application/json",
            "User-Agent": "GMPSignal-Python-Agent-SDK/1.0",
        },
        method="POST",
    )

    try:
        with urllib.request.urlopen(request, timeout=180) as response:
            raw_data = response.read().decode("utf-8")
            return json.loads(raw_data)
    except urllib.error.HTTPError as exc:
        error_text = exc.read().decode("utf-8", errors="replace")
        raise RuntimeError(f"GMPSignal Actor {actor_slug} HTTP {exc.code}: {error_text}") from exc


def run_quant_and_cyber_intelligence_demo() -> Dict[str, Any]:
    """
    Demonstrate multi-vertical AI Agent tool calls across Prediction Markets,
    CISA KEV + FIRST EPSS Cybersecurity, and Academic/Patent Citation Intelligence.

    Returns:
        Dictionary containing summarized outputs from all three Actors.
    """
    prediction_markets = run_gmpsignal_actor(
        "gmpsignal~prediction-markets-polymarket-kalshi-scanner",
        {
            "sources": ["polymarket", "kalshi"],
            "minVolumeUsd": 5000,
            "maxResults": 5,
        },
    )

    cyber_cves = run_gmpsignal_actor(
        "gmpsignal~cyber-cve-kev-epss-vulnerability-scanner",
        {
            "mode": "cisa_kev",
            "minEpssScore": 0.1,
            "maxResults": 5,
        },
    )

    research_papers = run_gmpsignal_actor(
        "gmpsignal~academic-patent-research-citation-intelligence",
        {
            "query": "autonomous AI agents tool use",
            "sources": ["openalex", "semantic_scholar", "arxiv"],
            "minYear": 2024,
            "maxResults": 5,
        },
    )

    return {
        "predictionMarketsCount": len(prediction_markets),
        "cyberVulnerabilitiesCount": len(cyber_cves),
        "researchPapersCount": len(research_papers),
        "topPredictionMarket": prediction_markets[0] if prediction_markets else None,
        "topCriticalCve": cyber_cves[0] if cyber_cves else None,
        "topResearchPaper": research_papers[0] if research_papers else None,
    }


if __name__ == "__main__":
    summary = run_quant_and_cyber_intelligence_demo()
    print(json.dumps(summary, indent=2))
