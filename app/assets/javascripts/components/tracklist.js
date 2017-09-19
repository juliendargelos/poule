var Tracklist = function(element) {
  this.element = element;
  this.search = new this.constructor.Search(this.element.querySelector('.tracklist__search'));
};

Tracklist.prototype = {
  constructor: Tracklist,
};

Tracklist.init = function() {
  window.tracklist = new this(document.querySelector('.tracklist'));
};
