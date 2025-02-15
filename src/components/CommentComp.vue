<template>
  <div class="comment-box">
    <div id="HCB_comment_box">
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

      // Manually clean the URL to remove any tracking parameters
      const cleanUrl = window.location.origin + window.location.pathname;

      // Force HTML Comment Box to use the clean URL
      window.hcb_user.page = cleanUrl;

      // Dynamically modify the browser's history state so that the current page appears clean
      if (window.history.replaceState) {
        window.history.replaceState(null, "", cleanUrl);
      }

      const s = document.createElement("script");
      const h = "https://www.htmlcommentbox.com";

      s.setAttribute("type", "text/javascript");
      s.setAttribute(
        "src",
        h + "/jread?page=" + encodeURIComponent(cleanUrl) +
        "&mod=%241%24wq1rdBcg%24jJ44Z9Yty1bqAkTYA64Nz1" +
        "&opts=16798&num=10&ts=" + Date.now()
      );

      document.getElementsByTagName("head")[0].appendChild(s);
    },
  },
};
</script>

<style>
.hcb-icon,
.home-desc,
.hcb-like,
#HCB_comment_box h3 {
  display: none;
}

.comment-box {
  padding-top: 10px;
}

.comment img {
  max-width: 80%;
}

@media only screen and (max-width: 576px) {
  .comment img {
    max-width: 100%;
  }
}

[title="next page"],
[title="previous page"] {
  display: table;
}

.hcb-shadow-r {
  background-color: white;
  opacity: 80%;
  border-radius: 3px;
}

.btn {
  border-radius: 3px;
}

.commentbox {
  resize: none;
}

.comment>a {
  pointer-events: none;
}

.hcb-comment-body a {
  color: white;
}
</style>