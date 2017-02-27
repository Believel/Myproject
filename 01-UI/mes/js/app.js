(function() {
    angular.module('app', ['ngRoute'])
        .directive('contentTop', contentTop)
        .directive('pageTop', pageTop)
        .directive('baSidebar', baSidebar)
        .directive('modal',modal)
        .config(function($routeProvider, $locationProvider){
          $locationProvider.html5Mode(false);
          $locationProvider.hashPrefix('!');
          $routeProvider
          .when('/home',{templateUrl: '/view/waibaozhuang.html',controller:'mainCon'})
          .when('/home/detail',{templateUrl:'/view/detail.html',controller:'detail'})
          .when('/detail',{})
          .when('/zhuaijuan/kezhuanzhai/1',{})
          .when('/zhuaijuan/kezhuanzhai/2',{})
          .when('/zhuaijuan/kezhuanzhai/3',{})
          .when('/zhuaijuan/kezhuanzhai/4',{})
          .when('/zhaijuan/believe',{})
          .when('/zhaijuan/believe/1',{})
          .when('/zhaijuan/lilu',{})
          .when('/zhaijuan/guozhai',{})
          .when('/zhaijuan/guozhai/1',{})
          .when('/zhaijuan/guozhai/2',{})
          .when('/zhaijuan/guozhai/3',{})
          .when('/zhaijuan/guozhai/4',{})

          .when('/gupiao',{})
          .when('/gupiao/jiben',{})
          .when('/gupiao/jiben/1',{})
          .when('/gupiao/lianghua',{})

          .when('/hongguan',{})
          .when('/hongguan/data',{})
          .when('/hongguan/data/1',{})
          .when('/hongguan/preview',{})
          .when('/hongguan/biaoxian',{})

          .when('/frame',{})
          .when('/menu',{})
          .when('/quality',{})
          .when('/produce',{})
          .when('/time',{})
          .when('/resource',{})
          .otherwise('/home')

      })
        .controller('sidebar',function($scope, $http, $location){
          $scope.$location = $location;
          $scope.$watch('$location.hash()', function (newVal, oldVal) {
            // console.log($location.url());
            // console.log($location.hash());
            angular.element('.sidebar-menu').find('a').each(function(index, value){
              if(value.hash.substr(1)==newVal){
                angular.element(value).closest('li').toggleClass('active').siblings().removeClass('active');
                angular.element(value).siblings().toggleClass('current').closest('li').siblings().children('ul').removeClass('current');

              }
            })
        })
        //  发送服务请求，拿到左侧的导航菜单菜单数据
        // ?callback=JSON_CALLBACK
        $http({
          url:'http://127.0.0.1:8080/api/user',
          method:'get',
          headers: {'Content-Type': 'application/json; charset=UTF-8'}
        }).then(function(json){
          // console.log(json);
          $scope.navbar = json.data;
        })
      })
        .controller('mainCon', function($scope, $http) {
          $scope.wbzData = '';
            var a = $http({
                method: 'GET',
                url: 'http://192.168.0.201:3002/products',
                dataType: 'jsonp'
            });
            // console.log(111);
            a.then(function(res){
                console.log(333);
                $scope.wbzData = res;
                console.log(JSON.stringify($scope.wbzData));
                $scope.wbzDataTitle = [];
                for(k in $scope.wbzData.data[2]){
                    console.log(k);
                    $scope.wbzDataTitle.push(k);
                }
                console.log($scope.wbzDataTitle.length);
            })

            var pageSize = 10;
            $scope.pageIndex = '' || 1;
            $scope.setPage = function(obj) {
                if (obj.innerHTML === '...') {
                    return false;
                }
                var txt = parseInt(obj.innerHTML);
                $scope.pageIndex = txt;
                getDat();
            }

            function getDat() {
                $http({
                    method: 'GET',
                    // url: 'http://192.168.0.201:3002/products',
                    url: 'http://192.168.0.252:88/Product/show?pageSize=' + pageSize + '&pageIndex=' + $scope.pageIndex,
                    // data:{
                    //     pageSize:10,//展示数据条数
                    //     pageIndex:1//分页数
                    // },
                    dataType: 'jsonp'
                }).then(function(res) {
                    $scope.wbzData = res.data.rows;
                    wbzDataTitle = [];
                    // console.log(JSON.stringify(res.data));
                    $scope.total = Math.ceil(res.data.total / pageSize);
                    var pageArr = [];
                    if ($scope.total < 10) {
                        var pageArr = [];
                        for (var i = 1; i < 10; i++) {
                            pageArr.push(i);
                        }
                    } else if ($scope.total > 10) {
                        var pageArr = [];
                        var c =  $scope.total-$scope.pageIndex;
                        if($scope.pageIndex>5 & c>3){
                            pageArr.push($scope.pageIndex-4);
                            pageArr.push($scope.pageIndex-2);
                            pageArr.push($scope.pageIndex-3);
                            pageArr.push($scope.pageIndex-1);
                            pageArr.push($scope.pageIndex);
                            pageArr.push($scope.pageIndex+1);
                            pageArr.push($scope.pageIndex+2);
                            pageArr.push($scope.pageIndex+3);
                        }else{
                            for(var i=1;i<10;i++){
                                pageArr.push(i);
                            }
                        }
                    }
                    $scope.showPage = pageArr;
                    for (k in $scope.wbzData[0]) {
                        wbzDataTitle.push(k);
                    }
                    $scope.wbzDataTitle = wbzDataTitle;
                });
            }
            getDat();
            $scope.cur = ''; //当前的点击
            $scope.setColor = function(i, d) {
                $scope.cur = d;
                // $(i).parent().siblings().css('background','');
                // $(i).parent().css('background','rgba(0,0,0,.1)');
                angular.element(i).parent().parent().children('tr').css('background', '');
                angular.element(i).parent().css('background', 'rgba(0,0,0,.1)');
            }
            $scope.del = function() {
                if ($scope.cur === '') {
                    return false;
                }
                $http({
                    method:'GET',
                    url:'http://192.168.0.252:88/Product/delete?id='+$scope.wbzData[$scope.cur].ID,
                    dataType: 'jsonp'
                }).then(function(res){
                    // console.log(JSON.stringify(res));
                    if(res.data ==='1'){
                        $scope.wbzData.splice($scope.cur, 1);
                        $scope.cur = '';
                    }
                })

            }
        })
        .controller('detail',['$scope', '$http',
                    function ($scope,      $http) {
                      //模态框显示方法
                      function show(){
                        angular.element('#myModal').modal();
                      }
                      //手风琴特效——后期修改地方标注
                      $(".menu_head").click(function(){
                        if($(this).find('.icon').hasClass('glyphicon-triangle-right')){
                          $(this).find('.icon').removeClass('glyphicon-triangle-right').addClass('glyphicon-triangle-bottom');
                        }else{
                          $(this).find('.icon').removeClass('glyphicon-triangle-bottom').addClass('glyphicon-triangle-right');
                        }
                        $(this).next("div.menu_body").slideToggle(300).siblings("div.menu_body").slideUp("slow");
                        $(this).siblings();

                      });


        }])

    function contentTop($location) {
        return {
            restrict: 'E',
            templateUrl: '/component/contentTop.html'
        };
    }

    function pageTop() {
        return {
            restrict: 'E',
            templateUrl: '/component/pageTop.html'
        };
    }

     function baSidebar() {
        return {
            restrict: 'E',
            templateUrl: '/component/baSidebar.html'
        };
    }
  //模态框指令
    function modal(){
        return {
          restrict : 'EA',
          templateUrl:'/componet/modal.html'
        }
      }

})();
