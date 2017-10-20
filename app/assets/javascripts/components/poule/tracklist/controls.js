Poule.Tracklist.Controls = function(element) {
  var self = this;

  Poule.Event.Listener.defer(this);

  this.element = element;
  this.elements = {
    pause: this.element.querySelector('.tracklist__control--pause'),
    play: this.element.querySelector('.tracklist__control--play'),
    next: this.element.querySelector('.tracklist__control--next')
  };

  this.elements.next.addEventListener('click', function() {
    if(self.next()) self.dispatch('next');
  });

  this.elements.play.addEventListener('click', function() {
    if(self.play()) self.dispatch('play');
  });

  this.elements.pause.addEventListener('click', function() {
    if(self.pause()) self.dispatch('pause');
  });
};

Poule.Tracklist.Controls.prototype = {
  get playing() {
    return this.elements.play.className.match(/\btracklist__control--hidden\b/) !== null;
  },

  set playing(v) {
    v = !!v;

    if(v !== this.playing) {
      if(v) {
        this.elements.pause.className = this.elements.pause.className.replace(/\btracklist__control--hidden\b/, '');
        this.elements.play.className += ' tracklist__control--hidden';
      }
      else {
        this.elements.play.className = this.elements.play.className.replace(/\btracklist__control--hidden\b/, '');
        this.elements.pause.className += ' tracklist__control--hidden';
      }
    }
  },

  get nextable() {
    return this.elements.next.className.match(/\btracklist__control--disabled\b/) === null;
  },

  set nextable(v) {
    v = !!v;

    if(v !== this.nextable) {
      if(v) this.elements.next.className = this.elements.next.className.replace(/\btracklist__control--disabled\b/, '');
      else this.elements.next.className += ' tracklist__control--disabled';
    }
  },

  get playable() {
    return this.elements.play.className.match(/\btracklist__control--disabled\b/) === null;
  },

  set playable(v) {
    v = !!v;

    if(v !== this.playable) {
      if(v) {
        this.elements.play.className = this.elements.play.className.replace(/\btracklist__control--disabled\b/, '');
        this.elements.pause.className = this.elements.pause.className.replace(/\btracklist__control--disabled\b/, '');
      }
      else {
        this.elements.play.className += ' tracklist__control--disabled';
        this.elements.pause.className += ' tracklist__control--disabled';
      }
    }
  },

  play: function() {
    if(!this.playing && this.playable) {
      this.playing = true;
      return true;
    }
    else return false;
  },

  pause: function() {
    if(this.playing && this.playable) {
      this.playing = false;
      return true;
    }
    else return false;
  },

  next: function() {
    return this.nextable;
  }
};
