import React, { useState } from 'react';
import { useHistory } from 'react-router-dom'

const Signup = (props) => {

  const [credentials, setCredentials] = useState({ name: "", email: "", password: "" });

  let history = useHistory() //Use history hook (to re-direct user to home page after successful login)

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password } = credentials;
    const response = await fetch("http://localhost:5000/api/auth/createuser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name, email, password }),
    });
    const json = await response.json();
    console.log(json)

    if (json.success) {
      // Save the auth-token and redirect
      localStorage.setItem('token', json.authtoken);

      history.push("/");  // (usehistory hook)

      props.showAlert("Account Created Successfully","success");
    }
    else {
      props.showAlert("Invalid credentials","danger");
    }

  }

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value })
  }

  return (
    <div className='container mt-3'>
      <h2>Create an account to use iNotebook</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input type="text" className="form-control" id="name" name="name" onChange={onChange} aria-describedby="emailHelp" placeholder="Enter name" />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email address</label>
          <input type="email" className="form-control" id="email" name="email" onChange={onChange} aria-describedby="emailHelp" placeholder="Enter email" />
          <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input type="password" className="form-control" id="password" name="password" onChange={onChange} placeholder="Password" minLength={5} required />
        </div>
        <div className="form-group">
          <label htmlFor="cpassword">Confirm Password</label>
          <input type="password" className="form-control" id="cpassword" name="cpassword" onChange={onChange} placeholder="Confirm Password" minLength={5} required />
        </div>
        <button type="submit" className="btn btn-primary my-3">Submit</button>
      </form>
    </div>
  )
}

export default Signup