<template>
  <div class="">
    <NavBar />
    <div class="py-4">
      <router-view />
    </div>
  </div>
</template>

<script>
import router from "../router"
import NavBar from "./components/NavBar.vue"
import { userService } from "../services/users.service"
export default {
  data() {
    return {
      user_id: localStorage.getItem('user_id'),
      logged: false,
    }
  },
  beforeMount() {
    if (this.user_id) {
      this.getUser(this.user_id)
    } 
  },
  methods: {
    getUser(id) {
      userService.getUser(id)
        .then((res) => {
          this.logged = true
        })
        .catch((err) => {
          if (err.response.status == 404) {
            this.logged = false
            localStorage.clear();
          }
        })
    }
  },
  components: {
    NavBar,
    router
  }
}
</script>

<style scoped></style>