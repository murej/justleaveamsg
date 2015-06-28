_ = lodash;

Template.home.helpers({
  message: function() {

    var message = Session.get("message");

    if(_.isEmpty(message)) {
      $("main").fadeOut(0);
      $("main").hide();
    }
    else {
      // $("main").fadeIn(500);
      stylePage();
    }
    return message;
  },
  remaining: function() {

    var remainingMessages = Messages.find(
      { displayDate: { $gt: getTodayUTCMidnight() } },
      { fields: { text: 0, ip: 0 } }
    ).fetch();

    if( !_.isEmpty(remainingMessages) ) {
      return remainingMessages.length;
    }
    else {
      return 0;
    }
  }
});

Template.home.onRendered(function() {
  if(Meteor.isClient) {
    stylePage();
  }
});
