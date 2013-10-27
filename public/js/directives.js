'use strict';

/* Directives */

angular.module('videoChat.directives', [])
  //Attach stream to video element when it becomes available
  .directive('attachStream', function(){
  	return function(scope, element, attrs){
		scope.$watch(attrs.attachStream, function(value) {
			if (value !== undefined) {
          //This function is defined in the webRTC adapter (adapter.js) and normalizes attaching a stream to a video element
  				attachMediaStream(element[0], value);	
  			}
      });
  	}
  });
