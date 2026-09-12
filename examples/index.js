// index.js - calls the SEC Enforcement & Litigation Release Delta Feed Actor
// and prints its delta dataset items. Run with: APIFY_API_TOKEN=xxx node index.js
const { ApifyClient } = require('apify-client');

// Reads your Apify API token from the environment - never hardcode it
const client = new ApifyClient({ token: process.env.APIFY_API_TOKEN });

async function main() {
  // Minimal realistic input matching the Actor's real input schema.
  // `userAgent` is the only required field (SEC requires a descriptive User-Agent).
  const input = {
    sources: ['litigation_releases', 'administrative_proceedings'],
    onlyNew: true,
    enableCikLinking: true,
    cikMatchConfidenceThreshold: 0.8,
    userAgent: 'Acme Compliance Monitoring contact@acme.com',
  };

  // Runs the Actor by its real Actor ID and waits for it to finish
  const run = await client.actor('EDhT9Mvrdm2hzTECA').call(input);

  // Fetches the resulting dataset items (NEW_LISTING / UPDATED delta records)
  const { items } = await client.dataset(run.defaultDatasetId).listItems();

  for (const item of items) {
    console.log(`${item.event_type}: ${item.release_number} - ${item.primary_respondent}`);
  }

  console.log(`Fetched ${items.length} delta records from run ${run.id}`);
}

main().catch((err) => {
  console.error('Actor run failed:', err);
  process.exit(1);
});
