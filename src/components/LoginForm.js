import React from "react";
import {connect} from 'react-redux';
import {addUser} from '../actions/users'

class LoginForm extends React.Component {
  
  state = {
    username: '',
    password: '',
    error: false
  }
  
  handleChange = (event) => {
    const {value, name} = event.target;
    this.setState({
      [name]: value
    })
  }
  
  handleSubmit = event => {
    event.preventDefault();
    fetch(`http://localhost:3000/api/v1/users`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: this.state.username,
        password: this.state.password,
      })
    })
      .then(res => res.json())
      .then(json => {
        json.status === 500 ? this.setState({error: true}) : this.props.addUser(json)
      });
  };
  
  render() {
    return (
      <div className="loginform">
        <p>Login or Sign Up to Start!</p>
        {this.state.error ? <h3 className='error'>Username or Password Incorrect</h3> : null}
        <form onSubmit={this.handleSubmit}>
          <input 
            type="text" 
            name="username" 
            id="username" 
            placeholder="username" 
            onChange={this.handleChange} value={this.state.username} />
          <input 
            type="password" 
            id="password"
            placeholder="password" 
            name="password" onChange={this.handleChange} value={this.state.password} />
          <input id="submit" type="submit" value="Login" />
        </form>
      </div>
    );
  } 
};

export default connect(null, {addUser}) (LoginForm);
