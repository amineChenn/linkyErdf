/**
 * Created by Amine on 01/02/2016.
 */

angular	.module("appAnomalie", [])
    .controller	( "anomlieController", ['$scope', '$interval', '$timeout', '$http'
    , function($scope,$interval,$timeout,$http,$httpProvider)
    {
      $scope.json = "";

      $scope.getTarif = function (){
        $http.get("http://localhost/api.php/opttarifaire", {timeout:1000}).success(function (data) {
          console.log("data0 = ", data);
          $scope.json = data[1].IdOptTarifaire;
        });
      }

      var promise = $interval($scope.getTarif, 1000);
}]);