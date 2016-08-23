Shortly.loginView = Backbone.View.extend({
  className: 'creator',

  template: Templates['login'],

  events: {
    'submit': null // TODO: authenticate user
  },

  render: function() {
    this.$el.html( this.template() );
    return this;
  },

  authenticateUser: function(e) {
    e && e.preventDefault();
    var $username = this.$el.find('#username');
    var $password = this.$el.find('#password');
    var user = new Shortly.User({ username: $username.val(), password: $password.val(), sessionState: 'login' });
    user.save({});
    $username.val('');
    $password.val('');
  }

  // shortenUrl: function(e) {
  //   e.preventDefault();
  //   var $form = this.$el.find('form .text');
  //   var link = new Shortly.Link({ url: $form.val() });
  //   link.on('request', this.startSpinner, this);
  //   link.on('sync', this.success, this);
  //   link.on('error', this.failure, this);
  //   link.save({});
  //   $form.val('');
  // },

  // success: function(link) {
  //   this.stopSpinner();
  //   var view = new Shortly.LinkView({ model: link });
  //   this.$el.find('.message').append(view.render().$el.hide().fadeIn());
  // },

  // failure: function(model, res) {
  //   this.stopSpinner();
  //   this.$el.find('.message')
  //     .html('Please enter a valid URL')
  //     .addClass('error');
  //   return this;
  // },

  // startSpinner: function() {
  //   this.$el.find('img').show();
  //   this.$el.find('form input[type=submit]').attr('disabled', 'true');
  //   this.$el.find('.message')
  //     .html('')
  //     .removeClass('error');
  // },

  // stopSpinner: function() {
  //   this.$el.find('img').fadeOut('fast');
  //   this.$el.find('form input[type=submit]').attr('disabled', null);
  //   this.$el.find('.message')
  //     .html('')
  //     .removeClass('error');
  // }
});