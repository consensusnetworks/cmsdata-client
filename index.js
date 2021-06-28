const fetch = require('node-fetch');
class CMSClient {
  /**
   * Create a client
   * @param {string} resourceId - Dataset resource id
   * @param {object} options - Fetch options
   */
  constructor(resourceId, options) {
    this.resourceId = resourceId;
    this.isOutdated = false;
    this.lastModified = '';
    this.type =
      options && typeof options.output === 'string' ? options.output : 'json';
    this.url = `https://data.cms.gov/resource/${this.resourceId}.${this.type}`;
    this.fetchOptions = {
      ...options,
      select: '',
      filter: {
        column: '',
        resource: '',
      },
      limit: 0,
      order: '',
    };
    this.fetched = {
      metadata: {},
      fields: [],
      data: {} || '',
    };
  }

  /**
   * Select columns
   * @param {(string|[]string)} columns - Selected column(s), similar to `SELECT` in SQL
   */
  select(columns) {
    if (typeof columns === 'string') {
      this.fetchOptions.select = columns;
      return this;
    }
    if (Array.isArray(columns)) {
      this.fetchOptions.select = Array.from(new Set(columns)).join();
      return this;
    }
    return this;
  }

  /**
   * Filter by a record, similar to `WHERE` in SQL
   * @param {string} column - Target column
   * @param {string} resource - Target resource
   */
  filter(column, resource) {
    if (!resource || !column)
      throw new Error(
        'Missing params: include column & resource to be filtered',
      );
    this.fetchOptions.filter = {
      column,
      resource,
    };
    return this;
  }

  /**
   * Limit the amount of records to return
   * @param {number} number - Number of records to return, similar to `LIMIT` in SQL
   */
  limit(limitResource) {
    if (typeof limitResource !== 'number')
      throw new Error(
        `Expected argument of type number, recieved type: ${typeof limitResource}`,
      );
    this.fetchOptions.limit = limitResource;
    return this;
  }

  /**
   * Sort records by column(s) in ascending order
   * @param {(string|[]string)} columns - Selected column(s) to sort by, similar to `ORDER` in SQL
   */
  order(columns) {
    if (typeof columns === 'string') {
      this.fetchOptions.order = columns;
      return this;
    }
    if (Array.isArray(columns)) {
      this.fetchOptions.order = new Set(columns).join();
      return this;
    }
    throw new Error(
      `Expected argument of type string or array, recieved type: ${typeof columns}`,
    );
  }
  _queryBuilder() {
    this.url = this.url.concat('?');

    if (this.fetchOptions.limit > 0) {
      this.url = this.url.concat(`$limit=${this.fetchOptions.limit}`);
    }

    if (this.fetchOptions.filter.column && this.fetchOptions.filter.resource) {
      this.url = this.url.concat(
        `&${this.fetchOptions.filter.column}=${this.fetchOptions.filter.resource}`,
      );
    }
    if (this.fetchOptions.select) {
      if (this.url[this.url.length - 1] === '?') {
        this.url = this.url.concat(`$select=${this.fetchOptions.select}`);
      } else {
        this.url = this.url.concat(`&$select=${this.fetchOptions.select}`);
      }
    }

    if (this.fetchOptions.order) {
      if (this.url[this.url.length - 1] === '?') {
        this.url = this.url.concat(`$order=${this.fetchOptions.order}`);
      } else {
        this.url = this.url.concat(`&$order=${this.fetchOptions.order}`);
      }
    }
  }

  async _isSafeToStream() {
    return (
      this.fetchOptions.stream.writable &&
      typeof this.fetchOptions.stream.pipe === 'function'
    );
  }

  async _fetchResource() {
    let resourceData;
    try {
      resourceData = await fetch(this.url);

      if (this.fetchOptions.stream && this._isSafeToStream()) {
        await resourceData.body.pipe(this.fetchOptions.stream);
      }

      const headers = await resourceData.headers;

      if (headers.get('x-soda2-fields')) {
        this.fetched.fields = JSON.parse(
          headers.get('x-soda2-fields').split(','),
        );
      }

      this.isOutdated = headers.get('x-soda2-data-out-of-date');
      this.lastModified = headers.get('Last-Modified');

      switch (this.fetchOptions.output) {
        case 'csv':
          this.fetched.data = await resourceData.text();
          return;
        default:
          this.fetched.data = await resourceData.json();
          if (!this.fetched.fields.length) {
            this.fetched.fields = Object.keys(this.fetched.data[0]);
          }
      }
      await this._fetchResourceMetadata().catch((error) => console.warn(error));
    } catch (error) {
      throw new Error(error);
    }
  }

  async _fetchResourceMetadata() {
    try {
      const metadataUrl = `https://data.cms.gov/api/views/metadata/v1/${this.resourceId}`;
      const metadata = await fetch(metadataUrl);
      this.fetched.metadata = await metadata.json();
    } catch (error) {
      throw new Error(error);
    }
  }

  /**
   * Get dataset from specified resource
   *
   * @async
   * @function get
   * @return {Promise<object>} Resolves to an object containing: data, fields, metadata
   */
  async get() {
    this._queryBuilder();
    await this._fetchResource();

    if (!this.isOutdated) {
      console.warn('Data is outdated');
    }

    if (!this.fetchOptions.includeMetadata) delete this.fetched.metadata;

    return this.fetched;
  }
}

/**
 *
 * @function createClient
 * @return {Class} New client instance
 */
function createClient(resourceId, options) {
  if (!resourceId || typeof resourceId !== 'string')
    throw Error(`Invalid argument: ${resourceId}`);
  return new CMSClient(resourceId, options);
}

module.exports = {
  createClient,
};
