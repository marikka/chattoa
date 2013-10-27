'use strict';

/* Directives */


angular.module('myApp.directives', [])
  //Attach stream to video element when it becomes available
  .directive('attachStream', function(){
  	return function(scope, element, attrs){
		scope.$watch(attrs.attachStream, function(value) {
			if (value !== undefined) {
  				attachMediaStream(element[0], value);	
  			}
      	});
  	}
  });
