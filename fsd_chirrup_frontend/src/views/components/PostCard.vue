<template>
    <div :key="post.post_id" class="card my-2" style="width: 100%;">
        <router-link :to="'/posts/' + post.post_id" class="card-text" style="text-decoration: none">
            <div class="card-body">
                <router-link :to="'/users/' + post.author.user_id" style="text-decoration: none; width: fit-content;"
                    class="flex col">
                    <h3 class="card-title text-dark" style="width: fit-content;"
                        onmouseover="this.style.textDecoration='underline';" onmouseout="this.style.textDecoration='none';">
                        {{ post.author.first_name + " " + post.author.last_name }}
                    </h3>
                    <h6 class="card-subtitle mb-2 text-secondary" style="width: fit-content;"
                        onmouseover="this.style.textDecoration='underline';" onmouseout="this.style.textDecoration='none';">
                        @{{ post.author.username }}
                    </h6>
                </router-link>
                <div class="card-text text-dark">
                    {{ post.text }}
                </div>
            </div>
        </router-link>
    </div>
</template>

<script>
export default {
    props: [
        'post'
    ]
}
</script>