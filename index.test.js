const { test } = require('tap');
const { createClient } = require('./index');
const fs = require('fs');
const path = require('path');

test('Query all records with metadata', async (t) => {
  const CMSClient = createClient('5fr6-cch3', {
    output: 'json',
    includeMetadata: true,
  });

  const dataset = await CMSClient.select().get();
  t.ok(dataset.data, 'Returns all records with metadata');
});

test('Query all records without metadata', async (t) => {
  const CMSClient = createClient('5fr6-cch3', {
    output: 'json',
  });

  const dataset = await CMSClient.select().get();
  t.ok(dataset.data, 'Returns all records without metadata');
});

test('Query all records without options', async (t) => {
  const CMSClient = createClient('5fr6-cch3');

  const dataset = await CMSClient.select().get();
  t.ok(dataset.data, 'Returns all records with metadata');
});

test('Query all records with csv output', async (t) => {
  const CMSClient = createClient('5fr6-cch3', {
    output: 'csv',
  });

  const dataset = await CMSClient.select().get();
  t.ok(dataset.data, 'Returns all records in csv format');
});

test('Query all records with a selected column', async (t) => {
  const CMSClient = createClient('5fr6-cch3', {
    output: 'json',
    includeMetadata: true,
  });

  const dataset = await CMSClient.select('nppes_provider_first_name').get();
  t.ok(dataset.data, 'Returns all records with a selected column');
});

test('Query with limit', async (t) => {
  const CMSClient = createClient('5fr6-cch3', {
    output: 'json',
    includeMetadata: true,
  });
  const dataset = await CMSClient.limit(30).get();
  t.ok(dataset.data, 'Returns records with specified limit');
});

test('Query by a column with limit', async (t) => {
  const CMSClient = createClient('5fr6-cch3', {
    output: 'json',
    includeMetadata: true,
  });

  const dataset = await CMSClient.select('npi').limit(22).get();
  t.ok(dataset.data, 'Returns limited records with a selected column');
});

test('Query by multiple columns', async (t) => {
  const CMSClient = createClient('5fr6-cch3', {
    output: 'json',
    includeMetadata: true,
  });

  const dataset = await CMSClient.select([
    'npi',
    'nppes_provider_first_name',
  ]).get();
  t.ok(dataset.data, 'Returns all records with multiple selected columns');
});

test('Query by multiple columns with limit', async (t) => {
  const CMSClient = createClient('5fr6-cch3', {
    output: 'json',
    includeMetadata: true,
  });

  const dataset = await CMSClient.select(['npi', 'nppes_provider_first_name'])
    .limit(30)
    .get();
  t.ok(dataset.data, 'Returns limited records with multiple selected records');
});

test('Query all records ordered by selected column', async (t) => {
  const CMSClient = createClient('5fr6-cch3', {
    output: 'json',
    includeMetadata: true,
  });

  const dataset = await CMSClient.order('nppes_provider_state').get();
  t.ok(dataset.data, 'Returns all records ordered by selected column');
  t.end();
});

test('Stream response body to stream destination', async (t) => {
  const CMSClient = createClient('5fr6-cch3', {
    output: 'json',
    includeMetadata: true,
    stream: fs.createWriteStream('./streamed.json'),
  });

  const dataset = await CMSClient.get();
  t.ok(dataset.data, 'Streams response body to file destinaton');

  t.teardown(() => {
    fs.unlink(path.join(process.cwd(), 'streamed.json'), (error) => {
      if (error) {
        throw new Error(error);
      }
    });
  });

  t.end();
});
