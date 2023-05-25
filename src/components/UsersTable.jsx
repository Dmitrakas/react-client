import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaUnlockAlt, FaTrash } from 'react-icons/fa';
import { Navigate } from 'react-router-dom';

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [lastLoginDates, setLastLoginDates] = useState({});
  const [registrationDates, setRegistrationDates] = useState({});
  const [isLogged, setIsLogged] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('jwt');

      const response = await axios.get('https://dmitrakas-express-server.onrender.com/api/users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUsers(response.data);
      const loginDates = {};
      const registrationDates = {};
      response.data.forEach((user) => {
        const lastLoginDate = user.lastLoginDate ? new Date(user.lastLoginDate) : null;
        const registrationDate = user.registrationDate ? new Date(user.registrationDate) : null;
        const formattedLastLoginDate = lastLoginDate ? `${lastLoginDate.getDate()}.${lastLoginDate.getMonth() + 1}.${lastLoginDate.getFullYear()} ${lastLoginDate.getHours()}:${lastLoginDate.getMinutes()}:${lastLoginDate.getSeconds()}` : '';
        const formattedRegistrationDate = registrationDate ? `${registrationDate.getDate()}.${registrationDate.getMonth() + 1}.${registrationDate.getFullYear()} ${registrationDate.getHours()}:${registrationDate.getMinutes()}:${registrationDate.getSeconds()}` : '';
        loginDates[user._id] = formattedLastLoginDate;
        registrationDates[user._id] = formattedRegistrationDate;
      });
      setLastLoginDates(loginDates);
      setRegistrationDates(registrationDates);

      const currentUserEmail = localStorage.getItem('currentUser');
      const currentUser = response.data.find((user) => user.email === currentUserEmail);
      if (currentUser && currentUser.status !== 'active') {
        window.location.href = '/';
      }
    } catch (error) {
      console.error('Ошибка при получении пользователей:', error);
    }
  };

  const handleLogOut = async () => {
    try {
      const token = localStorage.getItem('jwt');
      const email = localStorage.getItem('currentUser');

      await axios.put(
        `https://dmitrakas-express-server.onrender.com/api/users/currentUser/${email}/status`,
        {
          status: 'normal',
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      localStorage.removeItem('jwt');
      localStorage.removeItem('currentUser');
      window.location.href = '/';
    } catch (error) {
      console.error('Ошибка при разлогине пользователя:', error);
    }
  };

  const handleCheckboxChange = (event, user) => {
    const { checked } = event.target;
    if (checked) {
      setSelectedUsers([...selectedUsers, user]);
    } else {
      setSelectedUsers(selectedUsers.filter((selectedUser) => selectedUser._id !== user._id));
    }
  };

  const handleSelectAll = (event) => {
    const { checked } = event.target;
    setSelectAll(checked);
    if (checked) {
      setSelectedUsers([...users]);
    } else {
      setSelectedUsers([]);
    }
  };

  const handleBlockUsers = async () => {
    try {
      const token = localStorage.getItem('jwt');
      const userIds = selectedUsers.map((user) => user._id);
      const currentUserEmail = localStorage.getItem('currentUser');
      if (selectedUsers.some((user) => user.email === currentUserEmail)) {
        setIsLogged(true);
      }

      await axios.put(
        'https://dmitrakas-express-server.onrender.com/api/users/block',
        { userIds },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchUsers();
      setSelectedUsers([]);
      setSelectAll(false);
    } catch (error) {
      console.error('Ошибка при блокировке пользователей:', error);
    }
  };

  const handleUnblockUsers = async () => {
    try {
      const token = localStorage.getItem('jwt');
      const blockedUsers = selectedUsers.filter((user) => user.status === 'blocked');
      const userIds = blockedUsers.map((user) => user._id);
      await axios.put(
        'https://dmitrakas-express-server.onrender.com/api/users/unblock',
        { userIds },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchUsers();
      setSelectedUsers([]);
      setSelectAll(false);
    } catch (error) {
      console.error('Ошибка при разблокировке пользователей:', error);
    }
  };

  const handleDeleteUsers = async () => {
    try {
      const token = localStorage.getItem('jwt');
      const userIds = selectedUsers.map((user) => user._id);
      const currentUserEmail = localStorage.getItem('currentUser');
      if (selectedUsers.some((user) => user.email === currentUserEmail)) {
        setIsLogged(true);
      }

      await axios.delete('https://dmitrakas-express-server.onrender.com/api/users', {
        data: { userIds },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchUsers();
      setSelectedUsers([]);
      setSelectAll(false);
    } catch (error) {
      console.error('Ошибка при удалении пользователей:', error);
    }
  };

  if (isLogged) {
    return <Navigate to="/" />;
  }

  return (
    <div className="container d-flex justify-content-center">
      <div className="text-center">
        <h2 className="mt-4 mb-3">Users Table</h2>
        <div className="toolbar mb-3">
          <button className="btn btn-primary mr-2" onClick={handleBlockUsers} disabled={selectedUsers.length === 0}>
            Block
          </button>
          <button className="btn btn-primary mr-2" onClick={handleUnblockUsers} disabled={selectedUsers.length === 0}>
            <FaUnlockAlt /> Unblock
          </button>
          <button className="btn btn-danger" onClick={handleDeleteUsers} disabled={selectedUsers.length === 0}>
            <FaTrash /> Delete
          </button>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th className="text-center">
                <label className="d-flex flex-column align-items-center">
                  Выделить все / снять выделение
                </label>
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={handleSelectAll}
                  className="mb-1"
                />
              </th>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Registration Date</th>
              <th>Last Login Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedUsers.some((selectedUser) => selectedUser._id === user._id)}
                    onChange={(event) => handleCheckboxChange(event, user)}
                  />
                </td>
                <td>{user._id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{registrationDates[user._id]}</td>
                <td>{lastLoginDates[user._id]}</td>
                <td>{user.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <button className="btn btn-primary" onClick={handleLogOut}>
          Log Out
        </button>
      </div>
    </div>
  );
};

export default UserTable;
