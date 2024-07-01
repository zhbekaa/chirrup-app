<template>
    <div class="d-flex justify-content-center align-items-center" v-if="user_id != client_id">
        <button v-if="!isFollowing" class="btn btn-outline-primary" v-on:click="handleFollow(user_id)">
            Follow
        </button>
        <button v-if="isFollowing" class="btn btn-outline-danger"
            v-on:click="() => { isFollowing = !isFollowing; handleUnfollow(user_id) }">
            Unfollow
        </button>
    </div>
</template>

<script>
import { userService } from '../../services/users.service'
export default {
    props: [
        'user_id',
        'client_id'
    ],
    data() {
        return {
            isFollowing: false,
        }
    },
    methods: {
        handleFollow(id) {
            userService.follow(id)
                .then(res => {
                    this.isFollowing = true;
                })
                .catch(err => {
                    if (err.response.status == 401) window.location.replace('/login')
                    console.log(err)
                })
        },
        handleUnfollow(id) {
            userService.unfollow(id)
                .then(res => {
                    this.isFollowing = false;
                })
                .catch(err => {
                    console.log(err)
                })

        }
    },

    beforeMount() {
        userService.getUser(this.user_id)
            .then((res) => {
                this.followers = res.followers;
            })
            .then(() => {
                this.followers.map((follower) => {
                    if (follower.user_id == this.client_id) {
                        this.isFollowing = true;
                    }
                })
            })
            .catch((err) => {
                console.log(err)
            })
    },
}
</script>