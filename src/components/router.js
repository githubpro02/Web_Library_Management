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

const Update_Profile = () =>
    import("./Update_Profile.vue")

const ManageLists = () =>
    import("./ManageLists.vue")

const ChangePassword =() =>
    import("./ChangePassword.vue")

const StatisticsReports =() =>
    import("./StatisticsReports.vue")

const Admin_Dashboard =() =>
    import("./Admin_Dashboard.vue") 

const User_Manage =() =>
    import("./User_Manage.vue")

const Category_Manage =() =>
    import("./Category_Manage.vue")

const Book_Manage =() =>
    import("./Book_Manage.vue")

const Payment_Manage =() =>
    import("./Payment_Manage.vue")

Vue.use(VueRouter)

export const router = new VueRouter({
    routes: [
        {
            path: '/',
            redirect: '/login'
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
            path: '/update_profile',
            name: 'Update_Profile',
            component: Update_Profile
        },

        {
            path: '/managelists',
            name: 'ManageLists',
            component: ManageLists
        },

        {
            path: '/changepassword',
            name: 'ChangePassword',
            component: ChangePassword
        },

        {
            path: '/statistics-reports',
            name: 'StatisticsReports',
            component: StatisticsReports
        },

        {
            path: '/admin_dashboard',
            name: 'Admin_Dashboard',
            component: Admin_Dashboard,
            children: [
                {
                  path: 'user_manage',
                  component: User_Manage
                },

                {
                    path: 'book_manage',
                    component: Book_Manage
                },

                {
                    path: 'category_manage',
                    component: Category_Manage
                },

                {
                    path: 'payment_manage',
                    component: Payment_Manage
                },
            ]
        },
        // {
        //     path: '/',
        //     redirect: '/admin_dashboard/user_manage'
        // }
    ]
})