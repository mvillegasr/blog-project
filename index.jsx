var ShowUsers = React.createClass({
  getInitialState: function() {
    return {
      users: [],
      blog: '',
      clickeduser: '',
    };
  },
  componentDidMount: function() {
    ajax('viewblog.php', null, function(response) {
      if(response.result === 'error') {
        alert('Error: ' + response.msg);
      } else {
        for (var i = 0; i < response.size; i++) {
          this.setState(prev => ({ users: [...prev.users, response[i]]}));
        }
      }
    }.bind(this));
  },
  onUserClick: function(e) {
    this.setState({clickeduser: e.currentTarget.id});
    if(this.state.clickeduser = e.currentTarget.id) {
      ajax('displayblog.php', { clickeduser: this.state.clickeduser }, function(response) {
        if(response.result === 'error') {
          alert('Error: ' + response.msg);
        } else {
          console.log(response.blog);
          this.setState({blog: response.blog});
          }
      }.bind(this));
    }
  },
  render: function() {
    var display = this.state.users.map((showList) => <li onClick={this.onUserClick} id={showList}><a href='javascript: void 0'>{showList}</a></li>);
    var showBlog = <textarea value= {this.state.blog}/>;
    return (
      <div>
        <ul>
          {display} <br/>
          {showBlog}

        </ul>
      </div>
    );
  }
});

var LoginForm = React.createClass({
  getInitialState: function() {
    return {
      username: 'alice',
      password: '1234',
    };
  },
  onUsernameChange: function(e) {
    this.setState({ username: e.target.value});
  },
  onPasswordChange: function(e) {
    this.setState({ password: e.target.value});
  },
  onSubmit: function(e) {
    // send username and password in an ajax request to server.
    ajax('login.php', { username: this.state.username, password: this.state.password }, function(response) {
      if(response.result === 'failure') {
        alert('Bad username or password');
      } else if(response.result === 'success') {
        this.props.onLogin(response.blogText);
      } else if(response.result === 'error') {
        alert('Error: ' + response.msg);
      } else {
        alert('Response message has no result attribute.');
      }
    }.bind(this));
  },
  onSignUp: function(e) {
    ajax('signup.php', {username: this.state.username, password: this.state.password}, function(response) {
      if(response.result === 'failure') {
        alert('Bad username or password');
      } else if(response.result === 'success') {
        this.props.onLogin(response.blogText);
      } else if(response.result === 'error') {
        alert('Error: ' + response.msg);
      } else {
        alert('Response message has no result attribute.');
      }  
    }.bind(this));
  },
  render: function() {
    return (
      <div>
        <label>Username:</label> <input type='text'     onChange={this.onUsernameChange} value={this.state.username} /> <br/>
        <label>Password:</label> <input type='password' onChange={this.onPasswordChange} value={this.state.password} /> <br/><br/>
        <input type='submit'   onClick={this.onSubmit} value='Login' />               <br/>
        <input type='submit'   onClick={this.onSignUp} value='Sign Up' /> <br/><br/>
        <ShowUsers />
      </div>
    );
  }
});

var LogoutButton = React.createClass({
  onLogout: function() {
    ajax('logout.php', null, function(response) {
      if(response.result === 'error') {
        alert('Error: ' + response.msg);
      } else {
        this.props.onLogout();
      }
    }.bind(this));
  },
  render: function() {
    return (
      <div>
        <input type='submit' value='Logout' onClick={this.onLogout} /> <br/>
      </div>
    );
  }
});

var ClickScreen = React.createClass({
  onClick: function() {
    ajax('record_click.php', { blogText: this.state.blogText }, function(response) {
      if(response.result === 'success') {
        this.props.setClicks(response.blogText);
      } else if(response.result === 'error') {
        alert('Error: ' + response.msg);
      } else {
        alert('Response message has no result attribute.');
      }
    }.bind(this));
  },
  onBlogChange: function(e) {
    this.setState({ blogText: e.target.value.substr(0, 140)});
  },
  render: function() {
    return (
      <div>
        <div> Blog text: <textarea name='blogText' onChange={this.onBlogChange} defaultValue={this.props.blogText} /> </div><br/>
        <input type='submit' value='Save' onClick={this.onClick} />
        <LogoutButton onLogout={this.props.onLogout} />
      </div>
    );
  }
});

var LoginScreen = React.createClass({
  render: function() {
    return <LoginForm onLogin={this.props.onLogin} />;
  }
});

var LoadingScreen = React.createClass({
  render: function() {
    return <div>Loading ...</div>;
  }
});

//Main Componenent
var App = React.createClass({
  getInitialState: function() {
    // blogText set to null means the user is not logged in.
    return {
      loading: true,
      blogText: null,
      users: ''
    };
  },
  componentDidMount: function() {
    ajax('init.php', null, function(response) {
      if (response.result === 'error') {
        alert('Error: ' + response.msg);
      } else if (response.result === 'loggedIn') {
        this.setState({ blogText: response.blogText, loading: false});
      } else if (response.result === 'notLoggedIn') {
        this.setState({ blogText: null, loading: false});
      } else {
        alert('Response message has no result attribute.');
      }
    }.bind(this));
  },
  onLogin: function(blogText) {
    this.setState({ blogText: blogText });
  },
  onLogout: function(blogText) {
    this.setState({ blogText: null });
  },
  setClick: function(blogText) {
    this.setState({ blogText: blogText });
  },
  render: function() {
    if (this.state.loading) {
      return <LoadingScreen />;
    } else if (this.state.blogText === null) {
      return (
        <LoginScreen onLogin={this.onLogin} />
      );
    } else {
      return (
          <ClickScreen 
              onLogout={this.onLogout} 
              blogText={this.state.blogText} 
          />
      );
    }
  }
});

ReactDOM.render(<App />, document.getElementById('content'));