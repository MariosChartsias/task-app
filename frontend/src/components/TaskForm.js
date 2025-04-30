import React, { useState } from 'react';
    import { createTask } from '../api';
    function TaskForm() {
      const token = localStorage.getItem('token');
      const [task, setTask] = useState({ title: '', description: '' });
      const handle = async e => { e.preventDefault(); await createTask(task, token); };
      return (
        <form onSubmit={handle} className="mb-3">
          <input className="form-control" placeholder="Title" onChange={e => setTask({ ...task, title: e.target.value })} />
          <input className="form-control mt-2" placeholder="Description" onChange={e => setTask({ ...task, description: e.target.value })} />
          <button className="btn btn-success mt-2">Add Task</button>
        </form>
      );
    }
    export default TaskForm;