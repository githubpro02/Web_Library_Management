<template>
  <div class="management-page">
    <h2>Book Management</h2>
    <button @click="addBook" class="add-item-btn">Add Book</button>

    <!-- Add/Edit Book Form -->
    <div v-if="showAddBookForm" class="book-form">
      <form @submit.prevent="saveBook">
        <div class="form-group">
          <label for="name">Book Name:</label>
          <input type="text" v-model="localBook.name" required class="form-control" />
        </div>
        <div class="form-group">
          <label for="author">Author:</label>
          <input type="text" v-model="localBook.author" required class="form-control" />
        </div>
        <div class="form-group">
          <label for="categoryId">Category:</label>
          <select v-model="selectedCategoryId" required class="form-control">
            <option v-if="categories.length === 0" disabled>No categories available</option>
            <option v-else v-for="category in categories" :key="category._id" :value="category._id">
              {{ category.name }}
            </option>
          </select>
        </div>
        <div class="form-group">
          <label for="description">Description:</label>
          <textarea v-model="localBook.description" required class="form-control"></textarea>
        </div>
        <div class="form-group">
          <label for="quantity">Quantity:</label>
          <input type="number" v-model="localBook.quantity" required class="form-control" />
        </div>
        <div class="form-group">
          <label for="price">Price:</label>
          <input type="number" v-model="localBook.price" required class="form-control" />
        </div>
        <div class="form-group">
          <label for="uploadImage">Upload Cover Image:</label>
          <input type="file" @change="onFileChange" ref="uploadImage" class="form-control" />
          <img v-if="localBook.thumbnail" :src="localBook.thumbnail" alt="Cover Image" class="cover-preview" width="100" height="50" />
        </div>
        <button type="submit" class="btn btn-primary">Save</button>
        <button type="button" @click="cancelAddBook" class="btn btn-secondary">Cancel</button>
      </form>
    </div>

    <!-- Book List Table -->
    <table>
      <thead>
        <tr>
          <th>Book Name</th>
          <th>Author</th>
          <th>Category</th>
          <th>Description</th>
          <th>Quantity</th>
          <th>Price</th>
          <th>Image</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(book, index) in books" :key="book._id">
          <td>{{ book.name }}</td>
          <td>{{ book.author }}</td>
          <td>{{ getCategoryName(book) }}</td>
          <td>{{ book.description }}</td>
          <td>{{ book.quantity }}</td>
          <td>{{ book.price }}</td>
          <td>
            <img :src="book.thumbnail" alt="Cover Image" class="cover-thumbnail" />
          </td>
          <td>
            <button @click="editBook(book, index)" class="action-btn edit">Edit</button>
            <button @click="deleteBook(book._id)" class="action-btn delete">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://book-management-3td9.onrender.com/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

