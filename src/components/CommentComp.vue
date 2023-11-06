<template>
    <div class="comment-box">
        <div id="HCB_comment_box">
            <a href="http://www.htmlcommentbox.com">Comment Box</a> is loading comments...
        </div>
    </div>
</template>
  
<script>
export default {
    name: 'CommentBox',
    mounted() {
        this.loadCommentBoxScript();
    },
    methods: {
        loadCommentBoxScript() {
            if (!window.hcb_user) {
                window.hcb_user = {};
            }
            const s = document.createElement('script');
            const l = window.hcb_user.PAGE || ("" + window.location).replace(/'/g, "%27");
            const h = "https://www.htmlcommentbox.com";

            s.setAttribute("type", "text/javascript");
            s.setAttribute(
                "src",
                h + "/jread?page=" + encodeURIComponent(l).replace("+", "%2B") +
                "&mod=%241%24wq1rdBcg%24jJ44Z9Yty1bqAkTYA64Nz1" +
                "&opts=16798&num=10&ts=" + Date.now()
            );

            if (typeof s != "undefined") {
                document.getElementsByTagName("head")[0].appendChild(s);
            }
        },
    },
};
</script>
  