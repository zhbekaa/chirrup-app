<template>
    <div class="container">
        <em v-if="loading">Loading...</em>
        <div class="d-flex justify-content-between align-items-center">

            <div class="d-flex align-items-center gap-3">
                <font-awesome-icon icon="circle-user" style="height: 50px;" />
                <div>
                    <h3> {{ post.author?.first_name + " " + post.author?.last_name }} </h3>
                    <a :href="'/users/' + post.author?.user_id" style="color: black; text-decoration: none;"
                        onmouseover="this.style.textDecoration='underline';" onmouseout="this.style.textDecoration='none';">
                        @{{ post.author?.username }} </a>

                </div>
            </div>

            <button v-if="post.author?.user_id == user_id" class="btn  btn-outline-dark" data-bs-toggle="dropdown"
                aria-expanded="false">
                <font-awesome-icon icon="ellipsis-vertical" />
            </button>

            <div class="dropdown-menu dropdown-menu-end">
                <button v-on:click="editing()" class="btn btn-primary dropdown-item">
                    {{ edit ? "Discard Changes" : "Edit Post" }} </button>
                <button class="dropdown-item btn d-flex justify-content-between " style="color:red" data-bs-toggle="modal"
                    data-bs-target="#deleteModal">Delete
                    <font-awesome-icon icon="trash-can" />
                </button>
            </div>

        </div>
        <div v-show="!edit" class="container py-3">

            <div>
                <p> {{ post.text }} </p>
                <em> {{ date }} </em>
            </div>

            <div class="d-flex justify-content-end">
                <div class="btn-group">
                    <button class="btn btn-outline-danger col" id="like-button" v-on:click="handleClick()">
                        <font-awesome-icon icon="heart" class="text-white-30" />
                        {{ this.likesNum }}
                    </button>
                    <button class="btn col" data-bs-toggle="modal" data-bs-target="#LikesModal">
                        <font-awesome-icon icon="ellipsis-vertical" />

                    </button>
                    <!-- <button type="button" 
                    class="btn dropdown-toggle dropdown-toggle-split" data-bs-toggle="dropdown" aria-expanded="false">
                    </button> -->
                    <ul class="dropdown-menu dropdown-menu-end">
                        <li v-for="user in post.likes" class="menu-item container">
                            <UserCard :user="user" />
                        </li>
                    </ul>
                </div>
            </div>

        </div>


        <form v-show="edit" action="" @submit.prevent="handleEdit()">
            <div class="form-floating mt-3">
                <textarea class="form-control mb-3" placeholder="Edit you post" id="floatingTextarea" v-model="inputText"
                    @input="adjustTextareaHeight" ref="textareaRef"></textarea>
                <label for="floatingTextarea" class="form-label">Edit Post:</label>
            </div>
            <button class="btn btn-outline-primary float-end">Edit</button>
        </form>
        <br>
        <UsersModal :users="post.likes" :header="'Likes'" />

        <!-- Delete Modal -->
        <div class="modal fade" id="deleteModal" tabindex="-1" aria-labelledby="deleteModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="deleteModalLabel">Delete this post?</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        This action cannot be undone
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" v-on:click="delete_post()" class="btn btn-outline-danger">Delete</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import router from '../../router';
import { postService } from '../../services/posts.service';
import { userService } from '../../services/users.service';
import UserCard from './UserCard.vue';
import UsersModal from './UsersModal.vue';
export default {
    data() {
        return {
            post: {},
            user_id: localStorage.getItem('user_id'),
            user: {},
            logged: false,
            err: "",
            liked: false,
            likeHover: false,
            loading: true,
            likesNum: 0,
            edit: false,
            date: '',
            inputText: "",
        }
    },
    mounted() {
        if (this.user_id) {
            userService.getUser(this.user_id)
                .then(res => {
                    this.user = res;
                })
                .catch(err => {
                    console.log(err)
                })
        }


        postService.getSinglePost(this.$route.params.id)
            .then((res) => {
                if (res) {
                    this.post = res;
                    this.loading = false;
                    this.logged = (localStorage.getItem('user_id') != null);
                    this.date = new Date(this.post.timestamp).toLocaleString('en-GB', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                    });
                    // this.date = newDate.getHours() + ':' + newDate.getMinutes() + "º" + newDate.getDate() + "/" +  newDate.getUTCMonth() + '/' + newDate.getFullYear();
                }
            })
            .then(() => {
                this.post.likes?.map((user) => {
                    if (user.user_id == localStorage.getItem('user_id')) this.liked = true
                })
                this.likesNum = this.post.likes.length
            })
            .catch((err) => {
                router.push('/*')
            })
    },
    methods: {
        handleClick() {
            if (!this.logged) alert('Login To Like')
            else {
                this.liked ? this.handleDeleteLike() : this.handleLike();
                this.liked = !this.liked
            }
        },
        handleLike() {
            postService.addLike(this.post.post_id)
                .then(() => {
                    this.post.likes?.push({
                        first_name: this.user?.first_name,
                        last_name: this.user?.last_name,
                        user_id: this.user_id,
                        username: this.user?.username,
                    })
                    this.likesNum++;
                })
                .catch((err) => {
                    console.log(err)
                })
        },
        handleDeleteLike() {
            postService.deleteLike(this.post.post_id)
                .then(() => {
                    this.post.likes = this.post.likes?.filter((like) => 
                        like?.user_id != this.user_id
                    )
                    this.likesNum--;
                })
                .catch((err) => {
                    console.log(err)
                })
        },
        editing() {
            this.edit = !this.edit;
            this.inputText = this.post.text;
        },
        handleEdit(e) {
            postService.editPost(this.inputText, this.post.post_id)
                .then((res) => {
                    alert('Post edited!')
                    window.location.reload();
                })
                .catch((err) => {
                    console.log(err)
                    alert('Invalid data!')
                })
        },
        delete_post() {
            postService.deletePost(this.post.post_id)
                .then((res) => {
                    window.location.replace("/");
                })
                .catch((err) => {
                    console.log(err)
                })
        },
        adjustTextareaHeight() {
            const textarea = this.$refs.textareaRef;
            textarea.style.height = "auto";
            textarea.style.height = textarea.scrollHeight + "px";
        },
    },
    components: {
        UserCard,
        UsersModal
    }
}
</script>

<style></style>