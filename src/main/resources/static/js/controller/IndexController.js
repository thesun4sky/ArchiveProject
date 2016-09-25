/**
 * Created by TeasunKim on 2016-09-12.
 */

var __IndexCtrl = function ($interval, $scope, $http, store, $state, $uibModal, $rootScope, $filter) {
    var socket = io.connect('ws://52.79.170.80:7777');
    var userObject = store.get('obj');
    $scope.logoWidth = window.innerWidth/6;
    $scope.chatIsOpen = false;
    var chatName;
    var div;
    var txt;
    $scope.chatContents = [];


    $scope.closeChatting = function () {
        socket.emit('leaveroom', {room: chatName, user_name: userObject.login_id});
        $scope.chatIsOpen = false;
        div = document.getElementById('message').innerHTML = "";
        txt = document.getElementById('txtChat').innerHTML = "";
    };

    $scope.openChatting = function (f_id, f_name) {
        //채팅창이 켜진다
        $scope.chatfriendName = f_name;
        $scope.chatIsOpen = true;


        //채팅이름 설정
        if (userObject.user_id < f_id) {
            chatName = userObject.user_id+"-"+f_id;
        } else {
            chatName = f_id+"-"+userObject.user_id;
        }

        $http({
            method: 'POST', //방식
            url: "/user/getChat", /* 통신할 URL */
            data: {chatName: chatName},
            headers: {'Content-Type': 'application/json; charset=utf-8'} //헤더
        })
            .then(function (response) {
                $scope.chatContents = response.data;
                socket.emit('joinroom', {room: chatName, user_name: userObject.login_id});
        });



        //DOM 참조
        div = document.getElementById('message');
        txt = document.getElementById('txtChat');
        //텍스트 박스에 포커스 주기
        txt.focus();

        //텍스트 박스에 이벤트 바인딩
        txt.onkeydown = sendMessage.bind(this);
        function sendMessage(event){
            if(event.keyCode == 13){
                //메세지 입력 여부 체크
                var message = event.target.value;
                if(message){
                    //소켓서버 함수 호출
                    socket.emit('serverReceiver', {chatName: chatName,user_id: userObject.user_id, user_name: userObject.login_id , message: message});
                    //텍스트박스 초기화
                    txt.value = '';
                }
            }
        }


        //메시지 전송
        function sendMessage(event){
            if(event.keyCode == 13){
                //메세지 입력 여부 체크
                var message = event.target.value;
                if(message){
                    //소켓서버 함수 호출
                    $http({
                        method: 'POST', //방식
                        url: "/user/sendChat", /* 통신할 URL */
                        data: {chatName: chatName,user_id: userObject.user_id, user_name: userObject.login_id , message: message},
                        headers: {'Content-Type': 'application/json; charset=utf-8'} //헤더
                    })
                        .then(function (response) {
                            socket.emit('serverReceiver', {chatName: chatName,user_id: userObject.user_id, user_name: userObject.login_id , message: message});
                        });

                    //TODO 서버에 메시지 저장
                    //텍스트박스 초기화
                    txt.value = '';
                }
            }
        }

        //클라이언트 receive 이벤트 함수(서버에서 호출할 이벤트)
        socket.on('clientReceiver', function(data){
            //채팅창에 메세지 출력하기
            var message = '['+ data.user_name + '님의 말' + '] ' + data.message;
            //채팅창 스크롤바 내리기
            $scope.chatContents.push(data);
            div.scrollTop = div.scrollHeight;
            }
        );
    };



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
            user_id: userObject.user_id,
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
};

