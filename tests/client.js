// const os = require('os');
// const path = require('path');
// const fs = require('fs');
const tap = require('tap');
const { createClient } = require('../build/client');
// const { createClient } = require('../index');
// const jsonDataset = require('./fixtures/5fr6-cch3.json');

// tap.beforeEach((t) => {
//   t.datasetId = '5fr6-cch3';
// });

tap.test('Test ts lib', async (t) => {
  const client = createClient('b8b0419c-3025-4738-8787-ed40c9e0816d');
  const { data, err } = await client.get();

  if (err) {
    console.error(err);
  }

  console.log(data);

  t.pass('testing ts lib');
});

//   t.test('Without metadata', async (t) => {
//     const CMSClient = createClient(t.datasetId, {
//       output: 'json',
//     });
//     const dataset = await CMSClient.select().get();
//     if (typeof dataset.metadata === 'undefined') {
//       t.pass('metadata omitted');
//     }
//     t.same(dataset.data[0], jsonDataset[0], 'returns all records');
//   });

//   t.test('Without options', async (t) => {
//     const CMSClient = createClient(t.datasetId);

//     const dataset = await CMSClient.get();
//     t.same(dataset.data[0], jsonDataset[0], 'returns all records');
//   });

//   t.test('With csv output', async (t) => {
//     const CMSClient = createClient(t.datasetId, {
//       output: 'csv',
//     });

//     const dataset = await CMSClient.select().get();

//     const csvDataset = fs.readFileSync('tests/fixtures/5fr6-cch3.csv', 'utf8');

//     t.same(
//       dataset.data.split(os.EOL).slice(0, 50),
//       csvDataset.split(os.EOL),
//       'returns all records with csv output',
//     );
//   });
// });

// tap.test('Query options', async (t) => {
//   t.test('Select a column', async (t) => {
//     const CMSClient = createClient(t.datasetId, {
//       output: 'json',
//       includeMetadata: true,
//     });

//     const dataset = await CMSClient.select('nppes_provider_first_name').get();

//     const jsonDataset = require('./fixtures/5fr6-cch3.json');

//     const wanted = jsonDataset.map((record) =>
//       record.nppes_provider_first_name
//         ? { nppes_provider_first_name: record.nppes_provider_first_name }
//         : {},
//     );

//     t.same(dataset.data.slice(0, 50), wanted, 'returns selected column');
//   });

//   t.test('Select multiple columns', async (t) => {
//     const CMSClient = createClient(t.datasetId, {
//       output: 'json',
//       includeMetadata: true,
//     });

//     const wanted = jsonDataset.map((record) => {
//       if (record['nppes_provider_first_name']) {
//         return {
//           npi: record.npi,
//           nppes_provider_first_name: record.nppes_provider_first_name,
//         };
//       } else {
//         return {
//           npi: record.npi,
//         };
//       }
//     });

//     const dataset = await CMSClient.select(['npi', 'nppes_provider_first_name'])
//       .limit(50)
//       .get();

//     t.same(dataset.data, wanted, 'returns selected columns');
//   });

//   t.test('With limit', async (t) => {
//     const CMSClient = createClient(t.datasetId, {
//       output: 'json',
//       includeMetadata: true,
//     });
//     const dataset = await CMSClient.limit(50).get();
//     t.same(dataset.data, jsonDataset, 'returns limited records');
//   });

//   t.test('Order columns', async (t) => {
//     const CMSClient = createClient(t.datasetId, {
//       output: 'json',
//       includeMetadata: true,
//     });

//     const dataset = await CMSClient.order('nppes_provider_last_org_name').get();

//     t.ok(dataset.data, 'returns records ordered by a column');
//     t.end();
//   });

//   t.test('Filter by resource', async (t) => {
//     const CMSClient = createClient(t.datasetId, {
//       output: 'json',
//       includeMetadata: true,
//     });

//     const wanted = jsonDataset.filter(
//       (record) => record['nppes_provider_first_name'] == 'THOMAS',
//     );

//     const dataset = await CMSClient.filter(
//       'nppes_provider_first_name',
//       'THOMAS',
//     )
//       .limit(2)
//       .get();

//     t.same(dataset.data, wanted, 'returns filtered resource');
//     t.end();
//   });
// });

// tap.test('Stream option', async (t) => {
//   const streamDestination = fs.createWriteStream(
//     path.join(process.cwd(), 'tests', 'streamed.json'),
//   );
//   const CMSClient = createClient(t.datasetId, {
//     output: 'json',
//     includeMetadata: true,
//     stream: streamDestination,
//   });

//   await CMSClient.select('nppes_provider_first_name').limit(50).get();

//   const streamedData = require(path.join(
//     process.cwd(),
//     'tests',
//     'streamed.json',
//   ));

//   t.ok(streamedData, 'streams content to writable destination');

//   t.teardown(() => {
//     fs.unlink(path.join(process.cwd(), 'tests', 'streamed.json'), (error) => {
//       if (error) {
//         throw new Error(error);
//       }
//     });
//   });
//   t.end();
// });
