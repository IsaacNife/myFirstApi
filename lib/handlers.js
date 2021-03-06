/*
*  Request Handlers
*
*/
// Dependencies
const _data = require('./data');
const helpers = require('./helpers');

// Define the handlers
let handlers = {};

// Users
handlers.users = function(data,callback){
	let acceptableMethods = ['post','get','put','delete'];
	if(acceptableMethods.indexOf(data.method) > -1){
		handlers._users[data.method](data,callback);
	} else {
		callback(405);
	}
};
// Container for the user submethods
handlers._users = {};

// Users - post
// Required data : firstName, lastName, phone, password, tosAgreement
// Optional data : none
handlers._users.post = function(data,callback){
	// Check that all required are filled out
	let firstName = typeof(data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
	let lastName = typeof(data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
	let phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone.trim() : false;
	let password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
	let tosAgreement = typeof(data.payload.tosAgreement) == 'boolean' && data.payload.tosAgreement == true ? true : false;

	if(firstName && lastName && phone && password && tosAgreement){
				// Make sure that the user doesn't already exist
				_data.read('users',phone,function(err,data){
					if(err){
						// Hash the password
						let hashedPassword = helpers.hash(password);

						// Create the user 
						if(hashedPassword){

							let userObject = {
								'firstName': firstName,
								'lastName': lastName,
								'phone': phone,
								'hashedPassword': hashedPassword,
								'tosAgreement': true
							};

						// Persist data user
						_data.create('users',phone,userObject,function(err){
							if(!err){
								callback(200)
							} else {
								console.log(err);
								callback(500,{'Error' : 'Could not create the new user'});
							}
						});

					} else {
						callback(500, {'Error': 'Could not hash the password'});
					}

				} else {
						// User already exist
						callback(400,{'Error' : 'A user with that phone number already exist'});
					}

				})


			} else {
				callback(400,{'Error' : 'Missing required fields'});
			}

		};

// Users - get
// Required data : phone
// Optional data : none
// @TODO only let an authenticated user access their object.
handlers._users.get = function(data,callback){
	// Check that the phone number is valid
	let phone = typeof(data.queryStringObject.phone) == 'string' && data.queryStringObject.phone.trim().length == 10 ? data.queryStringObject.phone.trim() : false;
	if(phone){
		//Lookup the user
		_data.read('users',phone,function(err,data){
			if(!err && data){
				// Remove the hashed password from the user object before returning it to the requester
				delete data.hashedPassword;
				callback(200,data);
			} else {
				callback(404);
			}
		})

	} else {
		callback(400,{'Error' : 'Missing required fields'});
	}

};

// Users - update
// Required data : phone
// Optional data : firstName, lastName, password
// @TODO only let an authenticated update their object.
handlers._users.put = function(data,callback){
	// Check for the required field
	let phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone.trim() : false;
		// Check for the optional fields
		let firstName = typeof(data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
		let lastName = typeof(data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
		let password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;

// Error if the phone is invalid
if(phone){
	// Error if nothong is sent to update
	if(firstName || lastName || password){
		// Lookup the user
		_data.read('users',phone,function(err,userData){
			if(!err && userData){
				// Update the fields necessary
				if(firstName){
					userData.firstName = firstName;
				}
				if(lastName){
					userData.lastName = lastName;
				}
				if(password){
					userData.hashedPassword = helpers.hash(password);
				}
				// Store the new user's update
				_data.update('users',phone,userData,function(err){
					if(!err){
						callback(200);

					} else {
						console.log(err);
						callback(500,{'Error':'Could not update the user'})
					}
				})
			} else {
				callback(400,{'Error':'The specified user does not exist'});

			}
		})

	} else {
		callback(400,{'Error' : 'Missing fields to update'});
	}

} else {
	callback(400,{'Error': 'Missing required fields'});
}



};

// Users - delete
// Required fields : phone
// @TODO only let an authenticated update their object.
// @TODO Cleanup any other data files assiociated with this user
handlers._users.delete = function(data,callback){
 // Check that the phone number is valid
 let phone = typeof(data.queryStringObject.phone) == 'string' && data.queryStringObject.phone.trim().length == 10 ? data.queryStringObject.phone.trim() : false;
	if(phone){
		//Lookup the user
		_data.read('users',phone,function(err,data){
			if(!err && data){
				_data.delete('users',phone,function(err){
					if(!err){
						callback(200);

					} else {
						callback(500,{'Error':'Could not delete the specified user'});
					}
				})
				
			} else {
				callback(400,{'Error': ' Could not find the specified user'});
			}
		});

	} else {
		callback(400,{'Error' : 'Missing required fields'});
	}
};
// Ping handler

handlers.ping = function(data,callback){
	callback(200);
};

// Not found handler
handlers.notFound = function(data,callback){
	callback(404);

};


//Export module
module.exports = handlers;