<template>
  <div>
    <div class="login-container">
      <h2 class="login">Login</h2>
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" id="email" v-model="user.email" required/>
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input type="password" id="password" v-model="user.password" required />
        </div>
        <div class="form-group">
          <button class="b" type="submit">
            <span>Login</span>
          </button>
        </div>
      </form>
      <div class="a">
        <router-link to="/register">Register</router-link>
        <router-link to="/forgotpassword">ForgotPassword</router-link>
      </div>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    </div>
  </div>
</template>
  
  <script>
// import { router } from './router';
import axios from 'axios';
import User from "../models/user.js";

  export default {
    name: 'user_login',
    data() {
      return {
        user: new User('',''),
        errorMessage: ''
      };
    },
    methods: {
      async handleLogin() {
        try {
        const response = await axios.post('https://book-management-3td9.onrender.com/api/login', this.user);

        // Assuming the token is in response.data.token
        const accessToken = response.data.data.accessToken;

        // Store the token (e.g., in localStorage or Vuex)
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('User', JSON.stringify(response.data.data));

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