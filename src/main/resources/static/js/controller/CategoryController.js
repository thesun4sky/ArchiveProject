/**
 * Created by TeasunKim on 2016-09-12.
 */


var __CategoryCtrl = function ($scope,$http, store, $state, $rootScope) {
    var userObject = store.get('obj');

    $scope.colorCode1 = "#" + Math.round(Math.random() * 0xFFFFFF).toString(16);
    $scope.colorCode2 = "#" + Math.round(Math.random() * 0xFFFFFF).toString(16);
    $scope.colorCode3 = "#" + Math.round(Math.random() * 0xFFFFFF).toString(16);

    $http({
        method: 'POST', //방식
        url: "/api/boardlist", /* 통신할 URL */
        data: userObject, /* 파라메터로 보낼 데이터 */
        headers: {'Content-Type': 'application/json; charset=utf-8'} //헤더
    })
        .then(function(response) {
            $scope.catagory_boards = response.data;
            $scope.tagArray= [];
            for(var i=0;i<$scope.catagory_boards.length;i++) {
                $scope.checkPush($scope.catagory_boards.tag1);
                $scope.checkPush($scope.catagory_boards.tag2);
                $scope.checkPush($scope.catagory_boards.tag3);
            }
            $scope.checkPush = function (data) {
                for(var j=0; j<$scope.tagArray.length; j++){
                    if(tagArray[j].tag == data)
                    {
                        $scope.tagIsIn = true;
                    }
                    else{
                        $scope.tagIsIn = false;
                    }
                }
                if($scope.tagIsIn){
                    $scope.tagArray.push($scope.catagory_boards.tag1);
                }
                else{
                    alert('엘스 떴다.');
                }
            }

        });

    $scope.view_allCatagory = function(){
        $http({
            method: 'POST', //방식
            url: "/api/boardlist", /* 통신할 URL */
            data: userObject, /* 파라메터로 보낼 데이터 */
            headers: {'Content-Type': 'application/json; charset=utf-8'} //헤더
        })
            .then(function(response) {
                $scope.catagory_boards = response.data;
                $scope.filters_catagory ={};
                // $scope.getTagElement($scope.catagory_boards);
            });

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

    //클릭시마다 카테고리 변수를 갱신할 변수.
    $scope.filters_catagory={};

    $scope.menuList = [
        {catagory :1, link :"movie", title: "영화", icon1: "glyphicon" , icon2 : "glyphicon-film"},
        {catagory :2, link :"act", title: "연극", icon1: "fa", icon2 : "fa-street-view"},
        {catagory :3, link :"concert", title: "콘서트",  icon1: "fa" , icon2 : "fa-microphone"},
        {catagory :4, link :"drama", title: "드라마", icon1: "fa", icon2 : "fa-tv"},
        {catagory :5, link :"exhibition", title: "전시회", icon1: "glyphicon" , icon2 : "glyphicon-blackboard"},
        {catagory :6, link :"food", title: "음식", icon1: "glyphicon" , icon2 : "glyphicon-cutlery"},
        {catagory :7, link :"travel", title: "여행", icon1: "glyphicon" , icon2 : "glyphicon-plane"},
        {catagory :8, link :"music", title: "음악", icon1: "glyphicon" , icon2 : "glyphicon-music"}
    ];



    $scope.catagoryPost = function(menu) {

        var catagoryObject =
        {catagory: menu.catagory};

        $http({
            method: 'POST', //방식
            url: "/api/boardlistByCatagory", /* 통신할 URL */
            data: catagoryObject, /* 파라메터로 보낼 데이터 */
            headers: {'Content-Type': 'application/json; charset=utf-8'} //헤더
        })
            .then(function (response) {
                $scope.catagory_boards = response.data;
                //$scope.$apply();
            })
    };

    $scope.toTag = function(tags){
        $rootScope.tag_name = tags;
        $state.go("tag");
    }
};
