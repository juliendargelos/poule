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
      this.dispatch('complete', this.response);
      if(this.status == 200) this.dispatch('success', this.response);
      else this.dispatch('error', this.response);
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
    return this.state == 4;
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
    var url = this.url+(this.method.toLowerCase() == 'get' ? '?'+this.params : '');
    this.xhr.open(this.method.toUpperCase(), url);
    this.xhr.send(this.method.toLowerCase() == 'post' ? this.form : undefined);

    return this;
  }
};

Poule.Request.params = function(data, tree) {
  if(typeof tree != 'string') tree = '';
  var params = '';

  for(var p in data) {
    if(['string', 'number', 'boolean'].includes(typeof data[p])) {
      params += tree+(tree == ''? p : '['+p+']')+'='+encodeURIComponent(data[p])+'&';
    }
    else if(typeof data[p] == 'object') {
      params += this.params(data[p], tree+(tree == '' ? p : '['+p+']'))+'&';
    }
  }

  return params.replace(/&$/, '');
};

Poule.Request.form = function(data, form, namespace) {
  if(data instanceof FormData) return data;
  if(data instanceof HTMLElement) form = new FormData(data);
  else {
    if(!(form instanceof FormData)) form = new FormData();

    var key;

    for(var property in data) {
      if(data.hasOwnProperty(property)) {
        key = namespace ? namespace+'['+property+']' : property;

        if(typeof data[property] === 'object' && !(data[property] instanceof File) && !(data[property] instanceof FileList) && data[property] !== null) Mu.Request.form(data[property], form, key);
        else form.append(key, data[property]);
      }
    }
  }

  return form;
};
