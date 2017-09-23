Poule.Api.Youtube = function() {
  Poule.Api.apply(this, Array.prototype.slice.call(arguments));
};

Poule.Api.Youtube.prototype = Object.create(Poule.Api.prototype, Object.getOwnPropertyDescriptors({
  constructor: Poule.Api.Youtube,
  name: 'Youtube',
  scripts: [
    'https://apis.google.com/js/api.js',
    {
      src: 'https://www.youtube.com/player_api',
      load: function() {
        var self = this;
        window.onYouTubeIframeAPIReady = function() { self.dispatch('scriptLoad'); };
      }
    }
  ],
  key: 'AIzaSyCHv6fX1q3b0y74K-ljqzXHtbjx2j8rjIs',

  init: function() {
    var self = this;

    this.container = document.createElement('div');
    this.container.className = 'api-player';
    this.container.id = 'youtube-player';
    document.body.appendChild(this.container);

    this.player = new YT.Player(this.container.id);

    gapi.load('client', function() {
      gapi.client.load('youtube', 'v3', function() {
        gapi.client.setApiKey(self.key);
        self.dispatch('ready');
      });
    });
  },

  play: function(track) {
    this.require('ready', function() {
      if(track instanceof Poule.Track) this.player.loadVideoById(track.id);
      this.player.playVideo();
    });
  },

  pause: function() {
    this.require('ready', function() {
      this.player.pauseVideo();
    });
  },

  get: function(id, callback) {
    this.require('ready', function() {
      gapi.client.youtube.videos.list({
        id: id,
        part: 'snippet,status',
        type: 'video',
        maxResults: 1
      }).execute(function(response) {
        if(response.result && response.result.items && response.result.items.length > 0) {
          callback(new Poule.Track(source, url, cover, title, meta));
        }
        else callback(null);
      });
    });
  },

  search: function(input, callback, strict) {
    var self = this;

    this.require('ready', function() {
      gapi.client.youtube.search.list({
        q: input,
        part: 'snippet',
        type: 'video',
        videoSyndicated: 'true',
        maxResults: 15,
        // videoCategoryId: strict ? 10 : undefined,
      }).execute(function(response) {
        if(response.result && response.result.items) {
          callback(response.result.items.map(function(item) {
            return new Poule.Track(
              self,
              item.id.videoId,
              item.snippet.thumbnails.high.url,
              item.snippet.title,
              item.snippet.channelTitle
            );
          }));
        }
      });
    });
  },
}));
