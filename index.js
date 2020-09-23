/*
* Primary file for the API
*
*/

// Dependencies

const http = require('http');
const https = require('https')
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;
const config = require('./config');
const fs = require('fs');
const _data = require('./lib/data');

// Testing 
//@TODO delete this
_data.delete('test','newFile',function(err){
	console.log(err);
})

// Instantiating the HTTP server
const httpServer = http.createServer(function(req,res){
unifiedServer(req,res);
	
});

// Start the server , and have it listen on port 3000
httpServer.listen(config.httpPort,function(){
	console.log("the server is listening on port "+config.httpPort);
});

// Instantiate the HTTPS server
const httpsServerOptions = {
	'key': fs.readFileSync('./https/key.pem'),
	'cert':fs.readFileSync('./https/cert.pem')
}
const httpsServer = https.createServer(httpsServerOptions,function(req,res){
unifiedServer(req,res);
	
});
// Start the HTTPS server
httpsServer.listen(config.httpsPort,function(){
	console.log("the server is listening on port "+config.httpsPort);
});

// All the server logic for both the http and the https server
const unifiedServer = function(req,res){
	// Get the url and parse it
	const  parsedUrl = url.parse(req.url,true);


	// Get the path
	const path = parsedUrl.pathname;
	const trimmedPath = path.replace(/^\/+|\/+$/g,'');

	// Get the query string as an object
	const queryStringObject = parsedUrl.query;

	// Get the http method
	const method = req.method.toLowerCase();

	// Get the headers as an object

	 const headers = req.headers;

	 //Get the payload, if any
	 const decoder = new StringDecoder('utf-8');
	 let buffer = '';
	 req.on('data',function(data){
	 	buffer += decoder.write(data);
	 });
	 req.on('end',function(){
	 	buffer += decoder.end();
	

// Choose the handler this request should go to.
const chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

// Construct the data object to send to the handler
let data = {
	'trimmedPath': trimmedPath,
	'queryStringObject': queryStringObject,
	'method': method,
	'headers': headers,
	'payload': buffer

	
};
// Route the request to the handler specified in the router
chosenHandler(data,function(statusCode,payload ){
	// Use the status code code called back by the handler, or default to 200
	statusCode = typeof(statusCode) == 'number' ? statusCode : 200;

	// Use the payload . or default it by an empty object
	payload = typeof(payload) == 'object' ? payload : {};

	//Convert payload to a string
	const payloadString = JSON.stringify(payload);

	// Return the response
	res.setHeader('Content-Type','application/json');
	res.writeHead(statusCode);
	res.end(payloadString);

	// Log the request path
	console.log('Returning this response: ',statusCode,payloadString);
});

	
	 });

}
// Define the handlers
let handlers = {};

// Ping handler

handlers.ping = function(data,callback){
	callback(200);
}

// Not found handler
handlers.notFound = function(data,callback){
	callback(404);

}
// Define a request router
const router = {
	'ping' : handlers.ping
}