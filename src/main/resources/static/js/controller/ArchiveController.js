/**
 * Created by LeeMoonSeong on 2016-09-12.
 */


var __ArchiveCtrl = function ($scope, $http, store, $state, $uibModal, $rootScope,$filter) {

    //TODO: 로그인 정보를 토큰에서 받는것으로 변경하기

    var userObject = store.get('obj');
    $scope.quantity = 4;
    $scope.name = userObject.login_id;
    $scope.labels = ['만족', '반전', '박진감', '웃음', '통쾌', '후회', '식상', '지루', '혐오', '실망'];

    $scope.archiveList = function () {
        $http({
            method: 'POST', //방식
            url: "/folder/getFolderList", /* 통신할 URL */
            data: userObject, /* 파라메터로 보낼 데이터 */
            headers: {'Content-Type': 'application/json; charset=utf-8'} //헤더
        })
            .then(function (response) {
                $scope.folders = response.data;
            })
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
                    $scope.openFolder($rootScope.folder);
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
                    $scope.openFolder($rootScope.folder);
                }
            })
            .error(function (data, status, headers, config) {
                /* 서버와의 연결이 정상적이지 않을 때 처리 */
                console.log(status);
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
                    alert('페이버릿 성공');
                    $scope.openFolder($rootScope.folder);
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
                    alert('페이버릿취소 성공');
                    $scope.openFolder($rootScope.folder);
                }
            })
            .error(function (data, status, headers, config) {
                /* 서버와의 연결이 정상적이지 않을 때 처리 */
                console.log(status);
            });
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
            $scope.openFolder($rootScope.folder);
        });
    };

    $scope.archiveList();

    $scope.addNewFolder = function (new_folder_name) {
        var newFolderObject =
        {
            user_id: userObject.user_id,
            folder_name: new_folder_name
        };

        $http({
            method: 'POST', //방식
            url: "/folder/newFolder", /* 통신할 URL */
            data: newFolderObject, /* 파라메터로 보낼 데이터 */
            headers: {'Content-Type': 'application/json; charset=utf-8'} //헤더
        })
            .success(function (data, status, headers, config) {
                if (data.msg == 'false') {
                    alert('폴더생성 실패');
                } else {
                    $scope.archiveList();
                }
            })
            .error(function (data, status, headers, config) {
                /* 서버와의 연결이 정상적이지 않을 때 처리 */
                console.log(status);
            });
    };

    $scope.deleteFolder = function (folder_id) {
        var deleteFolderObject =
        {
            user_id: userObject.user_id,
            folder_id: folder_id
        };

        $http({
            method: 'POST', //방식
            url: "/folder/deleteFolder", /* 통신할 URL */
            data: deleteFolderObject, /* 파라메터로 보낼 데이터 */
            headers: {'Content-Type': 'application/json; charset=utf-8'} //헤더
        })
            .success(function (data, status, headers, config) {
                if (data.msg == 'false') {
                    alert('폴더삭제 실패');
                } else {
                    $scope.archiveList();
                }
            })
            .error(function (data, status, headers, config) {
                /* 서버와의 연결이 정상적이지 않을 때 처리 */
                console.log(status);
            })
    }

    $scope.folders = { };

    $scope.deleteBoard = function(board){
        alert('삭제됩니다?!');
        $http({
            method: 'POST', //방식
            url: "/api/deleteboard", /* 통신할 URL */
            data: board,
            headers: {'Content-Type': 'application/json; charset=utf-8'}
        })
            .success(function (data, status, headers, config) {
                if(data.msg == 'success') {
                    alert('게시글 삭제 성공');
                    $scope.archiveList();
                }else{
                    alert('게시글 삭제 실패');
                }
            })
    };
    $rootScope.folder = "";
    $scope.openFolder = function (folder_id) {
        $rootScope.folder = folder_id;
        if(folder_id == 100){
            var openLineFolderObject = {
                user_id: userObject.user_id
            };
            $http({
                method: 'POST', //방식
                url: "/folder/openLineFolder", /* 통신할 URL */
                data: openLineFolderObject, /* 파라메터로 보낼 데이터 */
                headers: {'Content-Type': 'application/json; charset=utf-8'} //헤더
            })
                .then(function (response) {
                    $scope.folder_boards = response.data;
                    $scope.myId = false;
                });
        }
        else if(folder_id == 200){
            var openFavoriteFolderObject = {
                user_id: userObject.user_id
            };
            $http({
                method: 'POST', //방식
                url: "/folder/openFavoriteFolder", /* 통신할 URL */
                data: openFavoriteFolderObject, /* 파라메터로 보낼 데이터 */
                headers: {'Content-Type': 'application/json; charset=utf-8'} //헤더
            })
                .then(function (response) {
                    $scope.folder_boards = response.data;
                    $scope.myId = false;
                });
        }
        else if(folder_id == 300){
            var openMyFolderObject = {
                user_id: userObject.user_id
            };
            $http({
                method: 'POST', //방식
                url: "/folder/openMyFolder", /* 통신할 URL */
                data: openMyFolderObject, /* 파라메터로 보낼 데이터 */
                headers: {'Content-Type': 'application/json; charset=utf-8'} //헤더
            })
                .then(function (response) {
                    $scope.folder_boards = response.data;
                    $scope.myId = true; //userObject.user_id;
                });
        }
        else{
            var openFolderObject =
            {
                folder_id: folder_id
            };

            $http({
                method: 'POST', //방식
                url: "/folder/openFolder", /* 통신할 URL */
                data: openFolderObject, /* 파라메터로 보낼 데이터 */
                headers: {'Content-Type': 'application/json; charset=utf-8'} //헤더
            })
                .then(function (response) {
                    $scope.folder_boards = response.data;
                    $scope.myId = false;
                });
        }
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

    $scope.onClick = function (points, evt) {
        console.log(points, evt);
    };
};
