<template>
  <nav class="navbar">
    <div class="container">
      <router-link to="/" class="navbar-brand">Library Management</router-link>
      <div class="menu">
        <div class="menu-item" @click="toggleSubMenu">
          <i class="fas fa-user"></i>
          <div class="submenu" v-if="showSubMenu">
            <router-link to="/update_profile" class="submenu-item">Profile</router-link>
            <router-link to="/changepassword" class="submenu-item">Change Password</router-link>
            <li v-if="isAdmin">
              <router-link to="/admin_dashboard" class="submenu-item">Admin</router-link>
            </li>
            <a class="submenu-item" href @click="logOut">Logout</a>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  data() {
    return {
      showSubMenu: false,
    };
  },
  computed: {
    isAdmin() {
      const user = JSON.parse(localStorage.getItem('User'));
      return user && user.role === 'admin';
    }
  },
  methods: {
    toggleSubMenu() {
      this.showSubMenu = !this.showSubMenu;
    },
    logOut() {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('User');
      this.$router.push('/login');
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