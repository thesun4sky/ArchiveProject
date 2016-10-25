/**
 * Created by TeasunKim on 2016-09-12.
 */



var __AlertCtrl = function ($rootScope, $scope, $http, store, $state, $interval, $filter) {
    var userObject = store.get('obj');

    $scope.alerts = [];

    $scope.addAlert = function (data) {
        if (data.id == '1') {
            if (data.status == 0) {
                $scope.alerts.push({type: 'info', msg: data.name + '님께서 친구 신청 하셨습니다.'});
            }
            else if (data.status == 1)
                $scope.alerts.push({type: 'success', msg: data.name + '님께서 친구 승인 하셨습니다.'});
        }
        else if (data.id == '2') {
            $scope.alerts.push({type: 'warning', msg: data.name + '님께서 댓글을 남겼습니다.'});
        }
        else if (data.id == '3') {
            $scope.alerts.push({type: 'danger', msg: data.name + '님께서 게시물을 페이보릿 하셨습니다.'});
        }
        else if (data.id == '4') {
            $scope.alerts.push({type: 'info', msg: data.name + '님께서 게시물을 공감하셨습니다.'});
        }
    };
    $scope.closeAlert = function (index) {
        $scope.alerts.splice(index, 1);
    };

    $rootScope.checkedTime = null;
    $scope.StartTimer = function () {
        $scope.Noti = $interval(function () {
            if ($rootScope.checkedTime != null) {
                if (store.get('obj') == null) {
                    $interval.cancel($scope.Noti);
                }
                $rootScope.currentTime = $filter('date')(new Date(), 'yyyy-MM-dd HH-mm-ss');
                $scope.CallNotiApi();
            }
            else {
                $rootScope.checkedTime = $filter('date')(new Date(), 'yyyy-MM-dd HH-mm-ss');
            }

        }, 10000);
    };

    //Timer stop function.
    $scope.CallNotiApi = function () {
        $http({
            method: 'POST', //방식
            url: "/user/notification",
            data: {
                user_id: userObject.user_id,
                currentTime: $rootScope.currentTime,
                checkedTime: $rootScope.checkedTime
            },
            headers: {'Content-Type': 'application/json; charset=utf-8'}
        })
            .then(function (response) {
                if (response.data != null && response.data != undefined) {
                    $scope.datas = response.data;
                    for (var i = 0; i < $scope.datas.length; i++) {
                        $scope.addAlert($scope.datas[i]);
                    }
                    $rootScope.checkedTime = $rootScope.currentTime
                }
            })
    };

    $scope.StartTimer();

};

