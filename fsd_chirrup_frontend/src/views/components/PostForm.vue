<template>
    <div class="w-100 px-2">
        <form v-show="!submitted" action="" @submit.prevent="handleSubmit" class="form-floating row gap-3">
            <textarea class="form-control" placeholder="What's Up" type="text" name="text" ref="textArea" v-model="text"
                id="text"></textarea>
            <label for="text" class="form-label">What's Up?</label>
            <div class="d-flex justify-content-end gap-1">
                <button id="draft" class="btn btn-outline-secondary w-25" :disabled="!text"> Draft</button>
                <button id="submit" class="btn btn-outline-primary w-25" :disabled="!text"> Post </button>
            </div>
        </form>

    </div>
</template>

<script>
import { postService } from '../../services/posts.service';
import SinglePost from './SinglePost.vue';
export default {
    data() {
        return {
            text: "",
            submitted: false
        }
    },
    methods: {
        handleSubmit(e) {
            if (e.submitter.id == "draft")
                this.draft();
            else
                this.submit();
        },
        submit() {
            postService.addPost(this.text)
                .then((res) => {
                    this.submitted;
                    alert('Post added!')
                    window.location.href = '/posts/' + res.data.post_id;
                })
                .catch((err) => {
                    console.log(err)
                });
        },
        draft() {
            const drafts = (localStorage.getItem("drafts")) ? JSON.parse(localStorage.getItem("drafts")) : [];
            let id = 0;
            if (drafts.length > 0) {
                id = Math.max(...drafts.map(draft => draft.id)) + 1
            }
            drafts.push({
                id: id,
                text: this.text
            })
            localStorage.setItem("drafts", JSON.stringify(drafts));
            window.location.href = '/drafts';

        },
        adjustTextareaHeight() {
            const textarea = this.$refs.text;
            textarea.style.height = "auto";
            textarea.style.height = textarea.scrollHeight + "px";
        },
    },
    components: {
        SinglePost
    }
}
</script>