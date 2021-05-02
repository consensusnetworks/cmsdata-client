const { test } = require('tap');
const { createClient } = require('./index');

test('Get all datatset records', async (t) => {
  const CMSClient = createClient('5fr6-cch3', {
    output: 'json',
    includeMetadata: true,
  });

  const dataset = await CMSClient.select().get();

  t.ok(dataset.data, 'New client with datatset');
});

test('Get all dataset records with only a specific column', async (t) => {
  const CMSClient = createClient('5fr6-cch3', {
    output: 'json',
    includeMetadata: true,
  });

  const dataset = await CMSClient.select('nppes_provider_first_name').get();

  t.ok(dataset.data, 'New client with datatset');
});

test('Limit the amount of records to return', async (t) => {
  const CMSClient = createClient('5fr6-cch3', {
    output: 'json',
    includeMetadata: true,
  });

  const dataset = await CMSClient.limit(22).get();

  t.ok(dataset.data, 'New client with datatset');
});

test('Get all dataset records with only a specific column and limit', async (t) => {
  const CMSClient = createClient('5fr6-cch3', {
    output: 'json',
    includeMetadata: true,
  });

  const dataset = await CMSClient.select('npi').limit(22).get();

  t.ok(dataset.data, 'New client with datatset');
});

test('Get all dataset records selecting multiple columns', async (t) => {
  const CMSClient = createClient('5fr6-cch3', {
    output: 'json',
    includeMetadata: true,
  });

  const dataset = await CMSClient.select(['npi', 'nppes_provider_first_name']).get();

  t.ok(dataset.data, 'New client with datatset');
});

test('Get all dataset records with only a specific column', async (t) => {
  const CMSClient = createClient('5fr6-cch3', {
    output: 'json',
    includeMetadata: true,
  });

  const dataset = await CMSClient.select(['npi', 'nppes_provider_first_name']).limit(30).get();

  t.ok(dataset.data, 'New client with datatset');
});
