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
