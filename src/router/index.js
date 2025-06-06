import { createRouter, createWebHistory } from "vue-router";

const routes = [
  // Login/Register Page (Guest only)
  {
    path: '/',
    component: () => import('../views/loginRegister.vue'),
    meta: { isGuest: true, equireAuth: false },
    name: "loginRegister"
  },
  // Login Page (Guest only)
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/login.vue'),
    meta: { isGuest: true, equireAuth: false },
  },
  {
    path: '/emailPasswordReset',
    name: 'emailPasswordReset',
    component: () => import('../views/emailPasswordReset.vue'),
    meta: { isGuest: true, equireAuth: false },
  },
  {
    path: '/resetPassword',
    name: 'resetPassword',
    component: () => import('../views/resetPassword.vue'),
    meta: { isGuest: true, equireAuth: false },
  },
  {
    path: '/verifyEmail',
    name: 'verifyEmail',
    component: () => import('../views/verifyEmailView.vue'),
    meta: { isGuest: true, equireAuth: false },
  },
  // Register Page (Guest only)
  {
    path: '/register',
    name: 'register',
    component: () => import('../views/register.vue'),
    meta: { isGuest: true, equireAuth: false },
  },
  // Dashboard (Authenticated users only)
  {
    path: '/dashboard',
    name: "dashboard",
    component: () => import('../views/dashboard.vue'),
    meta: { requireAuth: true, isGuest: false },
    children: [
      //profile tab
      { path: 'profile',  name: 'profile', component: () => import('../views/dashboardViews/profile.vue') },
      { path: 'newthing', name: 'newthing', component: () => import('../views/dashboardViews/newThing.vue') },
      { path: 'editThing', name: 'editThing', component: () => import('../views/dashboardViews/editThing.vue') },
      { path: 'seeThing', name: 'seeThing', component: () => import('../views/dashboardViews/seeThing.vue') },
      { path: 'editProfile',  name: 'editProfile', component: () => import('../views/dashboardViews/editProfile.vue') },

      // Swap Tab
      { path: 'swaps', name: 'swaps', component: () => import('../views/dashboardViews/swaps.vue') },

      // Chat Tab
      { path: 'chats', name: 'chats', component: () => import('../views/chats.vue') },
      {
        path: 'chat/',
        name: 'chat',
        component: () => import('../views/chatsViews/chatHeader.vue'),
        children: [
          { path: 'messages', name: 'messages', component: () => import('../views/chatsViews/messagesChat.vue') },
          { path: 'offers', name: 'offers', component: () => import('../views/chatsViews/offers.vue') },
          {
            path: 'watchOffer/',
            name: 'watchOffer',
            component: () => import('../views/chatsViews/lookAtOffer.vue'),
          },
          { path: 'makeOffer', name: 'makeOffer', component: () => import('../views/chatsViews/makeOfferView.vue') },
          { path: 'user', name: 'seeProfile', component: () => import('../views/chatsViews/otherUserProfile.vue') },
        ]
      }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

import store from '../store';
// Navigation Guard
router.beforeEach((to, from, next) => {
    if (to.meta.requireAuth && !store.getters.isAuthenticated) {
      next({ name: "loginRegister" }); // Redirect to login if not authenticated
    }
    else if (to.meta.isGuest && store.getters.isAuthenticated) {
      next({ name: "dashboard" }); // Redirect to dashboard if already logged in
    } else {
      next(); // Allow navigation
    }
});

export default router;
