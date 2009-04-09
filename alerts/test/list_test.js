jQuery(document).ready(function() {
  var global = { list: Alerts.List.instance() };

  test("truthitest", function() { ok(true); });

  module("#instance");

  test("should return the same object", function() {
    ok(Alerts.List.instance() == global.list, "Should always be the same object");
  });

  test("should load up alerts for already existing elements", function() {
    equals(Alerts.List.instance().alerts().length, jQuery("ul#alerts li").size(), "Should have as many alert lis as there are registered alerts");

    jQuery("ul#alerts li").each(function() {
      var li = jQuery(this);
      var matching_alerts = jQuery.map(Alerts.List.instance().alerts(), function(alert) {

	if (alert.message() === li.html()) {
	  return alert;
	} else {
	  return null;
	}
      });
      
      ok(matching_alerts.length === 1, "Should have exactly one registered alert with html matching \""+li.html()+"\"");
    });
  });
  
  module("#ul");

  test("should recognize the alerts ul", function() {
    ok(global.list.ul().is("ul#alerts:first"), "Should match the only alerts ul");
  });

  module("#is_registered", {
    setup : function() {
      Obj = function(message) { this.message = function() { return message; }; };

      global.foo = new Obj();
      global.list.alerts = function() { return [ 'foo', 'bar', 4, global.foo ]; };
    },
    teardown: function() {
      delete global.list.alerts;
    }
  });

  test("should return true if there's an object in the alerts() return and false otherwise", function() {
    equals(true, global.list.is_registered('foo'));
    equals(true, global.list.is_registered(4));
    equals(true, global.list.is_registered(global.foo));
    equals(false, global.list.is_registered(5));
    equals(false, global.list.is_registered(new Obj()), "When checking if there's a sibling of one of the objects");
  });

  module("#add", {
    setup: function() {
      global.alert = { message: function() { return 'foo'; } };
    }
  });

  test("should have the object registered", function() {
    global.list.add(global.alert);
    ok(global.list.is_registered(global.alert), "Should register the alert object");
  });

  test("should add a li to the ul", function() {
    global.list.add(global.alert);

    var has_matching_li = false;
    global.list.ul().children('li').each(function() {

      if (has_matching_li) {
	// if already found a matching li, do nothing, just skip to the end
      } else {
        has_matching_li = (new RegExp(global.alert.message())).exec(jQuery(this).html());
      }
    });

    ok(has_matching_li, "Should add an li containing message of the alert");
  });

  test("should allow specifying custom html node", function() {
    var pushed_pair = null;
    global.list._alerts.push = function(pair) { pushed_pair = pair; };

    var node = "node";

    var ul_alerts = jQuery("ul#alerts li").get().length;
    global.list.add(global.alert, node);

    equals(jQuery("ul#alerts li").get().length, ul_alerts, "Should not add any list items");

    same([global.alert, node], pushed_pair, "Should specify custom node in the added alert pair");
  });

  module("#remove", {
    setup: function() {
      global.alert = new Alerts.Alert("removable alert");
    }
  });

  test("should make the alert not registered anymore", function() {
    global.list.remove(global.alert);
    ok(!global.list.is_registered(global.alert), "Should unregister the removed alert");
  });

  test("should not have any li with the alert's message", function() {
    var li_arr = [];
    global.list.remove_alert_html = function(li) { li_arr.push(li); };

    global.list.remove(global.alert);
    same(jQuery("ul li:last").get(), li_arr, "Should have removed the last li");

    delete global.list.remove_alert_html;
  });

  module("#remove_alert_html");

  test("#remove_alert_html", function() {
    ok(false, "Not tested");
  });
});
