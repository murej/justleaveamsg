Router.configure({
    layoutTemplate: 'layout',
    loadingTemplate: 'loading'
});

Router.route('/', {name: 'home', controller: 'MainController'});
Router.route('/send', {name: 'sendView', controller: 'SendController'});

MainController = RouteController.extend({
  action: function() {
    setNextDisplayDate();
    this.render('home');
  }
});

SendController = RouteController.extend({
  action: function() {
    setNextDisplayDate();
    this.render('sendView');
  }
});
