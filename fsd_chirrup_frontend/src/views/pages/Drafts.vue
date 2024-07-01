<template>
    <div class="container">
        <div class="d-flex justify-content-center"> Please note: after logging out, all drafts will be deleted! </div>
        <DraftCard v-for="draft of drafts" :draft="draft" />
    </div>
</template>

<script>
import DraftCard from '../components/DraftCard.vue';
export default {
    data() {
        return {
            drafts: JSON.parse(localStorage.getItem("drafts"))
        }
    },
    mounted() {
    },
    components: {
        DraftCard
    }
}
</script>