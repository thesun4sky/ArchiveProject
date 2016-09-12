/**
 * Created by TeasunKim on 2016-09-12.
 */
angular.module("homeApp")
    .controller("leftSideBarCtrl",function($interval, $scope, $http, store, $state, $uibModal, $rootScope, $filter){

    $scope.category_labels = ['영화를', '연극을', '콘서트를', '드라마를', '전시회를', '음식을', '여행을', '음악을'];
    var userObject = store.get('obj');

    //친구 추천 받기
    $http({
        method: 'POST', //방식
        url: "/user/findCategoryFriend", /* 통신할 URL */
        data: userObject, /* 파라메터로 보낼 데이터 */
        headers: {'Content-Type': 'application/json; charset=utf-8'} //헤더
    })
        .then(function(response) {
            $scope.friend_Object = response.data;
            $scope.friend_category = $scope.category_labels[$scope.friend_Object.catagory-1];
            //alert($scope.friend_Object.catagory);
            var Recommand_category = {
                catagory : $scope.friend_Object.catagory
            };
            $http({  //추천 테그정보 가져오기(사진 등..)
                method: 'POST', //방식
                url: "/tag/loadRecommandTag", /* 통신할 URL */
                data: Recommand_category, /* 파라메터로 보낼 데이터 */
                headers: {'Content-Type': 'application/json; charset=utf-8'} //헤더
            })
                .then(function (response) {
                    $scope.Recommand_tag = response.data;
                });
        });


    $scope.toTag = function(tags){
        $rootScope.tag_name = tags.tag;
        $state.go("tag");
    };

})