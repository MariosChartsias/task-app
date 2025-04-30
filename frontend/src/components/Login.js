import React, { useState } from 'react';
    import { login } from '../api';
    function Login({ history }) {
      const [user, setUser] = useState({ username: '', password: '' });
      const handle = async e => {
        e.preventDefault();
        const token = await login(user);
        localStorage.setItem('token', token);
        history.push('/');
      };
      return (
        <form onSubmit={handle}>
          <h3>Login</h3>
          <input className="form-control" placeholder="Username" onChange={e => setUser({ ...user, username: e.target.value })} />
          <input type="password" className="form-control mt-2" placeholder="Password" onChange={e => setUser({ ...user, password: e.target.value })} />
          <button className="btn btn-primary mt-2">Submit</button>
        </form>
      );
    }
    export default Login;