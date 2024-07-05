<template>
  <div class="change-password-container">
    <h2 class="change-password">Change Password</h2>
    <form @submit.prevent="handleChangePassword">
      <div class="form-group">
        <label for="oldPassword">Old Password</label>
        <input type="password" id="oldPassword" v-model="oldPassword" required />
      </div>
      <div class="form-group">
        <label for="newPassword">New Password</label>
        <input type="password" id="newPassword" v-model="newPassword" required />
      </div>
      <div class="form-group">
        <label for="confirmNewPassword">Confirm New Password</label>
        <input type="password" id="confirmNewPassword" v-model="confirmNewPassword" required />
      </div>
      <button class="submit" type="submit">Change Password</button>
    </form>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    <p v-if="successMessage" class="success">{{ successMessage }}</p>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'ChangePassword',
  data() {
    return {
      oldPassword: '',
      newPassword: '',
      confirmNewPassword: '',
      errorMessage: '',
      successMessage: ''
    };
  },
  methods: {
    async handleChangePassword() {
      if (this.newPassword !== this.confirmNewPassword) {
        this.errorMessage = 'New passwords do not match.';
        this.successMessage = '';
        return;
      }

      const passwordData = {
        oldPassword: this.oldPassword,
        newPassword: this.newPassword,
        confirmPassword: this.confirmNewPassword,
      };

      try {
        const accessToken = localStorage.getItem('accessToken'); // Lấy token từ localStorage
        const response = await axios.put('https://book-management-3td9.onrender.com/api/change-password', passwordData,
          {
            headers: {
              'Authorization': `Bearer ${accessToken}`
            }
          }
        );
        console.log('Password changed:', response.data.accessToken);
        this.successMessage = 'Password changed successfully!';
        this.errorMessage = '';
      } catch (error) {
        console.error('Error during password change:', error);
        if (error.response && error.response.status === 401) {
          this.errorMessage = 'Unauthorized. Please log in again.';
        } else if (error.response && error.response.data && error.response.data.message) {
          this.errorMessage = error.response.data.message;
        } else {
          this.errorMessage = 'Password change failed. Please try again.';
        }
        this.successMessage = '';
      }
    }
  }
};
</script>

<style scoped>
.change-password-container {
  max-width: 400px;
  margin: auto;
  padding: 1em;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.change-password {
  text-align: center;
  color: green;
}

.submit {
  background-color: green;
}

.form-group {
  margin-bottom: 1em;
}

label {
  display: block;
  margin-bottom: 0.5em;
}

input {
  width: 100%;
  padding: 0.5em;
  box-sizing: border-box;
}

button {
  width: 100%;
  padding: 0.5em;
  background-color: #007BFF;
  color: white;
  border: none;
  border-radius: 5px;
}

button:hover {
  background-color: #0056b3;
}

.error {
  color: red;
  margin-top: 1em;
}

.success {
  color: green;
  margin-top: 1em;
}
</style>