Poule.Tracklist.Search = function(element) {
  Poule.Event.Listener.defer(this);

  this.api = new Poule.Api();
  this.element = element;
  this._keep = false;
  this.results = [];
  this.elements = {
    input: this.element.querySelector('.tracklist__search-input'),
    results: this.element.querySelector('.tracklist__search-results')
  };

  this.init();
};

Poule.Tracklist.Search.prototype = {
  constructor: Poule.Tracklist.Search,
  timeout: null,
  hideTimeout: null,
  interval: 200,

  get keep() {
    var keep = this._keep;
    this._keep = false;
    return keep;
  },

  set keep(v) {
    this._keep = v;
  },

  get selected() {
    var index = this.index;
    return index === -1 ? null : this.results[index];
  },

  set selected(v) {
    this.unselect();
    v.selected = true;
  },

  get index() {
    return this.results.findIndex(function(result) {
      return result.selected;
    });
  },

  set index(v) {
    if(v < 0) v = this.results.length - 1;
    this.selected = this.results[v%this.results.length];
  },

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

  unselect: function() {
    var result = this.selected;
    if(result) result.selected = false;
  },

  fetch: function() {
    var self = this;

    clearTimeout(this.timeout);
    this.loading = true;
    this.timeout = setTimeout(function() {
      self.api.search(self.value, function(tracks) {
        self.results = tracks.map(function(track) { return new self.constructor.Result(track); });
        self.render();
        self.loading = false;
      });
    }, this.interval);
  },

  clear: function() {
    this.elements.results.innerHTML = '';
  },

  render: function() {
    var element, result;

    this.clear();

    if(this.results.length == 0) this.empty = true;
    else {
      var self = this;
      var result;
      this.empty = false;
      this.selected = this.results[0];

      for(var i = 0; i < this.results.length; i++) {
        result = this.results[i];

        result.on('mousedown', function() {
          self.keep = true;
        });

        result.on('click', function() {
          self.selected = this;
          self.validate();
        });

        this.elements.results.appendChild(this.results[i].element);
      }
    }
  },

  handle: function() {
    if(this.value === '') {
      this.hidden = true;
      this.loading = false;
      this.results = [];
      this.clear();
    }
    else {
      this.hidden = false;
      this.fetch();
    }
  },

  validate: function() {
    this.elements.input.blur();
    this.focus = false;

    var selected = this.selected;
    if(selected) {
      this.dispatch('validate', {track: selected.track});
      this.value = '';
      this.handle();
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
      if(!self.keep) self.hidden = true;
    });

    this.elements.input.addEventListener('keydown', function(event) {
      if(event.keyCode === 38) {
        self.index--;
      }
      else if(event.keyCode === 40) {
        self.index++;
      }
      else if(event.keyCode === 13) self.validate();
      else if(event.keyCode === 27) self.elements.input.blur();
      else {
        self.oldValue = self.value;

        setTimeout(function() {
          if(self.oldValue !== self.value) self.handle();
        }, 1);

        return;
      }

      event.preventDefault();
    });
  }
};
