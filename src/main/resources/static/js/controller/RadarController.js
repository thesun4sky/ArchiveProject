

var __RadarCtrl = function ($scope) {
    $scope.labels = ['만족', '반전', '박진감', '웃음', '통쾌', '후회', '식상', '지루', '혐오', '실망'];

    $scope.RadarOnClick = function (points, evt) {
        console.log(points, evt);
    };

    $scope.colours =
        [ '#803690', '#00ADF9', '#DCDCDC', '#46BFBD', '#FDB45C', '#949FB1', '#4D5360'];
};


  
