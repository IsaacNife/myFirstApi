/*
*Create and export configuration variables
*
*/

// Container for all the environments
let environments = {};

// Dev (default) environment
environments.dev = {
	'httpPort' : 3000,
	'httpsPort': 3001,
	'envName': 'dev'

};


// Production enviroenment
environments.production = {
	'httpPort' : 5000,
	'httpsPort': 5001,
	'envName' : 'Production'
};

// Determine which env was passed as a command line arg
let currentEnvironement = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '' ;

// Check that the current environment is one of the environments above, if not, default to dev
let environmentToExport = typeof(environments[currentEnvironement]) == 'object' ? environments[currentEnvironement] : environments.dev;

//Export the module
module.exports = environmentToExport;