# CMS Data

> JavaScript client for [Centers for Medicare & Medicaid Services Data API](https://data.cms.gov/)

## Install

```bash
npm i cmsdata-client
```

## Usage

### Basic

```javascript
const { createClient } = require('cmsdata-client');

const client = createClient('b8b0419c-3025-4738-8787-ed40c9e0816d');
const result = await client.get();

// check for error
if (result.error) {
  console.error(result.error);
}
// data
console.log(dataset.data);

// metadata
console.log(dataset.metadata);
```

## API

- createClient:

  - `dataset id`: `string`, **required**
  - `options`: `object`, optional
    - `output`: `string`

- get:

  - returns dataset, metadata, and error messages if any

  `{ data: {}, metadata: {}, err: "" }`

More information on the [Drupal JSON:API module](https://www.drupal.org/docs/core-modules-and-themes/core-modules/jsonapi-module)

## Contributing

1. Fork it.
2. Create your feature branch (`git checkout -b feature/fooBar`)
3. Commit your changes (`git commit -am 'Add some fooBar'`)
4. Push to the branch (`git push origin feature/fooBar`)
5. Create a new Pull Request
