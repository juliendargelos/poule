Poule.Request = function(url, method) {
  var self = this;

  this.data = null;
  this.url = url;
  this.method = method || 'get';
  this.json = true;
  this.xhr = new XMLHttpRequest();

  Poule.Event.Listener.defer(this);

  this.xhr.onreadystatechange = function() {
    self.dispatch('change');
  };

  this.on('change', function() {
    if(this.finished) {
      this.dispatch('complete', {response: this.response});
      if(this.status === 200) this.dispatch('success', {response: this.response});
      else this.dispatch('error', {response: this.response});
      this.data = null;
    }
  });
};

Poule.Request.prototype = {
  get params() {
    return Poule.Request.params(this.data);
  },

  get form() {
    return Poule.Request.form(this.data);
  },

  get state() {
    return this.xhr.readyState;
  },

  get finished() {
    return this.state === 4;
  },

  get status() {
    return this.xhr.status;
  },

  get response() {
    if(this.json) {
      try {
        return JSON.parse(this.xhr.responseText);
      }
      catch(e) {
        return this.xhr.responseText;
      }
    }
    else return this.xhr.responseText;
  },

  send: function(data) {
    if(data !== undefined) this.data = data;
    var method = this.method.toLowerCase();
    if(!['get', 'post'].includes(method)) {
      if(!this.data) this.data = {};
      this.data._method = this.method;
      method = 'post';
    }

    var url = this.url+(method === 'get' ? '?'+this.params : '');
    this.xhr.open(method, url);
    this.xhr.send(method === 'post' ? this.form : undefined);

    if(this.data) delete this.data._method;

    return this;
  }
};

Object.defineProperties(Poule.Request, {
  authenticityToken: {
    get: function() {
      var meta = document.querySelector('meta[name="csrf-token"]');
      return meta ? meta.getAttribute('content') : null;
    }
  },
});

Poule.Request.params = function(data, tree) {
  if(typeof tree !== 'string') tree = '';
  var params = '';

  for(var param in data) {
    if(data.hasOwnProperty(param)) params += this.param(data, param, tree);
  }

  return params.replace(/&$/, '');
};

Poule.Request.param = function(data, param, tree) {
  if(['string', 'number', 'boolean'].includes(typeof data[param])) {
    return tree+(tree === '' ? param : '['+param+']')+'='+encodeURIComponent(data[param])+'&';
  }
  else if(typeof data[param] === 'object') {
    return this.params(data[param], tree+(tree === '' ? param : '['+param+']'))+'&';
  }
  else return '';
};

Poule.Request.form = function(data, form, namespace) {
  if(data instanceof FormData) return data;
  if(namespace === undefined) data.authenticity_token = this.authenticityToken;
  if(data instanceof HTMLFormElement) form = new FormData(data);
  else {
    if(!(form instanceof FormData)) form = new FormData();
    for(var field in data) {
      if(data.hasOwnProperty(field)) this.field(data, field, namespace, form);
    }
  }

  return form;
};

Poule.Request.field = function(data, field, namespace, form) {
  var key = namespace ? namespace+'['+field+']' : field;

  if(typeof data[field] === 'object' && !(data[field] instanceof File) && !(data[field] instanceof FileList) && data[field] !== null) this.form(data[field], form, key);
  else form.append(key, data[field]);
};
