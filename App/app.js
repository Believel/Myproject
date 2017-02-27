;(function(angular){
  angular.module('app',[
              'ui.router'
              ])
  //内置路由配置路由
          // .config(function($routeProvider,$locationProvider){
          //    $locationProvider.html5Mode(true);
          //    $locationProvider.hashPrefix('!');
          //       $routeProvider
          //                   .when('/packing',{templateUrl:'/App/views/packing.html'})
          //                   .when('/stock',{templateUrl:'/App/views/stock.html'})
          //                   .when('/order',{templateUrl:'/App/views/order.html'})
          //                   .otherwise({redirect:'/packing'})
          // })

    .config(function( $stateProvider, $urlRouterProvider){
        $urlRouterProvider.otherwise('/packing')
        $stateProvider.state('packing',{
            url:'/packing',
            templateUrl:'views/packing.html'
        })
        .state('detail',{
            url:'/detail',
            templateUrl:'views/packing.detail.html',
            controller:'Modal'
        })
        .state('stock',{
          url:'/stock',
          templateUrl:'views/stock.html'
        })
        .state('order',{
          url:'/order',
          templateUrl:'views/order.html'
        })

    })
    .directive('modal', function(){
        return {
          restrict:'EA',
          templateUrl:'views/modal.html'
        }
    })
    //左侧菜单栏控制器
   .controller('SidebarController', ['$scope', '$location', function ($scope, $location) {
      // $location 是一个 ng 提供的服务
      // 可以通过 $location.url() 方法拿到当前请求路径中的 url（在单页应用中 # 后面的字符串被称之为 url）
      // $scope.$watch 只能监视 $scope 上的视图模型成员
      // 也可以监视方法的返回值
      // 只要 url 发生变化，就会执行对应的回调处理函数
      // 在回调处理函数中，就通过原来的 DOM 操作思想去设置了 侧边栏导航的焦点状态
      $scope.$location = $location;
      $scope.$watch('$location.url()', function (newVal, oldVal) {
        // console.log($location.url())
        // console.log(newVal);
        angular.element('.nav-sidebar').find('a').each(function (index, a) {
          // console.log(a.hash.substr(1));//  /packing
          if (a.hash.substr(2) === newVal) {
            angular.element(a)
              .closest('li').addClass('active')
              .siblings().removeClass('active')
          }
        })
      })
    }])
    .controller('Modal', function($scope, $http){
            
            $scope.list = [];
            //模态框方法
            $scope.showModal = function(){
                angular.element('#myModal').modal('show');
            }
        
               //点击按钮请求后台数据
               // function show(){
               // }

              $('#ajax').on('click', function(){
                  //alert(1);
                  $http({
                    url:'http://192.168.0.133:88/Container/ShowContainer?Pagesize=10&Pageindex=1',
                    method:'get',
                    headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}  
                  }).then(function(res){
                    console.log(res);
                    $scope.list = res.data.rows[0];
                  }) 
              })
            //手风琴特效
            $(".menu_head").click(function(){
                if($(this).find('.icon').hasClass('glyphicon-triangle-right')){
                     $(this).find('.icon').removeClass('glyphicon-triangle-right').addClass('glyphicon-triangle-bottom');
                }else{
                  $(this).find('.icon').removeClass('glyphicon-triangle-bottom').addClass('glyphicon-triangle-right');
                }
                  $(this).next("div.menu_body").slideToggle(300).siblings("div.menu_body").slideUp("slow");
                  $(this).siblings();
                   
              });
  })
})(angular) 
