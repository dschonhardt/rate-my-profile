var path = require('path')
  , rootPath = path.normalize(__dirname + '/..');

module.exports = {
  development: {
    db: 'mongodb://localhost/ratemyprofile_dev',
    root: rootPath,
    app: {
      name: 'Rate My Profile'
    }
  },
  test: {
    db: 'mongodb://localhost/ratemyprofile_test',
    root: rootPath,
    app: {
      name: 'Rate My Profile - Testing'
    }
  },
  production: {}
}