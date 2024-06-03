import Vue from 'vue';
// import Login from './Login.vue'
import VueRouter from 'vue-router';

const Login = () =>
    import("./Login.vue")

const Register = () =>
    import("./Register.vue")

const Forgot = () =>
    import("./ForgotPassword.vue")

const Homepage = () =>
    import("./Homepage.vue")

const ManageLists = () =>
    import("./ManageLists.vue")

const BookForm = () =>
    import("./BookForm.vue")

Vue.use(VueRouter)

export const router = new VueRouter({
    routes: [
        {
            path: '/',
            redirect: '/homepage'
        },
        {
            path: '/login',
            name: 'Login',
            component: Login
        },

        {
            path: '/register',
            name: 'Register',
            component: Register
        },

        {
            path: '/forgotpassword',
            name: 'ForgotPassword',
            component: Forgot
        },
        
        {
            path: '/homepage',
            name: 'Homepage',
            component: Homepage
        },

        {
            path: '/managelists',
            name: 'ManageLists',
            component: ManageLists
        },

        {
            path: '/bookform',
            name: 'BookForm',
            component: BookForm
        },
    ]
})

// const router = new VueRouter({
//     router,
//     mode: "history",
// })

// export default router;