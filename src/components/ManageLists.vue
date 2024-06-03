<template>
    <div class="manage-lists section">
      <h2>Quản Lý Sách</h2>
  
      <div class="search-bar">
        <input
          v-model="searchQuery"
          placeholder="Tìm kiếm theo tên, tác giả, hoặc thể loại"
          class="search-input"
        />
      </div>
  
      <button @click="showAddBookForm = true" class="btn btn-add">
        Thêm Sách Mới
      </button>
  
      <div v-if="showAddBookForm" class="modal">
        <div class="modal-content">
          <span class="close" @click="showAddBookForm = false">&times;</span>
          <BookForm @save="addBook" @cancel="showAddBookForm = false" />
        </div>
      </div>
  
      <div class="books-grid">
        <div v-for="book in filteredBooks" :key="book.id" class="book-card">
          <img :src="book.coverImage" alt="Cover Image" class="cover-image" />
          <div class="book-details">
            <h3>{{ book.name }}</h3>
            <p><strong>Tác giả:</strong> {{ book.author }}</p>
            <p><strong>Thể loại:</strong> {{ book.genre }}</p>
            <div class="buttons">
              <button @click="editBook(book)" class="btn btn-edit">Sửa</button>
              <button @click="deleteBook(book.id)" class="btn btn-delete">Xóa</button>
            </div>
          </div>
        </div>
      </div>
  
      <div v-if="showEditBookForm" class="modal">
        <div class="modal-content">
          <span class="close" @click="showEditBookForm = false">&times;</span>
          <BookForm :book="selectedBook" @save="updateBook" @cancel="showEditBookForm = false" />
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import BookForm from './BookForm.vue';
  
  export default {
    name: 'ManageLists',
    components: {
      BookForm,
    },
    data() {
      return {
        books: [],
        searchQuery: '',
        showAddBookForm: false,
        showEditBookForm: false,
        selectedBook: null,
      };
    },
    computed: {
      filteredBooks() {
        const query = this.searchQuery.toLowerCase();
        return this.books.filter(
          (book) =>
            book.name.toLowerCase().includes(query) ||
            book.author.toLowerCase().includes(query) ||
            book.genre.toLowerCase().includes(query)
        );
      },
    },
    methods: {
      addBook(book) {
        book.id = Date.now();
        this.books.push(book);
        this.showAddBookForm = false;
      },
      editBook(book) {
        this.selectedBook = book;
        this.showEditBookForm = true;
      },
      updateBook(updatedBook) {
        const index = this.books.findIndex((book) => book.id === updatedBook.id);
        if (index !== -1) {
          this.books.splice(index, 1, updatedBook);
        }
        this.showEditBookForm = false;
        this.selectedBook = null;
      },
      deleteBook(id) {
        this.books = this.books.filter((book) => book.id !== id);
      },
    },
  };
  </script>
  
  <style scoped>
  .manage-lists {
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
  
  .btn-add {
    background-color: #28a745;
    color: #fff;
    margin-bottom: 2rem;
  }
  
  .btn-edit {
    background-color: #ffc107;
    color: #fff;
  }
  
  .btn-delete {
    background-color: #dc3545;
    color: #fff;
  }
  
  .btn:hover {
    opacity: 0.9;
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
  </style>