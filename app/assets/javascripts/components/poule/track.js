Poule.Track = function(api, identifier, cover, title, meta) {
  this._element = null;
  this.elements = {};

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

  set element(v) {
    this._element = v;
  },

  get data() {
    return {
      track: {
        api: this.api.name,
        identifier: this.identifier,
        cover: this.cover,
        title: this.title,
        meta: this.meta
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
    this.elements.cover.style.backgroundImage = 'url('+this.cover+')';
    this.elements.title.textContent = this.title;
    this.elements.meta.textContent = this.meta;
  }
};
