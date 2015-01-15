angular.module('empanadas.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $rootScope) {
  $scope.config = {ppl: 0.00, lpk: 0.0}
  if (localStorage.getItem("precioporlitro") == null) {
    $scope.config.ppl = 0.00;
    localStorage.setItem("precioporlitro", JSON.stringify($scope.config.ppl))
  } else {
    $scope.config.ppl = JSON.parse(localStorage.getItem("precioporlitro"))
  }
  if (localStorage.getItem("litrosporkm") == null) {
    $scope.config.lpk = 0.00;
    localStorage.setItem("litrosporkm", JSON.stringify($scope.config.lpk))
  } else {
    $scope.config.lpk = JSON.parse(localStorage.getItem("litrosporkm"))
  }

  $rootScope.ppl = $scope.config.ppl;
  $rootScope.lpk = $scope.config.lpk;

  $scope.ppl = function(value) {
    if (value >= 0){
      localStorage.setItem("precioporlitro", value)
      $rootScope.ppl = $scope.config.ppl;  
    } else {
      $scope.config.ppl = 0.00;
      localStorage.setItem("precioporlitro", value)
    }
    
  }

  $scope.lpk = function(value) {
    if (value >= 0){
      localStorage.setItem("litrosporkm", value)
      $rootScope.lpk = $scope.config.lpk;  
    } else {
      $scope.config.lpk = 0.0;
      localStorage.setItem("litrosporkm", value)
    }
  }
})




.controller('MainCtrl', function($scope, $rootScope, $ionicModal) {
  /* MODAL */ 
  $scope.cNuevo = function() {
    $ionicModal.fromTemplateUrl('templates/nuevo.html', {
      scope: $scope,
      animation: 'slide-in-up'
    })
    .then(function(modal) {
      $scope.nuevo = modal;
      $scope.nuevo.nFecha = convertDate(new Date())
      $scope.nuevo.nCombustible = 0
      $scope.nuevo.nPeaje = 0
      $scope.nuevo.nEstacionamiento = 0
      $scope.nuevo.nKilometros = 0
      $scope.nuevo.show();
    });

  }

  $scope.crear = function (_descripcion, _fecha, _combustible, _peaje, _estacionamiento, _kilometros) {
    if (isNullOrWhitespace(_descripcion)) {
      alert("Debe cargar la descripcion");
    } else if (isNullOrWhitespace(_fecha)) {
      alert("Debe cargar la fecha");
    } else {
      $scope.items.push({descripcion: _descripcion, fecha: _fecha ,combustible: _combustible, peaje: _peaje, estacionamiento: _estacionamiento, kilometros: _kilometros, ppl: $rootScope.ppl, lpk: $rootScope.lpk, total: _combustible + _peaje + _estacionamiento})
      localStorage.setItem("items", JSON.stringify($scope.items))
      $scope.nuevo.nDescripcion = ""
      $scope.nuevo.nFecha = convertDate(new Date())
      $scope.nuevo.nCombustible = 0
      $scope.nuevo.nPeaje = 0
      $scope.nuevo.nEstacionamiento = 0
      $scope.nuevo.nKilometros = 0
      $scope.nuevo.remove();
    }
  }

  /* MODAL 2 */
  $ionicModal.fromTemplateUrl('templates/editar.html', {
    scope: $scope,
    animation: 'slide-in-up'
  })
  .then(function(modal){
    $scope.editar = modal;
  });

  /*Resto*/
  $scope.filtro = {mes: "", descripcion: ""}
  $scope.item = {descripcion: "", fecha: null ,combustible: 0, peaje: 0, estacionamiento: 0, km: 0, ppl: 0.00, lpk: 0.0, total: 0}
  if (localStorage.getItem("items")!=null){
    $scope.items = JSON.parse(localStorage.getItem("items"));
  } else {
    $scope.items = []  
  }
  
  $scope.edicion = function (id, descripcion, fecha, combustible, peaje, estacionamiento, kilometros) {
    $scope.editar.eId = id;
    $scope.editar.eDescripcion = descripcion;
    $scope.editar.eFecha = fecha;
    $scope.editar.eCombustible = combustible;
    $scope.editar.ePeaje = peaje;
    $scope.editar.eEstacionamiento = estacionamiento;
    $scope.editar.eKilometros = kilometros;
    $scope.editar.show();
  }

  $scope.eliminar = function (id) {
    $scope.items.splice(id, 1);
    localStorage.setItem("items", JSON.stringify($scope.items))
    $scope.editar.hide();
  }

  $scope.guardar = function (id, _descripcion, _fecha, _combustible, _peaje, _estacionamiento, _kilometros) {
    $scope.items[id] = {
      descripcion: _descripcion,
      fecha: _fecha,
      combustible: _combustible,
      peaje: _peaje,
      estacionamiento: _estacionamiento,
      kilometros: _kilometros,
      total: _combustible + _peaje + _estacionamiento
    }
    localStorage.setItem("items", JSON.stringify($scope.items))
    $scope.editar.hide();
  }

  function convertDate(inputFormat) {
    function pad(s) { return (s < 10) ? '0' + s : s; }
    var d = inputFormat.getFullYear() + "-" + pad(inputFormat.getMonth()+1) + "-" + pad(inputFormat.getDate())
    return d;
  }
  function isNullOrWhitespace( input ) {
    if (typeof input === 'undefined' || input == null) return true;
    return input.replace(/\s/g, '').length < 1;
}
})

