Poule.Event.Listener = function() {
  this.handlers = {};
};

Poule.Event.Listener.prototype = {
  constructor: Poule.Event.Listener,

  available: function(event) {
    return Array.isArray(this.handlers[event]);
  },

  get: function(event) {
    if(!this.available(event)) this.handlers[event] = [];
    return this.handlers[event];
  },

  addEventListener: function(event, callback) {
    this.get(event).push(callback);
  },

  removeEventListener: function(event, callback) {
    if(this.available(event)) {
      var handlers = this.get(event);
      var index = handlers.indexOf(callback);
      if(index !== -1) this.handlers[event] = handlers.slice(0, index).concat(handlers.slice(index + 1));
    }
  },

  each: function(events, callback) {
    events = (events+'').split(' ');
    var event;

    for(var i = 0; i < events.length; i++) {
      event = events[i].trim();
      if(event) callback.call(this, event);
    }
  },

  on: function(events, callback) {
    this.each(events, function(event) {
      this.addEventListener(event, callback);
    });
  },

  off: function(events, callback) {
    this.each(events, function(event) {
      this.removeEventListener(evebnt, callback);
    });
  },

  once: function(events, callback) {
    this.on(events, function(event) {
      callback.call(this, event);
      this.off(events, callback);
    });
  },

  dispatch: function(events, data) {
    var handler;

    this.each(events, function(event) {
      handlers = this.get(event);

      event = data instanceof Poule.Event ? data : new Poule.Event(event, data);

      for(var i = 0; i < handlers.length; i++) {
        handlers[i].call(this, event);
        if(event.propagationStopped) break;
      }
    });
  },

  defer: function(object) {
    this.assign('addEventListener', object);
    this.assign('removeEventListener', object);
    this.assign('on', object);
    this.assign('off', object);
    this.assign('once', object);
    this.assign('dispatch', object);

    return this;
  },

  assign: function(method, object) {
    var self = this;

    object[method] = function() {
      self[method].apply(self, Array.prototype.map.call(arguments, function(arg) {
        if(typeof arg === 'function') {
          return function() {
            return arg.apply(object, Array.prototype.slice.call(arguments));
          };
        }
        else return arg;
      }));

      return object;
    };
  }
};

Poule.Event.Listener.defer = function(object) {
  return (new this()).defer(object);
};
