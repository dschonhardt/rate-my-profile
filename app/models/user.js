var sites = require('./sites');

function User(username) {
  this.username = username;
}

User.prototype.getDatingProfile = function (datingSiteName) {
  var site = sites[datingSiteName];
  return site.getProfile(this.username); // Should load this dating site username from user's profile
};

exports = module.exports = User;