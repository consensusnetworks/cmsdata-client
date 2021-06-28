const tap = require('tap');
const { createClient } = require('../index');
const fs = require('fs');
const jsonDataset = require('./fixtures/5fr6-cch3.json');
const os = require('os');
const path = require('path');

tap.beforeEach((t) => {
  t.datasetId = '5fr6-cch3';
});

tap.test('Client options', async (t) => {
  t.test('With metadata', async (t) => {
    const CMSClient = createClient(t.datasetId, {
      output: 'json',
      includeMetadata: true,
    });
    const dataset = await CMSClient.select().get();

    t.equal(dataset.metadata.id, t.datasetId, 'returns metadata');
    t.same(dataset.data[0], jsonDataset[0], 'returns all records');
  });
  t.test('Without metadata', async (t) => {
    const CMSClient = createClient(t.datasetId, {
      output: 'json',
    });
    const dataset = await CMSClient.select().get();
    if (typeof dataset.metadata === 'undefined') {
      t.pass('metadata omitted');
    }
    t.same(dataset.data[0], jsonDataset[0], 'returns all records');
  });
  t.test('Without options', async (t) => {
    const CMSClient = createClient(t.datasetId);

    const dataset = await CMSClient.get();
    t.same(dataset.data[0], jsonDataset[0], 'returns all records');
  });

  t.test('With csv output', async (t) => {
    const CMSClient = createClient(t.datasetId, {
      output: 'csv',
    });

    const dataset = await CMSClient.select().get();

    const csvDataset = fs.readFileSync('tests/fixtures/5fr6-cch3.csv', 'utf8');

    t.same(
      dataset.data.split(os.EOL).slice(0, 50),
      csvDataset.split(os.EOL),
      'returns all records with csv output',
    );
  });
});

tap.test('Query options', async (t) => {
  t.test('Select a column', async (t) => {
    const CMSClient = createClient(t.datasetId, {
      output: 'json',
      includeMetadata: true,
    });

    const dataset = await CMSClient.select('nppes_provider_first_name').get();

    const jsonDataset = require('./fixtures/5fr6-cch3.json');

    const wanted = jsonDataset.map((record) =>
      record.nppes_provider_first_name
        ? { nppes_provider_first_name: record.nppes_provider_first_name }
        : {},
    );

    t.same(dataset.data.slice(0, 50), wanted, 'returns selected column');
  });

  t.test('Select multiple columns', async (t) => {
    const CMSClient = createClient(t.datasetId, {
      output: 'json',
      includeMetadata: true,
    });

    const dataset = await CMSClient.select([
      'npi',
      'nppes_provider_first_name',
    ]).get();
    t.ok(dataset.data, 'returns selected columns');
  });

  t.test('With limit', async (t) => {
    const CMSClient = createClient(t.datasetId, {
      output: 'json',
      includeMetadata: true,
    });
    const dataset = await CMSClient.limit(50).get();
    t.same(dataset.data, jsonDataset, 'returns limited records');
  });

  t.test('Order columns', async (t) => {
    const CMSClient = createClient(t.datasetId, {
      output: 'json',
      includeMetadata: true,
    });

    const dataset = await CMSClient.order('nppes_provider_state').get();
    t.ok(dataset.data, 'returns records ordered by a column');
    t.end();
  });
});

tap.test('Stream option', async (t) => {
  const streamDestination = fs.createWriteStream(
    path.join(process.cwd(), 'tests', 'streamed.json'),
  );
  const CMSClient = createClient(t.datasetId, {
    output: 'json',
    includeMetadata: true,
    stream: streamDestination,
  });

  await CMSClient.select('nppes_provider_first_name').limit(50).get();

  streamDestination.on('data', (e) => console.log(e));

  const streamedData = require(path.join(
    process.cwd(),
    'tests',
    'streamed.json',
  ));
  t.ok(streamedData, 'streams content to writable destination');

  t.teardown(() => {
    fs.unlink(path.join(process.cwd(), 'tests', 'streamed.json'), (error) => {
      if (error) {
        throw new Error(error);
      }
    });
  });

  t.end();
});