describe('videoChat controllers', function() {
  beforeEach(module('videoChat.controllers'));
 
  describe('UsersCtrl', function(){
 
    it('should foo', inject(function($controller) {
      	var scope = {},
        ctrl = $controller('UsersCtrl', { $scope: scope });
 		
      	expect(true).toBe(true);

    }));
  });
});