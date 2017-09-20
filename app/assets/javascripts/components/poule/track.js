Poule.Track = function(source, url, cover, title, meta) {
  this.element = null;
  this.elements = {};

  this.source = source;
  this.url = url;
  this.cover = cover;
  this.title = title;
  this.meta = meta;
};

Poule.Track.prototype = {
  get created() {
    return !!this.element;
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
    this.elements.infos.appendChild(this.elements.name);
    this.element.appendChild(this.elements.cover);
    this.element.appendChild(this.elements.infos);
  },

  render: function() {
    this.elements.cover.style.backgroundImage = 'url('+this.cover+')';
    this.elements.title.textContent = this.title;
    this.elements.meta.textContent = this.meta;
  }
};
