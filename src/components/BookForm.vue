<template>
    <div class="book-form">
      <form @submit.prevent="saveBook">
        <div class="form-group">
          <label for="name">Tên sách:</label>
          <input type="text" v-model="localBook.name" required class="form-control" />
        </div>
        <div class="form-group">
          <label for="author">Tác giả:</label>
          <input type="text" v-model="localBook.author" required class="form-control" />
        </div>
        <div class="form-group">
          <label for="genre">Thể loại:</label>
          <input type="text" v-model="localBook.genre" required class="form-control" />
        </div>
        <div class="form-group">
          <label for="description">Mô tả:</label>
          <textarea v-model="localBook.description" required class="form-control"></textarea>
        </div>
        <div class="form-group">
          <label for="coverImage">URL Ảnh bìa:</label>
          <input type="text" v-model="localBook.coverImage" required class="form-control" />
        </div>
        <button type="submit" class="btn btn-primary">Lưu</button>
        <button type="button" @click="$emit('cancel')" class="btn btn-secondary">Hủy</button>
      </form>
    </div>
  </template>
  
  <script>
  export default {
    name: 'BookForm',
    props: {
      book: {
        type: Object,
        default: () => ({
          name: '',
          author: '',
          genre: '',
          description: '',
          coverImage: ''
        })
      }
    },
    data() {
      return {
        localBook: { ...this.book }
      };
    },
    methods: {
      saveBook() {
        this.$emit('save', { ...this.localBook });
      }
    }
  };
  </script>
  
  <style scoped>
  .book-form {
    padding: 1rem;
  }
  
  .form-group {
    margin-bottom: 1rem;
  }
  
  .form-control {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  
  .btn {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  
  .btn-primary {
    background-color: #007bff;
    color: #fff;
  }
  
  .btn-secondary {
    background-color: #6c757d;
    color: #fff;
  }
  
  .btn:hover {
    opacity: 0.9;
  }
  </style>