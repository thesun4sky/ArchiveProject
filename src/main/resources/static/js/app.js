/**
 * Created by 이호세아 on 2016-05-17.
 */

angular.module("homeApp",[
        'chart.js',
        'ngAnimate',
        'ui.router',
        'ngFileUpload',
        'angular-storage'

    ])
    .config(function(storeProvider){
        storeProvider.setStore('sessionStorage');
    })

    .controller('RadarCtrl', function ($scope) {
        $scope.labels = ['만족', '반전', '박진감', '웃음', '통쾌', '후회', '식상', '지루', '혐오', '실망'];

        $scope.data = [ //임의 값 집어넣음
            [65, 59, 90, 81, 56, 55, 40, 80, 30, 90],
            [28, 48, 40, 19, 96, 27, 100, 81, 56, 55]//,
            //[58, 78, 20, 80, 70, 20, 40, 90, 50, 20]
        ];

        $scope.onClick = function (points, evt) {
            console.log(points, evt);
        };
    })


    .run(function ($rootScope, $state, store) {
        $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
            var requireLogin = toState.data.requireLogin;
            if (requireLogin && store.get('obj') == null) {
                event.preventDefault();
                // get me a login modal!
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

            .state('others', {
                url: '/others',
                templateUrl: 'othersprofile.html',
                controller: 'othersCtrl',
                controllerAs: 'others',
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


    .controller("loginCtrl",function($scope, $http, store, $state){

        $scope.login=[{
            login_id :"" ,password :""
        }];


        $scope.logout = function(){
            store.set('obj',null);
            $state.go('login');
        }



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
                                user_id: data.result
                            };
                            store.set('obj',myInfo);
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
                            $state.go('/');
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

         $scope.myFunction = function() {
             var words = $scope.lines.firstLine + " " + $scope.lines.secondLine + " ";
           // var words = $scope.lines.firstLine.concat(" ".concat($scope.lines.secondLine));
            //삭제어
            var res = words.replace(/은 |는 |이 |이고 |가 |의 |을 |를 |야 |랑 /gi , " ");  //조사
            res = res.replace(/하 |내가 |엔 |앤 |에서 |으로 |한다면 /gi , " ");  //동사 꾸밈어

            //대체어
            res = res.replace(/입니당 |입니다 |습니당 |습니다 |어요 |지요 |며 |다면 |니 |자 /gi , "다 ");  //종조사
            res = res.replace(/[?]/gi , "물음표 ");  // ?
            res = res.replace(/[!]/gi , "느낌표 ");  // !
            res = res.replace(/[~]/gi , "물결 ");  // ~

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
                    line2_y: $scope.positions2.divtop2
                }})
            file.upload.then(function (response) {
                $timeout(function () {
                    file.result = response.data;
                    $state.go('main');
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

    .controller("findCtrl",function($rootScope,$scope,$http, store, $state){
        $scope.find_user = "";

        $scope.keyHit = function() {

            $http.get("/user/findUser/"+$scope.find_user)
                .then(function (response) {
                    $scope.users = response.data;
                });
        };
        $scope.toOthers = function(others){
            $rootScope.others_id = others.user_id;
            $state.go("others");
        }
    })


    .controller("othersCtrl",function($rootScope,$scope,$http, store, $state) {
        $scope.others_id = $rootScope.others_id;

       var othersObject = {
           user_id : $scope.others_id
    };
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

    })



    .controller('catagoryCtrl', function($scope,$http, store, $state){

        var userObject = store.get('obj');

        $http({
            method: 'POST', //방식
            url: "/api/boardlist", /* 통신할 URL */
            data: userObject, /* 파라메터로 보낼 데이터 */
            headers: {'Content-Type': 'application/json; charset=utf-8'} //헤더
        })
            .then(function(response) {
                $scope.catagory_boards = response.data;
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
                });

        }

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
    })

    //프로필 페이지 컨트롤러

    .controller('profileCtrl', function($scope,$http,Upload,store,$timeout,$state){

        var userObject = store.get('obj');
        
        $http({
            method: 'POST', //방식
            url: "/folder/openMyFolder", /* 통신할 URL */
            data: userObject, /* 파라메터로 보낼 데이터 */
            headers: {'Content-Type': 'application/json; charset=utf-8'} //헤더
        })
            .then(function (response) {
                $scope.my_boards = response.data;
            });
        
        $http({
            method: 'POST', //방식
            url: "/user/loadProfile", /* 통신할 URL */
            data: userObject, /* 파라메터로 보낼 데이터 */
            headers: {'Content-Type': 'application/json; charset=utf-8'} //헤더
        })
            .then(function (response) {
                $scope.Profile = response.data;
            });


        $scope.uploadProfile = function(file)  {

            file.upload = Upload.upload({
                url: '/user/insertUserImage',
                data: {
                    file:file,
                    user_id:userObject.user_id,
                }})
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
    })

    .controller("tolineCtrl",function($scope, $http, store, $state){

        //TODO: 로그인 정보를 토큰에서 받는것으로 변경하기

        var userObject = store.get('obj');

        $http({
            method: 'POST', //방식
            url: "/user/showfriends", /* 통신할 URL */
            data: userObject, /* 파라메터로 보낼 데이터 */
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



    .controller("indexCtrl",function($scope, $http, store, $state) {


        //TODO: 로그인 정보를 토큰에서 받는것으로 변경하기
        var userObject = store.get('obj');

        $http({
            method: 'POST', //방식
            url: "/api/boardlist", /* 통신할 URL */
            data: userObject, /* 파라메터로 보낼 데이터 */
            headers: {'Content-Type': 'application/json; charset=utf-8'} //헤더
        })
            .then(function (response) {
                $scope.boards = response.data;
            });
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
        }

        $scope.favoriteBoard = function (board_id) {
            var favoriteBoardObject =
            {
                user_id: userObject.user_id, //임시로 1번사용자 지정
                board_id: board_id
            };
            $http({
                method: 'POST', //방식
                url: "/api/favoriteBoard", /* 통신할 URL */
                data: favoriteBoardObject, /* 파라메터로 보낼 데이터 */
                headers: {'Content-Type': 'application/json; charset=utf-8'} //헤더
            })
                .success(function (data, status, headers, config) {
                    if (data.msg == 'false') {
                        alert('페이버릿 실패')
                    } else {
                        alert('페이버릿 성공');
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
                    }
                })
                .error(function (data, status, headers, config) {
                    /* 서버와의 연결이 정상적이지 않을 때 처리 */
                    console.log(status);
                });
        };

        $scope.commitReply = function (board_id, msg) {
            var replyObject =
            {
                user_id: userObject.user_id, //임시로 1번사용자 지정
                board_id: board_id,
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
                        $scope.reply.content = "";
                    } else {
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
            data: userObject, /* 파라메터로 보낼 데이터 */
            headers: {'Content-Type': 'application/json; charset=utf-8'} //헤더
        })
            .then(function (response) {
                $scope.friends = response.data;
            });

        $scope.acceptFriend = function (friend_id) {
            var acceptFriendObject =
            {
                user_id: friend_id, //임시로 1번사용자 지정
                friend_id: userObject.user_id
            };
            $http({
                method: 'POST', //방식
                url: "/user/acceptFriend", /* 통신할 URL */
                data: acceptFriendObject, /* 파라메터로 보낼 데이터 */
                headers: {'enctype': 'multipart/form-data; charset=utf-8'} //헤더
            })
                .success(function (data, status, headers, config) {
                    if (data.msg == 'false') {
                        alert('친구승낙 실패')
                    } else {
                        alert('친구승낙 성공');
                        window.location.href = 'Toline.html';
                    }
                })
                .error(function (data, status, headers, config) {
                    /* 서버와의 연결이 정상적이지 않을 때 처리 */
                    console.log(status);
                });
        };

        $scope.deleteFriend = function (friend_id) {
            var deleteFriendObject =
            {
                user_id: userObject.user_id, //임시로 1번사용자 지정
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
                        alert('친구삭제 실패')
                    } else {
                        alert('친구삭제 성공');
                        window.location.href = 'Toline.html';
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

    .controller("ArchiveCtrl",function($scope, $http, store, $state) {


        //TODO: 로그인 정보를 토큰에서 받는것으로 변경하기

        var userObject = store.get('obj');
        $scope.name = userObject.login_id;

        $http({
            method: 'POST', //방식
            url: "/folder/getFolderList", /* 통신할 URL */
            data: userObject, /* 파라메터로 보낼 데이터 */
            headers: {'Content-Type': 'application/json; charset=utf-8'} //헤더
        })
            .then(function (response) {
                $scope.folders = response.data;
            });


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
                        alert('폴더생성 성공');
                        $scope.$apply();
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
                        alert('폴더삭제 성공');
                        $scope.$apply();
                    }
                })
                .error(function (data, status, headers, config) {
                    /* 서버와의 연결이 정상적이지 않을 때 처리 */
                    console.log(status);
                })
        }

        $scope.folders = { };

        $scope.openFolder = function (folder_id) {
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
                    });
            }
        }
    });

