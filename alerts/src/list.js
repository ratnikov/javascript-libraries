Alerts.List = function(ul) {
  this._alerts = [];
  this._ul = ul;
};

Alerts.List.prototype.remove_alert_html = function(li_dom) {
  var li = jQuery(li_dom); 
  li.hide("drop", {}, 'normal', function() {
    li.remove();
  });
};

Alerts.List.prototype.alerts = function() {
  var alerts = [];

  for (var i = 0; i < this._alerts.length; i++) {
    // the alert object is the first of the pair
    alerts.push(this._alerts[i][0]);
  }
  
  return alerts;
};

Alerts.List.prototype.is_registered = function(obj) {
  var alerts = this.alerts();
  for (var i = 0; i < alerts.length; i++) {
    if (alerts[i] === obj) {
      return true;
    }
  }

  return false;
};

Alerts.List.prototype.ul = function() {
  if (typeof this._ul === "undefined") {
    this._ul = "ul#alerts";
  }

  return jQuery(this._ul);
};

Alerts.List.prototype.add = function(alert, node) {

  // if no custom html node is specified, add an extra li to the alerts ul
  if (typeof node === 'undefined') {
    this.ul().append("<li>"+alert.message()+"</li>");
    node = this.ul().children("li:last").get(0);
  }

  this._alerts.push([ alert, node ]);
};

Alerts.List.prototype.remove = function(alert) {
  var self = this;
  var alerts = this._alerts;

  this._alerts = jQuery.map(alerts, function(alert_pair) {
    if (alert_pair[0] === alert) {

      // destroy the li
      self.remove_alert_html(alert_pair[1]);

      // remove from the alerts array
      return null;
    } else {
      return [ alert_pair ];
    }
  });
};

Alerts.List.instance = function() {
  // private storage of the singleton instance
  var instance = null;

  return (function() {
    if (instance === null) {
      instance = new Alerts.List();

      // load up existing alerts
      instance.ul().children("li").each(function() {
	var jslint = new Alerts.Alert(jQuery(this).html(), { html_node: this });
      });
    }

    return instance; 
  });
}();

jQuery(document).ready(function() {

  // force initialization
  Alerts.List.instance();
});
