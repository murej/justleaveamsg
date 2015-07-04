Router.configure({
    layoutTemplate: 'layout',
    loadingTemplate: 'loading',
    trackPageView: true
});

Router.route('/', {
  name: 'home',
  template: 'home',
  fastRender: true,
  waitOn: function() {
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

// INSTALL monbro:iron-router-breadcrumb

// Router.route('/messages/:year/:month/:day', {
//   name: 'date',
//   template: 'home',
//   fastRender: true,
//   waitOn: function() {
//     return Meteor.subscribe("messages");
//   },
//   data: function() {
//
//     var queryDate = moment(this.params.year + "-" + this.params.month + "-" + this.params.day, "YYYY-MM-DD")
//     var isValid = queryDate.isValid();
//
//     if(isValid) {
//       setMessage(queryDate.utc()); <-- this doesnt work yet
//       return {
//         message: Session.get("message"),
//         count: Session.get("count")
//       }
//     }
//   }
// });

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
