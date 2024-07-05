<template>
  <div class="category-management">
    <h2>Category Management</h2>
    <button @click="showAddForm" class="add-category-btn">Add Category</button>
    
    <!-- Add Category Form -->
    <div v-if="showAddFormFlag" class="category-form">
      <h3>Add Category</h3>
      <form @submit.prevent="addCategory">
        <div class="form-group">
          <label for="add-name">Name:</label>
          <input type="text" class="form-control" id="add-name" v-model="addFormData.name" required>
        </div>
        <div class="form-group">
          <label for="add-description">Description:</label>
          <input type="text" class="form-control" id="add-description" v-model="addFormData.description" required>
        </div>
        <button type="submit" class="btn btn-primary">Save</button>
        <button type="button" @click="cancelAdd" class="btn btn-secondary">Cancel</button>
      </form>
    </div>
    
    <!-- Edit Category Form -->
    <div v-if="showEditFormFlag" class="category-form">
      <h3>Edit Category</h3>
      <form @submit.prevent="updateCategory">
        <div class="form-group">
          <label for="edit-name">Name:</label>
          <input type="text" class="form-control" id="edit-name" v-model="editFormData.name" required>
        </div>
        <div class="form-group">
          <label for="edit-description">Description:</label>
          <input type="text" class="form-control" id="edit-description" v-model="editFormData.description" required>
        </div>
        <button type="submit" class="btn btn-primary">Save</button>
        <button type="button" @click="cancelEdit" class="btn btn-secondary">Cancel</button>
      </form>
    </div>
    
    <table class="table mt-3">
      <thead>
        <tr>
          <th>Name</th>
          <th>Description</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="category in categories" :key="category._id" >
          <td>{{ category.name }}</td>
          <td>{{ category.description }}</td>
          <td>
            <button @click="showEditForm(category)" class="btn btn-sm btn-primary">Edit</button>
            <button @click="deleteCategory(category._id)" class="btn btn-sm btn-danger">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      categories: [],
      addFormData: {
        name: '',
        description: ''
      },
      editFormData: {
        id: null,
        name: '',
        description: ''
      },
      showAddFormFlag: false,
      showEditFormFlag: false,
      isPublished: true // Adjust based on your logic
    };
  },
  mounted() {
    this.fetchCategories();
  },
  methods: {
    async fetchCategories() {
      try {
        const response = await axios.get('https://book-management-3td9.onrender.com/api/category', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
          }
        });
        this.categories = response.data.data.docs;
      } catch (error) {
        console.error('Error fetching categories:', error);
        alert('Failed to fetch categories.');
      }
    },
    showAddForm() {
      this.showAddFormFlag = true;
      this.showEditFormFlag = false;
      this.resetFormData();
    },
    async addCategory() {
      try {
        const { name, description } = this.addFormData;
        let requestData = {
          categories: [{
            name,
            description,
            isPublished: this.isPublished
          }]
        };

        const response = await axios.post('https://book-management-3td9.onrender.com/api/category', requestData, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
          }
        });

        this.categories.push(response.data.data[0]); // Assuming API returns the added category
        this.cancelAdd();
      } catch (error) {
        console.error('Error adding category:', error);
        alert('Failed to add category.');
      }
    },
    cancelAdd() {
      this.showAddFormFlag = false;
      this.resetFormData();
    },
    showEditForm(category) {
      this.showEditFormFlag = true;
      this.showAddFormFlag = false;
      this.editFormData.id = category._id;
      this.editFormData.name = category.name;
      this.editFormData.description = category.description;
    },
    async updateCategory() {
      try {
        const { id, name, description } = this.editFormData;
        await axios.patch(`https://book-management-3td9.onrender.com/api/category/${id}`, {
          name,
          description
        }, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
          }
        });
        const updatedCategory = {
          _id: id,
          name,
          description
        };
        const index = this.categories.findIndex(cat => cat._id === id);
        if (index !== -1) {
          this.$set(this.categories, index, updatedCategory);
        }
        this.cancelEdit();
      } catch (error) {
        console.error('Error updating category:', error);
        alert('Failed to update category.');
      }
    },
    cancelEdit() {
      this.showEditFormFlag = false;
      this.resetFormData();
    },
    async deleteCategory(id) {
      try {
        await axios.delete(`https://book-management-3td9.onrender.com/api/category/${id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
          }
        });
        this.categories = this.categories.filter(cat => cat._id !== id);
      } catch (error) {
        console.error('Error deleting category:', error);
        alert('Failed to delete category.');
      }
    },
    resetFormData() {
      this.addFormData = {
        name: '',
        description: ''
      };
      this.editFormData = {
        id: null,
        name: '',
        description: ''
      };
    }
  }
};
</script>

<style scoped>
.category-management {
  margin-left: 270px;
  padding: 20px;
}

h2 {
  margin-bottom: 20px;
}

.add-category-btn {
  background-color: #3498db;
  color: white;
  border: none;
  padding: 10px 20px;
  margin-bottom: 20px;
  cursor: pointer;
}

.add-category-btn:hover {
  background-color: #2980b9;
}

.category-form {
  margin-bottom: 20px;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.table thead th {
  background-color: #f2f2f2;
  color: black;
  text-align: left;
  padding: 10px;
  border: 1px solid #ddd;
}

.table tbody tr {
  border-bottom: 1px solid #ddd;
  transition: background-color 0.3s ease;
}

.table tbody tr:hover {
  background-color: #f2f2f2;
}

.table td {
  padding: 10px;
  border: 1px solid #ddd;
}

.btn-primary {
  background-color: #3498db;
  border-color: #3498db;
}

.btn-primary:hover {
  background-color: #2980b9;
  border-color: #2980b9;
}

.btn-secondary {
  background-color: #95a5a6;
  border-color: #95a5a6;
}

.btn-secondary:hover {
  background-color: #7f8c8d;
  border-color: #7f8c8d;
}
</style>