var app = app || {};

(function () {
  'use strict';
  app.BWClient = {}
  _.extend(app.BWClient, Backbone.Events);
  _.extend(app.BWClient, {
    pullingTimer: null,
    pullingPeriod: 10000,
    sizeWhenBottomLoading: 50,
    failCount: 0,
    fwPostLock: false,
    logGetLock: false,
    mtGetLock: false,

    ajaxBasicOptions: {
      url:           'api/new',
      type:          'post',
      dataType:      'json',
      beforeSubmit: function (formData, jqForm, options) {
        var self = app.BWClient;
        $('#commit').button('loading');
        clearTimeout(self.pullingTimer);
        
        if ( self.fwPostLock || app.FirewoodsView.isFormEmpty() ) {
          return false;
        }

        self.fwPostLock = true;
      },
      success: function () {
        var self = app.BWClient;
        self.trigger('ajaxSuccess');
        self.fwPostLock = false;
        self.pulling(true);
      }
    },

    pageType: 1,
    load: function () {
      $('#loading').html('로드 중입니다.');
      $('#timeline').html('');

      clearTimeout(this.pullingTimer);
      $.get('/api/now?type=' + this.pageType, function (json) {
        var fws = _.map(json.fws, function (fw) { return new app.Firewood(fw); });
        app.firewoods.reset(fws);
        var users = _.map(json.users, function (user) { return new app.User(user); });
        app.users.reset(users);
        
        app.BWClient.pullingTimer = setTimeout(app.BWClient.pulling, app.BWClient.pullingPeriod);
      });
    },

    pulling: function (isLive) {
      clearTimeout(app.BWClient.pullingTimer);

      var recentId = app.firewoods.first().get('id');
      $.get('/api/pulling.json?after=' + recentId + '&type=' + app.BWClient.pageType, function (json) {
        var state = ( window.localStorage['live_stream'] == '1' ) ? 0 : -1;
        if ( isLive ) {
          state = 0;
        }

        if (json.fws) {
          var fws = _.map(json.fws, function (fw) { fw['state'] = -1; return new app.Firewood(fw); });
          
          app.firewoods.prepend(fws, state);
        }

        if (json.users) {
          var users = _.map(json.users, function (user) { return new app.User(user); });
          app.users.reset(users);
        }
        app.BWClient.pullingTimer = setTimeout(app.BWClient.pulling, app.BWClient.pullingPeriod);
      });
    },

    ajaxMtLoad: function ($self, prev_mt, img_tag) {
      // app.BWClient.mtGetLock = $self.attr('data-id') # 락걸기.
      // $.get('/api/get_mt.json?prev_mt=' + prev_mt + '&now=' + app.BWClient.mtGetLock, function (json) {
      //   str = '';
      //   if ( json.fws.length != 0 ) {
      //     mts = json.fws;

      //   build mention

      //   $self = $("div[data-id=#{app.BWClient.mtGetLock}]");
      //   // UITimeline.insertFWExpandResult($self, str + img_tag);
      //   app.BWClient.mtGetLock = 0;
      // });
    },

    getLogs: function () {
      var firewoods = app.firewoods;
      var self = app.BWClient;
      if ( self.logGetLock || firewoods.length < 50 || firewoods.last().get('id') < 10 ) {
        return false;
      }

      var $fws = $('.firewood');
      if ( !$fws.eq(-5).isOnScreen() ) {
        return false;
      }
      self.logGetLock = true;
      $('#div-loading').show();

      $.get('/api/trace.json?before=' + firewoods.last().get('id') + '&count=' + self.sizeWhenBottomLoading + '&type=' + self.pageType, function (json) {
        if ( json.fws.length != 0 ) {
          var fws = _.map(json.fws, function (fw) { fw['state'] = 1; return new app.Firewood(fw); });
          firewoods.append(fws);

          // timelineSize = $('.firewood').size() - 1;

          // $bottom.parent().after(TagBuilder.fwList(json.fws));
          // 이미지 자동 열기 옵션이 활성화 중이면, 새로 받아온 글에 한해서 트리거를 작동시킴
          // if window.getStorageValue('auto_image_open') is window.TRUE
          //   $list = $(".firewood:gt(#{timelineSize})").filter('.mt-to[img-link!=0]')
          //   UITimeline.expandImgs($list)
        }

        $("#div-loading").hide();
        self.logGetLock = false;
      });
    },

    ajaxError: function () {
      this.failCount += 1;

      if ( this.failCount < 3 ) {
        clearTimeout(this.pullingTimer);
        this.pullingTimer = setTimeout(this.pulling, this.pullingPeriod);
        return true;
      }

      var $panel = $(".panel-info");
      $panel.removeClass("panel-info")
            .addClass("panel-danger");
      $("#info").css("background-color","#f2dede");
      $('#new_firewood').find("fieldset").attr("disabled","a");
      $('#timeline_stack')
        .css("background-color","#b94a48")
        .html("서버와의 접속이 끊어졌습니다. 새로고침 해주세요.")
        .slideDown();
      $('#title').html("새로고침 해주세요.");
    }
  });

  $(document).ajaxError(app.BWClient.ajaxError);
})();