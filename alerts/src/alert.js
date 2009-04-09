
Alerts.Alert = function(message, options) {
  this._message = message;

  if (typeof options === 'undefined') {
    options = {};
  }

  if (typeof options.duration === 'undefined') {
    options.duration = 5000;
  }

  this._duration = options.duration;

  this.list().add(this, options.html_node);

  this._setup_timeout();
};

Alerts.Alert.prototype._setup_timeout = function() {
  if (this.duration() !== null) {
    var self = this;
    this._timeout = setTimeout(function() {
      self.elapse();
    }, this.duration());
    return true;
  } else {
    return false;
  }
};

Alerts.Alert.prototype._clear_timeout = function() {
  if (typeof this._timeout !== "undefined") {
    clearTimeout(this._timeout);
    delete this._timeout;
    return true;
  } else {
    return false;
  }
};

Alerts.Alert.prototype.list = function() {
  return Alerts.List.instance();
};

Alerts.Alert.prototype.message = function() {
  return this._message;
};

Alerts.Alert.prototype.duration = function() {
  return this._duration;
};

Alerts.Alert.prototype.elapse = function() {
  this.list().remove(this);
  this._clear_timeout();
};
