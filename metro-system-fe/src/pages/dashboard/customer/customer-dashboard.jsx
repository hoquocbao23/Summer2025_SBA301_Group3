import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../config/axios';

const CustomerDashboard = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editUser, setEditUser] = useState({ email: '', fullname: '', role: '', status: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axiosInstance.get('/user');
        setUsers(response.data.data || []);
      } catch (error) {
        setMessage('Failed to fetch users: ' + (error.response?.data?.message || error.message));
        setUsers([]);
      }
    };
    fetchUsers();
  }, []);

  const handleViewUser = async (id) => {
    try {
      const response = await axiosInstance.get(`/user/${id}`);
      setSelectedUser(response.data.data);
      setEditUser(response.data.data || { email: '', fullname: '', role: '', status: '' });
    } catch (error) {
      setMessage('Failed to fetch user details: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleUpdateUser = async (id) => {
    try {
      const response = await axiosInstance.put(`/user/${id}`, editUser);
      setMessage('User updated successfully');
      setUsers(users.map(user => user.id === id ? response.data.data : user));
      setSelectedUser(null);
    } catch (error) {
      setMessage('Failed to update user: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="p-6 bg-gradient-to-br from-gray-100 to-white min-h-screen">
      <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
        Admin Dashboard - User Management
      </h1>
      {message && (
        <div className="mb-6 p-4 text-center text-white bg-red-500 rounded-lg shadow-lg">
          {message}
        </div>
      )}

      <h2 className="text-2xl font-semibold text-gray-800 mb-6">User List</h2>
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {users && users.length > 0 ? (
          users.map(user => (
            <li key={user.id} className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="text-lg font-medium text-gray-700">{user.fullname}</div>
              <div className="text-sm text-gray-500">Email: {user.email}</div>
              <div className="text-sm text-gray-500">Role: {user.role}, Status: {user.status}</div>
              <button
                onClick={() => handleViewUser(user.id)}
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                View/Edit
              </button>
            </li>
          ))
        ) : (
          <li className="p-4 text-gray-500">No users found</li>
        )}
      </ul>

      {selectedUser && (
        <div className="bg-white p-6 rounded-lg shadow-xl max-w-2xl mx-auto">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Edit User</h2>
          <div className="space-y-6">
            <input
              type="text"
              value={editUser.email || ''}
              onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
              placeholder="Email"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              type="text"
              value={editUser.fullname || ''}
              onChange={(e) => setEditUser({ ...editUser, fullname: e.target.value })}
              placeholder="Full Name"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <select
              value={editUser.role || ''}
              onChange={(e) => setEditUser({ ...editUser, role: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="ADMIN">ADMIN</option>
              <option value="CUSTOMER">CUSTOMER</option>
            </select>
            <select
              value={editUser.status || ''}
              onChange={(e) => setEditUser({ ...editUser, status: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
              <option value="BANNED">BANNED</option>
            </select>
            <div className="flex justify-between">
              <button
                onClick={() => handleUpdateUser(selectedUser.id)}
                className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                Save Changes
              </button>
              <button
                onClick={() => setSelectedUser(null)}
                className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerDashboard;