/**
 * Created by TeasunKim on 2016-09-12.
 */

//테그 프로필페이지 컨트롤러

var __TagProfileCtrl = function ($rootScope,$scope,$http, store, $uibModal, $state) {
    $scope.chart_view = 1;
    $scope.quantity =4 ;
    var userObject = store.get('obj');
    $scope.tag_name = $rootScope.tag_name;
    $scope.back_num = 'img/back'+Math.floor((Math.random()*1000)%5 +1)+'.png';


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
                if(response.data == "")
                    $scope.fail_message = true;

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
};
