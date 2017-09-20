Poule.Api.Action = function(params, builders) {
  this.params = params;
  this.builders = builders;
};

Poule.Api.Action.prototype = {
  constructor: Poule.Api.Action,

  get url() {
    return this.builders.url(this.params),
  },

  get response() {
    return this.builders.response(this.request.response);
  }
};
