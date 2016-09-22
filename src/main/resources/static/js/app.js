/**
 * Created by 이호세아 on 2016-05-17.
 */

angular.module("homeApp",[
        'chart.js',
        'ngAnimate',
        'ui.router',
        'ngFileUpload',
        'angular-storage',
        'ui.bootstrap',
        'angular-jqcloud',
        'ui.bootstrap.alert',
        'angular-confirm',
        'duScroll'
    ])

    .config(function(storeProvider){
        storeProvider.setStore('sessionStorage');
    })
     .controller("alertCtrl" , __AlertCtrl)
     .controller("ArchiveCtrl" , __ArchiveCtrl)
     .controller("CarouselDemoCtrl" , __CarouselDemoCtrl)
     .controller("catagoryCtrl" , __CategoryCtrl)
     .controller("findIDCtrl" , __FindIdCtrl)
     .controller("findPASSCtrl" , __FindPassCtrl)
     .controller("findCtrl" , __FindCtrl)
     .controller("indexCtrl" , __IndexCtrl)
     .controller("joinCtrl" , __JoinCtrl)
     .controller("leftSideBarCtrl" , __LeftSidebarCtrl)
     .controller("loginCtrl" , __LoginCtrl)
     .controller("ModalDemoCtrl" , __ModalDemoCtrl)
     .controller("othersCtrl" , __OthersCtrl)
     .controller("RadarCtrl" , __RadarCtrl)
     .controller("ChartCtrl" , __ChartCtrl)
     // .controller("ScrollCtrl" , __ScrollCtrl)
     .controller("subHeaderCtrl" , __SubHeaderCtrl)
     .controller("tagCtrl" , __TagProfileCtrl)
     .controller("tolineCtrl" , __TolineCtrl)
     .controller("uploadCtrl" , __UploadCtrl)
     .controller("profileCtrl" , __UserProfileCtrl)


    .controller('scroll', function($scope, $document){
            $scope.toTheTop = function() {
                $document.scrollTopAnimated(0, 5000).then(function() {
                    console && console.log('You just scrolled to the top!');
                });
            }
            var section3 = angular.element(document.getElementById('section-3'));
            $scope.toSection3 = function() {
                $document.scrollToElementAnimated(section3);
            }
        }
    ).value('duScrollOffset', 30)

    .run(function ($rootScope, $state, store) {
        $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
            var requireLogin = toState.data.requireLogin;
            if (requireLogin && store.get('obj') == null) {
                event.preventDefault();
                $state.go('login');
            }
        });
    })

    .filter('unique', function() {
        return function(collection, keyname) {
            var output = [],
                keys = [];

            angular.forEach(collection, function(item) {
                var key = item[keyname];
                if(keys.indexOf(key) === -1) {
                    keys.push(key);
                    output.push(item);
                }
            });

            return output;
        };
    })
        //윈도우 크기 재구성
    .directive('resize', function ($window) {
        return function (scope, element) {
            var w = angular.element($window);
            scope.getWindowDimensions = function () {
                return {
                    'h': w.height(),
                    'w': w.width()
                };
            };
            scope.$watch(scope.getWindowDimensions, function (newValue, oldValue) {
                scope.windowHeight = newValue.h;
                scope.windowWidth = newValue.w;

                scope.style = function () {
                    return {
                        'height': (newValue.h - 100) + 'px',
                        'width': (newValue.w - 100) + 'px'
                    };
                };

            }, true);

            w.bind('resize', function () {
                scope.$apply();
            });
        }
    })



    // 댓글 엔터 입력 처리
    .directive('ngEnter', function () {
        return function (scope, element, attrs) {
            element.bind("keydown keypress", function (event) {
                if(event.which === 13) {
                    scope.$apply(function (){
                        scope.$eval(attrs.ngEnter);
                    });
                    event.preventDefault();
                }
            });
        };
    })

    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('login', {
                url: '/',
                templateUrl: 'login.html',
                controller: 'loginCtrl',
                controllerAs: 'loginCtrl',
                data: {
                    requireLogin: false
                }
            })

            .state('login1', {
                url: '/',
                templateUrl: 'login.html',
                controller: 'loginCtrl',
                controllerAs: 'loginCtrl',
                data: {
                    requireLogin: false
                }
            })

            .state('main', {
                url: '/main',
                templateUrl: 'main.html',
                controller: 'indexCtrl',
                controllerAs: 'index',
                data: {
                    requireLogin: true
                }
            })

            .state('catagory', {
                url: '/catagory',
                templateUrl: 'catagory.html',
                controller: 'catagoryCtrl',
                controllerAs: 'catagoryCtrl',
                data: {
                    requireLogin: true
                }
            })

            .state('Archive', {
                url: '/Archive',
                templateUrl: 'Archive.html',
                controller: 'ArchiveCtrl',
                controllerAs: 'archive',
                data: {
                    requireLogin: true
                }
            })


            .state('upload', {
                url: '/upload',
                templateUrl: 'upload.html',
                controller: 'uploadCtrl',
                controllerAs: 'upload',
                data: {
                    requireLogin: true
                }
            })



            .state('profile', {
                url: '/profile',
                templateUrl: 'profile.html',
                controller: 'profileCtrl',
                controllerAs: 'profile',
                data: {
                    requireLogin: true
                }
            })

            .state('others1', {
                url: '/others',
                templateUrl: 'othersprofile.html',
                controller: 'othersCtrl',
                controllerAs: 'others',
                data: {
                    requireLogin: true
                }
            })

            .state('others2', {
                url: '/others',
                templateUrl: 'othersprofile.html',
                controller: 'othersCtrl',
                controllerAs: 'others',
                data: {
                    requireLogin: true
                }
            })

            .state('tag', {
                url: '/tag',
                templateUrl: 'tagProfile.html',
                controller: 'tagCtrl',
                controllerAs: 'tag',
                data: {
                    requireLogin: true
                }
            })

            .state('toline', {
                url: '/Toline',
                templateUrl: 'Toline.html',
                controller: 'tolineCtrl',
                controllerAs: 'toline',
                data: {
                    requireLogin: true
                }
            });

        $urlRouterProvider.otherwise('/');
    });


