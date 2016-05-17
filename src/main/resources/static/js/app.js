/**
 * Created by 이호세아 on 2016-05-17.
 */

angular.module("homeApp",[
        'ngAnimate',
        'ui.router',
        'ngFileUpload'
    ])

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

    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('index', {
                url: '/',
                templateUrl: 'homepg.html',
                controller: 'indexCtrl',
                controllerAs: 'index',
                data: {
                    requireLogin: false
                }
            })

            .state('catagory', {
                url: '/catagory',
                templateUrl: 'catagory.html',
                controller: 'catagoryCtrl',
                controllerAs: 'catagory',
                data: {
                    requireLogin: false
                }
            })
            
            .state('Archive', {
                url: '/Archive',
                templateUrl: 'Archive.html',
                controller: 'ContactCtrl',
                controllerAs: 'contact',
                data: {
                    requireLogin: false
                }
            })


            .state('upload', {
                url: '/upload',
                templateUrl: 'upload.html',
                controller: 'uploadCtrl',
                controllerAs: 'upload',
                data: {
                    requireLogin: false
                }
            })
            
            .state('toline', {
                url: '/Toline',
                templateUrl: 'Toline.html',
                controller: 'tolineCtrl',
                controllerAs: 'toline',
                data: {
                    requireLogin: false
                }
            });



        $urlRouterProvider.otherwise('/');
    })


    // 댓글 엔터 입력 처리
  //   .directive('ngEnter', function () {
  //      return function (scope, element, attrs) {
  //          element.bind("keydown keypress", function (event) {
  //              if(event.which === 13) {
  //                  scope.$apply(function (){
  //                      scope.$eval(attrs.ngEnter);
  //                  });
  //
  //                  event.preventDefault();
  //              }
  //          });
  //      };
  //  });


    .controller("uploadCtrl", function($scope, $log, Upload, $timeout) {
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
        var BoardVO = {};

        $scope.uploadPic = function(file,p_level,c_list)  {

            file.upload = Upload.upload({
                url: '/api/board',
                data: {
                    file:file,
                    user_id:1,
                    public_level:p_level.id,
                    catagory:c_list.id,
                    likes_num: 0,
                    tag1: $scope.lines.tag1,
                    tag2: $scope.lines.tag2,
                    tag3: $scope.lines.tag3,
                    line1: $scope.lines.firstLine,
                    line1_y: $scope.positions.divtop1,
                    line2: $scope.lines.secondLine,
                    line2_y: $scope.positions2.divtop2
                }})
            file.upload.then(function (response) {
                $timeout(function () {
                    file.result = response.data;
                    window.location.href ='index.html';
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

    .controller("findCtrl",function($scope,$http){
        $scope.find_user = "";

        $scope.keyHit = function() {

            $http.get("/user/findUser/"+$scope.find_user)
                .then(function (response) {
                    $scope.users = response.data;
                });
        }
    })

    .controller('catagoryCtrl', function($scope,$http){
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
    })



    .controller("tolineCtrl",function($scope, $http){

        //TODO: 로그인 정보를 토큰에서 받는것으로 변경하기

        var loginObject = {
            user_id : 1
        };

        $http({
            method: 'POST', //방식
            url: "/user/showfriends", /* 통신할 URL */
            data: loginObject, /* 파라메터로 보낼 데이터 */
            headers: {'Content-Type': 'application/json; charset=utf-8'} //헤더
        })
            .then(function(response) {
                $scope.friends = response.data;
            });

        $scope.acceptFriend = function (friend_id){
            var acceptFriendObject =
            {
                user_id: friend_id, //임시로 1번사용자 지정
                friend_id: 1
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
                        alert('친구승낙 성공');
                        window.location.href = 'Toline.html';
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
                user_id: 1, //임시로 1번사용자 지정
                friend_id: friend_id
            };
            $http({
                method: 'POST', //방식
                url: "/user/deleteFriend", /* 통신할 URL */
                data: deleteFriendObject, /* 파라메터로 보낼 데이터 */
                headers: {'enctype': 'multipart/form-data; charset=utf-8'} //헤더
            })
                .success(function (data, status, headers, config) {
                    if(data.msg == 'false') {
                        alert('친구삭제 실패')
                    }else{
                        alert('친구삭제 성공');
                        window.location.href = 'Toline.html';
                    }
                })
                .error(function (data, status, headers, config) {
                    /* 서버와의 연결이 정상적이지 않을 때 처리 */
                    console.log(status);
                });
        };
    })



    .controller("indexCtrl",function($scope, $http){


        //TODO: 로그인 정보를 토큰에서 받는것으로 변경하기

        $scope.name = "김태선";
        var loginObject = {
            user_id : 1
        };

        $http({
            method: 'POST', //방식
            url: "/api/boardlist", /* 통신할 URL */
            data: loginObject, /* 파라메터로 보낼 데이터 */
            headers: {'Content-Type': 'application/json; charset=utf-8'} //헤더
        })
            .then(function(response) {
                $scope.boards = response.data;
            });

        $scope.favoriteBoard = function (board_id){
            var favoriteBoardObject =
            {
                user_id: 1, //임시로 1번사용자 지정
                board_id: board_id
            };
            $http({
                method: 'POST', //방식
                url: "/api/favoriteBoard", /* 통신할 URL */
                data: favoriteBoardObject, /* 파라메터로 보낼 데이터 */
                headers: {'Content-Type': 'application/json; charset=utf-8'} //헤더
            })
                .success(function (data, status, headers, config) {
                    if(data.msg == 'false') {
                        alert('페이버릿 실패')
                    }else{
                        alert('페이버릿 성공');
                    }
                })
                .error(function (data, status, headers, config) {
                    /* 서버와의 연결이 정상적이지 않을 때 처리 */
                    console.log(status);
                });
        };

        $scope.UnfavoriteBoard = function (board_id){
            var UnfavoriteBoardObject =
            {
                user_id: 1, //임시로 1번사용자 지정
                board_id: board_id
            };
            $http({
                method: 'POST', //방식
                url: "/api/UnfavoriteBoard", /* 통신할 URL */
                data: UnfavoriteBoardObject, /* 파라메터로 보낼 데이터 */
                headers: {'Content-Type': 'application/json; charset=utf-8'} //헤더
            })
                .success(function (data, status, headers, config) {
                    if(data.msg == 'false') {
                        alert('페이버릿취소 실패')
                    }else{
                        alert('페이버릿취소 성공');
                    }
                })
                .error(function (data, status, headers, config) {
                    /* 서버와의 연결이 정상적이지 않을 때 처리 */
                    console.log(status);
                });
        };

        $scope.commitReply = function (){
            var replyObject =
            {
                user_id: 1, //임시로 1번사용자 지정
                board_id: 4,
                reply : $scope.reply.content
            };
            $http({
                method: 'POST', //방식
                url: "/api/reply", /* 통신할 URL */
                data: replyObject, /* 파라메터로 보낼 데이터 */
                headers: {'Content-Type': 'application/json; charset=utf-8'} //헤더
            })
                .success(function (data, status, headers, config) {
                    if(data.msg == 'success') {
                        alert('댓글작성 성공')
                    }else{
                        alert('댓글작성 실패');
                    }

                })
                .error(function (data, status, headers, config) {
                    /* 서버와의 연결이 정상적이지 않을 때 처리 */
                    console.log(status);
                });
        };


        $http({
            method: 'POST', //방식
            url: "/user/showfriends", /* 통신할 URL */
            data: loginObject, /* 파라메터로 보낼 데이터 */
            headers: {'Content-Type': 'application/json; charset=utf-8'} //헤더
        })
            .then(function(response) {
                $scope.friends = response.data;
            });

        $scope.acceptFriend = function (friend_id){
            var acceptFriendObject =
            {
                user_id: friend_id, //임시로 1번사용자 지정
                friend_id: 1
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
                        alert('친구승낙 성공');
                        window.location.href = 'Toline.html';
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
                user_id: 1, //임시로 1번사용자 지정
                friend_id: friend_id
            };
            $http({
                method: 'POST', //방식
                url: "/user/deleteFriend", /* 통신할 URL */
                data: deleteFriendObject, /* 파라메터로 보낼 데이터 */
                headers: {'enctype': 'multipart/form-data; charset=utf-8'} //헤더
            })
                .success(function (data, status, headers, config) {
                    if(data.msg == 'false') {
                        alert('친구삭제 실패')
                    }else{
                        alert('친구삭제 성공');
                        window.location.href = 'Toline.html';
                    }
                })
                .error(function (data, status, headers, config) {
                    /* 서버와의 연결이 정상적이지 않을 때 처리 */
                    console.log(status);
                });
        };
    });


//        GET방식
//        var app = angular.module("homeApp" ,[]);
//        app.controller("homeCtrl",function($scope, $http){
//            $http.get("/api/getboardlist")
//                    .then(function(response) {
//                        $scope.boards = response.data;
//                    });
//        });
