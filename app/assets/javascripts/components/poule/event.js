Poule.Event = function(type, data) {
  this.type = type;
  var propagationStopped = false;

  this.stopPropagation = function() {
    propagationStopped = true;
  };

  Object.defineProperties(this, {
    propagationStopped: {
      get: function() {
        return propagationStopped;
      }
    }
  });

  for(var key in data) {
    if(this[key] === undefined) this[key] = data[key];
  }
};

Poule.Event.prototype = {
  constructor: Poule.Event
};
