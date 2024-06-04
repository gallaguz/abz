<template>
    <div id="app">
        <nav>
            <router-link to="/">User List</router-link>
            <router-link to="/register">Register New User</router-link>
        </nav>
        <router-view/>
    </div>
</template>

<script>
export default {
    name: 'App',
};
</script>

<style>
#app {
    font-family: Arial, sans-serif;
}

nav {
    margin-bottom: 20px;
}

nav a {
    margin-right: 10px;
}
</style>

