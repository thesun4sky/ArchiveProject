/**
 * Created by Hosea on 2016-09-22.
 */
window.onload = function(){
    //클라이언트 소켓 생성
    var socket = io.connect('ws://127.0.0.1:3000');
    //채팅이름 설정
    var chatName = "1-2";

    //DOM 참조
    var div = document.getElementById('message');
    var txt = document.getElementById('txtChat');
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
                socket.emit('serverReceiver', {chatName: chatName,user_id: "유저아이디" , message: message});
                //텍스트박스 초기화
                txt.value = '';
            }
        }
    }
    //TODO 서버에 대화내용 불러오기

    /*div.innerText += message + '\r\n';
    //채팅창 스크롤바 내리기
    div.scrollTop = div.scrollHeight;*/

    //메시지 전송
    function sendMessage(event){
        if(event.keyCode == 13){
            //메세지 입력 여부 체크
            var message = event.target.value;
            if(message){
                //소켓서버 함수 호출
                socket.emit('serverReceiver', {chatName: chatName, user_id: "유저아이디" , message: message});
                //TODO 서버에 메시지 저장
                //텍스트박스 초기화
                txt.value = '';
            }
        }
    }

    //클라이언트 receive 이벤트 함수(서버에서 호출할 이벤트)
    socket.on('clientReceiver', function(data){
        if (data.chatName == chatName) {
            //채팅창에 메세지 출력하기
            var message = '['+ data.user_id + '님의 말' + '] ' + data.message;
            div.innerText += message + '\r\n';
            //채팅창 스크롤바 내리기
            div.scrollTop = div.scrollHeight;
        }
    });
};