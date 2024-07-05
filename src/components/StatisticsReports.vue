<template>
  <div class="statistics-report">
    <h1>Thống kê và báo cáo</h1>
    
    <!-- Thống kê số lượng sách mượn theo tháng -->
    <div class="section">
      <h2>Thống kê số lượng sách mượn theo tháng</h2>
      <table class="styled-table">
        <thead>
          <tr>
            <th>Tháng</th>
            <th>Số lượng sách mượn</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(count, month) in booksBorrowedByMonth" :key="month">
            <td>{{ month }}</td>
            <td>{{ count }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <!-- Thống kê số lượng sách mượn theo người dùng -->
    <div class="section">
      <h2>Thống kê số lượng sách mượn theo người dùng</h2>
      <table class="styled-table">
        <thead>
          <tr>
            <th>Người dùng</th>
            <th>Số lần mượn</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(count, user) in booksBorrowedByUser" :key="user">
            <td>{{ user }}</td>
            <td>{{ count }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Báo cáo sách được mượn nhiều nhất, ít nhất -->
    <div class="section">
      <h2>Báo cáo sách được mượn nhiều nhất, ít nhất</h2>
      <div class="report">
        <p v-if="mostBorrowedBook.title"><strong>Sách được mượn nhiều nhất:</strong> {{ mostBorrowedBook.title }} ({{ mostBorrowedBook.count }} quyển)</p>
        <p v-if="leastBorrowedBook.title"><strong>Sách được mượn ít nhất:</strong> {{ leastBorrowedBook.title }} ({{ leastBorrowedBook.count }} quyển)</p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      booksBorrowedByMonth: {},
      booksBorrowedByUser: {},
      mostBorrowedBook: { title: '', count: 0 },
      leastBorrowedBook: { title: '', count: 0 },
    };
  },
  created() {
    this.fetchBooksBorrowedByMonth();
    this.fetchBooksBorrowedByUser();
    this.fetchMostAndLeastBorrowedBook();
  },
  methods: {
    async fetchBooksBorrowedByMonth() {
      try {
        const response = await axios.get('https://book-management-3td9.onrender.com/api/analyst/order');
        console.log(response.data); // Log the response to understand its structure
        const orders = response.data.data?.docs || [];
        
        // Process orders to get books borrowed by month
        const booksByMonth = orders.reduce((acc, order) => {
          const month = new Date(order.borrowDate).toISOString().slice(0, 7); // Get YYYY-MM format
          order.books.forEach(book => {
            if (!acc[month]) {
              acc[month] = 0;
            }
            acc[month] += book.quantity;
          });
          return acc;
        }, {});

        this.booksBorrowedByMonth = booksByMonth;
      } catch (error) {
        console.error('Error fetching books borrowed by month:', error);
      }
    },
    async fetchBooksBorrowedByUser() {
      try {
        const response = await axios.get('https://book-management-3td9.onrender.com/api/analyst/user/order?page=1&limit=5&month=[1, 12]');
        const usersData = response.data.data?.docs || [];
        
        // Process orders to get books borrowed by user
        const booksByUser = usersData.reduce((acc, userData) => {
          const user = `${userData._user.firstName} ${userData._user.lastName}`;
          userData._books.forEach(() => {
            if (!acc[user]) {
              acc[user] = 0;
            }
            acc[user] += 1;
          });
          return acc;
        }, {});

        this.booksBorrowedByUser = booksByUser;
      } catch (error) {
        console.error('Error fetching books borrowed by user:', error);
      }
    },
    async fetchMostAndLeastBorrowedBook() {
      try {
        const response = await axios.get('https://book-management-3td9.onrender.com/api/analyst/book');
        console.log(response.data); // Log the response to understand its structure
        const books = response.data.data || [];
        
        // Process books to find the most and least borrowed
        let mostBorrowed = { title: '', count: 0 };
        let leastBorrowed = { title: '', count: Infinity };

        books.forEach(book => {
          const count = book.quantity;
          const title = book.bookInfo.name;

          if (count > mostBorrowed.count) {
            mostBorrowed = { title, count };
          }
          if (count < leastBorrowed.count) {
            leastBorrowed = { title, count };
          }
        });

        this.mostBorrowedBook = mostBorrowed;
        this.leastBorrowedBook = leastBorrowed;
      } catch (error) {
        console.error('Error fetching most and least borrowed book:', error);
      }
    },
  },
};
</script>

<style scoped>
.statistics-report {
  font-family: 'Arial', sans-serif;
  color: #333;
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

h1 {
  color: #2c3e50;
  text-align: center;
  margin-bottom: 30px;
}

.section {
  margin-bottom: 30px;
}

h2 {
  color: #2c3e50;
  margin-bottom: 20px;
  border-bottom: 2px solid #e0e0e0;
  padding-bottom: 5px;
}

.styled-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
}

.styled-table thead tr {
  background-color: #009879;
  color: #ffffff;
  text-align: left;
}

.styled-table th, .styled-table td {
  padding: 12px 15px;
}

.styled-table tbody tr {
  border-bottom: 1px solid #dddddd;
}

.styled-table tbody tr:nth-of-type(even) {
  background-color: #f3f3f3;
}

.styled-table tbody tr:last-of-type {
  border-bottom: 2px solid #009879;
}

.styled-table tbody tr:hover {
  background-color: #f1f1f1;
}

.report {
  background-color: #f9f9f9;
  border: 1px solid #e0e0e0;
  padding: 15px;
  border-radius: 8px;
}

.report p {
  margin: 10px 0;
  font-size: 16px;
}

.report strong {
  color: #009879;
}
</style>