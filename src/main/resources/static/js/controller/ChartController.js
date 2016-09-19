/**
 * Created by LeeMoonSeong on 2016-09-13.
 */


var __ChartCtrl = function ($scope) {
    $scope.line_labels = ["세달전", "두달전", "한달전", "3주전", "2주전", "1주전", "이번주"];
    $scope.series = ['긍정', '부정'];
    $scope.LineOnClick = function (points, evt) {
        console.log(points, evt);
    };

    $scope.colours = [{
        fillColor: '#B2EBF4',
        strokeColor: '#003399',
        highlightFill: 'rgba(47, 132, 71, 0.8)',
        highlightStroke: 'rgba(47, 132, 71, 0.8)',
        backgroundColor: '#803690'
    }];
};

