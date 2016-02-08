var app = app || {};

(function () {
  'use strict';

  var BWRouter = Backbone.Router.extend({
    routes: {
      'now': 'typeNow',
      'mt': 'typeMt',
      'me': 'typeMe'
    },

    typeNow: function () {
      window.PAGE_TYPE = 1;
      this._toggleNavbarMenu('.now_nav');
      app.channel.load();
    },

    typeMt: function () {
      window.PAGE_TYPE = 2;
      this._toggleNavbarMenu('.mt_nav');
      app.channel.load();
    },

    typeMe: function () {
      window.PAGE_TYPE = 3;
      this._toggleNavbarMenu('.me_nav');
      app.channel.load();
    },

    _toggleNavbarMenu: function (toggleSelector) {
      $('.all_nav').parent().removeClass('active');
      $(toggleSelector).parent().addClass('active');
    }
  });

  app.BWRouter = new BWRouter();
})();
