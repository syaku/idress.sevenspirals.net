var dynamodb = new AWS.DynamoDB();

var router = new VueRouter({
  // 各ルートにコンポーネントをマッピングします
  // コンポーネントはVue.extend() によって作られたコンポーネントコンストラクタでも
  // コンポーネントオプションのオブジェクトでも構いません
  routes: [
    { path: '/', redirect: '/top' },
    {
      path: '/top',
      component: {
        data: function () {
          return {
            events: []
          }
        },
        created: function() {
          this.fetchData();
        },
        methods: {
          fetchData: function() {
            _this = this;
            $.get("https://bguxynw887.execute-api.ap-northeast-1.amazonaws.com/prod/IdressEvent",
              function(data) {
                _this.events = data.Items;
                console.log(data);
              }
            );
          }
        },
        template: '#top-page'
      }
    },
    {
      path: '/add',
      component: {
        data: function () {
          return {
            password: ""
          }
        },
        created: function() {
        },
        methods: {
          postData: function(event) {
            if ($("#source")[0].files.length > 0) {
              var _this = this;
              const reader = new FileReader
              reader.onload = (e) => {
                var csv = $.csv.toObjects(e.target.result);
                var param = {data: csv, password: _this.password};
                console.log(param);
                $.post("https://bguxynw887.execute-api.ap-northeast-1.amazonaws.com/prod/IdressEvent",
                  JSON.stringify(param),
                  function(data) {
                    console.log(data);
                  }
                );
              }
              var file = $("#source")[0].files[0];
              reader.readAsText(file, 'shift-jis');
            }
            return false;
          }
        },
        template: "#add-events"
      }
    },
    {
      path: '/event/:eventId',
      component: {
        data: function () {
          return {
            comment: "",
            mainIdress: "",
            illust: "",
            combo1: "",
            combo2: "",
            combo3: "",
            combo4: "",
            combo5: "",
            event: {}
          }
        },
        created: function() {
          this.fetchData();
        },
        methods: {
          postData: function(event) {
            var param = {
              comment: this.comment,
              mainIdress: this.mainIdress,
              illust: this.illust,
              combo1: this.combo1,
              combo2: this.combo2,
              combo3: this.combo3,
              combo4: this.combo4,
              combo5: this.combo5
            };
            $.post("https://bguxynw887.execute-api.ap-northeast-1.amazonaws.com/prod/IdressEvent/"+this.$route.params.eventId,
              JSON.stringify(param),
              function(data) {
                location.reload();
              }
            );
            return false;
          },
          fetchData: function() {
            _this = this;
            $.get("https://bguxynw887.execute-api.ap-northeast-1.amazonaws.com/prod/IdressEvent/"+this.$route.params.eventId,
              function(data) {
                _this.event = data.Item;
                _this.comment =data.Item.comment;
                _this.mainIdress =data.Item.mainIdress;
                _this.illust =data.Item.illust
                _this.combo1 =data.Item.combo1;
                _this.combo2 =data.Item.combo2;
                _this.combo3 =data.Item.combo3;
                _this.combo4 =data.Item.combo4;
                _this.combo5 =data.Item.combo5;
                console.log(data);
              }
            );
          }
        },
        template: "#view-events"
      }
    }
  ]
});

// ルーターのインスタンスをrootとなるVueインスタンスに渡します
var app = new Vue({
  router: router
}).$mount('#app');
