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

    .controller('RadarCtrl', function ($scope) {
        $scope.labels = ['만족', '반전', '박진감', '웃음', '통쾌', '후회', '식상', '지루', '혐오', '실망'];

        $scope.RadarOnClick = function (points, evt) {
            console.log(points, evt);
        };

        $scope.colours =
            [ '#803690', '#00ADF9', '#DCDCDC', '#46BFBD', '#FDB45C', '#949FB1', '#4D5360'];
    })
    
    .controller('ChartCtrl', function ($scope) {
        
        $scope.line_labels = ["세달전", "두달전", "한달전", "3주전", "2주전", "1주전", "이번주"];
        $scope.series = ['긍정', '부정'];
        $scope.LineOnClick = function (points, evt) {
            console.log(points, evt);
        };

        $scope.colours = [{
            fillColor: '#B2EBF4',
            strokeColor: '#003399',
            highlightFill: 'rgba(47, 132, 71, 0.8)',
            highlightStroke: 'rgba(47, 132, 71, 0.8)',
            backgroundColor: '#803690'
        }];
    })

    .controller('ModalDemoCtrl', function (store, $http,$state, $rootScope, $scope, $uibModal, $log) {

        var userObject = store.get('obj');

        $scope.replylist = function(board) {
            $http({
                method: 'POST', //방식
                url: "/api/showreply", /* 통신할 URL */
                data: board, /* 파라메터로 보낼 데이터 */
                headers: {'Content-Type': 'application/json; charset=utf-8'} //헤더
            })
                .success(function (data, status, headers, config) {
                    $rootScope.reply=data;
                });
        }

        $scope.modalrefresh=function (board_id) {
            $http({
                method: 'POST', //방식
                url: "/api/boardOne", /* 통신할 URL */
                data: {board_id: board_id, user_id : userObject.user_id}, /* 파라메터로 보낼 데이터 */
                headers: {'Content-Type': 'application/json; charset=utf-8'} //헤더
            })
                .then(function (response) {
                    $rootScope.modalboard = response.data;
                })
        }




        $scope.favoriteBoard = function (board_id) {
            $http({
                method: 'POST', //방식
                url: "/api/favoriteBoard", /* 통신할 URL */
                data: {user_id: userObject.user_id, board_id: board_id}, /* 파라메터로 보낼 데이터 */
                headers: {'Content-Type': 'application/json; charset=utf-8'} //헤더
            })
                .success(function (data, status, headers, config) {
                    if (data.msg == 'false') {
                        alert('페이버릿 실패')
                    } else {
                        $scope.modalrefresh(board_id)
                    }
                })
                .error(function (data, status, headers, config) {
                    /* 서버와의 연결이 정상적이지 않을 때 처리 */
                    console.log(status);
                });
        };


        $scope.UnfavoriteBoard = function (board_id) {
            var UnfavoriteBoardObject =
            {
                user_id: userObject.user_id, //임시로 1번사용자 지정
                board_id: board_id
            };
            $http({
                method: 'POST', //방식
                url: "/api/UnfavoriteBoard", /* 통신할 URL */
                data: UnfavoriteBoardObject, /* 파라메터로 보낼 데이터 */
                headers: {'Content-Type': 'application/json; charset=utf-8'} //헤더
            })
                .success(function (data, status, headers, config) {
                    if (data.msg == 'false') {
                        alert('페이버릿취소 실패')
                    } else {
                        $scope.modalrefresh(board_id)
                    }
                })
                .error(function (data, status, headers, config) {
                    /* 서버와의 연결이 정상적이지 않을 때 처리 */
                    console.log(status);
                });
        };


        //좋아요
        $scope.likeBoard = function (board_id) {
            $http({
                method: 'POST', //방식
                url: "/api/likeBoard", /* 통신할 URL */
                data: {user_id: userObject.user_id, board_id: board_id}, /* 파라메터로 보낼 데이터 */
                headers: {'Content-Type': 'application/json; charset=utf-8'} //헤더
            })
                .success(function (data, status, headers, config) {
                    if (data.msg == 'false') {
                        alert('좋아요 실패')
                    } else {
                        $scope.modalrefresh(board_id)
                    }
                })
                .error(function (data, status, headers, config) {
                    /* 서버와의 연결이 정상적이지 않을 때 처리 */
                    console.log(status);
                });
        };

        //좋아요 취소
        $scope.dislikeBoard = function (board_id) {
            var dislikeBoardObject =
            {
                user_id: userObject.user_id, //임시로 1번사용자 지정
                board_id: board_id
            };
            $http({
                method: 'POST', //방식
                url: "/api/dislikeBoard", /* 통신할 URL */
                data: dislikeBoardObject, /* 파라메터로 보낼 데이터 */
                headers: {'Content-Type': 'application/json; charset=utf-8'} //헤더
            })
                .success(function (data, status, headers, config) {
                    if (data.msg == 'false') {
                        alert('좋아요취소 실패')
                    } else {
                        $scope.modalrefresh(board_id)
                    }
                })
                .error(function (data, status, headers, config) {
                    /* 서버와의 연결이 정상적이지 않을 때 처리 */
                    console.log(status);
                });
        };


        $scope.toOthers = function(others){
            $rootScope.others_id = others.user_id;
            if ($rootScope.othersStatus){
                $state.go("others1");
                $rootScope.othersStatus = false;
            }else{
                $state.go("others2");
                $rootScope.othersStatus = true;
            }
        };

        $scope.folderList = function () {
            $http({
                method: 'POST', //방식
                url: "/api/folderlist", /* 통신할 URL */
                data: userObject, /* 파라메터로 보낼 데이터 */
                headers: {'Content-Type': 'application/json; charset=utf-8'} //헤더
            })
                .then(function (response) {
                    $scope.folders = response.data;
                })
        };

        $scope.folderList();
        $scope.replylist($rootScope.modalboard);

        $scope.putInFolder = function (board_id, folder_id) {
            var folderObject = {
                board_id : board_id,
                folder_id : folder_id
            };
            $http({
                method: 'POST', //방식
                url: "/api/putInFolder", /* 통신할 URL */
                data: folderObject, /* 파라메터로 보낼 데이터 */
                headers: {'Content-Type': 'application/json; charset=utf-8'} //헤더
            })
                .then(function () {
                    alert('폴더에 담겼습니다.');
                })
        };


        $scope.commitReply = function (msg) {
            var replyObject =
            {
                user_id: userObject.user_id, //임시로 1번사용자 지정
                board_id: $rootScope.modalboard.board_id,
                reply: msg
            };
            $http({
                method: 'POST', //방식
                url: "/api/reply", /* 통신할 URL */
                data: replyObject, /* 파라메터로 보낼 데이터 */
                headers: {'Content-Type': 'application/json; charset=utf-8'} //헤더
            })
                .success(function (data, status, headers, config) {
                    if (data.msg == 'success') {
                        alert('댓글작성 성공');
                        $scope.replylist($rootScope.modalboard);
                    } else {
                        alert('댓글작성 실패');
                    }

                })
                .error(function (data, status, headers, config) {
                    /* 서버와의 연결이 정상적이지 않을 때 처리 */
                    console.log(status);
                });
        };
    })

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

 .controller('CarouselDemoCtrl', function ($scope) {
    $scope.myInterval = 5000;
    $scope.noWrapSlides = false;
    $scope.active = 0;
    var slides = $scope.slides = [];
    var currIndex = 0;

    $scope.addSlide = function() {
        var newWidth = 600 + slides.length + 1;
        slides.push({
            image: 'http://lorempixel.com/' + newWidth + '/300',
            text: ['Nice image','Awesome photograph','That is so cool','I love that'][slides.length % 4],
            id: currIndex++
        });
    };

    $scope.randomize = function() {
        var indexes = generateIndexesArray();
        assignNewIndexesToSlides(indexes);
    };

    for (var i = 0; i < 4; i++) {
        $scope.addSlide();
    }

    // Randomize logic below

    function assignNewIndexesToSlides(indexes) {
        for (var i = 0, l = slides.length; i < l; i++) {
            slides[i].id = indexes.pop();
        }
    }

    function generateIndexesArray() {
        var indexes = [];
        for (var i = 0; i < currIndex; ++i) {
            indexes[i] = i;
        }
        return shuffle(indexes);
    }

    // http://stackoverflow.com/questions/962802#962890
    function shuffle(array) {
        var tmp, current, top = array.length;

        if (top) {
            while (--top) {
                current = Math.floor(Math.random() * (top + 1));
                tmp = array[current];
                array[current] = array[top];
                array[top] = tmp;
            }
        }

        return array;
    }
})


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
    })


    .controller("subHeaderCtrl",function(store, $scope, $rootScope, $http, $filter){
        var userObject = store.get('obj');
        $scope.getAlertData = function () {
            $http({
                method: 'POST', //방식
                url: "/user/fullAlert", /* 통신할 URL */
                data: {
                    user_id : userObject.user_id,
                    currentTime : $filter('date')(new Date(), 'yyyy-MM-dd HH-mm-ss'),
                    checkedTime : userObject.updated_time
                }, /* 파라메터로 보낼 데이터 */
                headers: {'Content-Type': 'application/json; charset=utf-8'} //헤더
            })
                .then(function (response) {
                    if(response.data != null && response.data != undefined){
                        $scope.alertData = response.data;
                        for(var i=0;i<$scope.alertData.length;i++) {

                            $scope.convAlert($scope.alertData[i]);
                        }
                    }
                })
        };
        $scope.getAlertData();


        $scope.alertThings = [];


        $scope.toggleDropdown = function($event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.status.isopen = !$scope.status.isopen;
        };

        $scope.convAlert = function(data) {
            if(data.id == '1') {
                if (data.status == 0) {
                    $scope.alertThings.push({type: 'info', msg: data.name+'님께서 친구 신청 하셨습니다.'});
                }
                else if (data.status == 1)
                    $scope.alertThings.push({type: 'success', msg: data.name+'님께서 친구 승인 하셨습니다.'});
            }
            else if(data.id == '2') {
                $scope.alertThings.push({type: 'warning', msg: data.name+'님께서 댓글을 남겼습니다.'});
            }
            else if(data.id == '3'){
                $scope.alertThings.push({type: 'danger', msg: data.name+'님께서 게시물을 페이보릿 하셨습니다.'});
            }
            else if(data.id == '4'){
                $scope.alertThings.push({type: 'info', msg: data.name+'님께서 게시물을 공감하셨습니다.'});
            }
        };
        $scope.closeAlert = function(index) {
            $scope.alertThings.splice(index, 1);
        };

    })

    .controller("leftSideBarCtrl",function($interval, $scope, $http, store, $state, $uibModal, $rootScope, $filter){

    $scope.category_labels = ['영화를', '연극을', '콘서트를', '드라마를', '전시회를', '음식을', '여행을', '음악을'];
        var userObject = store.get('obj');

    //친구 추천 받기
    $http({
        method: 'POST', //방식
        url: "/user/findCategoryFriend", /* 통신할 URL */
        data: userObject, /* 파라메터로 보낼 데이터 */
        headers: {'Content-Type': 'application/json; charset=utf-8'} //헤더
    })
        .then(function(response) {
            $scope.friend_Object = response.data;
            $scope.friend_category = $scope.category_labels[$scope.friend_Object.catagory-1];
            //alert($scope.friend_Object.catagory);
            var Recommand_category = {
                catagory : $scope.friend_Object.catagory
            };
            $http({  //추천 테그정보 가져오기(사진 등..)
                method: 'POST', //방식
                url: "/tag/loadRecommandTag", /* 통신할 URL */
                data: Recommand_category, /* 파라메터로 보낼 데이터 */
                headers: {'Content-Type': 'application/json; charset=utf-8'} //헤더
            })
                .then(function (response) {
                    $scope.Recommand_tag = response.data;
                });
        });


    $scope.toTag = function(tags){
        $rootScope.tag_name = tags.tag;
        $state.go("tag");
    };

})

    .controller("indexCtrl",function($interval, $scope, $http, store, $state, $uibModal, $rootScope, $filter) {
        var userObject = store.get('obj');
        $scope.logoWidth = window.innerWidth/6;

        $scope.boardList = function () {
            $http({
                method: 'POST', //방식
                url: "/api/boardlist", /* 통신할 URL */
                data: userObject, /* 파라메터로 보낼 데이터 */
                headers: {'Content-Type': 'application/json; charset=utf-8'} //헤더
            })
                .then(function (response) {
                    $scope.boards = response.data;
                })
        };

        $scope.showFriendList = function () {
            $http({
                method: 'POST', //방식
                url: "/user/showfriends",
                data: userObject,
                headers: {'Content-Type': 'application/json; charset=utf-8'} //헤더
            })
                .then(function (response) {
                    $scope.friends = response.data;
                });
        };

        $scope.showFriendList();

        $scope.toOthers = function(others){
            $rootScope.others_id = others.user_id;
            if ($rootScope.othersStatus){
                $state.go("others1");
                $rootScope.othersStatus = false;
            }else{
                $state.go("others2");
                $rootScope.othersStatus = true;
            }
        };

        var timeObject ={};
        $scope.updateTime = function() {
            $scope.theTime = new Date().toLocaleTimeString();
            timeObject = {
                updated_time: $filter('date')(new Date(), 'yyyy-MM-dd HH-mm-ss'),
                user_id: store.get('obj').user_id
            };

            $http({
                method: 'POST', //방식
                url: "user/updateTime", /* 통신할 URL */
                data: timeObject, /* 파라메터로 보낼 데이터 */
                headers: {'Content-Type': 'application/json; charset=utf-8'} //헤더
            })
                .then(function (response) {
                })
        };
        $scope.folderList = function () {
            $http({
                method: 'POST', //방식
                url: "/api/folderlist", /* 통신할 URL */
                data: userObject, /* 파라메터로 보낼 데이터 */
                headers: {'Content-Type': 'application/json; charset=utf-8'} //헤더
            })
                .then(function (response) {
                    $scope.folders = response.data;
                })
        };

        $scope.boardList();
        $scope.folderList();
        $scope.updateTime();

        $scope.filters = {};
        //
        // $scope.category_labels = ['영화를', '연극을', '콘서트를', '드라마를', '전시회를', '음식을', '여행을', '음악을'];
        //
        //
        // //친구 추천 받기
        // $http({
        //     method: 'POST', //방식
        //     url: "/user/findCategoryFriend", /* 통신할 URL */
        //     data: userObject, /* 파라메터로 보낼 데이터 */
        //     headers: {'Content-Type': 'application/json; charset=utf-8'} //헤더
        // })
        //     .then(function(response) {
        //         $scope.friend_Object = response.data;
        //         $scope.friend_category = $scope.category_labels[$scope.friend_Object.catagory-1];
        //         //alert($scope.friend_Object.catagory);
        //         var Recommand_category = {
        //             catagory : $scope.friend_Object.catagory
        //         };
        //         $http({  //추천 테그정보 가져오기(사진 등..)
        //             method: 'POST', //방식
        //             url: "/tag/loadRecommandTag", /* 통신할 URL */
        //             data: Recommand_category, /* 파라메터로 보낼 데이터 */
        //             headers: {'Content-Type': 'application/json; charset=utf-8'} //헤더
        //         })
        //             .then(function (response) {
        //                 $scope.Recommand_tag = response.data;
        //             });
        //     });
        //
        //
        // $scope.toTag = function(tags){
        //     $rootScope.tag_name = tags.tag;
        //     $state.go("tag");
        // };



        $scope.putInFolder = function (board_id, folder_id) {
            var folderObject = {
                board_id : board_id,
                folder_id : folder_id
            };
            $http({
                method: 'POST', //방식
                url: "/api/putInFolder", /* 통신할 URL */
                data: folderObject, /* 파라메터로 보낼 데이터 */
                headers: {'Content-Type': 'application/json; charset=utf-8'} //헤더
            })
                .then(function () {
                    alert('폴더에 담겼습니다.');
                })
        };



        $scope.open = function (size, board) {
            $rootScope.modalboard=board;
            var modalInstance = $uibModal.open({
                templateUrl: 'modal.html',
                controller: 'ModalDemoCtrl',
                size: size
            });
            modalInstance.result.then(function () {

            }, function () {
                // $log.info('Modal dismissed at: ' + new Date());
                $rootScope.modalboard={};
                $rootScope.reply={};
                $scope.boardList();
            });
        };


        $scope.viewAll= function(){

            $http({
                method: 'POST', //방식
                url: "/api/boardlist", /* 통신할 URL */
                data: userObject, /* 파라메터로 보낼 데이터 */
                headers: {'Content-Type': 'application/json; charset=utf-8'} //헤더
            })
                .then(function(response) {
                    $scope.boards = response.data;
                    $scope.filters={};
                });
        };

        $scope.favoriteBoard = function (board_id) {
            $http({
                method: 'POST', //방식
                url: "/api/favoriteBoard", /* 통신할 URL */
                data: {user_id: userObject.user_id, board_id: board_id}, /* 파라메터로 보낼 데이터 */
                headers: {'Content-Type': 'application/json; charset=utf-8'} //헤더
            })
                .success(function (data, status, headers, config) {
                    if (data.msg == 'false') {
                        alert('페이버릿 실패')
                    } else {
                        $scope.boardList();
                    }
                })
                .error(function (data, status, headers, config) {
                    /* 서버와의 연결이 정상적이지 않을 때 처리 */
                    console.log(status);
                });
        };


        $scope.UnfavoriteBoard = function (board_id) {
            var UnfavoriteBoardObject =
            {
                user_id: userObject.user_id, //임시로 1번사용자 지정
                board_id: board_id
            };
            $http({
                method: 'POST', //방식
                url: "/api/UnfavoriteBoard", /* 통신할 URL */
                data: UnfavoriteBoardObject, /* 파라메터로 보낼 데이터 */
                headers: {'Content-Type': 'application/json; charset=utf-8'} //헤더
            })
                .success(function (data, status, headers, config) {
                    if (data.msg == 'false') {
                        alert('페이버릿취소 실패')
                    } else {
                        $scope.boardList();
                    }
                })
                .error(function (data, status, headers, config) {
                    /* 서버와의 연결이 정상적이지 않을 때 처리 */
                    console.log(status);
                });
        };


        //좋아요
        $scope.likeBoard = function (board_id) {
            $http({
                method: 'POST', //방식
                url: "/api/likeBoard", /* 통신할 URL */
                data: {user_id: userObject.user_id, board_id: board_id}, /* 파라메터로 보낼 데이터 */
                headers: {'Content-Type': 'application/json; charset=utf-8'} //헤더
            })
                .success(function (data, status, headers, config) {
                    if (data.msg == 'false') {
                        alert('좋아요 실패')
                    } else {
                        $scope.boardList();
                    }
                })
                .error(function (data, status, headers, config) {
                    /* 서버와의 연결이 정상적이지 않을 때 처리 */
                    console.log(status);
                });
        };

        //좋아요 취소
        $scope.dislikeBoard = function (board_id) {
            var dislikeBoardObject =
            {
                user_id: userObject.user_id, //임시로 1번사용자 지정
                board_id: board_id
            };
            $http({
                method: 'POST', //방식
                url: "/api/dislikeBoard", /* 통신할 URL */
                data: dislikeBoardObject, /* 파라메터로 보낼 데이터 */
                headers: {'Content-Type': 'application/json; charset=utf-8'} //헤더
            })
                .success(function (data, status, headers, config) {
                    if (data.msg == 'false') {
                        alert('좋아요취소 실패')
                    } else {
                        $scope.boardList();
                    }
                })
                .error(function (data, status, headers, config) {
                    /* 서버와의 연결이 정상적이지 않을 때 처리 */
                    console.log(status);
                });
        };

        $scope.filters = { };

        $scope.menuList = [
            {catagory: 1, link: "movie", title: "영화", icon1: "glyphicon", icon2: "glyphicon-film"},
            {catagory: 2, link: "act", title: "연극", icon1: "fa", icon2: "fa-street-view"},
            {catagory: 3, link: "concert", title: "콘서트", icon1: "fa", icon2: "fa-microphone"},
            {catagory: 4, link: "drama", title: "드라마", icon1: "fa", icon2: "fa-tv"},
            {catagory: 5, link: "exhibition", title: "전시회", icon1: "glyphicon", icon2: "glyphicon-blackboard"},
            {catagory: 6, link: "food", title: "음식", icon1: "glyphicon", icon2: "glyphicon-cutlery"},
            {catagory: 7, link: "travel", title: "여행", icon1: "glyphicon", icon2: "glyphicon-plane"},
            {catagory: 8, link: "music", title: "음악", icon1: "glyphicon", icon2: "glyphicon-music"}
        ];


    })




    .controller("loginCtrl",function($scope, $http, store, $state, $filter, $interval, $rootScope){


        $scope.login=[{
            login_id :"" ,password :""
        }];


        $scope.logout = function(){
            store.set('obj',null);
            $state.go('login');
        };

        $scope.loginPost = function(){
            var loginObject = {
                login_id : $scope.login.login_id,
                password : $scope.login.password
            };
            $http({
                method: 'POST', //방식
                url: "/user/login", /* 통신할 URL */
                data: loginObject, /* 파라메터로 보낼 데이터 */
                headers: {'Content-Type': 'application/json; charset=utf-8'} //헤더
            })
                .success(function (data, status, headers, config) {
                    if(data){
                        if (data.msg != 'fales') {
                            var myInfo = {
                                login_id: data.msg,
                                user_id: data.result,
                                login_time: $filter('date')(new Date(), 'yyyy-MM-dd HH-mm-ss'),
                                updated_time : data.updated_time
                            };

                            store.set('obj',myInfo);
                            $rootScope.checkedTime = $filter('date')(new Date(), 'yyyy-MM-dd HH-mm-ss');
                            $state.go('main');
                            /* 맞음 */
                        }
                        else {
                            console.log('login_fail');
                            /* 틀림 */
                        }
                    }
                    else {
                        console.log('에러에러에러');
                    }
                })
                .error(function (data, status, headers, config) {
                    /* 서버와의 연결이 정상적이지 않을 때 처리 */
                    console.log(status);
                });
        };

    })

    .controller("joinCtrl",function($scope, $http, $state){
        var checkedId = "";
        $scope.join=[{
            login_id :"" ,password :"", passwordck :"", name :"", sex :"", born1 :"", born2 :"", born3 :"", email:""
        }];

        $scope.idCheck = function(id){
            $http({
                method: 'POST', //방식
                url: "/user/checkID", /* 통신할 URL */
                data: {login_id : id}, /* 파라메터로 보낼 데이터 */
                headers: {'Content-Type': 'application/json; charset=utf-8'} //헤더
            })
                .success(function (data, status, headers, config) {
                    if(data){
                        if (data.result == 0) { //존재하지 않음,아이디 사용가능
                            checkedId = id;
                            alert('"'+id+'"' + '는 사용 가능합니다.');
                            /* 맞음 */
                        }
                        else {
                            alert('"'+id+'"' + '는 사용 불가능합니다.'),
                                $scope.join.login_id = "";
                            console.log('아이디 사용 불가');
                            /* 틀림 */
                        }
                    }
                    else {
                        console.log('에러에러에러');

                    }
                })

        }

        $scope.joinPost = function(){
            var joinObject = {
                login_id : $scope.join.login_id,
                password : $scope.join.password,
                name : $scope.join.name,
                sex : $scope.join.sex,
                born : $scope.join.born1 + $scope.join.born2  + $scope.join.born3 ,
                email : $scope.join.email
            };


            if (checkedId != joinObject.login_id){
                alert('아이디를 중복 체크 해주세요!!');
            }
            else{

            if ($scope.join.password != $scope.join.passwordck)
            {
                alert('비밀번호가 틀립니다.');
                $scope.join.password = "",
                $scope.join.passwordck = ""
            }
            else{

            
            $http({
                method: 'POST', //방식
                url: "/user/join", /* 통신할 URL */
                data: joinObject, /* 파라메터로 보낼 데이터 */
                headers: {'Content-Type': 'application/json; charset=utf-8'} //헤더
            })
                .success(function (data, status, headers, config) {
                    if(data){
                        if (data.msg == 'success') {
                            // alert(data.msg)
                            $state.go('login1');
                            /* 맞음 */
                        }
                        else {
                            console.log('join_fail');
                            /* 틀림 */
                        }
                    }
                    else {
                        console.log('에러에러에러');

                    }
                })
                .error(function (data, status, headers, config) {
                    /* 서버와의 연결이 정상적이지 않을 때 처리 */
                    console.log(status);
                });
        };
        }}
    })



    .controller("findIDCtrl",function($scope, $http){

        $scope.findID=[{
            name :"", born1 :"", born2 :"", born3 :""
        }];

        $scope.findIDPost = function(){
            var findIDObject = {
                name : $scope.findID.name,
                born : $scope.findID.born1 + $scope.findID.born2  + $scope.findID.born3
            };
            $http({
                method: 'POST', //방식
                url: "/user/findID", /* 통신할 URL */
                data: findIDObject, /* 파라메터로 보낼 데이터 */
                headers: {'Content-Type': 'application/json; charset=utf-8'} //헤더
            })
                .success(function (data, status, headers, config) {
                    if(data.msg == 'false') {
                        alert('해당하는 아이디가 없습니다.')
                    }else{
                        alert('아이디는 '+ data.msg + '입니다.');
                        window.location.href = 'main.html';
                    }
                })
                .error(function (data, status, headers, config) {
                    /* 서버와의 연결이 정상적이지 않을 때 처리 */
                    console.log(status);
                });
        };
    })


    .controller("findPASSCtrl",function($scope, $http){

        $scope.findPASS=[{
            login_id :"", email :""
        }];

        $scope.findPASSPost = function(){
            var findPASSObject = {
                login_id : $scope.findPASS.login_id,
                email : $scope.findPASS.email
            };
            $http({
                method: 'POST', //방식
                url: "/user/findPASS", /* 통신할 URL */
                data: findPASSObject, /* 파라메터로 보낼 데이터 */
                headers: {'Content-Type': 'application/json; charset=utf-8'} //헤더
            })
                .success(function (data, status, headers, config) {
                    if(data.msg == 'false') {
                        alert('해당하는 비밀번호가 없습니다.')
                    }else{
                        alert('비밀번호는 '+ data.msg + '입니다.');
                        window.location.href = 'main.html';
                    }
                })
                .error(function (data, status, headers, config) {
                    /* 서버와의 연결이 정상적이지 않을 때 처리 */
                    console.log(status);
                });
        };
    })



    .controller("uploadCtrl", function($scope, $log, Upload, $timeout, store, $state) {
        var userObject = store.get('obj');
        var res="";
        $scope.openAccess = [
            {id :1 ,title :"전체공개"},
            {id :2, title :"Toline"},
            {id :3, title :"나만보기"}
        ];
        $scope.catagory = [
            {id :1 , title :"영화"},
            {id :2 , title :"연극"},
            {id :3 , title :"콘서트"},
            {id :4 , title :"드라마"},
            {id :5 , title :"전시회"},
            {id :6 , title :"음식"},
            {id :7 , title :"여행"},
            {id :8 , title :"음악"}
        ];
        $scope.p_level = $scope.openAccess[0];
        $scope.c_list = $scope.catagory[0];




        $scope.leftClass = function () {
            $scope.class_name = "left";
            $scope.multi_message = "좌측 정렬 되었습니다.";
        };
        $scope.centerClass = function () {
            $scope.class_name = "center";
            $scope.multi_message = "가운데 정렬 되었습니다.";
        };
        $scope.rightClass = function () {
            $scope.class_name = "right";
            $scope.multi_message = "우측 정렬 되었습니다.";
        };
        $scope.leftClass2 = function () {
            $scope.class_name2 = "left2";
            $scope.multi_message2 = "좌측 정렬 되었습니다.";
        };
        $scope.centerClass2 = function () {
            $scope.class_name2 = "center2";
            $scope.multi_message2 = "가운데 정렬 되었습니다.";
        };
        $scope.rightClass2 = function () {
            $scope.class_name2 = "right2";
            $scope.multi_message2 = "우측 정렬 되었습니다.";
        };

        $scope.lines = [
            {
                "firstLine": "",
                "secondLine": "",
                "tag1":"",
                "tag2":"",
                "tag3":""
            }
        ];
        $scope.positions = [
            {
                "divtop1": 0
            }
        ];
        $scope.positions2 = [
            {
                "divtop2": 0
            }
        ];

         $scope.myFunction = function() {
             var words = $scope.lines.firstLine + " " + $scope.lines.secondLine + " ";
           // var words = $scope.lines.firstLine.concat(" ".concat($scope.lines.secondLine));
            //삭제어
           res = words.replace(/은 |는 |이 |이고 |가 |의 |을 |를 |야 |나랑 |하는 |들과 |일 |했던 |한 |내 |너 |나 |네 |하니까 |엔 |앤 |에서 |으로 |이면 |하게 |하는 |으로 |한다 |한다면 |입니당 |입니다 |습니당 |습니다 |어요 |지요 |며 |다면 |니 |자 /gi , " ");  //조사  //동사 꾸밈어  //종조사

            //대체어
            // res = res.replace(/[?]/gi, " 물음표 ");  // ?
            // res = res.replace(/[!]/gi, " 느낌표 ");  // !
            // res = res.replace(/[~]/gi, " 물결 ");  // ~
             res = res.replace(/[~!?@\#$%^&*\()\-=+_']/gi, "");  //특수문자 삭제

            res = res.split(" "); //배열로 분해

            $scope.words = res;
        };

        $scope.uploadPic = function(file,p_level,c_list)  {

            file.upload = Upload.upload({
                url: '/api/board',
                data: {
                    file:file,
                    user_id:userObject.user_id,
                    public_level:p_level.id,
                    catagory:c_list.id,
                    likes_num: 0,
                    tag1: $scope.lines.tag1,
                    tag2: $scope.lines.tag2,
                    tag3: $scope.lines.tag3,
                    line1: $scope.lines.firstLine,
                    line1_y: $scope.positions.divtop1,
                    line2: $scope.lines.secondLine,
                    line2_y: $scope.positions2.divtop2,
                    words: $scope.words
                }})
            file.upload.then(function (response) {
                $timeout(function () {
                    file.result = response.data;
                    $state.go('main2');
                });
            }, function (response) {
                if (response.status > 0){
                    $scope.errorMsg = response.status + ': ' + response.data;
                    alert("response.status > 0");}
            }, function (evt) {
                // Math.min is to fix IE which reports 200% sometimes
                file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
            });
        };
    })


    .controller("alertCtrl", function ($rootScope,$scope,$http, store, $state, $interval, $filter) {

        var userObject = store.get('obj');

        $scope.alerts = [];

        $scope.addAlert = function(data) {
            if(data.id == '1') {
                if (data.status == 0) {
                    $scope.alerts.push({type: 'info', msg: data.name+'님께서 친구 신청 하셨습니다.'});
                }
                else if (data.status == 1)
                    $scope.alerts.push({type: 'success', msg: data.name+'님께서 친구 승인 하셨습니다.'});
            }
            else if(data.id == '2') {
                $scope.alerts.push({type: 'warning', msg: data.name+'님께서 댓글을 남겼습니다.'});
            }
            else if(data.id == '3'){
                $scope.alerts.push({type: 'danger', msg: data.name+'님께서 게시물을 페이보릿 하셨습니다.'});
            }
            else if(data.id == '4'){
                $scope.alerts.push({type: 'info', msg: data.name+'님께서 게시물을 공감하셨습니다.'});
            }
        };
        $scope.closeAlert = function(index) {
            $scope.alerts.splice(index, 1);
        };

        $rootScope.checkedTime = null;
        $scope.StartTimer = function () {
            $scope.Noti = $interval(function () {
                    if ($rootScope.checkedTime != null) {
                        if (store.get('obj') == null) {
                            $interval.cancel($scope.Noti);
                        }
                        $rootScope.currentTime = $filter('date')(new Date(), 'yyyy-MM-dd HH-mm-ss');
                        $scope.CallNotiApi();
                    }
                    else {
                        $rootScope.checkedTime = $filter('date')(new Date(), 'yyyy-MM-dd HH-mm-ss');
                    }

            }, 10000);
        };

        //Timer stop function.
        $scope.CallNotiApi = function () {
            $http({
                method: 'POST', //방식
                url: "/user/notification",
                data: {
                    user_id : userObject.user_id,
                    currentTime : $rootScope.currentTime,
                    checkedTime : $rootScope.checkedTime
                },
                headers: {'Content-Type': 'application/json; charset=utf-8'}
            })
                .then(function (response) {
                    if(response.data != null && response.data != undefined){
                        $scope.datas = response.data;
                        for(var i=0;i<$scope.datas.length;i++) {
                            $scope.addAlert($scope.datas[i]);
                        }
                        $rootScope.checkedTime = $rootScope.currentTime
                    }
                })
        };

        $scope.StartTimer();

    })

    .controller("findCtrl",function($rootScope,$scope,$http, store, $state){




        $scope.find_user = "";


        $scope.logout = function(){
            store.set('obj',null);
            $state.go('login');
        };


        $scope.keyHit = function() {

            $http.get("/user/findUser/"+$scope.find_user)
                .then(function (response) {
                    $scope.users = response.data;
                });

            $http.get("/tag/findTag/"+$scope.find_user)
                .then(function (response) {
                    $scope.tags = response.data; 
                });
        };

        $scope.toTag = function(tags){
            $rootScope.tag_name = tags.tag;
            $state.go("tag");
        };


        var userObject = store.get('obj');

        $scope.user_Object=[{
            user_id : userObject.user_id,
            user_img : "",
            name : userObject.name
        }];
        $http({
            method: 'POST', //방식
            url: "/user/loadProfile", /* 통신할 URL */
            data: userObject, /* 파라메터로 보낼 데이터 */
            headers: {'Content-Type': 'application/json; charset=utf-8'} //헤더
        })
            .then(function(response) {
                $scope.user_Object = response.data;
            });
    })


    .controller("othersCtrl",function($rootScope,$scope,$http, store, $state,$filter, $uibModal) {
        var othersObject = {
           user_id : $rootScope.others_id
        };
        $scope.back_num = 'img/back'+Math.floor((Math.random()*1000)%5 +1)+'.PNG';

        var userObject = store.get('obj')

        $scope.open = function (size, board) {
            $rootScope.modalboard=board;
            var modalInstance = $uibModal.open({
                templateUrl: 'modal.html',
                controller: 'ModalDemoCtrl',
                size: size
            });
            modalInstance.result.then(function () {

            }, function () {
                // $log.info('Modal dismissed at: ' + new Date());
                $rootScope.modalboard={};
                $rootScope.reply={};
                $scope.getOthersData();
            });
        };

        $scope.favoriteBoard = function (board_id) {
            $http({
                method: 'POST', //방식
                url: "/api/favoriteBoard", /* 통신할 URL */
                data: {user_id: userObject.user_id, board_id: board_id}, /* 파라메터로 보낼 데이터 */
                headers: {'Content-Type': 'application/json; charset=utf-8'} //헤더
            })
                .success(function (data, status, headers, config) {
                    if (data.msg == 'false') {
                        alert('페이버릿 실패')
                    } else {
                        $scope.getOthersData();
                    }
                })
                .error(function (data, status, headers, config) {
                    /* 서버와의 연결이 정상적이지 않을 때 처리 */
                    console.log(status);
                });
        };


        $scope.UnfavoriteBoard = function (board_id) {
            var UnfavoriteBoardObject =
            {
                user_id: userObject.user_id, //임시로 1번사용자 지정
                board_id: board_id
            };
            $http({
                method: 'POST', //방식
                url: "/api/UnfavoriteBoard", /* 통신할 URL */
                data: UnfavoriteBoardObject, /* 파라메터로 보낼 데이터 */
                headers: {'Content-Type': 'application/json; charset=utf-8'} //헤더
            })
                .success(function (data, status, headers, config) {
                    if (data.msg == 'false') {
                        alert('페이버릿취소 실패')
                    } else {
                        $scope.getOthersData();
                    }
                })
                .error(function (data, status, headers, config) {
                    /* 서버와의 연결이 정상적이지 않을 때 처리 */
                    console.log(status);
                });
        };


        //좋아요
        $scope.likeBoard = function (board_id) {
            $http({
                method: 'POST', //방식
                url: "/api/likeBoard", /* 통신할 URL */
                data: {user_id: userObject.user_id, board_id: board_id}, /* 파라메터로 보낼 데이터 */
                headers: {'Content-Type': 'application/json; charset=utf-8'} //헤더
            })
                .success(function (data, status, headers, config) {
                    if (data.msg == 'false') {
                        alert('좋아요 실패')
                    } else {
                        $scope.getOthersData();
                    }
                })
                .error(function (data, status, headers, config) {
                    /* 서버와의 연결이 정상적이지 않을 때 처리 */
                    console.log(status);
                });
        };

        //좋아요 취소
        $scope.dislikeBoard = function (board_id) {
            var dislikeBoardObject =
            {
                user_id: userObject.user_id, //임시로 1번사용자 지정
                board_id: board_id
            };
            $http({
                method: 'POST', //방식
                url: "/api/dislikeBoard", /* 통신할 URL */
                data: dislikeBoardObject, /* 파라메터로 보낼 데이터 */
                headers: {'Content-Type': 'application/json; charset=utf-8'} //헤더
            })
                .success(function (data, status, headers, config) {
                    if (data.msg == 'false') {
                        alert('좋아요취소 실패')
                    } else {
                        $scope.getOthersData();
                    }
                })
                .error(function (data, status, headers, config) {
                    /* 서버와의 연결이 정상적이지 않을 때 처리 */
                    console.log(status);
                });
        };


        $scope.userCloud = function () {
            $http({  //TODO 테그된 게시글 가져오기
                method: 'POST', //방식
                url: "/user/getUserWords", /* 통신할 URL */
                data: othersObject, /* 파라메터로 보낼 데이터 */
                headers: {'Content-Type': 'application/json; charset=utf-8'} //헤더
            })
                .then(function (response) {
                    $scope.Cwords = response.data;
                });
            $scope.colors = ["#800026", "#bd0026", "#e31a1c", "#fc4e2a", "#fd8d3c", "#5CD1E5", "#FFA7A7"];



            $scope.update = function() {
                $scope.Cwords.splice(-5);
            };
        };

        $scope.userCloud();

        $scope.category_labels = ['영화', '연극', '콘서트', '드라마', '전시회', '음식', '여행', '음악'];

        $scope.getUserValue = function () {
            $http({
                method: 'POST', //방식
                url: "/user/getUserValue", /* 통신할 URL */
                data: othersObject, /* 파라메터로 보낼 데이터 */
                headers: {'Content-Type': 'application/json; charset=utf-8'} //헤더
            })
                .then(function (response) {
                    $scope.Cdata = response.data;
                });
        };

        $scope.getUserValue();


        $scope.onClick = function (points, evt) {
            console.log(points, evt);
        };


        var checkObject={
            user_id : userObject.user_id,
            friend_id :$scope.others_id
        };

        $scope.getOthersData=function () {

            $http({
                method: 'POST', //방식
                url: "/user/loadProfile", /* 통신할 URL */
                data: othersObject, /* 파라메터로 보낼 데이터 */
                headers: {'Content-Type': 'application/json; charset=utf-8'} //헤더
            })
                .then(function (response) {
                    $scope.Profile = response.data;
                });
            //친구여부 확인
            $http({
                method: 'POST', //방식
                url: "/user/checkfriends", /* 통신할 URL */
                data: checkObject, /* 파라메터로 보낼 데이터 */
                headers: {'Content-Type': 'application/json; charset=utf-8'} //헤더
            })
                .then(function (response) {
                    $scope.check = response.data.msg;

                });

            //친구게시물만 나열하기
            $http({
                method: 'POST', //방식
                url: "/folder/openMyFolder", /* 통신할 URL */
                data: othersObject, /* 파라메터로 보낼 데이터 */
                headers: {'Content-Type': 'application/json; charset=utf-8'} //헤더
            })
                .then(function (response) {
                    $scope.my_boards = response.data;
                });
        }



        $scope.getOthersData();


        var timeObject ={};
        $scope.updateTime = function() {
            $scope.theTime = new Date().toLocaleTimeString();
            timeObject = {
                updated_time: $filter('date')(new Date(), 'yyyy-MM-dd HH-mm-ss'),
                user_id: store.get('obj').user_id
            };

            $http({
                method: 'POST', //방식
                url: "user/updateTime", /* 통신할 URL */
                data: timeObject, /* 파라메터로 보낼 데이터 */
                headers: {'Content-Type': 'application/json; charset=utf-8'} //헤더
            })
                .then(function (response) {
                })
        };
        $scope.updateTime();

        $scope.toOthers = function(others){
            $rootScope.others_id = others.user_id;
            if ($rootScope.othersStatus){
                $state.go("others1");
                $rootScope.othersStatus = false;
            }else{
                $state.go("others2");
                $rootScope.othersStatus = true;
            }
        };

        $scope.getOthersInfo = function () {
            $http({
                method: 'POST', //방식
                url: "/user/loadProfile", /* 통신할 URL */
                data: othersObject, /* 파라메터로 보낼 데이터 */
                headers: {'Content-Type': 'application/json; charset=utf-8'} //헤더
            })
                .then(function (response) {
                    $scope.Profile = response.data;
                });

            $http({
                method: 'POST', //방식
                url: "/folder/openMyFolder", /* 통신할 URL */
                data: othersObject, /* 파라메터로 보낼 데이터 */
                headers: {'Content-Type': 'application/json; charset=utf-8'} //헤더
            })
                .then(function (response) {
                    $scope.my_boards = response.data;
                });

        };

        $scope.showFriendList = function () {
            $http({
                method: 'POST', //방식
                url: "/user/showfriends",
                data: userObject,
                headers: {'Content-Type': 'application/json; charset=utf-8'} //헤더
            })
                .then(function (response) {
                    $scope.friends = response.data;
                });
            };


        $scope.showFriendList()

        $scope.applyFriend = function(){
            var applyObject ={
                user_id : store.get('obj').user_id,
                friend_id : $scope.others_id
            };
            $http({
                method: 'POST', //방식
                url: "/user/requestFriend", /* 통신할 URL */
                data: applyObject, /* 파라메터로 보낼 데이터 */
                headers: {'Content-Type': 'application/json; charset=utf-8'} //헤더
            })
                .success(function(data, status, headers, config) {
                    if( data ) {
                        $http({
                            method: 'POST', //방식
                            url: "/user/checkfriends", /* 통신할 URL */
                            data: checkObject, /* 파라메터로 보낼 데이터 */
                            headers: {'Content-Type': 'application/json; charset=utf-8'} //헤더
                        })
                            .then(function (response) {
                                $scope.check = response.data.msg;

                            });
                    }
                    else {
                        alert("실패")
                    }
                })
        }


        $scope.folderList = function () {
            $http({
                method: 'POST', //방식
                url: "/api/folderlist", /* 통신할 URL */
                data: userObject, /* 파라메터로 보낼 데이터 */
                headers: {'Content-Type': 'application/json; charset=utf-8'} //헤더
            })
                .then(function (response) {
                    $scope.folders = response.data;
                })
        };
        $scope.folderList();

        $scope.putInFolder = function (board_id, folder_id) {
            var folderObject = {
                board_id : board_id,
                folder_id : folder_id
            };
            $http({
                method: 'POST', //방식
                url: "/api/putInFolder", /* 통신할 URL */
                data: folderObject, /* 파라메터로 보낼 데이터 */
                headers: {'Content-Type': 'application/json; charset=utf-8'} //헤더
            })
                .then(function () {
                    alert('폴더에 담겼습니다.');
                })
        };

    })



    .controller('catagoryCtrl', function($scope,$http, store, $state, $rootScope){


        var userObject = store.get('obj');

        $scope.colorCode1 = "#" + Math.round(Math.random() * 0xFFFFFF).toString(16);
        $scope.colorCode2 = "#" + Math.round(Math.random() * 0xFFFFFF).toString(16);
        $scope.colorCode3 = "#" + Math.round(Math.random() * 0xFFFFFF).toString(16);

        $http({
            method: 'POST', //방식
            url: "/api/boardlist", /* 통신할 URL */
            data: userObject, /* 파라메터로 보낼 데이터 */
            headers: {'Content-Type': 'application/json; charset=utf-8'} //헤더
        })
            .then(function(response) {
                $scope.catagory_boards = response.data;
                $scope.tagArray= [];
                for(var i=0;i<$scope.catagory_boards.length;i++) {
                    $scope.checkPush($scope.catagory_boards.tag1);
                    $scope.checkPush($scope.catagory_boards.tag2);
                    $scope.checkPush($scope.catagory_boards.tag3);
                }
                $scope.checkPush = function (data) {
                    for(var j=0; j<$scope.tagArray.length; j++){
                        if(tagArray[j].tag == data)
                        {
                            $scope.tagIsIn = true;
                        }
                        else{
                            $scope.tagIsIn = false;
                        }
                    }
                    if($scope.tagIsIn){
                        $scope.tagArray.push($scope.catagory_boards.tag1);
                    }
                    else{
                        alert('엘스 떴다.');
                    }
                }

            });

        $scope.view_allCatagory = function(){
            $http({
                method: 'POST', //방식
                url: "/api/boardlist", /* 통신할 URL */
                data: userObject, /* 파라메터로 보낼 데이터 */
                headers: {'Content-Type': 'application/json; charset=utf-8'} //헤더
            })
                .then(function(response) {
                    $scope.catagory_boards = response.data;
                    $scope.filters_catagory ={};
                    // $scope.getTagElement($scope.catagory_boards);
                });

        };

        $scope.toOthers = function(others){
            $rootScope.others_id = others.user_id;
            if ($rootScope.othersStatus){
                $state.go("others1");
                $rootScope.othersStatus = false;
            }else{
                $state.go("others2");
                $rootScope.othersStatus = true;
            }
        };



        $scope.showFriendList = function () {
            $http({
                method: 'POST', //방식
                url: "/user/showfriends",
                data: userObject,
                headers: {'Content-Type': 'application/json; charset=utf-8'} //헤더
            })
                .then(function (response) {
                    $scope.friends = response.data;
                });
        };


        $scope.showFriendList()

        //클릭시마다 카테고리 변수를 갱신할 변수.
        $scope.filters_catagory={};

        $scope.menuList = [
            {catagory :1, link :"movie", title: "영화", icon1: "glyphicon" , icon2 : "glyphicon-film"},
            {catagory :2, link :"act", title: "연극", icon1: "fa", icon2 : "fa-street-view"},
            {catagory :3, link :"concert", title: "콘서트",  icon1: "fa" , icon2 : "fa-microphone"},
            {catagory :4, link :"drama", title: "드라마", icon1: "fa", icon2 : "fa-tv"},
            {catagory :5, link :"exhibition", title: "전시회", icon1: "glyphicon" , icon2 : "glyphicon-blackboard"},
            {catagory :6, link :"food", title: "음식", icon1: "glyphicon" , icon2 : "glyphicon-cutlery"},
            {catagory :7, link :"travel", title: "여행", icon1: "glyphicon" , icon2 : "glyphicon-plane"},
            {catagory :8, link :"music", title: "음악", icon1: "glyphicon" , icon2 : "glyphicon-music"}
        ];



        $scope.catagoryPost = function(menu) {

            var catagoryObject =
            {catagory: menu.catagory};

            $http({
                method: 'POST', //방식
                url: "/api/boardlistByCatagory", /* 통신할 URL */
                data: catagoryObject, /* 파라메터로 보낼 데이터 */
                headers: {'Content-Type': 'application/json; charset=utf-8'} //헤더
            })
                .then(function (response) {
                    $scope.catagory_boards = response.data;
                    //$scope.$apply();
                })
        };

        $scope.toTag = function(tags){
            $rootScope.tag_name = tags;
            $state.go("tag");
        }
    })

    //프로필 페이지 컨트롤러

    .controller('profileCtrl', function($scope,$http,Upload,store, $rootScope, $uibModal,$timeout,$state,$filter,$rootScope){

        var userObject = store.get('obj');
        $scope.back_num = 'img/back'+Math.floor((Math.random()*1000)%5 +1)+'.PNG';


        $scope.getProfileData=function () {
            $http({
                method: 'POST',
                url: "/user/loadProfile",
                data: userObject,
                headers: {'Content-Type': 'application/json; charset=utf-8'}
            })
                .then(function (response) {
                    $scope.Profile = response.data;
                });
        }

        $scope.getProfileData();


        $scope.userCloud = function () {
            $http({ 
                method: 'POST', //방식
                url: "/user/getUserWords", /* 통신할 URL */
                data: userObject, /* 파라메터로 보낼 데이터 */
                headers: {'Content-Type': 'application/json; charset=utf-8'} //헤더
            })
                .then(function (response) {
                    $scope.Cwords = response.data;
                });
            $scope.colors = ["#800026", "#bd0026", "#e31a1c", "#fc4e2a", "#fd8d3c", "#5CD1E5", "#FFA7A7"];



            $scope.update = function() {
                $scope.Cwords.splice(-5);
            };
        };

        $scope.userCloud();

        $scope.category_labels = ['영화', '연극', '콘서트', '드라마', '전시회', '음식', '여행', '음악'];

        $scope.getUserValue = function () {
            $http({ 
                method: 'POST', //방식
                url: "/user/getUserValue", /* 통신할 URL */
                data: userObject, /* 파라메터로 보낼 데이터 */
                headers: {'Content-Type': 'application/json; charset=utf-8'} //헤더
            })
                .then(function (response) {
                    $scope.Cdata = response.data;
                });
        };

        $scope.getUserValue();


        $scope.onClick = function (points, evt) {
            console.log(points, evt);
        };

        $scope.openMyFolder = function () {
            $http({
                method: 'POST', //방식
                url: "/folder/openMyFolder", /* 통신할 URL */
                data: userObject, /* 파라메터로 보낼 데이터 */
                headers: {'Content-Type': 'application/json; charset=utf-8'} //헤더
            })
                .then(function (response) {
                    $scope.my_boards = response.data;
                });
        };

        $scope.open = function (size, board) {
            $rootScope.modalboard=board;
            var modalInstance = $uibModal.open({
                templateUrl: 'modal.html',
                controller: 'ModalDemoCtrl',
                size: size
            });
            modalInstance.result.then(function () {

            }, function () {
                // $log.info('Modal dismissed at: ' + new Date());
                $rootScope.modalboard={};
                $rootScope.reply={};
                $scope.openMyFolder();
            });
        };


        $scope.openMyFolder();
        var timeObject ={};
        $scope.updateTime = function() {
            $scope.theTime = new Date().toLocaleTimeString();
            timeObject = {
                updated_time: $filter('date')(new Date(), 'yyyy-MM-dd HH-mm-ss'),
                user_id: store.get('obj').user_id
            };

            $http({
                method: 'POST', //방식
                url: "user/updateTime", /* 통신할 URL */
                data: timeObject, /* 파라메터로 보낼 데이터 */
                headers: {'Content-Type': 'application/json; charset=utf-8'} //헤더
            })
                .then(function (response) {
                })
        };
        $scope.updateTime();

        $scope.uploadProfile = function(file)  {

            file.upload = Upload.upload({
                url: '/user/insertUserImage',
                data: {
                    file:file,
                    user_id:userObject.user_id
                }});
            file.upload.then(function (response) {
                $timeout(function () {
                    file.result = response.data;
                    $state.go('profile');
                });
            }, function (response) {
                if (response.status > 0){
                    $scope.errorMsg = response.status + ': ' + response.data;
                    alert("response.status > 0");}
            }, function (evt) {
                // Math.min is to fix IE which reports 200% sometimes
                file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
            });
        };

        $scope.toOthers = function(others){
            $rootScope.others_id = others.user_id;
            if ($rootScope.othersStatus){
                $state.go("others1");
                $rootScope.othersStatus = false;
            }else{
                $state.go("others2");
                $rootScope.othersStatus = true;
            }
        };



        $scope.showFriendList = function () {
            $http({
                method: 'POST', //방식
                url: "/user/showfriends",
                data: userObject,
                headers: {'Content-Type': 'application/json; charset=utf-8'} //헤더
            })
                .then(function (response) {
                    $scope.friends = response.data;
                });
        };


        $scope.showFriendList()


        $scope.folderList = function () {
            $http({
                method: 'POST', //방식
                url: "/api/folderlist", /* 통신할 URL */
                data: userObject, /* 파라메터로 보낼 데이터 */
                headers: {'Content-Type': 'application/json; charset=utf-8'} //헤더
            })
                .then(function (response) {
                    $scope.folders = response.data;
                })
        };
        $scope.folderList();

        $scope.putInFolder = function (board_id, folder_id) {
            var folderObject = {
                board_id : board_id,
                folder_id : folder_id
            };
            $http({
                method: 'POST', //방식
                url: "/api/putInFolder", /* 통신할 URL */
                data: folderObject, /* 파라메터로 보낼 데이터 */
                headers: {'Content-Type': 'application/json; charset=utf-8'} //헤더
            })
                .then(function () {
                    alert('폴더에 담겼습니다.');
                })
        };

        $scope.favoriteBoard = function (board_id) {
            $http({
                method: 'POST', //방식
                url: "/api/favoriteBoard", /* 통신할 URL */
                data: {user_id: userObject.user_id, board_id: board_id}, /* 파라메터로 보낼 데이터 */
                headers: {'Content-Type': 'application/json; charset=utf-8'} //헤더
            })
                .success(function (data, status, headers, config) {
                    if (data.msg == 'false') {
                        alert('페이버릿 실패')
                    } else {
                        $scope.openMyFolder()
                    }
                })
                .error(function (data, status, headers, config) {
                    /* 서버와의 연결이 정상적이지 않을 때 처리 */
                    console.log(status);
                });
        };


        $scope.UnfavoriteBoard = function (board_id) {
            var UnfavoriteBoardObject =
            {
                user_id: userObject.user_id, //임시로 1번사용자 지정
                board_id: board_id
            };
            $http({
                method: 'POST', //방식
                url: "/api/UnfavoriteBoard", /* 통신할 URL */
                data: UnfavoriteBoardObject, /* 파라메터로 보낼 데이터 */
                headers: {'Content-Type': 'application/json; charset=utf-8'} //헤더
            })
                .success(function (data, status, headers, config) {
                    if (data.msg == 'false') {
                        alert('페이버릿취소 실패')
                    } else {
                        $scope.openMyFolder()
                    }
                })
                .error(function (data, status, headers, config) {
                    /* 서버와의 연결이 정상적이지 않을 때 처리 */
                    console.log(status);
                });
        };


        //좋아요
        $scope.likeBoard = function (board_id) {
            $http({
                method: 'POST', //방식
                url: "/api/likeBoard", /* 통신할 URL */
                data: {user_id: userObject.user_id, board_id: board_id}, /* 파라메터로 보낼 데이터 */
                headers: {'Content-Type': 'application/json; charset=utf-8'} //헤더
            })
                .success(function (data, status, headers, config) {
                    if (data.msg == 'false') {
                        alert('좋아요 실패')
                    } else {
                        $scope.openMyFolder()
                    }
                })
                .error(function (data, status, headers, config) {
                    /* 서버와의 연결이 정상적이지 않을 때 처리 */
                    console.log(status);
                });
        };

        //좋아요 취소
        $scope.dislikeBoard = function (board_id) {
            var dislikeBoardObject =
            {
                user_id: userObject.user_id, //임시로 1번사용자 지정
                board_id: board_id
            };
            $http({
                method: 'POST', //방식
                url: "/api/dislikeBoard", /* 통신할 URL */
                data: dislikeBoardObject, /* 파라메터로 보낼 데이터 */
                headers: {'Content-Type': 'application/json; charset=utf-8'} //헤더
            })
                .success(function (data, status, headers, config) {
                    if (data.msg == 'false') {
                        alert('좋아요취소 실패')
                    } else {
                        $scope.openMyFolder()
                    }
                })
                .error(function (data, status, headers, config) {
                    /* 서버와의 연결이 정상적이지 않을 때 처리 */
                    console.log(status);
                });
        };
    })

    //테그 프로필페이지 컨트롤러
    .controller("tagCtrl",function($rootScope,$scope,$http, store, $uibModal, $state) {
        $scope.chart_view = 1;

        var userObject = store.get('obj');
        $scope.tag_name = $rootScope.tag_name;
        $scope.back_num = 'img/back'+Math.floor((Math.random()*1000)%5 +1)+'.PNG';

        var tagObject = {
            user_id : userObject.user_id,
            tag : $scope.tag_name
        };

        $scope.toOthers = function(others){
            $rootScope.others_id = others.user_id;
            if ($rootScope.othersStatus){
                $state.go("others1");
                $rootScope.othersStatus = false;
            }else{
                $state.go("others2");
                $rootScope.othersStatus = true;
            }
        };

        $scope.open = function (size, board) {
            $rootScope.modalboard=board;
            var modalInstance = $uibModal.open({
                templateUrl: 'modal.html',
                controller: 'ModalDemoCtrl',
                size: size
            });
            modalInstance.result.then(function () {

            }, function () {
                // $log.info('Modal dismissed at: ' + new Date());
                $rootScope.modalboard={};
                $rootScope.reply={};
                $scope.tagBoardList();
            });
        };



        $scope.showFriendList = function () {
            $http({
                method: 'POST', //방식
                url: "/user/showfriends",
                data: userObject,
                headers: {'Content-Type': 'application/json; charset=utf-8'} //헤더
            })
                .then(function (response) {
                    $scope.friends = response.data;
                });
        };


        $scope.showFriendList();


        $scope.getTagData=function () {

        }

        $http({  //TODO 테그정보 가져오기(사진 등..)
            method: 'POST', //방식
            url: "/tag/loadTagProfile", /* 통신할 URL */
            data: tagObject, /* 파라메터로 보낼 데이터 */
            headers: {'Content-Type': 'application/json; charset=utf-8'} //헤더
        })
            .then(function (response) {
                $scope.tagProfile = response.data;
            });

        $scope.tagBoardList = function () {
            $http({  //TODO 테그된 게시글 가져오기
                method: 'POST', //방식
                url: "/tag/openTagFolder", /* 통신할 URL */
                data: tagObject, /* 파라메터로 보낼 데이터 */
                headers: {'Content-Type': 'application/json; charset=utf-8'} //헤더
            })
                .then(function (response) {
                    $scope.my_tagBoards = response.data;
                });
        };

        $scope.tagBoardList();

        $scope.tagCloud = function () {
            $http({  //TODO 테그된 게시글 가져오기
                method: 'POST', //방식
                url: "/tag/getTagWords", /* 통신할 URL */
                data: tagObject, /* 파라메터로 보낼 데이터 */
                headers: {'Content-Type': 'application/json; charset=utf-8'} //헤더
            })
                .then(function (response) {
                    $scope.Cwords = response.data;
                });
            $scope.colors = ["#800026", "#bd0026", "#e31a1c", "#fc4e2a", "#fd8d3c", "#5CD1E5", "#FFA7A7"];



            $scope.update = function() {
                $scope.Cwords.splice(-5);
            };
        };

        $scope.tagCloud();

        $scope.getTagValue = function () {
            $http({  //TODO 테그된 게시글 가져오기
                method: 'POST', //방식
                url: "/tag/getTagValue", /* 통신할 URL */
                data: tagObject, /* 파라메터로 보낼 데이터 */
                headers: {'Content-Type': 'application/json; charset=utf-8'} //헤더
            })
                .then(function (response) {
                    $scope.Cdata = response.data;
                });
        };

        $scope.getLineValue = function () {
            $http({  //TODO 테그된 게시글 가져오기
                method: 'POST', //방식
                url: "/tag/getLineValue", /* 통신할 URL */
                data: tagObject, /* 파라메터로 보낼 데이터 */
                headers: {'Content-Type': 'application/json; charset=utf-8'} //헤더
            })
                .then(function (response) {
                    $scope.Ldata = response.data;
                });
        };

        $scope.getTagValue();
        $scope.getLineValue();
        $rootScope.tag_name={};


        $scope.folderList = function () {
            $http({
                method: 'POST', //방식
                url: "/api/folderlist", /* 통신할 URL */
                data: userObject, /* 파라메터로 보낼 데이터 */
                headers: {'Content-Type': 'application/json; charset=utf-8'} //헤더
            })
                .then(function (response) {
                    $scope.folders = response.data;
                })
        };
        $scope.folderList();

        $scope.putInFolder = function (board_id, folder_id) {
            var folderObject = {
                board_id : board_id,
                folder_id : folder_id
            };
            $http({
                method: 'POST', //방식
                url: "/api/putInFolder", /* 통신할 URL */
                data: folderObject, /* 파라메터로 보낼 데이터 */
                headers: {'Content-Type': 'application/json; charset=utf-8'} //헤더
            })
                .then(function () {
                    alert('폴더에 담겼습니다.');
                })
        };


        $scope.favoriteBoard = function (board_id) {
            $http({
                method: 'POST', //방식
                url: "/api/favoriteBoard", /* 통신할 URL */
                data: {user_id: userObject.user_id, board_id: board_id}, /* 파라메터로 보낼 데이터 */
                headers: {'Content-Type': 'application/json; charset=utf-8'} //헤더
            })
                .success(function (data, status, headers, config) {
                    if (data.msg == 'false') {
                        alert('페이버릿 실패')
                    } else {
                        $scope.tagBoardList();
                    }
                })
                .error(function (data, status, headers, config) {
                    /* 서버와의 연결이 정상적이지 않을 때 처리 */
                    console.log(status);
                });
        };


        $scope.UnfavoriteBoard = function (board_id) {
            var UnfavoriteBoardObject =
            {
                user_id: userObject.user_id, //임시로 1번사용자 지정
                board_id: board_id
            };
            $http({
                method: 'POST', //방식
                url: "/api/UnfavoriteBoard", /* 통신할 URL */
                data: UnfavoriteBoardObject, /* 파라메터로 보낼 데이터 */
                headers: {'Content-Type': 'application/json; charset=utf-8'} //헤더
            })
                .success(function (data, status, headers, config) {
                    if (data.msg == 'false') {
                        alert('페이버릿취소 실패')
                    } else {
                        $scope.tagBoardList();
                    }
                })
                .error(function (data, status, headers, config) {
                    /* 서버와의 연결이 정상적이지 않을 때 처리 */
                    console.log(status);
                });
        };


        //좋아요
        $scope.likeBoard = function (board_id) {
            $http({
                method: 'POST', //방식
                url: "/api/likeBoard", /* 통신할 URL */
                data: {user_id: userObject.user_id, board_id: board_id}, /* 파라메터로 보낼 데이터 */
                headers: {'Content-Type': 'application/json; charset=utf-8'} //헤더
            })
                .success(function (data, status, headers, config) {
                    if (data.msg == 'false') {
                        alert('좋아요 실패')
                    } else {
                        $scope.tagBoardList();
                    }
                })
                .error(function (data, status, headers, config) {
                    /* 서버와의 연결이 정상적이지 않을 때 처리 */
                    console.log(status);
                });
        };

        //좋아요 취소
        $scope.dislikeBoard = function (board_id) {
            var dislikeBoardObject =
            {
                user_id: userObject.user_id, //임시로 1번사용자 지정
                board_id: board_id
            };
            $http({
                method: 'POST', //방식
                url: "/api/dislikeBoard", /* 통신할 URL */
                data: dislikeBoardObject, /* 파라메터로 보낼 데이터 */
                headers: {'Content-Type': 'application/json; charset=utf-8'} //헤더
            })
                .success(function (data, status, headers, config) {
                    if (data.msg == 'false') {
                        alert('좋아요취소 실패')
                    } else {
                        $scope.tagBoardList();
                    }
                })
                .error(function (data, status, headers, config) {
                    /* 서버와의 연결이 정상적이지 않을 때 처리 */
                    console.log(status);
                });
        };

    })





    .controller("tolineCtrl",function($scope,  $rootScope, $http, store, $state,$filter){

        //TODO: 로그인 정보를 토큰에서 받는것으로 변경하기

        var userObject = store.get('obj');
        $scope.toline_init = function () {
            $http({
                method: 'POST', //방식
                url: "/user/showfriends", /* 통신할 URL */
                data: userObject, /* 파라메터로 보낼 데이터 */
                headers: {'Content-Type': 'application/json; charset=utf-8'} //헤더
            })
                .then(function(response) {
                    $scope.tolineList = response.data;
                });
        };

        $scope.showFriendList = function () {
            $http({
                method: 'POST', //방식
                url: "/user/showfriends",
                data: userObject,
                headers: {'Content-Type': 'application/json; charset=utf-8'} //헤더
            })
                .then(function (response) {
                    $scope.friends = response.data;
                });
        };

        $scope.showFriendList();

        $scope.toline_init();

        $scope.toOthers = function(others){
            $rootScope.others_id = others.user_id;
            if ($rootScope.othersStatus){
                $state.go("others1");
                $rootScope.othersStatus = false;
            }else{
                $state.go("others2");
                $rootScope.othersStatus = true;
            }
        };

        var timeObject ={};
        $scope.updateTime = function() {
            $scope.theTime = new Date().toLocaleTimeString();
            timeObject = {
                updated_time: $filter('date')(new Date(), 'yyyy-MM-dd HH-mm-ss'),
                user_id: store.get('obj').user_id
            };

            $http({
                method: 'POST', //방식
                url: "user/updateTime", /* 통신할 URL */
                data: timeObject, /* 파라메터로 보낼 데이터 */
                headers: {'Content-Type': 'application/json; charset=utf-8'} //헤더
            })
                .then(function (response) {
                })
        };
        $scope.updateTime();

        $scope.acceptFriend = function (friend_id){
            var acceptFriendObject =
            {
                user_id: friend_id, //임시로 1번사용자 지정
                friend_id: store.get('obj').user_id
            };
            $http({
                method: 'POST', //방식
                url: "/user/acceptFriend", /* 통신할 URL */
                data: acceptFriendObject, /* 파라메터로 보낼 데이터 */
                headers: {'enctype': 'multipart/form-data; charset=utf-8'} //헤더
            })
                .success(function (data, status, headers, config) {
                    if(data.msg == 'false') {
                        alert('친구승낙 실패')
                    }else{
                        $scope.toline_init();
                    }
                })
                .error(function (data, status, headers, config) {
                    /* 서버와의 연결이 정상적이지 않을 때 처리 */
                    console.log(status);
                });
        };

        $scope.deleteFriend = function (friend_id){
            var deleteFriendObject =
            {
                user_id: store.get('obj').user_id, //임시로 1번사용자 지정
                friend_id: friend_id
            };
            $http({
                method: 'POST', //방식
                url: "/user/deleteFriend", /* 통신할 URL */
                data: deleteFriendObject, /* 파라메터로 보낼 데이터 */
                headers: {'enctype': 'multipart/form-data; charset=utf-8'} //헤더
            })
                .success(function (data, status, headers, config) {
                    if (data.msg == 'false') {
                        alert('친구신청 거절 실패')
                    } else {
                        $scope.toline_init();
                    }
                })
                .error(function (data, status, headers, config) {
                    /* 서버와의 연결이 정상적이지 않을 때 처리 */
                    console.log(status);
                });
        };
    })







    .controller("ArchiveCtrl",function($scope, $http, store, $state, $uibModal, $rootScope,$filter) {


        //TODO: 로그인 정보를 토큰에서 받는것으로 변경하기

        var userObject = store.get('obj');
        $scope.name = userObject.login_id;
        $scope.labels = ['만족', '반전', '박진감', '웃음', '통쾌', '후회', '식상', '지루', '혐오', '실망'];

        $scope.archiveList = function () {
            $http({
                method: 'POST', //방식
                url: "/folder/getFolderList", /* 통신할 URL */
                data: userObject, /* 파라메터로 보낼 데이터 */
                headers: {'Content-Type': 'application/json; charset=utf-8'} //헤더
            })
                .then(function (response) {
                    $scope.folders = response.data;
                })
        };

        $scope.toOthers = function(others){
            $rootScope.others_id = others.user_id;
            if ($rootScope.othersStatus){
                $state.go("others1");
                $rootScope.othersStatus = false;
            }else{
                $state.go("others2");
                $rootScope.othersStatus = true;
            }
        };



        $scope.showFriendList = function () {
            $http({
                method: 'POST', //방식
                url: "/user/showfriends",
                data: userObject,
                headers: {'Content-Type': 'application/json; charset=utf-8'} //헤더
            })
                .then(function (response) {
                    $scope.friends = response.data;
                });
        };


        $scope.showFriendList()

        var timeObject ={};
        $scope.updateTime = function() {
            $scope.theTime = new Date().toLocaleTimeString();
            timeObject = {
                updated_time: $filter('date')(new Date(), 'yyyy-MM-dd HH-mm-ss'),
                user_id: store.get('obj').user_id
            };

            $http({
                method: 'POST', //방식
                url: "user/updateTime", /* 통신할 URL */
                data: timeObject, /* 파라메터로 보낼 데이터 */
                headers: {'Content-Type': 'application/json; charset=utf-8'} //헤더
            })
                .then(function (response) {
                })
        };
        $scope.updateTime();



        //좋아요
        $scope.likeBoard = function (board_id) {
            $http({
                method: 'POST', //방식
                url: "/api/likeBoard", /* 통신할 URL */
                data: {user_id: userObject.user_id, board_id: board_id}, /* 파라메터로 보낼 데이터 */
                headers: {'Content-Type': 'application/json; charset=utf-8'} //헤더
            })
                .success(function (data, status, headers, config) {
                    if (data.msg == 'false') {
                        alert('좋아요 실패')
                    } else {
                        $scope.openFolder($rootScope.folder);
                    }
                })
                .error(function (data, status, headers, config) {
                    /* 서버와의 연결이 정상적이지 않을 때 처리 */
                    console.log(status);
                });
        };

        //좋아요 취소
        $scope.dislikeBoard = function (board_id) {
            var dislikeBoardObject =
            {
                user_id: userObject.user_id, //임시로 1번사용자 지정
                board_id: board_id
            };
            $http({
                method: 'POST', //방식
                url: "/api/dislikeBoard", /* 통신할 URL */
                data: dislikeBoardObject, /* 파라메터로 보낼 데이터 */
                headers: {'Content-Type': 'application/json; charset=utf-8'} //헤더
            })
                .success(function (data, status, headers, config) {
                    if (data.msg == 'false') {
                        alert('좋아요취소 실패')
                    } else {
                        $scope.openFolder($rootScope.folder);
                    }
                })
                .error(function (data, status, headers, config) {
                    /* 서버와의 연결이 정상적이지 않을 때 처리 */
                    console.log(status);
                });
        };

        $scope.favoriteBoard = function (board_id) {
            $http({
                method: 'POST', //방식
                url: "/api/favoriteBoard", /* 통신할 URL */
                data: {user_id: userObject.user_id, board_id: board_id}, /* 파라메터로 보낼 데이터 */
                headers: {'Content-Type': 'application/json; charset=utf-8'} //헤더
            })
                .success(function (data, status, headers, config) {
                    if (data.msg == 'false') {
                        alert('페이버릿 실패')
                    } else {
                        alert('페이버릿 성공');
                        $scope.openFolder($rootScope.folder);
                    }
                })
                .error(function (data, status, headers, config) {
                    /* 서버와의 연결이 정상적이지 않을 때 처리 */
                    console.log(status);
                });
        };


        $scope.UnfavoriteBoard = function (board_id) {
            var UnfavoriteBoardObject =
            {
                user_id: userObject.user_id, //임시로 1번사용자 지정
                board_id: board_id
            };
            $http({
                method: 'POST', //방식
                url: "/api/UnfavoriteBoard", /* 통신할 URL */
                data: UnfavoriteBoardObject, /* 파라메터로 보낼 데이터 */
                headers: {'Content-Type': 'application/json; charset=utf-8'} //헤더
            })
                .success(function (data, status, headers, config) {
                    if (data.msg == 'false') {
                        alert('페이버릿취소 실패')
                    } else {
                        alert('페이버릿취소 성공');
                        $scope.openFolder($rootScope.folder);
                    }
                })
                .error(function (data, status, headers, config) {
                    /* 서버와의 연결이 정상적이지 않을 때 처리 */
                    console.log(status);
                });
        };

        $scope.open = function (size, board) {
            $rootScope.modalboard=board;
            var modalInstance = $uibModal.open({
                templateUrl: 'modal.html',
                controller: 'ModalDemoCtrl',
                size: size
            });
            modalInstance.result.then(function () {

            }, function () {
                // $log.info('Modal dismissed at: ' + new Date());
                $rootScope.modalboard={};
                $rootScope.reply={};
                $scope.openFolder($rootScope.folder);
            });
        };

        $scope.archiveList();

        $scope.addNewFolder = function (new_folder_name) {
            var newFolderObject =
            {
                user_id: userObject.user_id,
                folder_name: new_folder_name
            };

            $http({
                method: 'POST', //방식
                url: "/folder/newFolder", /* 통신할 URL */
                data: newFolderObject, /* 파라메터로 보낼 데이터 */
                headers: {'Content-Type': 'application/json; charset=utf-8'} //헤더
            })
                .success(function (data, status, headers, config) {
                    if (data.msg == 'false') {
                        alert('폴더생성 실패');
                    } else {
                        $scope.archiveList();
                    }
                })
                .error(function (data, status, headers, config) {
                    /* 서버와의 연결이 정상적이지 않을 때 처리 */
                    console.log(status);
                });
        };

        $scope.deleteFolder = function (folder_id) {
            var deleteFolderObject =
            {
                user_id: userObject.user_id,
                folder_id: folder_id
            };

            $http({
                method: 'POST', //방식
                url: "/folder/deleteFolder", /* 통신할 URL */
                data: deleteFolderObject, /* 파라메터로 보낼 데이터 */
                headers: {'Content-Type': 'application/json; charset=utf-8'} //헤더
            })
                .success(function (data, status, headers, config) {
                    if (data.msg == 'false') {
                        alert('폴더삭제 실패');
                    } else {
                        $scope.archiveList();
                    }
                })
                .error(function (data, status, headers, config) {
                    /* 서버와의 연결이 정상적이지 않을 때 처리 */
                    console.log(status);
                })
        }

        $scope.folders = { };

        $scope.deleteBoard = function(board){
            alert('삭제됩니다?!');
            $http({
                method: 'POST', //방식
                url: "/api/deleteboard", /* 통신할 URL */
                data: board,
                headers: {'Content-Type': 'application/json; charset=utf-8'}
            })
                .success(function (data, status, headers, config) {
                    if(data.msg == 'success') {
                        alert('게시글 삭제 성공');
                        $scope.archiveList();
                    }else{
                        alert('게시글 삭제 실패');
                    }
                })
        }
        $rootScope.folder = ""
        $scope.openFolder = function (folder_id) {
            $rootScope.folder = folder_id;
            if(folder_id == 100){
                var openLineFolderObject = {
                    user_id: userObject.user_id
                };
                $http({
                    method: 'POST', //방식
                    url: "/folder/openLineFolder", /* 통신할 URL */
                    data: openLineFolderObject, /* 파라메터로 보낼 데이터 */
                    headers: {'Content-Type': 'application/json; charset=utf-8'} //헤더
                })
                    .then(function (response) {
                        $scope.folder_boards = response.data;
                        $scope.myId = false;
                    });
            }
            else if(folder_id == 200){
                var openFavoriteFolderObject = {
                    user_id: userObject.user_id
                };
                $http({
                    method: 'POST', //방식
                    url: "/folder/openFavoriteFolder", /* 통신할 URL */
                    data: openFavoriteFolderObject, /* 파라메터로 보낼 데이터 */
                    headers: {'Content-Type': 'application/json; charset=utf-8'} //헤더
                })
                    .then(function (response) {
                        $scope.folder_boards = response.data;
                        $scope.myId = false;
                    });
            }
            else if(folder_id == 300){
                var openMyFolderObject = {
                    user_id: userObject.user_id
                };
                $http({
                    method: 'POST', //방식
                    url: "/folder/openMyFolder", /* 통신할 URL */
                    data: openMyFolderObject, /* 파라메터로 보낼 데이터 */
                    headers: {'Content-Type': 'application/json; charset=utf-8'} //헤더
                })
                    .then(function (response) {
                        $scope.folder_boards = response.data;
                        $scope.myId = true; //userObject.user_id;
                    });
            }
            else{
                var openFolderObject =
                {
                    folder_id: folder_id
                };

                $http({
                    method: 'POST', //방식
                    url: "/folder/openFolder", /* 통신할 URL */
                    data: openFolderObject, /* 파라메터로 보낼 데이터 */
                    headers: {'Content-Type': 'application/json; charset=utf-8'} //헤더
                })
                    .then(function (response) {
                        $scope.folder_boards = response.data;
                        $scope.myId = false;
                    });
            }
        }

        $scope.folderList = function () {
            $http({
                method: 'POST', //방식
                url: "/api/folderlist", /* 통신할 URL */
                data: userObject, /* 파라메터로 보낼 데이터 */
                headers: {'Content-Type': 'application/json; charset=utf-8'} //헤더
            })
                .then(function (response) {
                    $scope.folders = response.data;
                })
        };
        $scope.folderList();

        $scope.putInFolder = function (board_id, folder_id) {
            var folderObject = {
                board_id : board_id,
                folder_id : folder_id
            };
            $http({
                method: 'POST', //방식
                url: "/api/putInFolder", /* 통신할 URL */
                data: folderObject, /* 파라메터로 보낼 데이터 */
                headers: {'Content-Type': 'application/json; charset=utf-8'} //헤더
            })
                .then(function () {
                    alert('폴더에 담겼습니다.');
                })
        };

        $scope.onClick = function (points, evt) {
            console.log(points, evt);
        };


    });
