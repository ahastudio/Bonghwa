var app = app || {};

// to avoid conflict with that of erb
_.templateSettings = {
  evaluate    : /\{\{([\s\S]+?)\}\}/g,
  interpolate : /\{\{=([\s\S]+?)\}\}/g,
  escape      : /\{\{-([\s\S]+?)\}\}/g
};

$(function () {
  'use strict';

  new app.FirewoodsView();
  new app.UsersView();
  app.BWClient.load();
  app.BWClient.pullingTimer = setTimeout(app.BWClient.pulling, app.BWClient.pullingPeriod);
});
