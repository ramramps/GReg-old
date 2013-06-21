var PackageModel = require('../lib/models').PackageModel
  , error = require('../lib/error')
  , packages = require('../lib/packages')
  , mongoose = require('mongoose')
  , search = require('../lib/search')
  , _ = require('underscore');

/**
 * Vote for a package
 *
 * @param {Object} HTTP request 
 * @param {Object} HTTP response
 * @api public
 */
exports.vote = function(req, res) {

  var id = req.params.id;

  PackageModel.findById(id, function(err, pkg) {

    if ( err || !pkg ) {
      console.log('Error')
      try {
        return res.send( error.fail("Could not find package") );
      } catch (exception) {
        return console.log('Log error - failed to download a package with id: ' + id);
      }
    }

    UserModel.find( {"username": req.user.username}, function(err, user){

      if ( err || !user ) {
        console.log('Error')
        try {
          return res.send( error.fail("Not a valid user") );
        } catch (exception) {
          return console.log('Log error - failed to download a package with id: ' + id);
        }
      }

      // look up user
      // check if the user has voted for this package

      var data = error.success_with_content('Found package', pkg);
      try {
        return res.send(data);
      } catch (exception) {
        return console.log('Log error');
      }



    })


  });

};


/**
 * Lookup a package by id
 *
 * @param {Object} HTTP request 
 * @param {Object} HTTP response
 * @api public
 */

exports.by_id = function(req, res) {

  var id = req.params.id;

  PackageModel.findById(id, function(err, pkg) {

    if ( err || !pkg ) {
      console.log('Error')
      try {
        return res.send( error.fail("Could not find package") );
      } catch (exception) {
        return console.log('Log error - failed to download a package with id: ' + id);
      }
    }

    var data = error.success_with_content('Found package', pkg);
    try {
      return res.send(data);
    } catch (exception) {
      return console.log('Log error');
    }

  });

};

/**
 * Get all packages
 *
 * @param {Object} HTTP request 
 * @param {Object} HTTP response
 * @api public
 */

exports.all = function(req, res) {

  PackageModel
  .find({})
  .populate('maintainers', 'username')
  .populate('versions.direct_dependency_ids', 'name')
  .populate('versions.full_dependency_ids', 'name')
  .populate('used_by', 'name')
  .exec(function (err, pkgs) {

    if ( err || !pkgs ) {
      try {
        return res.send( error.fail("There are no packages") );
      } catch (exception) {
        return console.log('Log error');
      }
    }

    var data = error.success_with_content('Found packages', pkgs);
    try {
      return res.send( data );
    } catch (exception) {
      return console.log('Log error');
    }

  })

};

/**
 * Lookup all packages with a particular engine
 *
 * @param {Object} HTTP request 
 * @param {Object} HTTP response
 * @api public
 */

exports.by_engine = function(req, res) {

  var engine = req.params.engine;

  PackageModel.find( {engine: engine} , function(err, pkgs) {

    if ( err || !pkgs || pkgs.length === 0 )
    {
      res.send( error.fail("There are no packages with that engine name") );
      return;
    }

    var data = error.success_with_content('Found packages', pkgs);
    return res.send( data );

  });

};


/**
 * Lookup a package by engine and name.  Returns only a single package.
 *
 * @param {Object} HTTP request 
 * @param {Object} HTTP response
 * @api public
 */

exports.by_engine_and_name = function(req, res) {

  var engine = req.params.engine;
  var name = req.params.name;

  PackageModel.findOne( {engine: engine, name: name} , function(err, pkg) {

    if ( err || !pkg )
    {
      res.send( error.fail("There is no package with that engine and package name") );
      return;
    }

    var data = error.success_with_content('Found package', pkg);
    return res.send( data );

  });

};

/**
 * Search for a package
 *
 * @param {Object} HTTP request 
 * @param {Object} HTTP response
 * @api public
 */

exports.search = function(req, res) {

  var q = req.params.query;

  if (!q) {
    exports.all(req, res);
    return;
  }

  search.pkg_search(q, function(err, data) {

    if (err) {
      res.send(error.fail('Something wrong with the pkg_search'));
      return;
    }

    if (data.Body.hits.found === 0) {
      res.send( error.success_with_content( "Succeeded", [] ) );
      return;
    }

    var ids = [];
    _.each( data.Body.hits.hit, function(id){

      ids.push(id.id);

    });

    packages.get_pkg_list(ids, function(err, pkgs) {

      if (err) {
        return res.send(err);
      }

      res.send(error.success_with_content('Search succeeded', pkgs));

    });

  });

}

/**
 * Add a new package
 *
 * @param {Object} HTTP request 
 * @param {Object} HTTP response
 * @api public
 */

exports.add = function(req, res) {

  var pkg = req.body;

  packages.save_new_pkg(req, pkg, function(result) {
    try {
      return res.send(result);
    } catch (exception) {
      return console.log('Log error');
    }
  });

}

/**
 * Add a new package version
 *
 * @param {Object} HTTP request 
 * @param {Object} HTTP response
 * @api public
 */

exports.add_version = function(req, res) {

  var pkg = req.body;

  packages.save_new_pkg_version(req, pkg, function(result) {
    try {
      return res.send(result);
    } catch (exception) {
      return console.log('Log error');
    }
  });

}

/**
 * Delete a package from the db
 *
 * @param {Object} HTTP request 
 * @param {Object} HTTP response
 * @api public
 */

exports.remove = function(req, res) {
  var id = req.params.id;
  res.send({thing: 'hi'});
}
