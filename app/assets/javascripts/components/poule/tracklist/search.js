Poule.Tracklist.Search = function(element) {
  this.api = new Poule.Api();
  this.element = element;
  this.tracks = [];
  this.elements = {
    input: this.element.querySelector('.tracklist__search-input'),
    results: this.element.querySelector('.tracklist__search-results')
  };

  this.init();
};

Poule.Tracklist.Search.prototype = {
  constructor: Poule.Tracklist.Search,
  timeout: null,
  interval: 200,

  get value() {
    return this.elements.input.value.trim();
  },

  set value(v) {
    this.elements.input.value = v.trim();
  },

  get focus() {
    return this.element.className.match(/\btracklist__search--focus\b/) !== null;
  },

  set focus(v) {
    v = !!v;

    if(v !== this.focus) {
      if(v) {
        this.element.className += ' tracklist__search--focus';
      }
      else {
        this.element.className = this.element.className.replace(/\btracklist__search--focus\b/, '');
      }
    }
  },

  get hidden() {
    return this.elements.results.className.match(/tracklist__search-results--hidden/) !== null;
  },

  set hidden(v) {
    v = !!v;

    if(v !== this.hidden) {
      if(v) this.elements.results.className += ' tracklist__search-results--hidden';
      else this.elements.results.className = this.elements.results.className.replace(/\btracklist__search-results--hidden\b/, '');
    }
  },

  get empty() {
    return this.elements.results.className.match(/tracklist__search-results--empty/) !== null;
  },

  set empty(v) {
    v = !!v;

    if(v !== this.empty) {
      if(v) this.elements.results.className += ' tracklist__search-results--empty';
      else this.elements.results.className = this.elements.results.className.replace(/\btracklist__search-results--empty\b/, '');
    }
  },

  get loading() {
    return this.element.className.match(/tracklist__search--loading/) !== null;
  },

  set loading(v) {
    v = !!v;

    if(v !== this.loading) {
      if(v) this.element.className += ' tracklist__search--loading';
      else this.element.className = this.element.className.replace(/\btracklist__search--loading\b/, '');
    }
  },

  fetch: function() {
    var self = this;

    clearTimeout(this.timeout);
    self.loading = true;
    this.timeout = setTimeout(function() {
      self.api.search(self.value, function(tracks) {
        self.tracks = tracks;
        self.render();
        self.loading = false;
      });
    }, this.interval);
  },

  clear: function() {
    this.elements.results.innerHTML = '';
  },

  render: function() {
    var element, track;

    this.clear();

    if(this.tracks.length == 0) this.empty = true;
    else {
      this.empty = false;

      for(var i = 0; i < this.tracks.length; i++) {
        track = this.tracks[i];
        track.element.className += ' track--small';

        element = document.createElement('div');
        element.className = 'tracklist__search-result';
        element.appendChild(track.element);

        this.elements.results.appendChild(element);
      }
    }
  },

  init: function() {
    var self = this

    this.value = '';

    this.elements.input.addEventListener('mousedown', function() {
      self.focus = true;
      self.hidden = false;
    });

    this.elements.input.addEventListener('focus', function() {
      self.focus = true;
      self.hidden = false;
    });

    this.elements.input.addEventListener('blur', function() {
      if(self.value === '') self.focus = false;
      self.hidden = true;
    });

    this.elements.input.addEventListener('keydown', function() {
      self.oldValue = self.value;
      setTimeout(function() {
        if(self.oldValue !== self.value) {
          if(self.value === '') {
            self.hidden = true;
            self.loading = false;
            self.tracks = [];
            self.clear();
          }
          else {
            self.hidden = false;
            self.fetch();
          }
        }
      }, 1);
    });
  }
};
