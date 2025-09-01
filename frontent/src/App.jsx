

import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/tasks';

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editId, setEditId] = useState(null);
  const [editStatus, setEditStatus] = useState("");

  // Fetch tasks
  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL);
      setTasks(res.data);
      setError("");
    } catch (err) {
      setError("Failed to fetch tasks");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Add task
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      await axios.post(API_URL, { title });
      setTitle("");
      fetchTasks();
    } catch (err) {
      setError("Failed to add task");
    }
  };

  // Delete task
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this task?")) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchTasks();
    } catch (err) {
      setError("Failed to delete task");
    }
  };

  // Start editing
  const startEdit = (task) => {
    setEditId(task._id);
    setEditStatus(task.status);
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditId(null);
    setEditStatus("");
  };

  // Update task
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_URL}/${editId}`, { status: editStatus });
      cancelEdit();
      fetchTasks();
    } catch (err) {
      setError("Failed to update status");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white py-8 px-2">
      <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-xl p-6">
        <h1 className="text-4xl font-extrabold text-center text-indigo-700 mb-2 tracking-tight">TaskFlow Manager</h1>
        <p className="text-center text-gray-500 mb-6">Manage your tasks efficiently.</p>

        {/* Add Task */}
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 mb-8">
          <input
            type="text"
            placeholder="Add a new task..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
          />
          <button type="submit" className="px-6 py-2 bg-indigo-500 text-white font-semibold rounded-md hover:bg-indigo-600 transition">Add</button>
        </form>

        {error && <div className="text-red-500 text-center mb-4">{error}</div>}

        {/* Task List */}
        <ul className="space-y-3">
          {tasks.map(task => (
            <li
              key={task._id}
              className="flex items-center justify-between bg-gray-50 hover:bg-gray-100 rounded-xl px-4 py-3 shadow-sm transition"
            >
              <div className="flex items-center gap-3">
                <span className={`text-lg ${task.status === 'completed' ? 'line-through text-gray-400' : 'text-gray-700'}`}>{task.title}</span>
              </div>
              <div className="flex items-center gap-2">
                {editId === task._id ? (
                  <form onSubmit={handleUpdate} className="flex items-center gap-2">
                    <select
                      className="border rounded-lg px-3 py-1 focus:ring-2 focus:ring-indigo-400 transition"
                      value={editStatus}
                      onChange={e => setEditStatus(e.target.value)}
                      required
                    >
                      <option value="pending">Pending</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                    <button type="submit" className="text-green-600 hover:text-green-800 transition font-semibold">Save</button>
                    <button type="button" onClick={cancelEdit} className="text-gray-500 hover:text-gray-700 transition font-semibold">Cancel</button>
                  </form>
                ) : (
                  <>
                    <span className={
                      task.status === 'completed' ? 'bg-green-100 text-green-700 px-2 py-1 rounded text-xs' :
                      task.status === 'in-progress' ? 'bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs' :
                      'bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs'
                    }>
                      {task.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                    <button onClick={() => startEdit(task)} className="text-blue-600 hover:text-blue-800 transition font-semibold">Edit</button>
                    <button onClick={() => handleDelete(task._id)} className="text-red-600 hover:text-red-800 transition font-semibold">Delete</button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
      <footer className="text-center text-xs text-gray-400 mt-8">&copy; {new Date().getFullYear()} TaskFlow Manager</footer>
    </div>
  );
}

export default App;
