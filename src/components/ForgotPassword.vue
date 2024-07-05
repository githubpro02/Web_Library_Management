<template>
  <div class="password-management">
    <div v-if="!isResetPassword">
      <h2 class="h">Forgot Password</h2>
      <form @submit.prevent="handleSubmitForgot">
        <div>
          <label for="email">Email:</label>
          <input type="email" v-model="email" id="email" required />
        </div>
        <button class="submit" type="submit">Submit</button>
        <router-link to="/login" class="a">Back</router-link>
      </form>
      <div v-if="message" :class="{'message': true, 'error': isError}">{{ message }}</div>
    </div>

    <div v-else>
      <h2 class="h">Reset Password</h2>
      <form @submit.prevent="handleSubmitReset">
        <div>
          <label for="token">Token:</label>
          <input type="text" v-model="token" id="token" required />
        </div>
        <div>
          <label for="newPassword">New Password:</label>
          <input type="password" v-model="newPassword" id="newPassword" required />
        </div>
        <button class="submit" type="submit">Submit</button>
        <router-link to="/login" class="a">Back</router-link>
      </form>
      <div v-if="message" :class="{'message': true, 'error': isError}">{{ message }}</div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: "user_password_management",
  data() {
    return {
      email: '',
      token: '',
      newPassword: '',
      message: '',
      isError: false,
      isResetPassword: false
    };
  },
  methods: {
    async handleSubmitForgot() {
      try {
        const response = await axios.post('https://book-management-3td9.onrender.com/api/forgot-password', { email: this.email });
        this.message = response.data.message || `If an account with the email ${this.email} exists, a password reset link has been sent.`;
        this.isError = false;
        this.isResetPassword = true; // Move to the reset password form
      } catch (error) {
        this.message = error.response ? error.response.data.message : 'An error occurred. Please try again.';
        this.isError = true;
      }
      this.email = '';
    },
    async handleSubmitReset() {
      try {
        const response = await axios.patch('https://book-management-3td9.onrender.com/api/forgot-password', {
          resetToken: this.token,
          newPass: this.newPassword
        });
        this.message = response.data.message || 'Your password has been successfully reset.';
        this.isError = false;
        this.isResetPassword = false; // Reset the form state after successful password reset
      } catch (error) {
        this.message = error.response ? error.response.data.message : 'An error occurred. Please try again.';
        this.isError = true;
      }
      this.token = '';
      this.newPassword = '';
    }
  }
};
</script>

<style scoped>
.password-management {
  max-width: 400px;
  margin: auto;
  padding: 1em;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.a {
  font-size: 20px;
  padding: 0.5em;
  justify-content: space-around;
  width: 100%;
}

.h {
  text-align: center;
  color: green;
}

.submit {
  background-color: green;
  border-radius: 5px;
}

button:hover {
  background-color: #0056b3;
}

.password-management h2 {
  margin-bottom: 1em;
}

.password-management form {
  display: flex;
  flex-direction: column;
}

.password-management form div {
  margin-bottom: 1em;
}

.message {
  margin-top: 1em;
  color: green;
}

.error {
  color: red;
}
</style>