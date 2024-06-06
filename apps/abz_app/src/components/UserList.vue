<template>
  <div class="user-list">
    <h2>Users List</h2>
    <div class="pagination-controls">
      <button @click="loadPreviousPage" :disabled="!prevUrl">Previous Page</button>
      <button @click="loadNextPage" :disabled="!nextUrl">Next Page</button>
      <button @click="loadMore" :disabled="!nextUrl">Show more</button>
    </div>
    <div class="user-cards">
      <div v-for="user in users" :key="user.id" class="user-card">
        <div class="user-photo">
          <img :src="user.photo" alt="User photo"/>
        </div>
        <div class="user-info">
          <p><strong>Name:</strong> {{ user.name }}</p>
<!--          <p><strong>Email:</strong> {{ user.email }}</p>-->
<!--          <p><strong>Phone:</strong> {{ user.phone }}</p>-->
<!--          <p><strong>Position:</strong> {{ user.position }}</p>-->
          <router-link :to="{ name: 'UserDetail', params: { id: user.id } }">Details</router-link>
        </div>
      </div>
    </div>
    <div class="pagination-controls">
      <button @click="loadPreviousPage" :disabled="!prevUrl">Previous Page</button>
      <button @click="loadNextPage" :disabled="!nextUrl">Next Page</button>
      <button @click="loadMore" :disabled="!nextUrl">Show more</button>
    </div>
  </div>
</template>

<script>
import axios from '../axios';

export default {
  data() {
    return {
      users: [],
      nextUrl: '',
      prevUrl: ''
    };
  },
  created() {
    this.fetchUsers(`/users?page=1&count=6`);
  },
  methods: {
    fetchUsers(url, more = false) {
      axios.get(url)
          .then(response => {
            this.users = more ? this.users.concat(response.data.users) : response.data.users;
            this.nextUrl = response.data.links.next_url;
            this.prevUrl = response.data.links.prev_url;
          })
          .catch(error => {
            console.log(error);
          });
    },
    loadNextPage() {
      if (this.nextUrl) {
        this.fetchUsers(this.nextUrl);
      }
    },
    loadPreviousPage() {
      if (this.prevUrl) {
        this.fetchUsers(this.prevUrl);
      }
    },
    loadMore() {
      if (this.nextUrl) {
        this.fetchUsers(this.nextUrl, true);
      }
    }
  }
};
</script>

<style scoped>
.user-list {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.header-options {
  margin-bottom: 20px;
}

.pagination-controls {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin: 20px 0;
}

.user-cards {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: space-between;
}

.user-card {
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: calc(200px);
}

.user-photo img {
  max-width: 100%;
  margin-bottom: 10px;
}

.user-info {
  text-align: left;
}
</style>
