<template>
  <div class="profile">
    <div v-if="!isUpdating">
      <h2>Profile Information</h2>
      <p><strong>ID:</strong> {{ profile._id }}</p>
      <p><strong>First Name:</strong> {{ profile.firstName }}</p>
      <p><strong>Last Name:</strong> {{ profile.lastName }}</p>
      <p><strong>Email:</strong> {{ profile.email }}</p>
      <div class="a">
        <button @click="isUpdating = true">Update Profile</button>
        <router-link to="/homepage" class="back-homepage-button">Back_HomePage</router-link>
      </div>
    </div>

    <div v-else class="profile-update">
      <h2>Update Profile</h2>
      <form @submit.prevent="updateProfile">
        <label for="firstName">First Name:</label>
        <input type="text" id="firstName" v-model="form.firstName" required><br><br>
  
        <label for="lastName">Last Name:</label>
        <input type="text" id="lastName" v-model="form.lastName" required><br><br>
  
        <label for="email">Email:</label>
        <input type="email" id="email" v-model="form.email" required><br><br>
  
        <button type="submit" :disabled="!accessToken">Update</button>
        <button @click="isUpdating = false" type="button">Cancel</button>
      </form>
  
      <div v-if="updateSuccess" class="success-message">
        <p>Profile updated successfully!</p>
      </div>
  
      <div v-if="updateError" class="error-message">
        <p>Failed to update profile. Error: {{ updateError }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      profile: {
        _id: '',
        firstName: '',
        lastName: '',
        email: ''
      },
      form: {
        firstName: '',
        lastName: '',
        email: ''
      },
      updateSuccess: false,
      updateError: null,
      accessToken: localStorage.getItem('accessToken'),
      isUpdating: false
    };
  },
  created() {
    this.fetchProfile();
  },
  methods: {
    async fetchProfile() {
      try {
        if (!this.accessToken) {
          this.updateError = 'Access token not found. Please log in.';
          return;
        }

        const user = JSON.parse(localStorage.getItem('User'));
        if (!user || !user._id) {
          this.updateError = 'User ID not found.';
          return;
        }

        const userId = user._id;
        const response = await axios.get(`https://book-management-3td9.onrender.com/api/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${this.accessToken}`
          }
        });

        if (response.status === 200) {
          this.profile = response.data.data;
        } else {
          this.updateError = 'Failed to fetch profile';
        }
      } catch (error) {
        this.updateError = error.message || 'Failed to fetch profile';
      }
    },
    async updateProfile() {
      try {
        if (!this.accessToken) {
          this.updateError = 'Access token not found. Please log in.';
          return;
        }

        const user = JSON.parse(localStorage.getItem('User'));
        if (!user || !user._id) {
          this.updateError = 'User ID not found.';
          return;
        }

        const userId = user._id;

        const response = await axios.put(`https://book-management-3td9.onrender.com/api/user/${userId}`, {
          firstName: this.form.firstName,
          lastName: this.form.lastName,
          email: this.form.email
        }, {
          headers: {
            Authorization: `Bearer ${this.accessToken}`
          }
        });

        if (response.status === 200) {
          this.updateSuccess = true;
          this.updateError = null;
          this.isUpdating = false;
          this.fetchProfile();
        } else {
          this.updateSuccess = false;
          this.updateError = 'Failed to update profile';
        }
      } catch (error) {
        this.updateSuccess = false;
        this.updateError = error.message || 'Failed to update profile';
      }
    }
  }
};
</script>

<style scoped>
.profile {
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.profile h2 {
  font-size: 28px;
  margin-bottom: 20px;
  color: #333;
}

.profile p {
  font-size: 16px;
  color: #555;
  margin: 5px 0;
}

.profile strong {
  color: #333;
}

.profile button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s ease;
  margin-top: 20px;
}

.back-homepage-button {
  display: inline-block;
  padding: 10px 20px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s ease;
  text-align: center;
  text-decoration: none;
  margin-top: 20px;
}

.back-homepage-button:hover {
  background-color: #218838;
}

.a {
    display: flex;
    font-size: 20px;
    padding: 1em;
    flex-direction: row;
    justify-content: space-around;
    width: 100%;
  }

.profile button:hover {
  background-color: #0056b3;
}

.profile-update form {
  display: flex;
  flex-direction: column;
}

.profile-update label {
  margin-bottom: 8px;
  font-size: 14px;
  color: #333;
}

.profile-update input {
  padding: 10px;
  margin-bottom: -20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
}

.profile-update button {
  padding: 12px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s ease;
}

.profile-update button:hover {
  background-color: #218838;
}

.profile-update button[type="button"] {
  background-color: #6c757d;
}

.profile-update button[type="button"]:hover {
  background-color: #5a6268;
}

.success-message {
  margin-top: 10px;
  background-color: #d4edda;
  color: #155724;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #c3e6cb;
}

.error-message {
  margin-top: 10px;
  background-color: #f8d7da;
  color: #721c24;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #f5c6cb;
}
</style>