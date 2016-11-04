window.ENTER_KEY = 13
window.ESC_KEY = 27
window.FW_STATE = {IN_STACK: -1, IN_TL: 0, IN_LOG: 1}
window.PAGE_TYPE = 1
window.app = {
  defaultIsOpened: false,

  foldImageAll: () => {
    app.defaultIsOpened = false
    window._render()
  },

  unfoldImageAll: () => {
    app.defaultIsOpened = true
    window._render()
  },

  disableApp: () => {
    const $title = $("#title")
    const $panel = $(".panel-info")

    $panel.removeClass("panel-info")
          .addClass("panel-danger")
    $("#info, #div-form").css("background-color","#f2dede")
    $("#new_firewood").find("fieldset").attr("disabled","a")
    $("#commit").removeClass("btn-primary").addClass("btn-danger")
    $("#timeline_stack")
      .css("background-color","#f5c5c5")
      .html("서버와의 접속이 끊어졌습니다. 새로고침 해주세요.")
      .slideDown()
    $title.html("새로고침 해주세요.")
  },

  render: () => {
    ReactDOM.render(
      React.createElement(Firewoods, {
        firewoods: app.firewoods.models,
        defaultIsOpened: app.defaultIsOpened
      }),
      document.getElementById("firewoods-react")
    )
    ReactDOM.render(
      React.createElement(FirewoodForm, {originTitle: app.originTitle}),
      document.getElementById("new_firewood")
    )
    ReactDOM.render(
      React.createElement(Users, {users: app.users.toJSON()}),
      document.getElementById("users-wrapper")
    )
    ReactDOM.render(
      React.createElement(MobileUsers, {users: app.users.toJSON()}),
      document.getElementById("users-mobile")
    )
  }
}

$(() => {
  "use strict"

  if (document.getElementById("firewoods") !== null) {
    app.channel = new app.Channel(app.firewoods, app.users)
    new app.AppView({}, { timeline_state: PAGE_TYPE })
    Backbone.history.start()

    $(".all_nav").click(e => {
      const page = window.PAGE_TYPE
      const clicked = (() => {
        if ($(".now_nav").parent().hasClass("active")) return 1
        else if ($(".mt_nav").parent().hasClass("active")) return 2
        else return 3
      })()
      
      if (page === clicked) {
        $(document).scrollTop(0)
        e.stopPropagation()
      }
      return false
    })
  }
})
