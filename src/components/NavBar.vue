<template>
  <nav class="navbar">
    <div class="container">
      <router-link to="/" class="navbar-brand">Library Management</router-link>
      <div class="menu">
        <div class="menu-item" @click="toggleDropdown" v-if="isUserLoggedIn">
          <i class="fas fa-user"></i>
          <span v-if="isUserLoggedIn"> Welcome, {{ username }}</span>
          <div class="submenu" v-if="isDropdownOpen">
            <router-link to="/update-profile" class="submenu-item">Update Profile</router-link>
            <router-link to="/change-password" class="submenu-item">Change Password</router-link>
            <router-link v-if="isAdmin" to="/user-management" class="submenu-item">User Management</router-link>
            <router-link to="/login" class="submenu-item">Logout</router-link>
          </div>
        </div>
        <!-- <div v-else>
          <div class="menu-item" @click="toggleDropdown">
            <i class="fas fa-user"></i>
            <div class="submenu" v-if="isDropdownOpen">
              <router-link to="/login" class="submenu-item">Login</router-link>
              <router-link to="/register" class="submenu-item">Register</router-link>
            </div>
          </div>
        </div> -->
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  data() {
    return {
      isDropdownOpen: false,
      isAdmin: false, // Change based on your user role logic
      isUserLoggedIn: false, // Change based on your authentication logic
      username: '', // Change based on your user data
    };
  },
  methods: {
    toggleDropdown() {
      this.isDropdownOpen = !this.isDropdownOpen;
    },
    logout() {
      // Add your logout functionality here
      console.log("Logging out...");
      // Clear authentication token
      localStorage.removeItem('authToken');
      // Update login state
      this.isUserLoggedIn = false;
      // Redirect to home or login page
      this.$router.push('/login');
    }
  },
  mounted() {
    // Check if user is logged in when component mounts
    const token = localStorage.getItem('authToken');
    if (token) {
      this.isUserLoggedIn = true;
      // Fetch user data if necessary and set username and isAdmin
      this.username = 'John Doe'; // Replace with actual username
      this.isAdmin = true; // Replace with actual admin check
    }
  }
};
</script>

<style scoped>
/* Navbar styles */
.navbar {
  background-color: #343a40;
  color: #fff;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 1000;
  padding: 1rem 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.navbar-brand {
  font-size: 1.5rem;
  font-weight: bold;
  color: #fff;
  text-decoration: none;
}

.menu {
  display: flex;
}

.menu-item {
  position: relative;
  margin-right: 20px;
  padding: 10px;
  color: #FFFFFF;
  cursor: pointer;
}

.submenu {
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  background-color: #FFFFFF;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.submenu a {
  display: block;
  padding: 10px;
  color: #007BFF;
  text-decoration: none;
}

.submenu a:hover {
  background-color: #F0F0F0;
}

.menu-item:hover .submenu {
  display: block;
}

.fa-user {
  font-size: 1.5rem;
}
</style>