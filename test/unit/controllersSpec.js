describe('videoChat controllers', function() {
  beforeEach(module('videoChat.controllers'));
 
  describe('AppCtrl', function(){
 
    it('should foo', inject(function($controller) {
      var scope = {},
          ctrl = $controller('AppCtrl', { $scope: scope });
 
      expect(3).toBe(2);

    }));
  });
});