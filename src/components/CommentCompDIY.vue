<template>
    <section class="comment-box">
        <div class="comment-form">
            <div class="name-row">
                <input v-model="name" class="field field-name" type="text" maxlength="40" placeholder="Name" />

                <span v-if="replyTarget" class="reply-context">
                    is replying to {{ displayName(replyTarget) }}
                </span>
            </div>

            <textarea v-model="body" class="field field-body" maxlength="4000" placeholder="Enter your comment here" />

            <div v-if="imagePreview" class="preview-wrap">
                <img :src="imagePreview" alt="Selected preview" class="preview-image" />
            </div>

            <div class="actions">
                <button class="btn btn-dark" :disabled="!canSubmit" @click="onSubmit">
                    Comment
                </button>

                <label class="btn btn-light">
                    <input ref="fileInput" class="file-input" type="file" accept="image/*,.gif"
                        @change="onFileChange" />
                    Add Image
                </label>
            </div>
        </div>

        <div class="comment-list">
            <CommentItemDIY v-for="comment in comments" :key="comment.id" :comment="comment" @reply="setReplyTarget" />

            <p v-if="loading" class="state-text">Loading comments...</p>
            <p v-else-if="!comments.length" class="state-text">No comments yet.</p>
        </div>

        <div v-if="totalPages > 1" class="comment-pagination">
            <button style="padding-left: 0;" type="button" class="page-btn" :disabled="currentPage === 1"
                @click="$emit('page-change', currentPage - 1)">
                Prev
            </button>

            <button v-for="page in visiblePages" :key="page" type="button" class="page-btn"
                :class="{ active: page === currentPage }" @click="$emit('page-change', page)">
                {{ page }}
            </button>

            <button type="button" class="page-btn" :disabled="currentPage === totalPages"
                @click="$emit('page-change', currentPage + 1)">
                Next
            </button>
        </div>
    </section>
</template>

<script>
import CommentItemDIY from './CommentItemDIY.vue';

export default {
    name: 'CommentCompDIY',

    components: {
        CommentItemDIY,
    },

    props: {
        comments: {
            type: Array,
            default: () => [],
        },
        loading: {
            type: Boolean,
            default: false,
        },
        currentPage: {
            type: Number,
            default: 1,
        },
        totalPages: {
            type: Number,
            default: 1,
        },
    },

    data() {
        return {
            name: '',
            body: '',
            image: null,
            imagePreview: '',
            replyTarget: null,
        };
    },

    computed: {
        canSubmit() {
            return this.body.trim().length > 0 || !!this.image;
        },

        visiblePages() {
            return Array.from({ length: this.totalPages }, (_, i) => i + 1);
        }
    },

    watch: {
        body(newValue) {
            if (!this.replyTarget) return;

            const targetName = this.displayName(this.replyTarget);
            const prefix = `@${targetName}, `;

            if (!newValue.startsWith(prefix)) {
                this.replyTarget = null;
            }
        },
    },

    beforeUnmount() {
        this.clearPreview();
    },

    methods: {
        clearPreview() {
            if (this.imagePreview) {
                URL.revokeObjectURL(this.imagePreview);
            }
            this.imagePreview = '';
        },

        onFileChange(event) {
            const file = event.target.files && event.target.files[0]
                ? event.target.files[0]
                : null;

            this.image = file;
            this.clearPreview();

            if (file) {
                this.imagePreview = URL.createObjectURL(file);
            }
        },

        resetForm() {
            this.name = '';
            this.body = '';
            this.image = null;
            this.clearPreview();
            this.replyTarget = null;

            if (this.$refs.fileInput) {
                this.$refs.fileInput.value = '';
            }
        },

        onSubmit() {
            if (!this.canSubmit) return;

            this.$emit('submit', {
                authorName: this.name.trim(),
                body: this.body.trim(),
                image: this.image,
                parentId: this.replyTarget ? this.replyTarget.id : null,
                resetForm: this.resetForm,
            });
        },

        displayName(comment) {
            return comment.authorName && comment.authorName.trim()
                ? comment.authorName.trim()
                : 'Anonymous';
        },

        formatDate(dateString) {
            return new Date(dateString).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
            });
        },

        setReplyTarget(comment) {
            this.replyTarget = comment;

            const targetName = this.displayName(comment);
            const prefix = `@${targetName}, `;

            if (!this.body.trim()) {
                this.body = prefix;
            } else if (!this.body.startsWith(prefix)) {
                this.body = `${prefix}${this.body}`;
            }
        },
    },
};
</script>

<style scoped>
.comment-box {
    --ui-font: 'Montserrat', sans-serif;
    --text-font: 'Play', sans-serif;
    --radius: 3px;
    --dark: rgb(53, 53, 53);
    --reply: rgb(32, 150, 243);

    box-sizing: border-box;
    color: white;
    padding-top: 10px;
}

.comment-box,
.comment-box * {
    box-sizing: inherit;
}

.comment-form {
    max-width: 600px;
    margin-bottom: 36px;
}

.comment-list {
    display: flex;
    flex-direction: column;
    gap: 48px;
}

.field {
    display: block;
    width: 100%;
    padding: 8px;
    border: none;
    border-radius: var(--radius);
    background: white;
    opacity: 0.8;
    outline: none;
    font-family: var(--ui-font);
    font-size: 14px;
}

.field-name {
    max-width: 200px;
    margin-bottom: 10px;
}

.field-body {
    min-height: 100px;
    resize: none;
    margin-bottom: 10px;
}

.actions {
    display: flex;
    gap: 6px;
}

.btn {
    display: inline-flex;
    align-items: center;
    padding: 8px 16px;
    border-radius: var(--radius);
    border: 1px solid var(--dark);
    font-family: var(--ui-font);
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
}

.btn-dark {
    background: var(--dark);
    color: white;
}

.btn-light {
    background: white;
    color: var(--dark);
}

.btn-dark:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.file-input {
    display: none;
}

.preview-wrap {
    margin-bottom: 12px;
}

.preview-image {
    display: block;
    height: auto;
    max-width: 80%;
}

.reply-btn,
.state-text {
    font-family: var(--text-font);
}

.reply-btn {
    padding: 0;
    border: none;
    background: none;
    color: var(--reply);
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
}

.state-text {
    font-size: 14px;
    color: gray;
}

.replying-to {
    margin-bottom: 10px;
    font-family: var(--text-font);
    font-size: 14px;
    color: #ddd;
}

.cancel-reply-btn {
    margin-left: 10px;
    padding: 0;
    border: none;
    background: none;
    color: var(--reply);
    font-size: 14px;
    cursor: pointer;
}

.name-row {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
}

.reply-context {
    font-family: var(--text-font);
    font-size: 14px;
    color: gray;
}

.comment-pagination {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 24px;
    flex-wrap: wrap;
    font-family: var(--text-font);
}

.page-btn {
    padding: 4px 10px;
    border: none;
    background: none;
    color: gray;
    font-family: inherit;
    font-size: 14px;
    cursor: pointer;
}

.page-btn.active {
    color: var(--dynamic-color, white);
    font-weight: 700;
    text-decoration: underline;
}

.page-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
}

@media only screen and (max-width: 576px) {

    .preview-image {
        max-width: 100%;
    }
}
</style>