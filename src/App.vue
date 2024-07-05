<template>
  <!-- <img alt="Vue logo" src="./assets/logo.png">
  <HelloWorld msg="Welcome to Your Vue.js App"/> -->
  <div id="app">
     <!-- <Login/>
     <Register/> -->
      <!-- <ManageLists/> -->
      <router-link to="/login"></router-link>
      <router-link to="/register"></router-link>
      <router-link to="/forgot"></router-link>
      <router-link to="/homepage"></router-link>
      <router-link to="/update_profile"></router-link>
      <router-link to="/managelists"></router-link>
      <router-link to="/bookmanagement"></router-link>
      <router-link to="/changepassword"></router-link>
      <router-link to="/statistics-report"></router-link>
      <router-link to="/admin_dashboard"></router-link>
      <router-link to="/user_manage"></router-link>
      <router-link to="/category_manage"></router-link>
      <router-link to="/book_manage"></router-link>
    <router-view/>
  </div>
</template>

<script>

// import HelloWorld from './components/HelloWorld.vue'
// import Login from './components/Login.vue'
// import Register from './components/Register.vue'
// import ManageLists from './components/ManageLists.vue';

export default {
  name: 'App',
  components: {
    // HelloWorld
    // Login,
    // Register
    // ManageLists
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  color: #2c3e50;
  margin-top: 60px;
}
</style>
