<template>
  <div class="dashboard">
    <div class="dashboard-menu">
      <h2>Dashboard Menu</h2>
      <ul>
        <li><router-link to="/admin_dashboard/user_manage">Management User</router-link></li>
        <li><router-link to="/admin_dashboard/book_manage">Management Book</router-link></li>
        <li><router-link to="/admin_dashboard/category_manage">Management Category</router-link></li>
        <li><router-link to="/admin_dashboard/payment_manage">Payment Manage</router-link></li>
      </ul>
      <div class="footer"></div>
    </div>
    <div class="content">
      <header>
        <h1>Admin Dashboard</h1>
      </header>
      <main>
        <router-view></router-view>
      </main>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DashboardMenu'
}
</script>

<style scoped>
.dashboard {
  display: flex;
}

.dashboard-menu {
  background-color: #2c3e50;
  padding: 20px;
  color: #ecf0f1;
  height: 100vh;
  position: fixed;
  width: 250px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

h2 {
  margin: 0 0 20px 0;
  font-size: 24px;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  margin: 10px 0;
}

a {
  color: #ecf0f1;
  text-decoration: none;
  font-size: 18px;
}

a:hover {
  color: #3498db;
}

.footer {
  margin-top: auto;
  text-align: center;
  font-size: 14px;
  color: #bdc3c7;
}

.content {
  margin-left: 270px;
  padding: 20px;
  width: calc(100% - 270px);
  display: flex;
  flex-direction: column;
}

header {
  background-color: #ecf0f1;
  padding: 20px;
  border-bottom: 1px solid #ddd;
}

header h1 {
  margin: 0;
  font-size: 24px;
  color: #2c3e50;
}

main {
  flex: 1;
  padding: 20px;
  background-color: #ffffff;
}
</style>