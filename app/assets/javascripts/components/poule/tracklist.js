Poule.Tracklist = function(element) {
  Poule.Event.Listener.defer(this);

  var self = this;

  this.element = element;
  this.search = new this.constructor.Search(this.element.querySelector('.tracklist__search'));
  this.controls = new this.constructor.Controls(this.element.querySelector('.tracklist__controls'));
  this.tracks = [];
  this._current = null;

  this.elements = {
    tracks: this.element.querySelector('.tracklist__tracks'),
    current: this.element.querySelector('.tracklist__current'),
    background: this.element.querySelector('.tracklist__background'),
    backgroundCue: this.element.querySelector('.tracklist__background-cue'),
    progress: this.element.querySelector('.tracklist__progress-bar')
  };

  this.hidden = true;

  this.requests = {
    index: new Poule.Request('/'+this.slug+'/tracks'),
    add: new Poule.Request('/'+this.slug+'/tracks', 'post'),
    remove: new Poule.Request('/'+this.slug+'/tracks', 'delete')
  };

  this.requests.index.on('success', function(event) {
    var tracks = self.parse(event.response);
    if(self.different(tracks)) {
      self.tracks = tracks;
      self.render();
      self.dispatch('update');
    }
  });

  this.once('ready', function() {
    this.hidden = false;
  });

  this.requests.add.on('success', function(event) {
    var tracks = self.parse(event.response);
    self.render(tracks);
    if(!self.current) self.current = self.tracks[0];
  });

  this.search.on('validate', function(event) {
    self.add(event.track);
  });

  this.controls.on('play', function() {
    self.play();
  });

  this.controls.on('pause', function() {
    self.pause();
  });

  this.controls.on('previous', function() {
    self.previous();
  });

  this.controls.on('next', function() {
    self.next();
  });


  this.once('ready', function() {
    this.once('update', function() {
      this.current = this.tracks[0];
    });
    this.connect();
  });

  this.api.once('ready', function() {
    self.dispatch('ready');
  });

  this.api.on('progress', function(event) {
    self.progress = event.progress;
  });
};

Poule.Tracklist.prototype = {
  constructor: Poule.Tracklist,
  interval: null,

  get hidden() {
    return this.element.className.match(/\btracklist--hidden\b/) !== null;
  },

  set hidden(v) {
    v = !!v;

    if(v !== this.hidden) {
      if(v) this.element.className += ' tracklist--hidden';
      else this.element.className = this.element.className.replace(/\btracklist--hidden\b/g, '');
    }
  },

  get api() {
    return this.search.api;
  },

  get slug() {
    return this.element.getAttribute('data-slug');
  },

  get checksum() {
    return this.constructor.checksum(this.tracks);
  },

  get master() {
    return this.element.getAttribute('data-master') !== null;
  },

  get playing() {
    return this.current && this.current.playing;
  },

  get background() {
    return this.elemennts.background.style.backgroundImage.replace(/^url\((.+)\)$/, '$1');
  },

  set background(v) {
    var self = this;

    this.elements.backgroundCue.style.backgroundImage = 'url('+v+')';
    this.elements.backgroundCue.className += ' tracklist__background-cue--visible';
    setTimeout(function() {
      self.elements.background.style.backgroundImage = 'url('+v+')';
      self.elements.backgroundCue.className = self.elements.backgroundCue.className.replace(/\btracklist__background-cue--visible\b/g, '');
    }, 500);
  },

  get current() {
    return this._current;
  },

  set current(v) {
    if(v && this.current && this.current.identifier == v.identifier) return;

    if(v) {
      var self = this;

      v.big = true;
      v.removeParent();

      if(this.current) {
        this.current.replace(v);
        this.current.pause();
      }
      else {
        var current = this.elements.current.querySelector('.track');
        if(current) {
          current.parentNode.insertBefore(v.element, current);
          current.parentNode.removeChild(current);
        }
      }

      this.background = v.cover;
      this.controls.playable = true;
      if(this.tracks.length < 2) this.controls.nextable = false;
    }
    else {
      this.controls.playable = false;
      this.controls.nextable = false;
    }

    this._current = v;
    if(this.current) {
      this.current.once('end', function() {
        self.next();
      });
    }
    this.play();
  },

  get progress() {
    return parseFloat(this.elements.progress.style.width || 0)/100;
  },

  set progress(v) {
    this.elements.progress.style.width = v*100+'%';
  },

  play: function() {
    if(this.current && this.master) {
      this.current.play();
      this.controls.playing = true;
    }
  },

  pause: function() {
    if(this.current && this.master) {
      this.current.pause();
      this.controls.playing = false;
    }
  },

  next: function() {
    this.current = this.tracks[1];
  },

  add: function(track) {
    var self = this;
    this.requests.add.send(track.data);
  },

  remove: function(track) {
    if(this.delete(track)) this.requests.remove.send(track.data);
  },

  different: function(tracks) {
    return this.constructor.checksum(tracks) !== this.checksum;
  },

  update: function() {
    this.requests.index.send();
  },

  append: function(track) {
    var self = this;

    var element = document.createElement('div');
    element.className = 'tracklist__track';

    element.appendChild(track.element);

    if(this.master) {
      var remove = document.createElement('span');
      remove.className = 'tracklist__track-remove';

      remove.addEventListener('click', function() {
        self.remove(track);
      });

      element.appendChild(remove);
    }

    track.element.normal = true;
    this.elements.tracks.appendChild(element);
  },

  delete: function(track) {
    var index = this.tracks.indexOf(track);
    if(index !== -1) {
      this.tracks = this.tracks.slice(0, index).concat(this.tracks.slice(index + 1));
      track.removeParent();
      return true;
    }
    else return false;
  },

  render: function(tracks) {
    if(tracks !== undefined) {
      if(this.different(tracks)) {
        var track, t;

        for(var i = 0; i < tracks.length; i++) {
          track = this.tracks[i];
          t = tracks[i];

          if(track) {
            if(track.identifier != t.identifier) {
              track.replace(t);
              this.delete(track);
            }
            else if(tracks.id !== t.id) tracks.id = t.id;
          }
          else {
            this.tracks.push(t);
            this.append(t);
          }
        }
      }
    }
    else {
      this.clear();
      for(var i = 0; i < this.tracks.length; i++) this.append(this.tracks[i]);
    }

    this.controls.playable = this.tracks.length > 0;
    this.controls.nextable = this.tracks.length > 1;
  },

  parse: function(tracks) {
    var self = this;

    return tracks.map(function(track) {
      return new Poule.Track(
        self.api.providers.find(function(provider) { return provider.name == track.api; }),
        track.identifier,
        track.cover,
        track.title,
        track.meta,
        track.id
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
  return tracks.map(function(track) { return track.id; }).join(',');
};

Poule.Tracklist.init = function() {
  var element = document.querySelector('.tracklist');
  if(element) tracklist = new this(element);
};
