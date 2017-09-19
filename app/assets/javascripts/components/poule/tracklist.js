Poule.Tracklist = function(element) {
  this.element = element;
  this.search = new this.constructor.Search(this.element.querySelector('.tracklist__search'));
};

Poule.Tracklist.prototype = {
  constructor: Poule.Tracklist,
};

Poule.Tracklist.init = function() {
  var element = document.querySelector('.tracklist');
  if(element) window.tracklist = new this(element);
};
