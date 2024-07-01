<template>
    <div class="container-lg">
        <div class="row px-2">
            <div class="d-flex justify-content-between">
                <div>
                    <h1>
                        {{ user.first_name + " " + user.last_name }}
                    </h1>
                    <h3 style="opacity: 50%;">
                        @{{ user.username }}
                    </h3>
                </div>
                <FollowButton :user_id="$route.params.id" :client_id="client_id" />
            </div>
            <div v-if="!isMD" class="d-flex gap-2">
                <a data-bs-toggle="modal" data-bs-target="#FollowersModal" >
                    · <a href="#" class="text-dark"> {{ user.followers?.length }} Followers</a>
                </a>
                <a data-bs-toggle="modal" data-bs-target="#FollowingModal">
                    · <a href="#" class="text-dark"> {{ user.following?.length }} Following</a>
                </a>
            </div>
            <UsersModal :users="user.followers" :header="'Followers'" />
            <UsersModal :users="user.following" :header="'Following'" />
            <div class="col-md-4" v-if="isMD">
                <div v-if="user.following?.length">
                    <h3>Following</h3>
                    <UserCard v-for="following in user.following" :key="following.user_id" :user="following" />
                </div>
                <div v-if="user.followers?.length">
                    <h3>Followers</h3>
                    <UserCard v-for="follower in user.followers" :key="follower.user_id" :user="follower" />
                </div>
            </div>
            <div class="col-md-8">
                <div v-if="user.posts">
                    <h3>Posts</h3>
                    <PostCard v-for="post in user.posts" :key="post.post_id" :post="post" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { userService } from '../../services/users.service';
import PostCard from '../components/PostCard.vue';
import UserCard from '../components/UserCard.vue';
import FollowButton from '../components/FollowButton.vue';
import UsersModal from '../components/UsersModal.vue';
export default {
    data() {
        return {
            user: {},
            client_id: localStorage.getItem('user_id'),
            isMD: window.innerWidth > 768,
        }
    },
    beforeMount() {
        userService.getUser(this.$route.params.id)
            .then((res) => {
                this.user = res;
            })
            .catch((err) => {
                console.log(err)
            })
    },
    created() {
        window.addEventListener('resize', this.handleResize);
    },
    destroyed() {
        window.removeEventListener('resize', this.handleResize);
    },
    methods: {
        handleResize() {
            this.isMD = window.innerWidth > 768;
        },
    },
    components: {
        PostCard,
        UserCard,
        FollowButton,
        UsersModal
    }
}
</script>