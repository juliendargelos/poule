Poule.Api.Youtube = function() {
  Poule.Api.call(this);

  var self = this;

  this.script = document.createElement('script');
  this.script.async = true;
  this.script.defer = true;
  this.script.src = this.src;

  this.script.addEventListener('load', function() {
    self.load();
  });

  document.body.appendChild(this.script);
};

Poule.Api.Youtube.prototype = Object.create(Poule.Api, Object.getOwnPropertyDescriptors({
  constructor: Poule.Api.Youtube,
  src: 'https://apis.google.com/js/api.js',
  key: 'AIzaSyACWZUx0jw3tqKl5NVuXqxuB7siYiziPDA',

  load: function() {
    var self = this;

    gapi.load('client', function() {
      gapi.client.load('youtube', 'v3', function() {
        gapi.client.setApiKey(self.key);
        self.dispatch('load');
      });
    });
  },

  get: function(id, callback) {
    this.require('load', function() {
      gapi.client.youtube.videos.list({
        id: id,
        part: 'snippet,status',
        type: 'video',
        maxResults: 1
      }).execute(function(response) {
        if(response.result && response.result.items && response.result.items.length > 0) {
          console.log(response.result.items[0]);
          // callback(new Poule.Track(source, url, cover, title, meta));
        }
        else callback(null);
      });
    });
  },

  search: function(input, callback, strict) {
    var self = this;

    this.require('load', function() {
      gapi.client.youtube.search.list({
        q: input,
        part: 'snippet',
        type: 'video',
        videoSyndicated: 'true',
        maxResults: 15,
        // videoCategoryId: strict ? 10 : undefined,
      }).execute(function(response) {
        if(response.result && response.result.items) {
          console.log(response.result.items);
          // callback(new self.Video(response.result.items));
        }
      });
    });
  },
}));
