// src/router.js

import { createRouter, createWebHistory } from 'vue-router';
import UserList from './components/UserList.vue';
import UserForm from './components/UserForm.vue';
import UserDetail from './components/UserDetail.vue';

const routes = [
    {
        path: '/',
        name: 'UserList',
        component: UserList
    },
    {
        path: '/register',
        name: 'UserForm',
        component: UserForm
    },
    {
        path: '/user/:id',
        name: 'UserDetail',
        component: UserDetail,
        props: true
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;
