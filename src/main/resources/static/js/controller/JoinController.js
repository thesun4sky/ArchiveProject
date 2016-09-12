/**
 * Created by TeasunKim on 2016-09-12.
 */
angular.module("homeApp")
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