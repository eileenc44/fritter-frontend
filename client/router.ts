import Vue from 'vue';
import VueRouter from 'vue-router';
import FreetsPage from './components/Freet/FreetsPage.vue';
import AccountPage from './components/Account/AccountPage.vue';
import LoginPage from './components/Login/LoginPage.vue';
import ProfilePage from './components/Follow/ProfilePage.vue';
import GroupsPage from './components/Group/GroupsPage.vue';
import GroupPage from './components/Group/GroupPage.vue';
import NotFound from './NotFound.vue';

Vue.use(VueRouter);

const routes = [
  {path: '/', name: 'Home', component: FreetsPage},
  {path: '/account', name: 'Account', component: AccountPage},
  {path: '/login', name: 'Login', component: LoginPage},
  {path: '/users/:id', name: 'Profile', component: ProfilePage},
  {path: '/groups/:id', name: 'Group', component: GroupPage},
  {path: '/groups', name: 'Groups', component: GroupsPage},
  {path: '*', name: 'Not Found', component: NotFound}
];

const router = new VueRouter({routes});

/**
 * Navigation guards to prevent user from accessing wrong pages.
 */
router.beforeEach((to, from, next) => {
  if (router.app.$store) {
    if (to.name === 'Login' && router.app.$store.state.username) {
      next({name: 'Account'}); // Go to Account page if user navigates to Login and are signed in
      return;
    }

    if (to.name === 'Account' && !router.app.$store.state.username) {
      next({name: 'Login'}); // Go to Login page if user navigates to Account and are not signed in
      return;
    }

    if (to.name === 'Profile' && !router.app.$store.state.username) {
      next({name: 'Login'}); // Go to Login page if user navigates to Profile and are not signed in
      return;
    }

    if (to.name === 'Groups' && !router.app.$store.state.username) {
      next({name: 'Login'}); // Go to Login page if user navigates to Profile and are not signed in
      return;
    }

    if (to.name === 'Group' && !router.app.$store.state.username) {
      next({name: 'Login'}); // Go to Login page if user navigates to Profile and are not signed in
      return;
    }
  }

  next();
});

export default router;
