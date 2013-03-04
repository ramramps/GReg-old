var UserModel = require('./models').UserModel;

/**
 * Save a new user into the database, assuming data has been validated.
 *
 * @param {Object} The parsed and validated json from the client.
 * @param {Function} Callback to execute after inserting. The argument is an error object.
 * @api private
 */

exports.save_new_user = function(pkg_data, callback) {

	_validate_new_user(data, function(err) {

		if (err) {
			if (callback) callback(err);
			return;
		}

		_save_new_user( pkg_data, callback );

	}

};


/**
 * Validate new user data.
 *
 * @param {Object} The parsed and validated json from the client.
 * @param {Function} Callback to execute after inserting. The argument is an error object.
 * @api private
 */

function _validate_new_user(pkg_data, callback) {

	if (callback) callback(); // callback with nothing, indicating success
	
};

/**
 * Save a new user into the database, assuming data has been validated.
 *
 * @param {Object} The parsed and validated json from the client.
 * @param {Function} Callback to execute after inserting. The argument is an error object.
 * @api private
 */

function _save_new_user (pkg_data, callback) {

	var user = new UserModel({
		name: pkg_data.name
	});

	console.log( 'saving user:', user );

 	user.save( function(err){  

    if (err)
    {
      if (callback) callback( error.fail('DB error creating the new user.') );
      return;
    }

    if (callback) callback( error.success('Successfully inserted user into the database.')) );

  });

};