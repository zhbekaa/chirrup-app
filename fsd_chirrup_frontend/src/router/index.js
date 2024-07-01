import { createRouter, createWebHistory } from "vue-router";
import Signup from "../views/pages/Signup.vue";
import Log from "../views/pages/Log.vue";

import SearchUsers from "../views/pages/SearchUsers.vue";
import Feed from "../views/pages/Feed.vue";
import SinglePost from "../views/components/SinglePost.vue";
import Profile from "../views/pages/Profile.vue";
import PostForm from "../views/components/PostForm.vue";
import Drafts from "../views/pages/Drafts.vue"
import NotFound from "../views/components/NotFound.vue";
const routes = [
  { path: "/", component: Feed },
  { path: "/login", component: Log },
  { path: "/signup", component: Signup },
  { path: "/posts/:id", component: SinglePost },
  { path: "/users/:id", component: Profile },
  { path: "/posts", component: PostForm },
  { path: "/search", component: SearchUsers },
  { path: "/drafts", component: Drafts },
  { path: "/:catchAll(.*)", component: NotFound },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
