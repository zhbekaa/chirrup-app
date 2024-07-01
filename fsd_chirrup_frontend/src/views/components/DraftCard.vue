<template>
    <div :key="draft" class="card my-2" style="width: 100%;">
        <div class="card-body">
            <div>
                <div class="d-flex justify-content-between">
                    <h3 class="card-title text-dark" style="width: fit-content;">
                        Draft #{{ draft.id + 1 }}
                    </h3>
                    <div>
                        <button class="btn  btn-outline-dark" data-bs-toggle="dropdown" aria-expanded="false">
                            <font-awesome-icon icon="ellipsis-vertical" />
                        </button>
                        <div class="dropdown-menu dropdown-menu-end">
                            <button v-on:click="handlePost(this.draft.text)" class="btn btn-primary dropdown-item">
                                Post
                            </button>
                            <button v-on:click="editing()" class="btn btn-primary dropdown-item">
                                {{ edit ? "Discard Changes" : "Edit Draft" }} </button>
                            <button class="dropdown-item btn d-flex justify-content-between " style="color:red"
                                v-on:click="handleDelete"> Delete
                                <font-awesome-icon icon="trash-can" />
                            </button>
                        </div>
                    </div>
                </div>

                <div v-if="!edit" class="card-text text-dark">
                    {{ draft.text }}
                </div>
                <form v-show="edit" action="" @submit.prevent="handleEdit()" class="w-100">
                    <div class="form-floating mt-3">
                        <textarea class="form-control mb-3" placeholder="Edit you post" id="floatingTextarea"
                            v-model="inputText" @input="adjustTextareaHeight" ref="textareaRef"></textarea>
                        <label for="floatingTextarea" class="form-label">Edit Post:</label>
                    </div>
                    <button class="btn btn-outline-primary float-end">Edit</button>
                </form>
            </div>

        </div>


    </div>
</template>

<script>
import { postService } from '../../services/posts.service';
export default {
    props: [
        'draft'
    ],
    data() {
        return {
            edit: false,
            inputText: "",
            drafts: JSON.parse(localStorage.getItem("drafts"))
        }
    },
    methods: {
        editing() {
            this.edit = !this.edit;
            this.inputText = this.draft.text;
        },
        handleEdit() {
            const id = this.draft.id;
            const newDraft = { id: id, text: this.inputText };
            const editID = this.drafts.findIndex(draft => draft.id === id);
            this.drafts[editID].text = this.inputText;
            localStorage.setItem("drafts", JSON.stringify(this.drafts))
            window.location.reload();
        },
        handleDelete() {
            this.drafts = this.drafts.filter(draft => draft.id !== this.draft.id)
            localStorage.setItem("drafts", JSON.stringify(this.drafts))
            window.location.reload();
        },
        handlePost(text) {
            postService.addPost(text)
                .then((res) => {
                    alert('Post added!');
                    this.handleDelete();
                    window.location.href = '/posts/' + res.data.post_id;
                })
                .catch((err) => {
                    console.log(err)
                });
        },
    }
}
</script>