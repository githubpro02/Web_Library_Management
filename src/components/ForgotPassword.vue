<!-- src/components/ForgotPassword.vue -->
<template>
    <div class="forgot-password">
      <h2 class="h">Forgot Password</h2>
      <form @submit.prevent="handleSubmit">
        <div>
          <label for="email">Email:</label>
          <input type="email" v-model="email" id="email" required />
        </div>
        <button class="submit" type="submit">Submit</button>
        <router-link to="/login">Quay về trang chủ</router-link>
      </form>
      <div v-if="message" class="message">{{ message }}</div>
    </div>
  </template>
  
  <script>
  export default {
    name: "user_forgot",
    data() {
      return {
        email: '',
        message: ''
      };
    },
    methods: {
      handleSubmit() {
        // Simulate an API call
        setTimeout(() => {
          this.message = `If an account with the email ${this.email} exists, a password reset link has been sent.`;
          this.email = '';
        }, 1000);
      }
    }
  };
  </script>
  
  <style scoped>
  .forgot-password {
    max-width: 400px;
    margin: auto;
    padding: 1em;
    border: 1px solid #ccc;
    border-radius: 5px;
  }

  .h {
    text-align: center;
    color: green;
  }

  .submit {
    background-color: green;
  }

  button:hover {
    background-color: #0056b3;
  }

  .forgot-password h2 {
    margin-bottom: 1em;
  }
  .forgot-password form {
    display: flex;
    flex-direction: column;
  }
  .forgot-password form div {
    margin-bottom: 1em;
  }
  .forgot-password .message {
    margin-top: 1em;
    color: green;
  }
  </style>