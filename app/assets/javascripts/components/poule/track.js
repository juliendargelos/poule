Poule.Track = function(api, identifier, cover, title, meta, id) {
  this._element = null;
  this.elements = {};

  this.id = id;
  this.api = api;
  this.identifier = identifier;
  this.cover = cover;
  this.title = title;
  this.meta = meta;
};

Poule.Track.prototype = {
  get created() {
    return !!this._element;
  },

  get element() {
    if(!this.created) {
      this.create();
      this.render();
    }

    return this._element;
  },

  get big() {
    return this.element.className.match(/\btrack--big\b/) !== null;
  },

  set big(v) {
    v = !!v;
    if(v !== this.big) {
      if(v) this.element.className += ' track--big';
      else this.element.className = this.element.className.replace(/\btrack--big\b/, '');
    }
  },

  get small() {
    return this.element.className.match(/\btrack--small\b/) !== null;
  },

  set small(v) {
    v = !!v;
    if(v !== this.small) {
      if(v) this.element.className += ' track--small';
      else this.element.className = this.element.className.replace(/\btrack--small\b/, '');
    }
  },

  get normal() {
    return !(this.small || this.big);
  },

  set normal(v) {
    v = !!v;
    if(v !== this.normal) {
      if(v) {
        this.small = false;
        this.big = false;
      }
      else this.small = true;
    }
  },

  set element(v) {
    this._element = v;
  },

  get data() {
    return {
      track: {
        id: this.id,
        api: this.api.name,
        identifier: this.identifier,
        cover: this.cover,
        title: this.title,
        meta: this.meta
      }
    }
  },

  get loading() {
    return this.elements.cover && this.elements.cover.className.match(/\btrack__cover--loading\b/) !== null;
  },

  set loading(v) {
    if(this.elements.cover) {
      v = !!v;
      if(v != this.loading) {
        if(v) this.elements.cover.className += ' track__cover--loading';
        else this.elements.cover.className = this.elements.cover.className.replace(/\btrack__cover--loading\b/, '');
      }
    }
  },

  create: function() {
    this.element = document.createElement('div');
    this.element.className = 'track';

    this.elements.cover = document.createElement('div');
    this.elements.cover.className = 'track__cover';

    this.elements.infos = document.createElement('div');
    this.elements.infos.className = 'track__infos';

    this.elements.title = document.createElement('span');
    this.elements.title.className = 'track__title';

    this.elements.meta = document.createElement('span');
    this.elements.meta.className = 'track__meta';

    this.elements.infos.appendChild(this.elements.title);
    this.elements.infos.appendChild(this.elements.meta);
    this.element.appendChild(this.elements.cover);
    this.element.appendChild(this.elements.infos);
  },

  render: function() {
    var self = this;

    this.loading = true;

    var cover = new Image();
    cover.addEventListener('load', function() {
      self.elements.cover.style.backgroundImage = 'url('+self.cover+')';
      self.loading = false;
    });

    cover.src = this.cover

    this.elements.title.textContent = this.title;
    this.elements.meta.textContent = this.meta;
  },

  remove: function() {
    if(this.created && this.element.parentNode) this.element.parentNode.removeChild(this.element);
  }
};
