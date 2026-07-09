<template>
    <article class="comment">
        <header class="comment-meta">
            <strong class="comment-author">{{ displayName(comment) }}</strong>
            <span class="comment-date">· {{ formatDate(comment.createdAt) }}</span>
        </header>

        <p v-if="comment.body" class="comment-body">{{ comment.body }}</p>

        <img v-if="comment.imageUrl" class="comment-image" :src="comment.imageUrl" alt="Comment upload" />

        <div class="comment-links">
            <button class="reply-btn" @click="$emit('reply', comment)">Reply</button>
        </div>

        <div v-if="comment.replies && comment.replies.length" class="comment-replies">
            <CommentItemDIY v-for="reply in comment.replies" :key="reply.id" :comment="reply"
                @reply="$emit('reply', $event)" />
        </div>
    </article>
</template>

<script>
export default {
    name: 'CommentItemDIY',

    props: {
        comment: {
            type: Object,
            required: true,
        },
    },

    methods: {
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
    },
};
</script>

<style scoped>
.comment {
    width: 100%;
}

.comment-meta,
.comment-body,
.comment-author,
.comment-date,
.reply-btn {
    font-family: 'Play', sans-serif;
}

.comment-meta {
    display: flex;
    align-items: baseline;
    gap: 6px;
}

.comment-author {
    font-weight: 700;
}

.comment-date {
    font-size: 13px;
    color: gray;
}

.comment-body {
    margin: 8px 0 0;
    font-size: 14px;
    white-space: pre-wrap;
}

.comment-image {
    display: block;
    height: auto;
    max-width: 80%;
    margin-top: 10px;
}

.comment-links {
    margin-top: 4px;
}

.reply-btn {
    padding: 0;
    border: none;
    background: none;
    color: var(--dynamic-color);
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
}

.comment-replies {
    margin-top: 18px;
    margin-left: 24px;
    padding-left: 16px;
    border-left: 1px solid rgba(255, 255, 255, 0.14);
    display: flex;
    flex-direction: column;
    gap: 28px;
}

@media only screen and (max-width: 576px) {
    .comment-image {
        max-width: 100%;
    }

    .comment-replies {
        margin-left: 14px;
        padding-left: 10px;
    }
}
</style>