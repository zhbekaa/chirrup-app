<template>
    <em v-if="loading">Loading posts...</em>
    <div class="container">
        <PostForm v-if="id" />
        <ul v-if="posts.length" class="ps-0">
            <PostCard v-for="post in posts" :post="post" />
        </ul>
    </div>
</template>

<script>
import { postService } from '../../services/posts.service'
import PostCard from '../components/PostCard.vue'
import PostForm from '../components/PostForm.vue'
export default {
    data() {
        return {
            posts: [],
            error: "",
            logged: false,
            loading: true,
            id: localStorage.getItem('user_id')
        }
    },
    mounted() {
        postService.getFeed()
            .then(posts => {
                this.posts = posts;
                this.loading = false
            })
            .catch(err => {
                alert(err)
            })
    },
    components: {
        PostCard,
        PostForm
    }
}

</script>