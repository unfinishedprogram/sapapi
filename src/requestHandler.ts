import fetch from "node-fetch";

type RequestMethod = "GET" | "POST"

class RequestBuilder<T> {
	private path:string;
	private method:RequestMethod;
	private body:unknown;
	private headers:{[index:string]:string};
	private endpointURL:string;
	private requestOptions:{[index:string]:unknown} = {};
	private version:string;

	constructor(url:string, version:string) {
		this.version = version;
		this.endpointURL = `${url}/0.${version}/api/`;
		this.headers = {
			"accept": "*/*",
			"accept-language": "en-US,en;q=0.9",
			"cache-control": "no-cache",
			"content-type": "application/json; utf-8",
			"pragma": "no-cache",
			"sec-fetch-dest": "empty",
			"sec-fetch-mode": "cors",
			"sec-fetch-site": "cross-site",
			"sec-gpc": "1",
		}
	}

	setAuth(token:string){
		Object.assign(this.headers, {'authorization':`Bearer ${token}`});
		return this;
	}

	setMethod(method:RequestMethod) {
		this.method = method;
		if(method != "GET") {
			this.body = { "Version": this.version };
		}
		return this;
	}
	
	setHeaders(headers:{[index:string]:string}) {
		Object.assign(this.headers, headers);
		return this;
	}

	setBody(body:unknown) {
		if(this.method != "GET")
			Object.assign(this.body, body);
		else 
			console.error("Cannot set a body for a request usigng GET")
		return this;
	}

	setPath(path:string){
		this.path = path;
		return this;
	}

	async makeRequest():Promise<T> {
		this.requestOptions.headers = this.headers;
		this.requestOptions.method = this.method;

		if(this.method != "GET" && this.body){
			this.requestOptions.body = JSON.stringify(this.body);
		} 
		const fullUrl = `${this.endpointURL}${this.path}`

		const response = await fetch(fullUrl,this.requestOptions)
		if(response.ok) {
			return await response.json() as Promise<T>;
		} else {
			return new Promise((res, rej) => {
				rej(response.text);
			})
		}
	}
}


export default class RequestHandler {
	endpointURL:string;
	version:string;
	constructor(version:string) {
		this.version = version;
		this.endpointURL = `https://api.teamwood.games`;
	}

	getRequest<T>() {
		return new RequestBuilder<T>(this.endpointURL, this.version)
	}
}