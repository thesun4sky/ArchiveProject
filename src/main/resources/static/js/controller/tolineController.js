/**
 * Created by LeeMoonSeong on 2016-09-12.
 */



var __TolineCtrl = function ($scope,  $rootScope, $http, store, $state,$filter) {
    //TODO: 로그인 정보를 토큰에서 받는것으로 변경하기

    var userObject = store.get('obj');
        
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
