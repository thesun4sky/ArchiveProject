/**
 * Created by TeasunKim on 2016-09-12.
 */

var __UploadCtrl = function ($scope, $log, Upload, $timeout, store, $state) {
    var userObject = store.get('obj');
    var res="";
    $scope.openAccess = [
        {id :1 ,title :"전체공개"},
        {id :2, title :"Toline"},
        {id :3, title :"나만보기"}
    ];
    $scope.catagory = [
        {id :1 , title :"영화"},
        {id :2 , title :"연극"},
        {id :3 , title :"콘서트"},
        {id :4 , title :"드라마"},
        {id :5 , title :"전시회"},
        {id :6 , title :"음식"},
        {id :7 , title :"여행"},
        {id :8 , title :"음악"}
    ];
    $scope.p_level = $scope.openAccess[0];
    $scope.c_list = $scope.catagory[0];

    $scope.leftClass = function () {
        $scope.class_name = "left";
        $scope.multi_message = "좌측 정렬 되었습니다.";
    };
    $scope.centerClass = function () {
        $scope.class_name = "center";
        $scope.multi_message = "가운데 정렬 되었습니다.";
    };
    $scope.rightClass = function () {
        $scope.class_name = "right";
        $scope.multi_message = "우측 정렬 되었습니다.";
    };
    $scope.leftClass2 = function () {
        $scope.class_name2 = "left2";
        $scope.multi_message2 = "좌측 정렬 되었습니다.";
    };
    $scope.centerClass2 = function () {
        $scope.class_name2 = "center2";
        $scope.multi_message2 = "가운데 정렬 되었습니다.";
    };
    $scope.rightClass2 = function () {
        $scope.class_name2 = "right2";
        $scope.multi_message2 = "우측 정렬 되었습니다.";
    };

    $scope.lines = [
        {
            "firstLine": "",
            "secondLine": "",
            "tag1":"",
            "tag2":"",
            "tag3":""
        }
    ];
    $scope.positions = [
        {
            "divtop1": 0
        }
    ];
    $scope.positions2 = [
        {
            "divtop2": 0
        }
    ];

    $scope.myFunction = function() {
        var words = $scope.lines.firstLine + " " + $scope.lines.secondLine + " ";
        // var words = $scope.lines.firstLine.concat(" ".concat($scope.lines.secondLine));
        //삭제어
        res = words.replace(/은 |는 |이 |이고 |가 |의 |을 |를 |야 |나랑 |하는 |들과 |일 |했던 |한 |내 |너 |나 |네 |하니까 |엔 |앤 |에서 |으로 |이면 |하게 |하는 |으로 |한다 |한다면 |입니당 |입니다 |습니당 |습니다 |어요 |지요 |며 |다면 |니 |자 /gi , " ");  //조사  //동사 꾸밈어  //종조사

        //대체어
        // res = res.replace(/[?]/gi, " 물음표 ");  // ?
        // res = res.replace(/[!]/gi, " 느낌표 ");  // !
        // res = res.replace(/[~]/gi, " 물결 ");  // ~
        res = res.replace(/[~!?@\#$%^&*\()\-=+_']/gi, "");  //특수문자 삭제

        res = res.split(" "); //배열로 분해

        $scope.words = res;
    };

    $scope.uploadPic = function(file,p_level,c_list)  {

        file.upload = Upload.upload({
            url: '/api/board',
            data: {
                file:file,
                user_id:userObject.user_id,
                public_level:p_level.id,
                catagory:c_list.id,
                likes_num: 0,
                tag1: $scope.lines.tag1,
                tag2: $scope.lines.tag2,
                tag3: $scope.lines.tag3,
                line1: $scope.lines.firstLine,
                line1_y: $scope.positions.divtop1,
                line2: $scope.lines.secondLine,
                line2_y: $scope.positions2.divtop2,
                words: $scope.words
            }})
        file.upload.then(function (response) {
            $timeout(function () {
                file.result = response.data;
                $state.go('main');
            });
        }, function (response) {
            if (response.status > 0){
                $scope.errorMsg = response.status + ': ' + response.data;
                alert("response.status > 0");}
        }, function (evt) {
            // Math.min is to fix IE which reports 200% sometimes
            file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
        });
    };
};