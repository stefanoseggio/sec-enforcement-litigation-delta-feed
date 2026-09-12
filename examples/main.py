# main.py - calls the SEC Enforcement & Litigation Release Delta Feed Actor
# and prints its delta dataset items. Run with: APIFY_API_TOKEN=xxx python main.py
import os
from apify_client import ApifyClient

# Reads your Apify API token from the environment - never hardcode it
client = ApifyClient(os.environ["APIFY_API_TOKEN"])

# Minimal realistic input matching the Actor's real input schema.
# "userAgent" is the only required field (SEC requires a descriptive User-Agent).
run_input = {
    "sources": ["litigation_releases", "administrative_proceedings"],
    "onlyNew": True,
    "enableCikLinking": True,
    "cikMatchConfidenceThreshold": 0.8,
    "userAgent": "Acme Compliance Monitoring contact@acme.com",
}

# Runs the Actor by its real Actor ID and waits for it to finish
run = client.actor("EDhT9Mvrdm2hzTECA").call(run_input=run_input)

# Fetches the resulting dataset items (NEW_LISTING / UPDATED delta records)
dataset_items = client.dataset(run["defaultDatasetId"]).list_items().items

for item in dataset_items:
    print(f"{item['event_type']}: {item['release_number']} - {item['primary_respondent']}")

print(f"Fetched {len(dataset_items)} delta records from run {run['id']}")
