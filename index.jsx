/* global React */
/* global ReactDOM */
/* global ajax */

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

var LoginForm = React.createClass({
  getInitialState: function() {
    return {
      username: 'alice',
      password: '1234'
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
  render: function() {
    return (
      <div>
        Username: <input type='text'     onChange={this.onUsernameChange} value={this.state.username} /> <br/>
        Password: <input type='password' onChange={this.onPasswordChange} value={this.state.password} /> <br/>
                  <input type='submit'   onClick={this.onSubmit}          value='Login' />               <br/>
        <a href="viewblog.php?u=alice">Alice</a><br/>
        <a href="viewblog.php?u=fred">Fred</a><br/>
        <a href="viewblog.php?u=bob">Bob</a>
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

var App = React.createClass({
  getInitialState: function() {
    // blogText set to null means the user is not logged in.
    return {
      loading: true,
      blogText: null
    };
  },
  componentDidMount: function() {
    ajax('init.php', null, function(response) {
      if (response.result === 'error') {
        alert('Error: ' + response.msg);
      } else if (response.result === 'loggedIn') {
        this.setState({ blogText: response.blogText, loading: false });
      } else if (response.result === 'notLoggedIn') {
        this.setState({ blogText: null, loading: false });
      } else {
        alert('Response message has no result attribute.');
      }
    }.bind(this));
  },
  onLogin: function(blogText) {
    this.setState({ blogText: blogText });
  },
  onLogout: function() {
    this.setState({ blogText: null });
  },
  setClick: function(blogText) {
    this.setState({ blogText: blogText });
  },
  render: function() {
    if (this.state.loading) {
      return <LoadingScreen />;
    } else if (this.state.blogText === null) {
      return <LoginScreen onLogin={this.onLogin} />;
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