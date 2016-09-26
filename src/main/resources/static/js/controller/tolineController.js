/**
 * Created by LeeMoonSeong on 2016-09-12.
 */



var __TolineCtrl = function ($scope,  $rootScope, $http, store, $state,$filter) {
    //TODO: 로그인 정보를 토큰에서 받는것으로 변경하기

    var userObject = store.get('obj');
    var socket = io.connect('ws://52.79.170.80:7777');
    // var socket = io.connect('ws://localhost:3000');
    $scope.quantity = 4;
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

        //메시지 전송
        function sendMessage(event){
            if(event.keyCode == 13){
                //메세지 입력 여부 체크
                var message = event.target.value;
                if(message){
                    $scope.chatContents.push({chatName: chatName,user_id: userObject.user_id, user_name: userObject.login_id , message: message});

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
                    document.getElementById('message').scrollTop = document.getElementById('message').scrollHeight;

                }
            }
        }


        //클라이언트 receive 이벤트 함수(서버에서 호출할 이벤트)
        socket.on('clientReceiver', function(data){
                //채팅창에 메세지 출력하기
                var message = '['+ data.user_name + '님의 말' + '] ' + data.message;
                //채팅창 스크롤바 내리기
                $scope.chatContents.push(data);
                document.getElementById('message').scrollTop = document.getElementById('message').scrollHeight;
                // div.scrollTop = div.scrollHeight;
            }
        );
    };
    
    
    
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
};
