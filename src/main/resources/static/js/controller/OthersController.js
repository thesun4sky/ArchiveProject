/**
 * Created by TeasunKim on 2016-09-12.
 */


var __OthersCtrl = function ($rootScope, $scope, $http, store, $state, $filter, $uibModal) {
    $scope.quantity = 4;
    var othersObject = {
        user_id: $rootScope.others_id
    };
    $scope.back_num = 'img/back' + Math.floor((Math.random() * 1000) % 5 + 1) + '.png';

    var userObject = store.get('obj');


    $scope.open = function (size, board) {
        $rootScope.modalboard = board;
        var modalInstance = $uibModal.open({
            templateUrl: 'modal.html',
            controller: 'ModalDemoCtrl',
            size: size
        });
        modalInstance.result.then(function () {

        }, function () {
            // $log.info('Modal dismissed at: ' + new Date());
            $rootScope.modalboard = {};
            $rootScope.reply = {};
            $scope.getOthersData();
        });
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
                    $scope.getOthersData();
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
                    $scope.getOthersData();
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
                    $scope.getOthersData();
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
                    $scope.getOthersData();
                }
            })
            .error(function (data, status, headers, config) {
                /* 서버와의 연결이 정상적이지 않을 때 처리 */
                console.log(status);
            });
    };


    $scope.userCloud = function () {
        $http({  //TODO 테그된 게시글 가져오기
            method: 'POST', //방식
            url: "/user/getUserWords", /* 통신할 URL */
            data: othersObject, /* 파라메터로 보낼 데이터 */
            headers: {'Content-Type': 'application/json; charset=utf-8'} //헤더
        })
            .then(function (response) {
                $scope.Cwords = response.data;
            });
        $scope.colors = ["#800026", "#bd0026", "#e31a1c", "#fc4e2a", "#fd8d3c", "#5CD1E5", "#FFA7A7"];


        $scope.update = function () {
            $scope.Cwords.splice(-5);
        };
    };

    $scope.userCloud();

    $scope.category_labels = ['영화', '연극', '콘서트', '드라마', '전시회', '음식', '여행', '음악'];

    $scope.getUserValue = function () {
        $http({
            method: 'POST', //방식
            url: "/user/getUserValue", /* 통신할 URL */
            data: othersObject, /* 파라메터로 보낼 데이터 */
            headers: {'Content-Type': 'application/json; charset=utf-8'} //헤더
        })
            .then(function (response) {
                $scope.Cdata = response.data;
            });
    };

    $scope.getUserValue();


    $scope.onClick = function (points, evt) {
        console.log(points, evt);
    };


    var checkObject = {
        user_id: userObject.user_id,
        friend_id: $scope.others_id
    };

    $scope.getOthersData = function () {

        $http({
            method: 'POST', //방식
            url: "/user/loadProfile", /* 통신할 URL */
            data: othersObject, /* 파라메터로 보낼 데이터 */
            headers: {'Content-Type': 'application/json; charset=utf-8'} //헤더
        })
            .then(function (response) {
                $scope.Profile = response.data;
            });
        //친구여부 확인
        $http({
            method: 'POST', //방식
            url: "/user/checkfriends", /* 통신할 URL */
            data: checkObject, /* 파라메터로 보낼 데이터 */
            headers: {'Content-Type': 'application/json; charset=utf-8'} //헤더
        })
            .then(function (response) {
                $scope.check = response.data.msg;

            });

        //친구게시물만 나열하기
        $http({
            method: 'POST', //방식
            url: "/folder/openFriendProfileBoards", /* 통신할 URL */
            data: checkObject, /* 파라메터로 보낼 데이터 */
            headers: {'Content-Type': 'application/json; charset=utf-8'} //헤더
        })
            .then(function (response) {
                $scope.my_boards = response.data;
                if (response.data == "")
                    $scope.fail_message = true;
            });
    }


    $scope.getOthersData();


    var timeObject = {};
    $scope.updateTime = function () {
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

    $scope.toOthers = function (others) {
        $rootScope.others_id = others.user_id;
        if ($rootScope.othersStatus) {
            $state.go("others1");
            $rootScope.othersStatus = false;
        } else {
            $state.go("others2");
            $rootScope.othersStatus = true;
        }
    };

    $scope.getOthersInfo = function () {
        $http({
            method: 'POST', //방식
            url: "/user/loadProfile", /* 통신할 URL */
            data: othersObject, /* 파라메터로 보낼 데이터 */
            headers: {'Content-Type': 'application/json; charset=utf-8'} //헤더
        })
            .then(function (response) {
                $scope.Profile = response.data;
            });

        $http({
            method: 'POST', //방식
            url: "/folder/openMyFolder", /* 통신할 URL */
            data: othersObject, /* 파라메터로 보낼 데이터 */
            headers: {'Content-Type': 'application/json; charset=utf-8'} //헤더
        })
            .then(function (response) {
                $scope.my_boards = response.data;
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


    $scope.showFriendList()

    $scope.applyFriend = function () {
        var applyObject = {
            user_id: store.get('obj').user_id,
            friend_id: $scope.others_id
        };
        $http({
            method: 'POST', //방식
            url: "/user/requestFriend", /* 통신할 URL */
            data: applyObject, /* 파라메터로 보낼 데이터 */
            headers: {'Content-Type': 'application/json; charset=utf-8'} //헤더
        })
            .success(function (data, status, headers, config) {
                if (data) {
                    $http({
                        method: 'POST', //방식
                        url: "/user/checkfriends", /* 통신할 URL */
                        data: checkObject, /* 파라메터로 보낼 데이터 */
                        headers: {'Content-Type': 'application/json; charset=utf-8'} //헤더
                    })
                        .then(function (response) {
                            $scope.check = response.data.msg;

                        });
                }
                else {
                    alert("실패")
                }
            })
    }


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
            board_id: board_id,
            folder_id: folder_id
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
};

