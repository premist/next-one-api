const firebase = require("../modules/firebase");

exports.foursquare = function*(next) {
  try {
    var user = yield firebase.authWithCustomToken(this.query.token);
  } catch(e) {
    this.status = 422;
    this.body = {
      "success": false,
      "error": "Invalid token"
    }

    return;
  }

  this.session.user = user;
  this.status = 302;
  this.redirect("/connect/foursquare");
};

exports.foursquareCallback = function*(next) {
  if(this.session.user == undefined) {
    this.status = 422;
    this.body = {
      "success": "false",
      "error": "Invalid access"
    }

    return;
  }

  yield firebase.child("users")
                .child(this.session.user.uid)
                .child("private")
                .child("foursquare_token").set(this.session.grant.response.access_token);

  this.body = {
    "success": "true"
  };
};

exports.twitter = function*(next) {
  try {
    var user = yield firebase.authWithCustomToken(this.query.token);
  } catch(e) {
    this.status = 422;
    this.body = {
      "success": false,
      "error": "Invalid token"
    }

    return;
  }

  this.session.user = user;
  this.status = 302;
  this.redirect("/connect/twitter");
};

exports.twitterCallback = function*(next) {
  if(this.session.user == undefined) {
    this.status = 422;
    this.body = {
      "success": "false",
      "error": "Invalid access"
    }

    return;
  }

  var ref = firebase.child("users")
                    .child(this.session.user.uid)
                    .child("private");

  var setToken = ref.child("twitter_token").set(this.session.grant.response.access_token);
  var setTokenSecret = ref.child("twitter_secret").set(this.session.grant.response.access_secret);

  yield Promise.all([setToken, setTokenSecret]);

  this.body = {
    "success": "true"
  };
};
