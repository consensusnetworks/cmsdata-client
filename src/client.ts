import fetch from "node-fetch";
import * as Papa from "papaparse";

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

interface Options {
	output: 'csv' | 'json',
	stream: NodeJS.WritableStream | null
}

interface transformer {
	data: object[];
	fields?: string[];	
}

class Client {
	query: QueryParams;
	dataset: Dataset;
	fetchOptions: fetchOptions;
	result: Result;
	options: Options;
	
	constructor(datasetId: Dataset['identifier'], options: Options) {
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
		this.fetchOptions = {
			url: `https://data.cms.gov/data-api/v1/dataset/${datasetId}/data`,
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
			params: this.query
		}
		this.options = {
			output: options ? options.output :'json',
			stream: null,
		}
	}

	private async getResource() {
		try {
			const res = await fetch(this.fetchOptions.url, { method: this.fetchOptions.method })

			if (res.status !== 200) {
				this.result.error = new Error(`HTTP ${res.status}`);
				return; 
			}

			if (this.options.output === 'csv') {
				let transform = {
					data: await res.json(),
				} 
				this.result.data = await this.JSONToCSV(transform)
			} else {
				this.result.data = await res.json()
			}
			this.result.error = null
		} catch (e: any) {
			this.result.error = e;
		}
	}

	private async getResourceMetadata() {
		const viewerEndpoint = `https://data.cms.gov/data-api/v1/dataset/${this.dataset.identifier}/data-viewer/`
		try {
			const res = await fetch(viewerEndpoint, { method: this.fetchOptions.method })
			if (res.status !== 200) {
				this.result.error = new Error(`HTTP ${res.status}`);
				return; 
			}
			const resource = await res.json()

			this.result.metadata = {
				...resource.meta,
				...resource.links
			},
			this.result.error = null
		} catch (e: any) {
			this.result.error = e;
		}
	}

	private JSONToCSV(t: transformer): string {
		const p =  Papa.unparse(t.data, {
			header: true,
			skipEmptyLines: false,
			newline: '\n',
			delimiter: ',',
		})
		return p;
	} 

	async get() {	
		Promise.allSettled([await this.getResource(), await this.getResourceMetadata()])
		.catch(e => this.result.error = e )
		return this.result;
	}
}

function createClient(datasetId: Dataset['identifier'], options: Options): Client {
	return new Client(datasetId, options);
}

module.exports = {
	createClient
}




