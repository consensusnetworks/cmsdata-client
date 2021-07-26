const path = require('path');
const fs = require('fs');

const tap = require('tap');
const { createClient } = require('../build/client');

tap.test('Test CMS Client', async (t) => {
  const datasetId = 'b8b0419c-3025-4738-8787-ed40c9e0816d';
  const client = createClient(datasetId);
  const result = await client.get();

  if (result.err) {
    throw new Error(result.err);
  }
  const file = fs.readFileSync(
    path.join(__dirname, 'fixtures', `${datasetId}.json`),
    'utf8',
  );

  // only first 10 records
  const wanted = JSON.parse(file).slice(0, 10);
  const found = result.data.slice(0, 10);

  t.same(found, wanted, 'should return correct dataset in json');
});
