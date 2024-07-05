<template>
  <div class="book-management">
    <table class="order-table">
      <thead>
        <tr>
          <th>Order ID</th>
          <th>User ID</th>
          <th>Quantity</th>
          <th>Price</th>
          <th>Date Borrowed</th>
          <th>Due Date</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="order in orders" :key="order._id">
          <td>{{ order._id }}</td>
          <td>{{ order.userId }}</td>
          <td>{{ order.books[0].quantity }}</td>
          <td>{{ order.totalPrice }}</td>
          <td>{{ formatDate(order.borrowDate) }}</td>
          <td>{{ formatDate(order.dueDate) }}</td>
          <td>{{ order.status }}</td>
          <td>
            <button @click="editOrder(order)" class="action-button-edit">Edit</button>
            <button @click="deleteOrder(order._id)" class="action-button-delete">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="selectedOrder" class="edit-form">
      <h2>Edit Order</h2>
      <form @submit.prevent="updateOrder">
        <div class="form-group">
          <label for="userId">User ID:</label>
          <input type="text" v-model="selectedOrder.userId" required />
        </div>
        <div class="form-group">
          <label for="bookId">Book ID:</label>
          <input type="text" v-model="selectedOrder.books[0]._id._id" required />
        </div>
        <div class="form-group">
          <label for="quantity">Quantity:</label>
          <input type="number " v-model="selectedOrder.books[0].quantity" required />
        </div>
        <div class="form-group">
          <label for="totalPrice">Total Price:</label>
          <input type="number " v-model="computedTotalPrice" required/>
        </div>
        <div class="form-group">
          <label for="borrowDate">Date Borrowed:</label>
          <input type="date" v-model="selectedOrder.borrowDate" required />
        </div>
        <div class="form-group">
          <label for="dueDate">Due Date:</label>
          <input type="date" v-model="selectedOrder.dueDate" required />
        </div>
        <div class="form-group">
          <label for="status">Status:</label>
          <select v-model="selectedOrder.status">
            <option value="Borrowed">Borrowed</option>
            <option value="Returned">Returned</option>
          </select>
        </div>
        <button type="submit" class="action-button-edit">Update</button>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      accessToken: null,
      orders: [],
      selectedOrder: null,
      books: {}
    };
  },
  created() {
    this.accessToken = localStorage.getItem('accessToken');
    if (this.accessToken) {
      this.fetchOrders();
    }
  },
  computed: {
    computedTotalPrice() {
      if (this.selectedOrder && this.selectedOrder.books.length > 0) {
        const bookPrice = this.selectedOrder.books[0]._id.price;
        return this.selectedOrder.books[0].quantity * bookPrice;
      }
      return 0;
    },
  },
  methods: {
    async fetchOrders() {
      try {
        const response = await axios.get('https://book-management-3td9.onrender.com/api/order', {
          headers: {
            Authorization: `Bearer ${this.accessToken}`
          }
        });
        this.orders = response.data.data.docs;
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    },
    editOrder(order) {
      this.selectedOrder = JSON.parse(JSON.stringify(order));
    },
    async updateOrder() {
      try {
        const orderId = this.selectedOrder._id;
        const updatedOrder = {
          userId: this.selectedOrder.userId,
          books: [{
            _id: this.selectedOrder.books[0]._id._id,
            quantity: this.selectedOrder.books[0].quantity // Thêm trường quantity vào đây
          }],
          totalPrice: this.computedTotalPrice,
          borrowDate: new Date(this.selectedOrder.borrowDate).getTime(),
          dueDate: new Date(this.selectedOrder.dueDate).getTime(),
          status: this.selectedOrder.status
        };

        await axios.patch(`https://book-management-3td9.onrender.com/api/order/${orderId}`, updatedOrder, {
          headers: {
            Authorization: `Bearer ${this.accessToken}`
          }
        });
        this.selectedOrder = null;
        this.fetchOrders();
      } catch (error) {
        console.error('Error updating order:', error);
      }
    },
    async deleteOrder(orderId) {
      try {
        await axios.delete(`https://book-management-3td9.onrender.com/api/order`, {
          headers: {
            Authorization: `Bearer ${this.accessToken}`
          },
          data: {
            orderIdList: [orderId]  // Sending the bookId in the body as an array
          }
        });
        this.fetchOrders();
      } catch (error) {
        console.error('Error deleting order:', error);
      }
    },
    formatDate(timestamp) {
      return new Date(timestamp).toLocaleDateString();
    },
  }
};
</script>
  
<style scoped>
.book-management {
  font-family: Arial, sans-serif;
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
}

.order-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
  text-align: center;
}

.order-table th, .order-table td {
  padding: 12px; /* Increased padding for better spacing */
  text-align: center;
  border: 1px solid #ddd;
}

.order-table th {
  background-color: #f0f0f0; /* Light gray background for table headers */
}

.action-button-edit {
  padding: 8px 12px;
  margin-right: 5px;
  cursor: pointer;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
}

.action-button-delete {
  padding: 8px 12px;
  margin-right: 5px;
  cursor: pointer;
  background-color: red;
  color: #fff;
  border: none;
  border-radius: 4px;
}

.action-button:hover {
  background-color: #0056b3;
}

.edit-form {
  background-color: #f5f5f5;
  padding: 20px;
  border-radius: 8px;
  margin-top: 20px;
}

.edit-form h2 {
  margin-bottom: 10px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  font-weight: bold;
  display: block; /* Ensure labels are block-level for proper spacing */
}

.form-group input, .form-group select {
  width: calc(100% - 16px); /* Adjust width to accommodate padding and border */
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

.form-group input[type="date"] {
  padding: 6px;
}

.form-group input:focus, .form-group select:focus {
  outline: none;
  border-color: #007bff;
}

.form-group select {
  width: 100%; /* Ensure select elements occupy full width */
}
</style>