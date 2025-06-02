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

<style>
.hcb-icon,
.home-desc,
.hcb-like {
  display: none;
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
  width: 600px !important;
}

.comment > a {
  pointer-events: none;
}

@media (max-width: 670px) {
  .commentbox {
    width: 100% !important;
  }

  .comment img {
    width: 100%;
  }
}
</style>
  