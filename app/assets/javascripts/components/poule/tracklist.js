Poule.Tracklist = function(element) {
  this.element = element;
  this.search = new this.constructor.Search(this.element.querySelector('.tracklist__search'));
  this.tracks = [];

  this.elements = {
    tracks: this.element.querySelector('.tracklist__tracks')
  };

  this.requests = {
    index: new Poule.Request('/'+this.slug+'/tracks'),
    add: new Poule.Request('/'+this.slug+'/tracks', 'post')
  };

  this.connect();
};

Poule.Tracklist.prototype = {
  constructor: Poule.Tracklist,
  interval: null,

  get slug() {
    return this.element.getAttribute('data-slug');
  },

  get checksum() {
    return this.constructor.checksum(this.tracks);
  },

  add: function(track) {
    var self = this;

    this.requests.add.once('success', function(event) {
      var tracks = self.parse(event.response);
      self.tracks.push(track);

      if(self.different(tracks)) this.render();
      else self.append(track);
    }).send(track.data);
  },

  different: function(tracks) {
    return this.constructor.checksum(tracks) !== this.checksum;
  },

  update: function() {
    var self = this;

    this.requests.index.once('success', function(event) {
      var tracks = self.parse(event.response);
      if(self.different(tracks)) {
        self.tracks = tracks;
        self.render();
      }
    }).send();
  },

  append: function(track) {
    var element = document.createElement('div');
    element.className = 'tracklist__track';
    element.appendChild(track.element);

    this.elements.tracks.appendChild(element);
  },

  render: function() {
    this.clear();
    for(var i = 0; i < this.tracks.length; i++) this.append(this.tracks[i]);
  },

  parse: function(tracks) {
    return tracks.map(function(track) {
      return new Poule.Track(
        Poule.Api[track.api],
        track.identifier,
        track.cover,
        track.title,
        track.meta
      );
    });
  },

  clear: function() {
    this.elements.tracks.innerHTML = '';
  },

  connect: function() {
    var self = this;
    this.disconnect();

    this.update();

    this.interval = setInterval(function() {
      self.update();
    }, 5000);
  },

  disconnect: function() {
    clearInterval(this.interval);
    this.interval = null;
  }
};

Poule.Tracklist.checksum = function(tracks) {
  return tracks.map(function(track) { return track.identifier; }).join('');
};

Poule.Tracklist.init = function() {
  var element = document.querySelector('.tracklist');
  if(element) window.tracklist = new this(element);
};
