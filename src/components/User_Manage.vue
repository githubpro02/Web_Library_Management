<template>
    <div id="app" class="user-management">
      <h1>User Management</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id">
            <td>{{ user.id }}</td>
            <td>{{ user.firstName }}</td>
            <td>{{ user.lastName }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.role }}</td>
            <td>
              <button @click="selectUser(user)" class="action-btn edit">Edit</button>
              <button @click="deleteUser(user.id)" class="action-btn delete">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
  
      <div v-if="selectedUser" class="edit-form">
        <h2>Edit User</h2>
        <form @submit.prevent="updateUser">
          <label>
            First Name:
            <input v-model="selectedUser.firstName" required class="form-control" />
          </label>
          <label>
            Last Name:
            <input v-model="selectedUser.lastName" required class="form-control" />
          </label>
          <label>
            Email:
            <input v-model="selectedUser.email" type="email" required class="form-control" />
          </label>
          <label>
            Role:
            <input v-model="selectedUser.role" type="text" required class="form-control" />
          </label>
          <div>
            <button type="submit" class="btn btn-primary">Save</button>
            <button @click="cancelEdit" class="btn btn-secondary">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  import User from '../models/user';
  
  export default {
    name: 'App',
    data() {
      return {
        users: [],
        selectedUser: null,
      };
    },
    mounted() {
      this.authenticateAdmin();
    },
    methods: {
      authenticateAdmin() {
        const token = localStorage.getItem('accessToken');
  
        if (!token) {
          console.error('Authentication failed: Token not found');
          return;
        }
  
        this.fetchUsers(token);
      },
      fetchUsers(token) {
        fetch('https://book-management-3td9.onrender.com/api/user', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.json();
          })
          .then((data) => {
            this.users = data.data.docs.map(
              (userData) =>
                new User(
                  userData._id,
                  userData.firstName,
                  userData.lastName,
                  userData.email,
                  userData.password,
                  '',
                  '',
                  '',
                  userData.role
                )
            );
          })
          .catch((error) => {
            console.error('Error fetching users:', error);
          });
      },
      selectUser(user) {
        this.selectedUser = { ...user };
      },
      updateUser() {
        const token = localStorage.getItem('accessToken');
  
        if (!this.selectedUser || !this.selectedUser.id) {
          console.error('No user selected or user ID missing');
          return;
        }
  
        const updatedUser = {
          firstName: this.selectedUser.firstName,
          lastName: this.selectedUser.lastName,
          email: this.selectedUser.email,
          role: this.selectedUser.role,
        };
  
        fetch(`https://book-management-3td9.onrender.com/api/user/${this.selectedUser.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(updatedUser),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.json();
          })
          .then((data) => {
            if (data.message === 'Update user' && data.data.matchedCount === 1 && data.data.modifiedCount === 1) {
              const userIndex = this.users.findIndex(u => u.id === this.selectedUser.id);
              if (userIndex !== -1) {
                this.$set(this.users, userIndex, { ...this.selectedUser });
              }
              this.selectedUser = null;
            } else {
              console.error('Update operation did not modify any user.');
            }
          })
          .catch((error) => {
            console.error('Error updating user:', error);
          });
      },
      deleteUser(userId) {
        const token = localStorage.getItem('accessToken');
  
        fetch(`https://book-management-3td9.onrender.com/api/user/${userId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            this.users = this.users.filter(user => user.id !== userId);
          })
          .catch((error) => {
            console.error('Error deleting user:', error);
          });
      },
      cancelEdit() {
        this.selectedUser = null;
      },
    },
  };
  </script>
  
  <style scoped>
  .user-management {
    margin-left: 270px;
    padding: 20px;
  }
  
  h1 {
    margin-bottom: 20px;
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 20px;
    background-color: #fff;
    border: 1px solid #ddd;
  }
  
  th, td {
    border: 1px solid #ddd;
    padding: 12px;
    text-align: left;
  }
  
  th {
    background-color: #f2f2f2;
  }
  
  .action-btn {
    padding: 8px 12px;
    margin-right: 10px;
    border: none;
    cursor: pointer;
    border-radius: 4px;
  }
  
  .edit {
    background-color: #f39c12;
    color: white;
  }
  
  .edit:hover {
    background-color: #e67e22;
  }
  
  .delete {
    background-color: #e74c3c;
    color: white;
  }
  
  .delete:hover {
    background-color: #c0392b;
  }
  
  .edit-form {
    margin-top: 20px;
  }
  
  .edit-form label {
    display: block;
    margin-bottom: 10px;
    font-weight: bold;
  }
  
  .edit-form input {
    padding: 10px;
    font-size: 16px;
    width: 100%;
    margin-bottom: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  
  .edit-form button {
    padding: 10px 20px;
    margin-right: 10px;
    cursor: pointer;
    border: none;
    border-radius: 4px;
  }
  
  .btn-primary {
    background-color: #3498db;
    color: white;
  }
  
  .btn-primary:hover {
    background-color: #2980b9;
  }
  
  .btn-secondary {
    background-color: #95a5a6;
    color: white;
  }
  
  .btn-secondary:hover {
    background-color: #7f8c8d;
  }
  </style>