var dynamodb = new AWS.DynamoDB();

var router = new VueRouter({
  routes: [
    { path: '/', redirect: '/top' },
    {
      path: '/top',
      component: {
        data: function () {
          return {
            total: 0,
            page: 1,
            keyword: '',
            range: 'title',
            items: []
          }
        },
        created: function() {
          if (this.$route.query.p) {
            this.page = parseInt(this.$route.query.p);
          }
          if (this.$route.query.r) {
            this.range = this.$route.query.r;
          }
          if (this.$route.query.q) {
            this.keyword = this.$route.query.q;
            this.search();
          }
        },
        watch: {
          '$route' (to, from) {
            if (to.query.p) {
              this.page = parseInt(to.query.p);
            }
            if (to.query.q) {
              this.keyword = to.query.q;
              this.search();
            } else {
              this.total = 0;
              this.keyword = '';
              this.page = 1;
              this.items = [];
            }
          }
        },
        methods: {
          nextPage: function() {
            this.page++;
            router.push({ path: 'top', query: { p: this.page, q: this.keyword, r:this.range }});
          },
          prevPage: function() {
            this.page--;
            router.push({ path: 'top', query: { p: this.page, q: this.keyword, r:this.range }});
          },
          doSearch: function() {
            this.page = 1;
            router.push({ path: 'top', query: { p: this.page, q: this.keyword, r:this.range }});
          },
          search: function() {
            var _this = this;
            $.ajax({
              type:"post",                // method = "POST"
              url:"https://search-idress-z5mivpmwekdygdonnuaethw6me.ap-northeast-1.es.amazonaws.com/idress/group/_search",        // POST送信先のURL
              data:JSON.stringify({
                "query": {
                  "query_string": {
                    "default_field" : _this.range,
                    "default_operator" : "AND",
                    "auto_generate_phrase_queries" : true,
                       "query": _this.keyword
                  }
                },
                "_source": ["id", "title", "character_name", "nation_name"],
                "size": 30,
                "from": 0 + (_this.page -1)  * 30
              }),  // JSONデータ本体
              contentType: 'application/json', // リクエストの Content-Type
              dataType: "json",           // レスポンスをJSONとしてパースする
              success: function(data) {
                _this.total = data.hits.total;
                _this.items = data.hits.hits;
              },
              error: function() {
              },
              complete: function() {
              }
            });
          }
        },
        template: '#view-groups'
      }
    }
  ]
});

// ルーターのインスタンスをrootとなるVueインスタンスに渡します
var app = new Vue({
  router: router
}).$mount('#app');
