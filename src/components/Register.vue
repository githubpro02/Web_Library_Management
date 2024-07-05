<template>
  <div class="register-container">
    <h2 class="register">Register</h2>
    <form @submit.prevent="handleRegister">
      <div class="form-group">
        <label for="firstName">FirstName</label>
        <input type="text" id="firstName" v-model="firstName" required />
      </div>
      <div class="form-group">
        <label for="lastName">LastName</label>
        <input type="text" id="lastName" v-model="lastName" required />
      </div>
      <div class="form-group">
        <label for="email">Email</label>
        <input type="email" id="email" v-model="email" required />
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input type="password" id="password" v-model="password" required />
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
import axios from 'axios';
// import User from '../models/user'

export default {
  name: 'user_register',
  data() {
    return {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      // user: new User('','','',''),
      errorMessage: ''
    };
  },
  methods: {
    async handleRegister() {

      const user = {
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        password: this.password,
      };

      try {
        const response = await axios.post('https://book-management-3td9.onrender.com/api/register', user);
        console.log('User registered:', response.data);
        alert('Registration successful!');
        this.$router.push('/login');
      } catch (error) {
        console.error('Error during registration:', error);
        this.errorMessage = error.response ? error.response.data.message : 'Registration failed. Please try again.';
      }
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