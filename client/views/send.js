Template.sendView.helpers({
  isntSent: function() {
    return Session.get("sent") !== true;
  }
});

Template.sendView.events({
  'keyup h1': function(event, template) {
    var text = $("h1 span").text();
    if(_.isEmpty(text)) {
      if(Meteor.Device.isPhone() || Meteor.Device.isTablet()) {
        $('h1 span').text("Tap to type");
      }
      else {
        $('h1 span').text("Start typing...");
      }
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

    var text = $("h1 span").text();
    var hasPlaceholder = (text === "Start typing...") || (text === "Tap to type");

    // if ESC
    if(event.which === 27) {
      event.preventDefault();
      window.location.href = "/";
    }
    // if ENTER
    else if(event.which === 13 && !hasPlaceholder) {
      event.preventDefault();

      Session.set("sent", true);
      var newMessage = $("h1 span").text();

      $("h1 span")
      .blur()
      .attr("contenteditable", false)
      .text("")
      .removeClass().addClass("style0");

      Messages.insert({
        createdAt: moment().utc().toDate(),
        text: newMessage,
        displayDate: Session.get("nextDisplayDate"),
        ip: headers.getClientIP()
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
        }, 1500);
      });
    }
    else {
      if(hasPlaceholder) {
        $("h1 span").text("");
      }
      limitCharacters(event);
    }
  }
  //,
  // 'click div.button': function(event, template) {
  // }
});

Template.sendView.onRendered(function() {
  if(Meteor.Device.isPhone() || Meteor.Device.isTablet()) {
    $('h1 span').text("Tap to type");
  }
  else {
    $('h1 span').text("Start typing...").focus();
  }
  stylePage("");
});
