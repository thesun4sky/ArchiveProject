/**
 * Created by TeasunKim on 2016-09-12.
 */

var __SubHeaderCtrl = function (store, $scope, $rootScope, $http, $filter) {
    var userObject = store.get('obj');
    $scope.getAlertData = function () {
        $http({
            method: 'POST', //방식
            url: "/user/fullAlert", /* 통신할 URL */
            data: {
                user_id: userObject.user_id,
                currentTime: $filter('date')(new Date(), 'yyyy-MM-dd HH-mm-ss'),
                checkedTime: userObject.updated_time
            }, /* 파라메터로 보낼 데이터 */
            headers: {'Content-Type': 'application/json; charset=utf-8'} //헤더
        })
            .then(function (response) {
                if (response.data != null && response.data != undefined) {
                    $scope.alertData = response.data;
                    for (var i = 0; i < $scope.alertData.length; i++) {

                        $scope.convAlert($scope.alertData[i]);
                    }
                }
            })
    };
    $scope.getAlertData();


    $scope.alertThings = [];


    $scope.toggleDropdown = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.status.isopen = !$scope.status.isopen;
    };

    $scope.convAlert = function (data) {
        if (data.id == '1') {
            if (data.status == 0) {
                $scope.alertThings.push({type: 'info', msg: data.name + '님께서 친구 신청 하셨습니다.'});
            }
            else if (data.status == 1)
                $scope.alertThings.push({type: 'success', msg: data.name + '님께서 친구 승인 하셨습니다.'});
        }
        else if (data.id == '2') {
            $scope.alertThings.push({type: 'warning', msg: data.name + '님께서 댓글을 남겼습니다.'});
        }
        else if (data.id == '3') {
            $scope.alertThings.push({type: 'danger', msg: data.name + '님께서 게시물을 페이보릿 하셨습니다.'});
        }
        else if (data.id == '4') {
            $scope.alertThings.push({type: 'info', msg: data.name + '님께서 게시물을 공감하셨습니다.'});
        }
    };
    $scope.closeAlert = function (index) {
        $scope.alertThings.splice(index, 1);
    };
};
