<template>
    <div class="container">
        <UserCard v-if="users.length" v-for="user of users" :user="user" />
        <div v-else class="d-flex justify-content-center"> There are no users found... </div>
    </div>
</template>

<script>

import { userService } from '../../services/users.service';
import UserCard from '../components/UserCard.vue';
export default {
    components: {
        UserCard
    },
    data() {
        return {
            users: [],
            query: this.$route.query.input
        }
    },
    beforeMount() {
        userService.search(this.query)
            .then(res => {
                this.users = res
            })
            .catch(err => console.log(err))

    },
}
</script>