Poule.Tracklist.Search.Result = function(track) {
  Poule.Event.Listener.defer(this);

  this._element = null;
  this.track = track;
};

Poule.Tracklist.Search.Result.prototype = {
  get element() {
    if(!this.created) {
      this.create();
      this.render();
    }

    return this._element;
  },

  set element(v) {
    this._element = v;
  },

  get created() {
    return !!this._element;
  },

  get selected() {
    return this.element.className.match(/\btracklist__search-result--selected\b/) !== null;
  },

  set selected(v) {
    v = !!v;

    if(v !== this.selected) {
      if(v) this.element.className += ' tracklist__search-result--selected';
      else this.element.className = this.element.className.replace(/\btracklist__search-result--selected\b/, '');
    }
  },

  create: function() {
    var self = this;

    this.element = document.createElement('li');
    this.element.className = 'tracklist__search-result';

    this.element.addEventListener('click', function() {
      self.dispatch('click');
    });

    this.element.addEventListener('mousedown', function() {
      self.dispatch('mousedown');
    });
  },

  clear: function() {
    this.element.innerHTML = '';
  },

  render: function() {
    this.clear();
    if(this.track) {
      this.track.small = true;
      this.element.appendChild(this.track.element);
    }
  }
};
