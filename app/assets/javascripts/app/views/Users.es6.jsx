class Users extends React.Component {
  constructor(props) {
    super(props)
  }

  renderTitle() {
    return `접속자(${this.props.users.length}명)`
  }

  renderUsers() {
    return this.props.users.map(user => {
      return (
        <li key={user.name} className="list-group-item div-username">
          <User name={user.name} clkUsernameFactory={this.clkUsernameFactory}/>
        </li>
      )
    })
  }

  render() {
    const title = this.renderTitle()
    const userNodes = this.renderUsers()
    return (
      <div className="panel panel-info">
        <div className="panel-heading" id="users-header">{title}</div>
        <ul className="list-group" id="users-body">
          {userNodes}
        </ul>
      </div>
    )
  }

  clkUsernameFactory(name) {
    return () => {
      const arr = [`@${name}`]
      window._appendMt(arr)
    }
  }
}
