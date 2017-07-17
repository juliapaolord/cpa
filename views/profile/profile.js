'use strict';
angular
    .module('cpaApp')
    .controller('ProfileController', ProfileController);


function ProfileController($scope,$location,$http,$routeParams,$rootScope) {
    var collaborator_id = $routeParams.id;
    $scope.grades = [];
    $scope.months = [];
    $scope.events = [];
    $scope.final = {};
    $scope.selectedMonth = '';
    $scope.current = JSON.parse(localStorage.getItem('current'));
    $scope.indicators = [];
    $scope.resumeData = {
        'Calidad/Operaciones':[],
        'Productividad/Comercial':[],
        'Rentabilidad/Administración':[],
    };
    $scope.extraPoints = {};
    $scope.penalizations = {};
    $scope.totalGrades = [];
    $scope.finalGrades = [];
    $scope.totalEvents = {};
    $scope.remainingMonths = [];

    $scope.newReport = function(month){
        $('#remaining-months').modal('close');
        localStorage.setItem('currentMonth', JSON.stringify(month));
        $location.path('boleta/'+ $scope.current.empleado_id + '/' + $scope.current.nombre + '/' + month.mes);
        /*if($scope.finalGrades.some(grade => grade.mes_id === month_id)){
            $location.path('boleta/'+ $scope.current.empleado_id + '/' + $scope.current.nombre);
        }*/
    }

    $scope.changeMonth = function(selected){
        $scope.selectedMonth = selected;
        if($scope.selectedMonth != '2017'){
            getDataPerMonth(7);
            getDataPerMonth(11);
            getDataPerMonth(12);
        }
    }

    var getFinalGrades = function(){
        $http({
            url: "db/connection.php", //profile
            method: "GET",
            params: {
                request: 16,//0
                collaborator_id: collaborator_id
            }
        }).then(function (response){
            $scope.finalGrades = response.data;
        }, function (response){});
    }

    var getTotalEvents = function(month_id){
        $http({
            url: "db/connection.php", //profile
            method: "GET",
            params: {
                request: 17,//1
                collaborator_id: collaborator_id,
                month_id: month_id
            }
        }).then(function (response){
            month_id = month_id.toString();
            $scope.totalEvents[month_id] = response.data;
            
            console.log(response.data);
            var extras = false;
            var pen = false;
            if(response.data != ""){
                if(response.data.some(event => event.area_id === '4')){
                    pen = true;
                } else if(response.data.some(event => event.area_id === '5')){
                    extras = true;
                }
            }
            $scope.extraPoints[month_id] = extras;
            $scope.penalizations[month_id] = pen;
        }, function (response){});
    }

    var getTotalGrades = function(){
        $http({
            url: "db/connection.php",//profile
            method: "GET",
            params: {
                collaborator_id: collaborator_id,
                request: 14 //2
            }
        }).then(function (response){
            $scope.totalGrades = response.data;
        }, function (response){});
    }

    var formatNumber = function(){
        for(var i=0; i < $scope.grades.length; i++){
            var object = $scope.grades[i];
            switch($scope.grades[i]["unidad_id"]){
                case '6':
                    object["minimo"] = object["minimo"] + "%";
                    object["meta"] = object["meta"] + "%";
                    object["real_obtenido"] = object["real_obtenido"] + "%";
                    break;

                case '8':
                    object["minimo"] = $rootScope.formatMoney(object["minimo"],2);
                    object["meta"] = $rootScope.formatMoney(object["meta"],2);
                    object["real_obtenido"] = $rootScope.formatMoney(object["real_obtenido"],2);
                    break;
            }
        }
    }

    var getDataPerMonth = function(request){
        $http({
            url: "db/connection.php", //profile
            method: "GET",
            params: {
                collaborator_id: collaborator_id,
                month_id: $scope.selectedMonth,
                request: request
            }
        }).then(function (response){
            switch(request){
                case 7://3
                    $scope.grades = response.data;
                    formatNumber();
                    //console.log($scope.grades);
                    break;
                case 11://4
                    $scope.events = response.data;
                    break;
                case 12://5
                    $scope.final = response.data;
            }
            
        }, function (response){});
    }

    var getTypes = function(area_id){
        $http({
            url: "db/connection.php",//modifiers
            method: "GET",
            params: {
                request: 8,//1
                area_id: area_id
            }
        }).then(function (response){
            var area;
            if(area_id === '4'){
                area = $rootScope.areas[3].area;
            } else{
                area = $rootScope.areas[4].area;
            }
            for(var i=0; i<response.data.length; i++){
                $scope.resumeDataMod[area].push(response.data[i].tipo);
            }
        }, function (response){});
    }

    var setResumeData = function(){
        for(var i=0; i<$scope.indicators.length; i++){
            $scope.resumeData[$scope.indicators[i].area].push($scope.indicators[i].indicador);
        }
    }

    var getIndicators = function(){
        $http({
            url: "db/connection.php",//profile
            method: "GET",
            params: {
                collaborator_id: collaborator_id,
                request: 13//6
            }
        }).then(function (response){
            $scope.indicators = response.data;
            setResumeData();
            getFinalGrades();
            for(var i=0; i<$scope.months.length-1; i++){
                getTotalEvents($scope.months[i].mes_id);
            }
        }, function (response){});
    }

    $http({
        url: "db/connection.php",//profile
        method: "GET",
        params: {
            collaborator_id: collaborator_id,
            request: 10//7
        }
    }).then(function (response){
        $scope.months = response.data;
        if($scope.months != "NO INFO"){
            $scope.months.push({
                mes: 'Resumen',
                mes_id: '2017'
            });
            $scope.changeMonth($scope.months[$scope.months.length-1].mes_id);
        } 
     }, function (response){});

    $http({
        url: "db/connection.php",//profile
        method: "GET",
        params: {
            collaborator_id: collaborator_id,
            request: 20//8
        }
    }).then(function (response){
        $scope.remainingMonths = response.data;
    }, function (response){});

    if($scope.current.mes != null){
        getIndicators();
        getTotalGrades();
    }

}

ProfileController.$inject = ['$scope','$location','$http','$routeParams','$rootScope'];