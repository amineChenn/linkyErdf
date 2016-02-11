
angular	.module("appTechnophile", [])
    .controller	( "technoPhileController", ['$scope', '$interval', '$timeout', '$http'
    , function($scope,$interval,$timeout,$http,$httpProvider)
    {

        $scope.LancerAnalyse = function (){
            $scope.date = $('.input-groupDebut.date').datepicker("getDate");
            $scope.dateDebut = $scope.date.getFullYear() +"-"+($scope.date.getMonth()+1) +"-" + $scope.date.getDate();
            console.log($scope.dateDebut);
            $scope.date = $('.input-groupFin.date').datepicker("getDate");
            $scope.dateFin = $scope.date.getFullYear() +"-"+($scope.date.getMonth()+1) +"-" + $scope.date.getDate();
                console.log("data = ", data);


        }

        //$interval($scope.LancerAnalyse, 1000);



    }]);