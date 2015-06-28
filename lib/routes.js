Router.configure({
    layoutTemplate: 'layout',
    loadingTemplate: 'loading'
});

Router.route('/', {
  name: 'home',
  template: 'home',
  fastRender: true,
  waitOn: function() {
    // waitOn makes sure that this publication is ready before rendering your template
    return Meteor.subscribe("messages");
  },
  data: function() {
    setMessage();
    return {
      message: Session.get("message"),
      count: Session.get("count")
    }
  }
});
Router.route('/send', {
  name: 'sendView',
  template: 'sendView',
  fastRender: true,
  waitOn: function(){
    // waitOn makes sure that this publication is ready before rendering your template
    return Meteor.subscribe("messages");
  },
  data: function() {
    setMessage();
    setNextDisplayDate();
    return {
      message: Session.get("message"),
      count: Session.get("count")
    }
  }
});
