/*
* Primary file for the API
*
*/

// Dependencies

const http = require('http');
const url = require('url');

// The server should respond to all requests with a string
const server = http.createServer(function(req,res){

	// Get the url and parse it
	var parsedUrl = url.parse(req.url,true);


	// Get the path
	const path = parsedUrl.pathname;
	const trimmedPath = path.replace(/^\/+|\/+$/g,'');

	// Get the query string as an object
	const queryStringObject = parsedUrl.query;

	// Get the http method
	const method = req.method.toLowerCase();

	// Get the headers as an object

	 const headers = req.headers;


	// Send the response
res.end('Hello World\n');

	// Log the request path
	console.log('Request received on path: '+trimmedPath+' with method'+ method);
	
});

// Start the server , and have it listen on port 3000
server.listen(3000,function(){
	console.log("the server is listening on port 3000 now")
})