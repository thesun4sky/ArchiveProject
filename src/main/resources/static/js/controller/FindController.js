/**
 * Created by TeasunKim on 2016-09-12.
 */

var __FindCtrl =  function ($rootScope,$scope,$http, store, $state) {
    $scope.find_user = "";


    $scope.logout = function(){
        store.set('obj',null);
        $state.go('login');
    };


    $scope.keyHit = function() {

        $http.get("/user/findUser/"+$scope.find_user)
            .then(function (response) {
                $scope.users = response.data;
            });

        $http.get("/tag/findTag/"+$scope.find_user)
            .then(function (response) {
                $scope.tags = response.data;
            });
    };

    $scope.toTag = function(tags){
        $rootScope.tag_name = tags.tag;
        $state.go("tag");
    };


    var userObject = store.get('obj');

    $scope.user_Object=[{
        user_id : userObject.user_id,
        user_img : "",
        name : userObject.name
    }];
    $http({
        method: 'POST', //방식
        url: "/user/loadProfile", /* 통신할 URL */
        data: userObject, /* 파라메터로 보낼 데이터 */
        headers: {'Content-Type': 'application/json; charset=utf-8'} //헤더
    })
        .then(function(response) {
            $scope.user_Object = response.data;
        });
};
