'use strict';
angular
    .module('cpaApp')
    .directive('cpasidenav', cpaSidenav);

function cpaSidenav($http, $rootScope) {
    var directive = {
        link: link,
        replace: true,
        restrict: 'E',
        templateUrl: 'components/sidenav/sidenav.html'
    };
    return directive;

    function link(scope, element, attrs) {
        scope.user = JSON.parse(localStorage.getItem('user'));
        scope.menuItems = [];
        scope.dropdownItems = [];
        scope.dropdownButton = '';
        scope.role = '';

        $rootScope.areas = [{
            area: 'Calidad/Operaciones',
            id: '1'
        },{
            area: 'Productividad/Comercial',
            id: '2'
        },{
            area: 'Rentabilidad/Administración',
            id: '3'
        },{
            area: 'Penalizaciones',
            id: '4'
        },{
            area: 'Puntos Extras',
            id: '5'
        }];


        if(scope.user.rol === 'gerente'){
            if(JSON.parse(localStorage.getItem('department')) === null){
                scope.$on('someEvent', function(e) {
                    scope.department = JSON.parse(localStorage.getItem('department'));
                    scope.role = 'Gerente de ' + scope.department.departamento;
                });
            } else{
                scope.department = JSON.parse(localStorage.getItem('department'));
                scope.role = 'Gerente de ' + scope.department.departamento;
            }
            
            

            scope.menuItems = [{
                item: 'Inicio',
                ref: '/cpa/',
                pclass: '',
                activates: ''
            },{
                item: 'Colaboradores',
                ref: '/cpa/colaboradores',
                pclass: '',
                activates: ''
            }];

            scope.dropdownButton = 'Catálogos';
            scope.dropdownItems = [{
                item: 'Indicadores',
                ref: '/cpa/indicadores'
            },{
                item: 'Penalizaciones',
                ref: '/cpa/penalizaciones'
            },{
                item: 'Puntos Extras',
                ref: '/cpa/puntos_extras'
            }];

        } else{
            scope.role = scope.user.rol;
            scope.menuItems = [{
                item: 'Inicio',
                ref: '/cpa/',
                pclass: '',
                activates: ''
            }];

            scope.dropdownButton = 'Departamentos';
            scope.dropdownItems = [{
                item: 'Administración',
                ref: '/cpa/administracion',
                name: 'administracion'
            },{
                item: 'Desarrollo',
                ref: '/cpa/desarrollo',
                name: 'desarrollo'
            },{
                item: 'Soporte',
                ref: '/cpa/soporte',
                name: 'soporte'
            },{
                item: 'Ventas',
                ref: '/cpa/ventas',
                name: 'ventas'
            }];  

        }

       $('.dropdown-button').dropdown({
            inDuration: 300,
            outDuration: 225,
            constrainWidth: false, // Does not change width of dropdown to that of the activator
            hover: false, // Activate on hover
            gutter: 0, // Spacing from edge
            belowOrigin: true, // Displays dropdown below the button
            alignment: 'left', // Displays dropdown with edge aligned to the left of button
            stopPropagation: false // Stops event propagation
            }
        );
    }
}

cpaSidenav.$inject = ['$http', '$rootScope'];