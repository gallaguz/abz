<template>
    <div id="app">
        <nav>
            <router-link to="/">Users</router-link>
            <router-link to="/register">Register</router-link>
        </nav>
        <router-view/>
    </div>
</template>

<script>
export default {
    name: 'App',
    mounted() {
        document.title = "ABZ Test Assignment";
    }
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