export default {
  data() {
    return {
      books: [],
      categories: [],
      showAddBookForm: false,
      localBook: {
        name: '',
        author: '',
        description: '',
        thumbnail: '',
        quantity: 1,
        price: 0,
        categories: [] // Initialize categories as an array
      },
      editingIndex: null,
      selectedCategoryId: '' // Store selected category ID
    };
  },
  created() {
    this.fetchBooks();
    this.fetchCategories(); // Fetch categories when component is created
  },
  methods: {
    fetchBooks() {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        console.error('No token available. User is not authenticated.');
        return;
      }

      axiosInstance.get('/book', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
        .then(response => {
          this.books = response.data.data.docs;
        })
        .catch(error => {
          console.error('Error fetching books:', error);
        });
    },
    fetchCategories() {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        console.error('No token available. User is not authenticated.');
        return;
      }

      axiosInstance.get('/category', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
        .then(response => {
          this.categories = response.data.data.docs;
        })
        .catch(error => {
          console.error('Error fetching categories:', error);
        });
    },
    addBook() {
      this.showAddBookForm = true;
      this.resetLocalBook();
      this.resetFileInput();
    },
    saveBook() {
      if (this.editingIndex === null) {
        // Khi thêm sách mới
        delete this.localBook._id; // Loại bỏ trường _id
        this.localBook.categories = [this.selectedCategoryId]; // Gán selectedCategoryId cho localBook.categories

        this.uploadCoverImage()
          .then(thumbnailLink => {
            this.localBook.thumbnail = thumbnailLink;
            return axiosInstance.post('/book', this.localBook, {
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
              }
            });
          })
          .then(response => {
            this.books.push(response.data);
            this.cancelAddBook();
          })
          .catch(error => {
            console.error('Error adding book:', error);
          });
      } else {
        // Khi chỉnh sửa sách
        const updatedBook = { ...this.localBook };
        delete updatedBook._id; // Loại bỏ trường _id khỏi payload
        delete updatedBook.createdAt;
        delete updatedBook.updatedAt;
        delete updatedBook.__v;

        updatedBook.categories = [this.selectedCategoryId];

        this.uploadCoverImage()
          .then(thumbnailLink => {
            updatedBook.thumbnail = thumbnailLink;
            return axiosInstance.patch(`/book/${this.localBook._id}`, updatedBook, {
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
              }
            });
          })
          .then(response => {
            this.books.splice(this.editingIndex, 1, response.data);
            this.editingIndex = null;
            this.cancelAddBook();
          })
          .catch(error => {
            console.error('Error updating book:', error);
          });
      }
    },
    uploadCoverImage() {
      const formData = new FormData();
      formData.append('thumbnail', this.$refs.uploadImage.files[0]); // Ensure the field name matches the expected field name

      return axiosInstance.post('/upload/book-thumbnail', formData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'multipart/form-data'
        }
      })
        .then(response => response.data.data.thumbnailLink)
        .catch(error => {
          console.error('Error uploading cover image:', error);
          throw error;
        });
    },
    cancelAddBook() {
      this.resetLocalBook();
      this.showAddBookForm = false;
      this.resetFileInput();
    },
    editBook(book, index) {
      this.localBook = { ...book };
      this.selectedCategoryId = book.categories[0] ? book.categories[0]._id : ''; // Set selected category ID
      this.localBook.categories = book.categories.map(cat => cat._id);
      this.editingIndex = index;
      this.showAddBookForm = true;
      this.resetFileInput();
    },
    deleteBook(bookId) {
      axiosInstance.delete('/book', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        data: {
          arrayId: [bookId]  // Sending the bookId in the body as an array
        }
      })
        .then(() => {
          this.books = this.books.filter(book => book._id !== bookId);
        })
        .catch(error => {
          console.error('Error deleting book:', error);
        });
    },
    onFileChange(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          this.localBook.thumbnail = reader.result;
        };
        reader.readAsDataURL(file);
      }
    },
    resetLocalBook() {
      this.localBook = { name: '', author: '', description: '', thumbnail: '', quantity: 1, price: 0, categories: [] };
    },
    resetFileInput() {
      const fileInput = this.$refs.uploadImage;
      if (fileInput) {
        fileInput.value = null;
      }
    },
    getCategoryName(book) {
      if (!book.categories || book.categories.length === 0) {
        return 'Unknown';
      } else {
        const category = this.categories.find(cat => cat._id === book.categories[0]._id);
        return category ? category.name : 'Unknown';
      }
    }
  }
};
</script>

<style scoped>
.management-page {
  background-color: #f7f7f7;
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 5px;
}

h2 {
  margin-bottom: 20px;
  color: #333;
}

.add-item-btn {
  background-color: #3498db;
  color: white;
  border: none;
  padding: 10px 20px;
  margin-bottom: 20px;
  cursor: pointer;
  border-radius: 4px;
}

.add-item-btn:hover {
  background-color: #2980b9;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  border: 1px solid #e0e0e0;
  padding: 12px;
  text-align: left;
}

th {
  background-color: #f2f2f2;
}

.action-btn {
  padding: 8px 12px;
  margin-right: 10px;
  border: none;
  cursor: pointer;
  border-radius: 4px;
}

.edit {
  background-color: #2ecc71;
  color: white;
}

.edit:hover {
  background-color: #27ae60;
}

.delete {
  background-color: #e74c3c;
  color: white;
}

.delete:hover {
  background-color: #c0392b;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  font-weight: bold;
  color: #333;
}

.form-control {
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.cover-thumbnail {
  width: 100px;
  height: 50px;
  object-fit: cover;
  border-radius: 4px;
}

.cover-preview {
  margin-top: 10px;
  border-radius: 4px;
}
</style>