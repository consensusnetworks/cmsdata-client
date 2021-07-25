import fetch from "node-fetch";

interface QueryParams {
	filter?: string
	limit?: number;
	offset?: number;
	order?: string;
	sortBy?: string;
}


interface Dataset {
  identifier: string | string[];
  query?: QueryParams
}

interface fetchOptions {
	url : string;
	method: string;
	headers: object;
	params: QueryParams
}

type Result = {
	data: string | object;
	metadata?: object;
	error: Error | null;
}

class Client {
	query: QueryParams;
	dataset: Dataset;
	options: fetchOptions;
	result: Result;
	
	constructor(datasetId: Dataset['identifier']) {
		this.result = {
			data: "",
			error: null
		};
		this.query = {
			filter: '',
			limit: 100,
			offset: 0,
			order: '',
			sortBy: '',
		}
		this.dataset = {
			identifier: datasetId
		}
		this.options = {
			url: `https://data.cms.gov/data-api/v1/dataset/${datasetId}/data`,
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
			params: this.query
		}
	}

	async get() {
		const p = await Promise.all([this.getResource(), this.getResourceMetadata()])
		console.log(p)
		return this.result;
	}

	private async getResource() {
		try {
			const res = await fetch(this.options.url, { method: this.options.method })

			if (res.status !== 200) {
				this.result.error = new Error(`HTTP ${res.status}`);
				return; 
			}
			const resource = await res.json()
			this.result.data = resource
			this.result.error = null
		} catch (e: any) {
			this.result.error = e;
		}
	}

	private async getResourceMetadata() {
		const metadataEndpoint = `https://data.cms.gov/data-api/v1/dataset/${this.dataset.identifier}/data-viewer/`
		try {
			const res = await fetch(metadataEndpoint, { method: this.options.method })
			if (res.status !== 200) {
				this.result.error = new Error(`HTTP ${res.status}`);
				return; 
			}
			const resource = await res.json()
			this.result.metadata = resource
			this.result.error = null
		} catch (e: any) {
			this.result.error = e;
		}
	}
}

function createClient(datasetId: Dataset['identifier']): Client {
	return new Client(datasetId);
}

module.exports = {
	createClient
}




