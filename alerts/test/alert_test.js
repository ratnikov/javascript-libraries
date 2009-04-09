jQuery(document).ready(function() {
  var global = {};

  // override the timeout methods
  setTimeout = function() { global.timeoutSet = arguments; };
  clearTimeout = function(id) {  global.timeoutCleared = id; };

  test("truthitest", function() { ok(true); });

  module("Initialization");

  test("Should register the alert with alert list", function() {
    var alert = new Alerts.Alert("random alert");
    ok(Alerts.List.instance().is_registered(alert), "Should automatically register the alert with the alert list");
  });

  test("Should push custom html node if specified", function() {
    var added_args = null;
    Alerts.List.instance().add = function() { added_args = arguments; };

    var alert = new Alerts.Alert("random alert");
    equals(alert, added_args[0], "Should add the alert");
    equals(undefined, added_args[1], "Should not specify html node by default");

    var custom_alert = new Alerts.Alert("with html node", { html_node: "html node" });
    equals(added_args[0], custom_alert, "Should add the custom alert as well");
    equals(added_args[1], "html node", "Should forward the custom 'html node'");
  });

  test("Should correctly setup duration", function() {
    equals(5000, (new Alerts.Alert("default duration alert")).duration(), "Should use default 5000 as duration");
    equals(1000, (new Alerts.Alert("custom duration alert", { duration: 1000 })).duration(), "Should allow specifying custom duration");
  });

  test("Should support 'permanent' alerts (with duration 'null')", function() {
    delete global.timeoutSet;
    var perm_alert = new Alerts.Alert("permanent", { duration: null });

    ok(typeof global.timeoutSet === 'undefined', "Should not setup any time outs");
  });

  test("Should setup the timeout correctly", function() {
    delete global.timeoutSet;

    alert = new Alerts.Alert("alert", { duration: 1000 });
    ok(typeof global.timeoutSet !== 'undefined', "Should set the timeout");

    var callback = global.timeoutSet[0];
    ok(typeof callback !== 'undefined', "Should specify the callback parameter");
    equals(alert.duration(), global.timeoutSet[1], "Should correctly specify the duration of the alert");

    var elapsed = false;
    alert.elapse = function() { elapsed = true;} ; 

    callback();
    ok(elapsed, "Callback should invoke #elapse on the alert");
  });

  module("#elapse", {
    setup: function() {
      global.alert = new Alerts.Alert("default alert");
    }
  });

  test("should remove the alert from the list", function() {
    var removed = null;
    global.alert.list = function() { return { remove: function(alert) { removed = alert; } }; };

    global.alert.elapse();
    equals(global.alert, removed, "Should attempt to remove the alert from the list");
  });

  test("should clear the timeout", function() {
    var cleared = false;
    global.alert._clear_timeout = function() { cleared = true; };
    global.alert.elapse();

    ok(cleared, "Should clear the timeout");
  });

  module("#_clear_timeout", {
    setup : function() {
      global.alert = new Alerts.Alert("alert");
    }
  });

  test("should invoke clearTimeout if it was setup", function() {
    global.alert._timeout = 555;
    global.alert._clear_timeout();

    equals(555, global.timeoutCleared, "Should clear the setup timeout");
    ok(typeof global.alert._timeout === 'undefined', "Should undefine the timeout after it was cleared");
  });

  test("should do nothing if timeout wasnt setup", function() {
    delete global.alert._timeout; // make sure it wasn't setup

    delete global.timeoutCleared;
    global.alert._clear_timeout();
    ok(typeof global.timeoutCleared === "undefined", "Should not clear the timeout");
  });
});
