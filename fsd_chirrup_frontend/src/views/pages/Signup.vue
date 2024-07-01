<template>
    <div class="d-flex justify-content-center flex-column align-items-center mt-3 gap-4 container">
        <h1>
            Sing Up
        </h1>
        <form @submit.prevent="handleSubmit" @change="error=''" class="row g-3 w-100 ">
            <div class="form-floating col-md-6">
                <input class="form-control" type="text" name="first_name" id="first_name" placeholder="First Name" v-model="first_name">
                <label for="first_name" class="form-label ms-2" :aria-required="true">First Name </label>
            </div>
            <div class="form-floating col-md-6">
                <input class="form-control" type="text" name="last_name" id="last_name" v-model="last_name" placeholder="Last Name">
                <label for="last_name" class="form-label ms-2">Last Name </label>
            </div>
            <div class="form-floating col-12">
                <input class="form-control" type="text" name="username" id="username" v-model="username" placeholder="Username">
                <label for="username" class="form-label ms-2">Username </label>
            </div>
            <div class="form-floating col-12">
                <input class="form-control" type="password" name="password" id="password" placeholder="Password" v-model="password">
                <label for="password" class="form-label ms-2"> Password </label>
            </div>
            <!-- <br /><br /> -->
            <div class="alert alert-danger d-flex justify-content-center w-100" role="alert" v-if="error">
                {{ error }}
            </div>
            <div class="d-flex justify-content-center">
                <button class="btn btn-primary w-50">Sign Up</button>
            </div>
        </form>
        <span>
            Already have an account?  
            <a href="/login">Login</a>
        </span>
    </div>
</template>

<script lang="js">

import { userService } from '../../services/users.service';
export default {
    data() {
        return {
            first_name: "",
            last_name: "",
            username: "",
            password: "",
            error: "",
            submitted: false
        }
    },
    methods: {
        handleSubmit(e) {
            this.error = ""
            this.submitted = true;
            const { first_name, last_name, username, password } = this
            const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,18}$/
            if (!first_name || !last_name || !username || !password) {
                this.error = 'Please fill in all of the fields!'
                return;
            }
            if (!(passwordPattern.test(password))) {
                this.error = "Password is not strong!"
                return;
            }
            userService.signup(this.first_name, this.last_name, this.username, this.password)
                .then((res) => {
                    alert("You signed up");
                    window.location.href = '/login'
                })
                .catch((err) => {
                    this.error = err
                })
            this.submitted = true
        }
    }
}
</script>