import React, { useEffect, useState } from 'react';
    import { fetchTasks, deleteTask } from '../api';
    import TaskForm from './TaskForm';
    function TaskList() {
      const token = localStorage.getItem('token');
      const [tasks, setTasks] = useState([]);
      useEffect(() => { fetchTasks(token).then(setTasks); }, [tasks]);
      return (
        <div>
          <h3>Tasks</h3>
          <TaskForm />
          <ul className="list-group">
            {tasks.map(t => (
              <li key={t.id} className="list-group-item d-flex justify-content-between">
                <span>{t.title}</span>
                <button className="btn btn-danger btn-sm" onClick={() => deleteTask(t.id, token)}>Delete</button>
              </li>
            ))}
          </ul>
        </div>
      );
    }
    export default TaskList;