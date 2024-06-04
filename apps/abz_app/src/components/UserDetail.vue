<template>
  <div class="user-detail" v-if="user">
    <h2>User Details</h2>
    <img :src="user.photo" alt="User photo" class="user-photo"/>
    <p><strong>Name:</strong> {{ user.name }}</p>
    <p><strong>Email:</strong> {{ user.email }}</p>
    <p><strong>Phone:</strong> {{ user.phone }}</p>
    <p><strong>Position:</strong> {{ user.position }}</p>
  </div>
</template>

<script>
import axios from '../axios';

export default {
  data() {
    return {
      user: null
    };
  },
  created() {
    this.fetchUser();
  },
  methods: {
    fetchUser() {

      axios.get(`/users/${this.$route.params.id}`)
          .then(response => {
            this.user = response.data.user;
          })
          .catch(error => {
            console.log(error);
          });
    }
  }
};
</script>

<style scoped>
.user-detail {
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.header-options {
  margin-bottom: 20px;
}

.user-photo {
  display: block;
  max-width: 100px;
  margin: 0 auto 20px;
}
</style>
