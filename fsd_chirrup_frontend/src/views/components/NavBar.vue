<template>
    <nav class="h-30 navbar navbar-expand-md bg-dark border-bottom border-body px-3" data-bs-theme="dark">
        <div class="container-fluid">
            <a class="navbar-brand" href="/">Chirrup</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarSupportedContent">

                <ul v-if="id" class="navbar-nav me-auto mb-2 mb-lg-0">
                    <li class="nav-item">
                        <a class="nav-link active" aria-current="page" href="/">Feed</a>
                    </li>
                    <li class="nav-item">
                        <button class="nav-link" aria-current="page" data-bs-toggle="modal"
                            data-bs-target="#postModal">Post</button>
                    </li>
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown"
                            aria-expanded="false">
                            Account
                        </a>
                        <ul class="dropdown-menu dropdown-menu-end">
                            <li v-if="id"><a class="dropdown-item" :href="'/users/' + id">Profile</a></li>
                            <li v-if="id"><a class="dropdown-item" href="/drafts">Drafts</a></li>
                            <!-- <li><a class="dropdown-item" href="#">Another action</a></li> -->
                            <hr class="dropdown-divider">
                            <li><button class="dropdown-item" v-on:click="handleLogOut">Log Out</button></li>
                        </ul>
                    </li>
                   
                </ul>

                <ul v-if="!id" class="navbar-nav me-auto mb-2 mb-lg-0">
                    <li class="nav-item">
                        <a class="nav-link active" aria-current="page" href="/">Feed</a>
                    </li>
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown"
                            aria-expanded="false">
                            Account
                        </a>
                        <ul class="dropdown-menu">
                            <li><a class="dropdown-item" href="/login">Log In</a></li>
                            <li><a class="dropdown-item" href="/signup">Sign Up</a></li>
                        </ul>
                    </li>
                </ul>

                <form class="d-flex" @submit="handleSubmit">
                    <input class="form-control me-2" name="input" placeholder="Search other users..." @input="handleSearch"
                        aria-label="Search" v-model="input">
                </form>
            </div>
        </div>
    </nav>
    <div class="modal fade" id="postModal" tabindex="-1" aria-labelledby="postModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content container p-3">
                <PostForm />
            </div>
        </div>
    </div>
</template>

<script>
import router from '../../router';
import { userService } from '../../services/users.service';
import PostForm from './PostForm.vue';
export default {
    data() {
        return {
            input: "",
            id: localStorage.getItem('user_id'),
            isSearching: false,
            users: []
        }
    },
    methods: {
        handleSubmit() {
            router.push("/search?input" + this.input)
        },
        handleLogOut() {
            userService.logout()
                .then((res) => {
                    localStorage.clear()
                    alert(res.data)

                    window.location.reload();
                })
        }
    },
    components: {
        PostForm
    }
}

</script>