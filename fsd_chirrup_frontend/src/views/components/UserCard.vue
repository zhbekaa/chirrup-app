<template>
    <div class="card my-3 px-3">
        <div class="d-flex justify-end">
            <div class="card-body">
                <a :href="'/users/' + user.user_id" style="text-decoration: none;"
                    onmouseover="this.style.textDecoration='underline';" onmouseout="this.style.textDecoration='none';">
                    <h4 class="card-title text-dark"> {{ user.first_name + " " +  user.last_name }} </h4>
                    <p class="card-text text-secondary">@{{ user.username }}</p>
                </a>
            </div>
            <FollowButton :user_id="user.user_id" :client_id="client_id"/>
        </div>
    </div>
</template>

<script>
import FollowButton from './FollowButton.vue';
export default {
    props: [
        'user'
    ],
    data() {
        return {
            client_id: localStorage.getItem('user_id'),
            followers: []
        }
    },
    components: {
        FollowButton
    }
}
</script>