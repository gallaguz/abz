// src/components/UserForm.vue
<template>
  <div class="user-form">
    <h2>Register New User</h2>
    <form @submit.prevent="registerUser">
      <div class="form-group">
        <label>Name:</label>
        <input type="text" v-model="name" required />
      </div>
      <div class="form-group">
        <label>Email:</label>
        <input type="email" v-model="email" required />
      </div>
      <div class="form-group">
        <label>Phone:</label>
        <input type="tel" v-model="phone" required />
      </div>
      <div class="form-group">
        <label>Position:</label>
        <select v-model="position_id" required>
          <option v-for="position in positions" :key="position.id" :value="position.id">{{ position.name }}</option>
        </select>
      </div>
      <div class="form-group">
        <label>Photo:</label>
        <input type="file" @change="onFileChange" required />
      </div>
      <div class="form-group">
        <label>
          <input type="checkbox" v-model="autoGetToken" /> Auto Get Token
        </label>
      </div>
      <div class="form-actions">
        <button type="submit">Register</button>
        <button type="button" @click="getToken">Get Token</button>
      </div>
    </form>
  </div>
</template>

<script>
import axios from '../axios';

export default {
  data() {
    return {
      name: '',
      email: '',
      phone: '',
      position_id: null,
      photo: null,
      positions: [],
      autoGetToken: false,
      token: ''
    };
  },
  created() {
    this.fetchPositions();
    if (this.autoGetToken) {
      this.getToken();
    }
  },
  methods: {
    fetchPositions() {
      axios.get('/positions')
          .then(response => {
            this.positions = response.data.positions;
          })
          .catch(error => {
            console.log(error);
          });
    },
    onFileChange(e) {
      this.photo = e.target.files[0];
    },
    async getToken() {
      try {
        const response = await axios.get('/token');
        this.token = response.data.token;
      } catch (error) {
        console.log(error);
      }
    },
    async registerUser() {
      if (this.autoGetToken && !this.token) {
        await this.getToken();
      }
      const formData = new FormData();
      formData.append('name', this.name);
      formData.append('email', this.email);
      formData.append('phone', this.phone);
      formData.append('position_id', this.position_id);
      formData.append('photo', this.photo);

      const headers = {
        'Token': this.token,
        'Content-Type': 'multipart/form-data',
      };

      axios.post('/users/register', formData, { headers })
          .then(response => {
            console.log(response.data);
            alert('User registered successfully!');
          })
          .catch(error => {
            console.log(error.response.data);
            alert('User registration failed!');
          });
    }
  }
};
</script>

<style scoped>
.user-form {
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
}

.form-actions {
  display: flex;
  gap: 10px;
  justify-content: center;
}
</style>
