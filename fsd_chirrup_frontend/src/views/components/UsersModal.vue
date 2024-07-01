<template>
    <div class="modal fade" :id="header + 'Modal'" tabindex="-1" aria-labelledby="usersModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">{{ header }}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <UserCard v-if="users?.length" v-for="user of users" :user="user" />
                    <div v-else class="d-flex justify-content-center"> ... </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import UserCard from './UserCard.vue';
export default {
    props: [
        "users",
        "header"
    ],
    data() {
        return {

        }
    },
    components: {
        UserCard
    }
}
</script>