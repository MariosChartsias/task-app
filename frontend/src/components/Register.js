import React, { useState } from 'react';
    import { register } from '../api';
    function Register({ history }) {
      const [user, setUser] = useState({ username: '', password: '' });
      const handle = async e => {
        e.preventDefault();
        await register(user);
        history.push('/login');
      };
      return (
        <form onSubmit={handle}>
          <h3>Register</h3>
          <input className="form-control" placeholder="Username" onChange={e => setUser({ ...user, username: e.target.value })} />
          <input type="password" className="form-control mt-2" placeholder="Password" onChange={e => setUser({ ...user, password: e.target.value })} />
          <button className="btn btn-secondary mt-2">Register</button>
        </form>
      );
    }
    export default Register;