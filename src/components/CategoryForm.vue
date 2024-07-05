<!-- CategoryForm.vue -->
<template>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="name">Category Name</label>
        <input
          type="text"
          id="name"
          v-model="categoryData.name"
          required
          class="form-control"
        />
      </div>
      <div class="buttons">
        <button type="submit" class="btn btn-save">Save</button>
        <button type="button" @click="$emit('cancel')" class="btn btn-cancel">Cancel</button>
      </div>
    </form>
  </template>
  
  <script>
  export default {
    name: 'CategoryForm',
    props: {
      category: {
        type: Object,
        default: () => ({ name: '' }),
      },
    },
    data() {
      return {
        categoryData: { ...this.category },
      };
    },
    methods: {
      handleSubmit() {
        this.$emit('save', this.categoryData);
      },
    },
  };
  </script>
  
  <style scoped>
  .form-group {
    margin-bottom: 1rem;
  }
  .form-control {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  .buttons {
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
  }
  .btn-save {
    background-color: #28a745;
    color: #fff;
  }
  .btn-cancel {
    background-color: #dc3545;
    color: #fff;
  }
  </style>