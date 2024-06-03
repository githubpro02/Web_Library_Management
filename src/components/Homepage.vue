<template>
  <div class="homepage">
    <NavBar />

    <header class="hero">
      <div class="container">
        <h1>Welcome to Our Library Management System</h1>
        <p>Efficiently manage your library resources with ease.</p>
        <router-link to="/managelists" class="btn btn-primary">
          <h5>Get Started</h5>
        </router-link>
      </div>
    </header>

    <section class="features">
      <div class="container">
        <div class="feature">
          <i class="fas fa-book"></i>
          <!-- <h2>Manage Lists</h2> -->
          <router-link to="/managelists">
            <h2>Manage Lists</h2>
          </router-link>
          <p>Add, edit, and delete books. Search by name, author, or genre.</p>
        </div>
        <!-- <div class="feature">
          <i class="fas fa-users"></i>
          <router-link to="">
            <h2>User Management</h2>
          </router-link>
          <p>Manage user accounts, permissions, and access.</p>
        </div> -->
        <div class="feature">
          <i class="fas fa-chart-bar"></i>
          <router-link to="">
            <h2>Statistics & Reporting</h2>
          </router-link>
          <p>Track library usage, generate reports, and gain insights.</p>
        </div>
      </div>
    </section>
    

    <footer class="footer">
      <div class="container">
        <p>&copy; 2024 Library Management System. All Rights Reserved.</p>
      </div>
    </footer>

    <!-- <Footer></Footer> -->
  </div>
</template>

<script>
import NavBar from './NavBar.vue';
// import Footer from './FooterPage.vue';

export default {
  name: 'user_Homepage',
  components: {
    NavBar,
    // FooterPage
  }
};
</script>

<style scoped>
/* Homepage styles */
.homepage {
  font-family: 'Roboto', sans-serif;
  padding-top: 70px;
}

/* Hero section styles */
.hero {
  background-color: #007bff;
  color: #fff;
  text-align: center;
  padding: 6rem 0;
}

.hero h1 {
  font-size: 3rem;
  margin-bottom: 1.5rem;
}

.hero p {
  font-size: 1.25rem;
  margin-bottom: 2rem;
}

.btn-primary {
  background-color: #0056b3;
  color: #fff;
  padding: 2rem 2rem;
  border-radius: 5px;
  text-decoration: none;
  transition: background-color 0.3s ease;
}

.btn-primary:hover {
  background-color: #004080;
}

/* Features section styles */
.features {
  background-color: #f8f9fa;
  padding: 4rem 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  justify-content: space-around;
}

.feature {
  text-align: center;
  margin-bottom: 2rem;
}

.feature i {
  font-size: 3rem;
  color: #007bff;
}

.feature h2 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.feature p {
  font-size: 1rem;
  color: #555;
}


  /* Footer styles */
  .footer {
    background-color: #343a40;
    color: #fff;
    text-align: center;
    padding: 2rem 0;
  }
  
  /* .container {
    max-width: 1200px;
    margin: 0 auto;
  } */
  
  .footer p {
    margin: 0;
  }


/* FontAwesome icons */
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css');
</style>