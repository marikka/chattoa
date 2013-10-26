'use strict';

/* Directives */


angular.module('myApp.directives', []).
  directive('appVersion', ['version', function(version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
  }])
  //Attach stream to video element when it becomes available
  .directive('attachStream', function(){
  	return function(scope, element, attrs){
  		scope.$watch('stream', function(newValue, oldValue) {
  			if (newValue !== undefined) {
  				attachMediaStream(element[0], newValue);	
  			}
		});
  	}
  });
