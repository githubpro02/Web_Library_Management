<template>
  <div class="bookstore section">
    <h2>Bookstore</h2>

    <!-- Books Viewing and Ordering Section -->
    <div class="books-section">
      <div class="search-bar">
        <input
          v-model="searchQuery"
          placeholder="Search by name, author, or genre"
          class="search-input"
        />
      </div>
      <div class="books-grid">
        <div v-for="book in filteredBooks" :key="book._id" class="book-card">
          <img :src="book.thumbnail" alt="Cover Image" class="cover-image" />
          <div class="book-details">
            <h3>{{ book.name }}</h3>
            <p><strong>Author:</strong> {{ book.author }}</p>
            <p><strong>Category:</strong> {{ book.categories[0]?.name }}</p>
            <p><strong>Quantity:</strong> {{ book.quantity }}</p>
            <p><strong>Price:</strong> {{ book.price }}</p>
            <div class="buttons">
              <button @click="showOrderForm(book)" class="btn btn-order" :disabled="book.quantity === 0">Order</button>
            </div>
          </div>
        </div>
      </div>
      <div v-if="showOrderModal" class="modal">
        <div class="modal-content">
          <span class="close" @click="showOrderModal = false">&times;</span>
          <h3>{{ editingOrder ? 'Edit Order' : 'Order Book' }}</h3>
          <form @submit.prevent="placeOrder">
            <div>
              <label>Book Name:</label>
              <input type="text" v-model="orderForm.bookName" readonly />
            </div>
            <div>
              <label>User ID:</label>
              <input type="text" v-model="orderForm.userId" readonly />
            </div>
            <div>
              <label>Borrow Date:</label>
              <input type="date" v-model="orderForm.borrowDateFormatted" required />
            </div>
            <div>
              <label>Due Date:</label>
              <input type="date" v-model="orderForm.dueDateFormatted" required @change="calculateTotalPrice" />
            </div>
            <div>
              <label>Quantity:</label>
              <input type="number" v-model="orderForm.quantity" required @input="calculateTotalPrice" />
            </div>
            <div>
              <label>Total Price:</label>
              <input type="number" v-model="orderForm.totalPrice" readonly />
            </div>
            <button type="submit" class="btn btn-confirm">Confirm Order</button>
          </form>
        </div>
      </div>

      <!-- Pagination Controls -->
      <div class="pagination">
        <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1">Previous</button>
        <span>Page {{ currentPage }} of {{ totalPages }}</span>
        <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages">Next</button>
      </div>
    </div>

    <!-- Orders Status Section -->
    <div class="orders-section">
      <h3>Order Status</h3>
      <div v-if="orders.length === 0">
        <p>No orders yet.</p>
      </div>
      <div v-else class="orders-list">
        <div v-for="order in orders" :key="order._id" class="order-item">
          <p><strong>Order ID:</strong> {{ order._id }}</p>
          <p><strong>User ID:</strong> {{ order.userId }}</p>
          <p><strong>Borrow Date:</strong> {{ formatDateString(order.borrowDate) }}</p>
          <p><strong>Due Date:</strong> {{ formatDateString(order.dueDate) }}</p>
          <p><strong>Books:</strong></p>
          <ul>
            <li v-for="book in order.books" :key="book._id">
              {{ book.name }} ({{ book.quantity }})
            </li>
          </ul>
          <p><strong>Total Price:</strong> {{ order.totalPrice }}</p>
          <p><strong>Status:</strong> {{ order.status }}</p>
        </div>
      </div>
    </div>

    <!-- Error Message -->
    <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'BookStore',
  data() {
    return {
      books: [],
      orders: [],
      searchQuery: '',
      showOrderModal: false,
      editingOrder: false,
      orderForm: {
        bookName: '',
        userId: '', // Assuming you might store the logged in user's id here
        borrowDateFormatted: '',
        dueDateFormatted: '',
        quantity: 1,
        totalPrice: 0,
      },
      errorMessage: '',
      currentPage: 1,
      totalPages: 1,
      itemsPerPage: 5,
      accessToken: '',
    };
  },
  computed: {
    filteredBooks() {
      const query = this.searchQuery.toLowerCase();
      return this.books.filter(
        (book) =>
          book.name.toLowerCase().includes(query) ||
          book.author.toLowerCase().includes(query) ||
          (book.categories[0]?.name && book.categories[0]?.name.toLowerCase().includes(query))
      );
    },
  },
  methods: {
    fetchBooks() {
      const url = `https://book-management-3td9.onrender.com/api/book?page=${this.currentPage}&limit=${this.itemsPerPage}`;
      axios
        .get(url)
        .then((response) => {
          this.books = response.data.data.docs;
          this.totalPages = response.data.data.totalPages;
        })
        .catch((error) => {
          console.error(error);
          this.errorMessage = 'Failed to fetch books.';
        });
    },
    async fetchOrders() {
      try {
        if (!this.accessToken) {
          this.errorMessage = 'Access token not found.';
          return;
        }

        // Retrieve user data from localStorage
        const user = JSON.parse(localStorage.getItem('User'));

        if (!user || !user._id) {
          this.errorMessage = 'User ID not found.';
          return;
        }

        const userId = user._id;
        const url = `https://book-management-3td9.onrender.com/api/user/${userId}/orders`;

        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
          },
        });

        this.orders = response.data.data.docs;
      } catch (error) {
        console.error('Error fetching orders:', error);
        if (error.response && error.response.status === 403) {
          this.errorMessage = 'Access forbidden. Please ensure you have the necessary permissions.';
        } else {
          this.errorMessage = 'Failed to fetch orders.';
        }
      }
    },
    changePage(page) {
      if (page < 1 || page > this.totalPages) return;
      this.currentPage = page;
      this.fetchBooks();
    },
    showOrderForm(book) {
      const user = JSON.parse(localStorage.getItem('User'));
      const userId = user._id;
      this.orderForm.bookName = book.name;
      this.orderForm.userId = userId; // Reset userId when showing order form
      this.orderForm.borrowDateFormatted = '';
      this.orderForm.dueDateFormatted = '';
      this.orderForm.quantity = 1;
      this.orderForm.totalPrice = book.price; // Set default total price based on book price
      this.editingOrder = false;
      this.showOrderModal = true;
    },
    calculateTotalPrice() {
      const book = this.books.find((b) => b.name === this.orderForm.bookName);
      if (!book) return;

      const quantity = this.orderForm.quantity;
      let price = book.price * quantity;

      // const borrowDate = new Date(this.orderForm.borrowDateFormatted);
      const dueDate = new Date(this.orderForm.dueDateFormatted);
      const today = new Date();

      if (dueDate < today) {
        const weeksOverdue = Math.ceil((today - dueDate) / (7 * 24 * 60 * 60 * 1000));
        price += (price * 0.2 * weeksOverdue);
      }

      this.orderForm.totalPrice = price;
    },
    placeOrder() {
      const book = this.books.find((b) => b.name === this.orderForm.bookName);

      if (!book) {
        this.errorMessage = 'Book not found.';
        return;
      }

      const borrowDateTimestamp = new Date(this.orderForm.borrowDateFormatted).getTime();
      const dueDateTimestamp = new Date(this.orderForm.dueDateFormatted).getTime();

      const orderData = {
        books: [{ _id: book._id, quantity: this.orderForm.quantity }],
        userId: this.orderForm.userId,
        borrowDate: borrowDateTimestamp,
        dueDate: dueDateTimestamp,
        totalPrice: this.orderForm.totalPrice,
      };

      axios
        .post('https://book-management-3td9.onrender.com/api/order', orderData, {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
          },
        })
        .then(() => {
          const newOrder = {
            _id: Date.now(),
            ...orderData,
            books: [{ name: book.name, quantity: this.orderForm.quantity }],
            status: 'Borrowed',
            createdAt: Date.now(),
            updatedAt: Date.now(),
          };
          this.orders.push(newOrder);

          book.quantity -= orderData.books[0].quantity;

          this.resetOrderForm();
          this.showOrderModal = false;
        })
        .catch((error) => {
          console.error(error);
          this.errorMessage = 'Failed to place order.';
        });
    },
    formatDateString(timestamp) {
      return new Date(timestamp).toISOString().split('T')[0];
    },
    calculateTotalOrderPrice(order) {
      let totalPrice = 0;
      const today = new Date();

      order.books.forEach((book) => {
        const bookData = this.books.find((b) => b._id === book._id);
        if (bookData) {
          let price = bookData.price * book.quantity;

          const dueDate = new Date(order.dueDate);
          if (dueDate < today) {
            const weeksOverdue = Math.ceil((today - dueDate) / (7 * 24 * 60 * 60 * 1000));
            price += (price * 0.2 * weeksOverdue);
          }

          totalPrice += price;
        }
      });

      return totalPrice.toFixed(2);
    },
    resetOrderForm() {
      this.orderForm.bookName = '';
      this.orderForm.userId = '';
      this.orderForm.borrowDateFormatted = '';
      this.orderForm.dueDateFormatted = '';
      this.orderForm.quantity = 1;
      this.orderForm.totalPrice = 0;
      this.editingOrder = false;
    },
  },
  mounted() {
    // Retrieve accessToken from localStorage
    this.accessToken = localStorage.getItem('accessToken');
    if (this.accessToken) {
      this.fetchOrders(); // Fetch orders if accessToken is available
    } else {
      this.errorMessage = 'Access token not found.';
    }

    // Assuming you would set the userId during authentication or based on your app logic
    this.orderForm.userId = ''; // Set this to the actual userId of the logged in user
    this.fetchBooks();
  },
};
</script>


<style scoped>
.bookstore {
  max-width: 1200px;
  margin: auto;
  padding: 2rem;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.search-bar {
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
}

.search-input {
  width: 100%;
  max-width: 600px;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
}

.btn {
  display: inline-block;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-order {
  background-color: #007bff;
  color: #fff;
}

.btn-confirm {
  background-color: #28a745;
  color: #fff;
}

.btn-edit {
  background-color: #ffc107;
  color: #212529;
}

.btn-delete {
  background-color: #dc3545;
  color: #fff;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-content {
  background-color: #fff;
  padding: 2rem;
  border-radius: 8px;
  max-width: 500px;
  width: 100%;
  position: relative;
}

.close {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 1.5rem;
  cursor: pointer;
}

.books-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
}

.book-card {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1rem;
  text-align: center;
}

.cover-image {
  width: 100%;
  height: auto;
  border-radius: 4px;
}

.book-details {
  margin-top: 1rem;
}

.buttons {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1rem;
}

.orders-section {
  margin-top: 3rem;
}

.orders-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 3rem;
}

.order-item {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1rem;
}

.order-item-actions {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 2rem;
}

.pagination button {
  margin: 0 0.5rem;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.pagination button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>