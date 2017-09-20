Poule.Tracklist.Search = function(element) {
  this.element = element;
  this.placeholder = this.element.querySelector('.tracklist__search-placeholder');
  this.input = this.element.querySelector('.tracklist__search-input');

  this.init();
};

Poule.Tracklist.Search.prototype = {
  constructor: Poule.Tracklist.Search,

  get value() {
    return this.input.value.trim();
  },

  set value(v) {
    this.input.value = v.trim();
  },

  get focus() {
    return this.element.className.match(/\btracklist__search--focus\b/) !== null;
  },

  set focus(v) {
    v = !!v;

    if(v !== this.focus) {
      if(v) this.element.className += ' tracklist__search--focus';
      else this.element.className = this.element.className.replace(/\btracklist__search--focus\b/, '');
    }
  },

  init: function() {
    var self = this

    this.value = '';

    this.input.addEventListener('mousedown', function() {
      self.focus = true;
    });

    this.input.addEventListener('focus', function() {
      self.focus = true;
    });

    this.input.addEventListener('blur', function() {
      if(self.value === '') self.focus = false;
    });
  }
};
