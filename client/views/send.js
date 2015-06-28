Template.sendView.helpers({
  isntSent: function() {
    return Session.get("sent") !== true;
  }
});

Template.sendView.events({
  'keyup h1': function(event, template) {
    var text = $("h1 span").text();
    if(_.isEmpty(text)) {
      $("h1 span").text("Start typing...");
      $("p").css("visibility", "hidden");
    }
    else {
      $("p").css("visibility", "visible");
      $("div.button").removeClass("disabled");
    }
    if (event.which !== 0) {
      stylePage( text );
    }
    limitCharacters(event);
  },
  'keydown h1': function(event, template) {

    if(  $("h1 span").text() === "Start typing..." ) {
      $("h1 span").text("");
    }

    limitCharacters(event);
    if(event.which === 13) {

      $("h1 span").blur().attr("contenteditable", false);

      Session.set("sent", true);
      var newMessage = $("h1 span").text();
      $("h1 span").removeClass().addClass("style0").text("...");

      $.get("http://api.hostip.info/get_json.php", function(ip) {

        Messages.insert({
          createdAt: moment().utc().toDate(),
          text: newMessage,
          displayDate: Session.get("nextDisplayDate"),
          ip: ip
        },
        function(err, id) {
          if(err) {
            console.log(err);
            $("h1 span").html("&#9785;");
          }
          else {
            $("h1 span").html("&#9786;");
            Session.set("message", newMessage);
          }
          setTimeout(function() {
            window.location.href = "/";
          }, 2000);
        });
      });
    }
  }
  //,
  // 'click div.button': function(event, template) {
  // }
});

Template.sendView.onRendered(function() {
  $('h1 span').focus();
  stylePage("");
});
