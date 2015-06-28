_ = lodash;

Template.home.helpers({
  myAppVariable: function() {
    return Session.get('myAppVariable');
  },
  message: function (message) {
    setMessage();

    var message = Session.get('message');
    if(_.isEmpty(message)) {
      message = "No message.";
    }
    return message;
  },
  number: function() {
    return Session.get('count');
  },
  remaining: function() {

    var remainingMessages = Messages.find({ displayDate: { $gt: getTodayUTCMidnight() } });
    var remainingMessagesArray = remainingMessages.fetch();

    if( !_.isEmpty(remainingMessagesArray) ) {
      return remainingMessages.count();
    }
    else {
      return 0;
    }
  }
});

Template.home.onRendered(function() {
  if(Meteor.isClient) {
    setMessage();
  }
});
