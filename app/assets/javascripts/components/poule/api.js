Poule.Api = function() {
  Poule.Event.Listener.defer(this);

  this.loaded = false;

  this.on('load', function() {
    this.loaded = true;
  })
};

Poule.Api.prototype = {
  constructor: Poule.Api,

  url: {
    get: function(id) {
      return null;
    },

    search: function(input) {
      return null;
    }
  },

  parse: {
    get: function(response) {
      return null;
    },

    search: function(response) {
      return [];
    }
  },

  actions: {
    get: {
      url: function(id) {
        return null;
      },
      search: function(response) {
        return null;
      }
    },

    search
  }

  action: function

  action: {
    get: function(id, callback) {
      var self = this;

      return (new Request(this.url.get(id))).on('success', function(response) {
        callback(self.parse.get(response));
      });
    },

    search: function(input, callback) {
      var self = this;

      return (new Request(this.url.search(input))).on('success', function(response) {
        callback(self.parse.search(response));
      });
    }
  },

  get: function(id, callback) {

  },

  search: function(input, callback) {

  },
};
