<template>
    <div class="register-container">
      <h2 class="register">Register</h2>
      <form @submit.prevent="handleRegister">
        <div class="form-group">
          <label for="username">Username</label>
          <input type="text" id="username" v-model="username" required />
        </div>
        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" id="email" v-model="email" required />
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input type="password" id="password" v-model="password" required />
        </div>
        <div class="form-group">
          <label for="confirmPassword">Confirm Password</label>
          <input type="password" id="confirmPassword" v-model="confirmPassword" required />
        </div>
        <button class="submit" type="submit">Register</button>
      </form>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
      <p>
        Already have an account? <router-link to="/login">Login</router-link>
      </p>
    </div>
  </template>
  
  <script>
  export default {
    name: 'user_register',
    data() {
      return {
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        errorMessage: ''
      };
    },
    methods: {
      handleRegister() {
        if (this.password !== this.confirmPassword) {
          this.errorMessage = 'Passwords do not match.';
          return;
        }
        
        // Example registration logic
        const user = {
          username: this.username,
          email: this.email,
          password: this.password
        };
  
        // Replace with actual registration logic, such as an API call
        console.log('User registered:', user);
        alert('Registration successful!');
      }
    }
  };
  </script>
  
  <style scoped>
  .register-container {
    max-width: 400px;
    margin: auto;
    padding: 1em;
    border: 1px solid #ccc;
    border-radius: 5px;
  }

  .register {
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
  </style>