/**
 * Created by TeasunKim on 2016-09-12.
 */

var __FindIdCtrl = function ($scope, $http,$state) {
    $scope.findID=[{
        name :"", born1 :"", born2 :"", born3 :""
    }];


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
                    $state.go('login1');
                }
            })
            .error(function (data, status, headers, config) {
                /* 서버와의 연결이 정상적이지 않을 때 처리 */
                console.log(status);
            });
    };
};

