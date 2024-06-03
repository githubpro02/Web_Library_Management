<template>
    <div class="login-container">
      <h2 class="login">Login</h2>
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="username">Username</label>
          <input type="text" id="username" v-model="username" required />
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input type="password" id="password" v-model="password" required />
        </div>
        <button class="b" type="submit" >Login</button>
      </form>
      <div class="a">
        <router-link to="/register">Đăng ký</router-link>
        <router-link to="/forgotpassword">Quên mật khẩu</router-link>
      </div>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    </div>
  </template>
  
  <script>
// import { router } from './router';
import axios from 'axios';

  export default {
    name: 'user_login',
    data() {
      return {
        username: '',
        password: '',
        errorMessage: ''
      };
    },
    methods: {
      async handleLogin() {
        // Example login logic
        // const validUsername = 'user';
        // const validPassword = 'password';
        
        // if (this.username === validUsername && this.password === validPassword) {
        //   // Redirect to dashboard or another page
        //   alert('Login successful!');
        // } else {
        //   this.errorMessage = 'Invalid username or password.';
        // }

        try {
        const response = await axios.post('https://book-management-3td9.onrender.com/api/login', {
          email: this.username,
          password: this.password
        });

        // Assuming the token is in response.data.token
        const token = response.data.token;

        // Store the token (e.g., in localStorage or Vuex)
        localStorage.setItem('authToken', token);

        // Redirect or update the UI to indicate the user is logged in
        this.$router.push('/homepage');

      } catch (error) {
        console.error('Error logging in:', error);
        alert('Login failed. Please check your credentials and try again.');
      }
    }
  }
}
  </script>
  
  <style scoped>
  .login-container {
    max-width: 500px;
    margin: auto;
    padding: 1em;
    border: 1px solid #ccc;
    border-radius: 5px;
  }

  .login {
    text-align: center;
    color: green;
  }
  
  .a {
    display: flex;
    font-size: 20px;
    padding: 1em;
    flex-direction: row;
    justify-content: space-around;
    width: 100%;
  }

  .b {
    font-size: 20px;
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
    background-color: green;
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