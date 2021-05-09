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
### Include metadata and specify output

```javascript
const { createClient } = require('cmsdata-client');

const CMSClient = createClient("5fr6-cch3", {
  output: "csv",
  includeMetadata: true,
 })

 const dataset = await CMSClient.get()

// data
console.log(dataset.data)
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


### Specifiy a column to return

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

### Specifiy multiple columns to return

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



## API
 - `createClient`
 	- `resourceId`: `string`, **required**
 	- `options`: `object`, optional
 		- `includeMetadata`: `boolean`, defualt: `false`
 		- `output`: `string`
- `filter`
	- column: `string`
	- resource: `string`
- `get`
	- `data`: in **json** or **csv** format
	- `fields`: dataset column headers
	- `metadata`: metadata of the dataset, **available only if `includeMetadata` is `true`**
- `limit`
	- `number`: limit the number of records to return



More information on the [Socrata Open Data Spec](https://dev.socrata.com/)
## Contributing
1. Fork it.
2. Create your feature branch (`git checkout -b feature/fooBar`)
3. Commit your changes (`git commit -am 'Add some fooBar'`)
4. Push to the branch (`git push origin feature/fooBar`)
5. Create a new Pull Request

## License
[MIT](https://choosealicense.com/licenses/mit/)

  