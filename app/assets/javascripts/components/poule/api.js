Poule.Api = function(onready) {
  Poule.Event.Listener.defer(this);

  if(typeof onready === 'function') this.on('ready', onready);
  this.providers = [];

  this.once('load', this.init);

  this.associate('scriptLoad', 'load', this.scripts.length);

  this.load();
};

Poule.Api.prototype = {
  constructor: Poule.Api,
  name: null,
  scripts: [],

  load: function() {
    var self = this;
    var script, tag, src, dispatch;

    for(var i = 0; i < this.scripts.length; i++) {
      script = this.scripts[i];

      tag = document.createElement('script');
      tag.async = true;
      tag.defer = true;

      if(typeof script === 'object' && script !== null) {
        src = script.src;
        script.load.call(this, tag);
      }
      else {
        src = script;
        tag.addEventListener('load', function() {
          self.dispatch('scriptLoad');
        });
      }

      tag.src = src;
      document.body.appendChild(tag);
    }
  },

  init: function() {
    var self = this;

    this.associate('apiReady', 'ready', this.constructor.all.length);

    this.providers = this.constructor.all.map(function(api) {
      return new api(function() {
        self.dispatch('apiReady');
      });
    });
  },

  get: function(id, callback) {

  },

  search: function(input, callback) {
    this.require('ready', function() {
      var self = this;
      var tracks = [];
      var response = 0;

      this.each(function(provider) {
        provider.search(input, function(providersTracks) {
          response++;
          tracks = tracks.concat(providersTracks);

          if(response >= self.providers.length) callback.call(self, tracks);
        });
      });
    });
  },

  each: function(callback) {
    for(var i = 0; i < this.providers.length; i++) {
      if(callback.call(this, this.providers[i]) === false) break;
    }
  }
};

Poule.Api.concatTracks = function(providerTracks) {
  return providerTracks.reduce(function(tracks, t) { return tracks.concat(t); }, []);
  // var tracks = [];
  // var t, length;

  // for(var i = 0; i < providerTracks.length; i++) {
  //   t = providerTracks[i];
  //   for(var j = 0; j < t.length; j++) tracks.push([(j + 0.5)/t.length, t[j]]);
  // }

  // return tracks.sort().reduce(function(t, track, i) {
  //   if(i%providerTracks.length == 0) {
  //     if(t.length != 0) t[t.length - 1].reverse();
  //     t.push([track]);
  //   }
  //   else t[t.length - 1].push(track);

  //   return t;
  // }, []).reduce(function(t, gt) {
  //   return t.concat(gt);
  // }).map(function(item) { return item[1]; })
};

Object.defineProperties(Poule.Api, {
  all: {
    get: function() {
      if(!this._all) {
        this._all = [];
        var caps = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

        for(var api in this) {
          if(this.hasOwnProperty(api) && caps.includes(api[0])) this._all.push(this[api]);
        }
      }

      return this._all;
    }
  }
});
