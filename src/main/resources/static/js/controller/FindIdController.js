/**
 * Created by TeasunKim on 2016-09-12.
 */

var __FindIdCtrl = function ($scope, $http) {
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
};

