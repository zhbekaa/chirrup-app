<template>
    <div class="d-flex container justify-content-center flex-column align-items-center mt-3 gap-4">
        <h1 class="">
            Login
        </h1>
        <form @submit.prevent="handleSubmit" class="form d-flex flex-column gap-3 w-100 align-items-center" style="max-width: 800px;">
            <div class="form-floating w-100">
                <input class="form-control" type="text" name="username" id="username" autocomplete="current-username"
                placeholder="Username" v-model="username">
                <label for="username" class="form-label left-25">Username </label>
            </div>
            <div class="form-floating w-100">
                <input class="form-control" type="password" name="password" id="password" autocomplete="current-password"
                    placeholder="Password" v-model="password">
                <label for="password" class="form-label left-25"> Password </label>
            </div>
            <div class="alert alert-danger d-flex justify-content-center w-100" role="alert" v-if="error">
                {{ error }}
            </div>
            <button class="btn btn-primary w-50">Login</button>
            
        </form>
        <span>
            Don't have an account?
            <a href="/signup">Sign Up</a>
        </span>
    </div>
</template>

<script>

import { userService } from '../../services/users.service';
import Signup from './Signup.vue';
import router from "../../router"

export default {

    data() {
        return {
            username: "",
            password: "",
            submitted: false,
            error: ""
        }
    },
    methods: {
        handleSubmit() {
            this.error = ""
            this.submitted = true;
            userService.login(this.username, this.password)
                .then((res) => {
                    alert("Logged In Successfull");
                    window.location.href = '/';
                    localStorage.setItem("user_id", res.user_id);
                    localStorage.setItem("X-Authorization", res.session_token);
                })
                .catch((err) => {
                    console.log(err)
                    if (!this.username || !this.password) this.error = "Please fill in all the fields!";
                    else this.error = err.response.data.error_message
                })
        }
    }
}
</script>