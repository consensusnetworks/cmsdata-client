# CMS Data JS Client

> JavaScript client for [Centers for Medicare & Medicaid Services Data API](https://www.cms.gov/)

## Install

```bash
npm i cmsdata-client
# yarn install cmsdata-client
```
## Usage

### Basic

```javascript
const { createClient } = require('cmsdata-client');

const CMSClient = createClient("5fr6-cch3")
const dataset = await CMSClient.get()

// data
console.log(dataset.data)

// dataset headers
console.log(dataset.fields)

```
### Include metadata and specify output type

```javascript
const { createClient } = require('cmsdata-client');

const CMSClient = createClient("5fr6-cch3", {
  output: "csv",
  includeMetadata: true,
 })

 const dataset = await CMSClient.get()

// data
console.log(dataset.data)

// metadata
console.log(dataset.metadata)
```

### Filter by record

```javascript
const { createClient } = require('cmsdata-client');

const CMSClient = createClient("5fr6-cch3", {
  output: "csv",
  includeMetadata: true,
 })

const dataset = await CMSClient.filter("nppes_provider_last_org_name", "ENKESHAFI").get()

// data
console.log(dataset.data)
```

### Limit result

```javascript
const { createClient } = require('cmsdata-client');

const CMSClient = createClient("5fr6-cch3", {
  output: "csv",
  includeMetadata: true,
 })

const dataset = await CMSClient.limit(12).get()

// data
console.log(dataset.data)
```


### Specifiy a column

```javascript
const { createClient } = require('cmsdata-client');

const CMSClient = createClient("5fr6-cch3", {
  output: "csv",
  includeMetadata: true,
 })

const dataset = await CMSClient.limit().select("nppes_provider_first_name").get()

// data
console.log(dataset.data)
```

### Specifiy multiple columns

```javascript
const { createClient } = require('cmsdata-client');

const CMSClient = createClient("5fr6-cch3", {
  output: "csv",
  includeMetadata: true,
 })

const dataset = await CMSClient.select(["nppes_provider_first_name", 'npi']).get()

// data
console.log(dataset.data)
```

```javascript
const { createClient } = require('cmsdata-client');

const CMSClient = createClient("5fr6-cch3", {
  output: "csv",
  includeMetadata: true,
  stream: require('fs').fs.createWriteStream("path-to-file")
 })

await CMSClient.select(["nppes_provider_first_name", 'npi']).get()
```
## API

 - `createClient`
	- `resource id`: `string`, **required**
	- `options`: `object`, optional
 		- `includeMetadata`: `boolean`, defualt: `false`
 		- `output`: `string`
- `select`
	- column(s): `string | []string`
- `filter`
	- column: `string`
	- resource: `string`
- `order`
	- column(s): `string | []string`
- `limit`
	- `number`: `number`
- `get`
	- `data`: json | csv
	- `fields`: header column (first row)
	- `metadata`: metadata of the dataset, **available only if `includeMetadata` is `true`**


More information on the [Socrata Open Data API](https://dev.socrata.com/)
## Contributing
1. Fork it.
2. Create your feature branch (`git checkout -b feature/fooBar`)
3. Commit your changes (`git commit -am 'Add some fooBar'`)
4. Push to the branch (`git push origin feature/fooBar`)
5. Create a new Pull Request

## License
[MIT](https://choosealicense.com/licenses/mit/)

  