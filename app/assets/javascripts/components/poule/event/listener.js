Poule.Event.Listener = function() {
  this.handlers = {};
  this.dispatchedEvents = {};
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
      this.get(event).push(callback);
    });
  },

  off: function(events, callback) {
    var handlers, index;
    this.each(events, function(event) {
      if(this.available(event)) {
        handlers = this.get(event);
        index = handlers.indexOf(callback);
        if(index !== -1) this.handlers[event] = handlers.slice(0, index).concat(handlers.slice(index + 1));
      }
    });
  },

  once: function(events, callback) {
    this.on(events, function(event) {
      callback.call(this, event);
      this.off(events, callback);
    });
  },

  require: function(events, callback) {
    var dispatched = this.dispatched(events);

    if(dispatched) callback.call(this, dispatched);
    else this.once(events, callback);
  },

  dispatch: function(events, data) {
    var handler;

    this.each(events, function(event) {
      handlers = this.get(event);

      event = data instanceof Poule.Event ? data : new Poule.Event(event, data);
      this.dispatchedEvents[event.type] = event;

      for(var i = 0; i < handlers.length; i++) {
        handlers[i].call(this, event);
        if(event.propagationStopped) break;
      }
    });
  },

  dispatched: function(events) {
    var dispatched = false;

    this.each(events, function(event) {
      dispatched = this.dispatchedEvents[event];
      return !!dispatched;
    });

    return dispatched;
  },

  defer: function(object) {
    this.assign('on', object);
    this.assign('off', object);
    this.assign('once', object);
    this.assign('require', object);
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
