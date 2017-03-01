;(function(angular){
  angular.module('app',[
              'ui.router',
              'ngAnimate', 
              'toastr'
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
    .directive('dialog', function(){
        return {
          restrict:'EA',
          templateUrl:'views/popupTmpl.html'
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
        // angular.element('.nav-sidebar').find('a').each(function (index, a) {
        //   // console.log(a.hash.substr(1));//  /packing
        //   if (a.hash.substr(2) === newVal) {
        //     angular.element(a)
        //       .closest('li').addClass('active')
        //       .siblings().removeClass('active')
        //   }
        // })
        // 
        
          //添加之后的改变
            angular.element('.sidebar-menu').find('a').each(function(index, value){
                            if(value.hash.substr(1)==newVal){
                              console.log(value.hash.substr(1))
                              angular.element(value).closest('li').toggleClass('active').siblings().removeClass('active');
                              angular.element(value).siblings().toggleClass('current').closest('li').siblings().children('ul').removeClass('current');
                            }
                        })
      })
       var json = [
                 {
                  "label": "常用",
                  "link" : "packing",
                  "icon"  :"fa fa-book",
                  "children": []
                },
                 {
                  "label": "库存",
                  "link" : "stock",
                  "icon"  :"fa fa-book",
                  "children": []
                },
                 {
                  "label": "订单管理",
                  "link" : "order",
                  "icon"  :"fa fa-book",
                  "children": []
                }
            ];
            $scope.navbar = json;

    }])
    .controller('Modal', function($scope, $http, $location, toastr){
            $scope.list = {};
            $scope.master = {};//保存表单数据改变之前的值
            $scope.title = '';
            //模态框方法
            $scope.showModal = function(){
                angular.element('#myModal').modal('show');
            }
            $scope.request = function(){
                 $http({
                    url:'http://192.168.0.201:80/Container/ShowContainer?Pagesize=10&Pageindex=1',
                    method:'get',
                    headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}  
                  }).then(function(res){
                    console.log(res);
                    $scope.list = res.data.rows[0];
                    $scope.master = angular.copy($scope.list);
                  }) 
              };
              function getData(){
                      var Container = angular.element('.Container').val();
                       var containerId = angular.element('.containerclassId').val();
                      var status = angular.element('.status').val()
                      var weight = angular.element('.weight').val();
                      var actual = angular.element('.actual').val();  
                      var MobileFlag = angular.element('.MobileFlag').val();
                      var LastMaintenanceDate = angular.element('.LastMaintenanceDate').val();
                      var NextMaintenanceDate = angular.element('.NextMaintenanceDate').val();
                      var data = {
                            Container:Container,
                            ContainerClassID:containerId,
                            CalculatedWeight:weight,
                            ActualWeight:actual,
                            ContainerStatus:status,
                            MobileFlag:MobileFlag,
                            LastMaintenanceDate:LastMaintenanceDate,
                            NextMaintenanceDate:NextMaintenanceDate
                       };
                       return data;
              }
              //保存数据
            $scope.save = function(){
              //将表单中的数据提交到后台       
               $scope.list = getData();
                $http({
                  url:'http://192.168.0.201:80/Container/EditContainer',
                  data:$scope.list,
                  method:'post'
                }).then(function(res){
                    // console.log(res);
                    if(res.status == 200){
                        $scope.title = '修改成功';
                        toastr.success($scope.title, {closeButton: true});
                    }
                })
                $location.path('/packing');       
            }; 
            //表单未改变之前的数据
            var inputs = angular.element('input');
             var flag = false;
             
             //$scope.master = angular.copy(getData());
             console.log($scope.master);
             //监控表单改变了没有，如果改变了就将改变的标志设置为true
             inputs.each(function(){
                  $(this).change(function(){   
                    $(this).css("background-color","#FFFFCC");
                    flag = true;
                  })
             })
               //刷新数据
            $scope.refresh = function(){
              //1.判断页面中有没有修改的，如果有的话就提示要不要保存，是：保存数据；否：刷新页面
               if(flag){
                  angular.element('#modal2').modal({show:'true',backdrop:'static'});
                  // 重置
                  $scope.Yes = function(){
                     //重置为之前的数据
                      $scope.list = angular.copy($scope.master);
                      //关闭模态框
                      $('#modal2').modal('hide')
                  }
                  //什么也不做
                  $scope.No = function(){
                      $('#modal2').modal('hide')
                  }
               }
            };
            
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
