/**
 * Created by TeasunKim on 2016-09-12.
 */
angular.module("homeApp")
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
