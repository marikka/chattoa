describe('videoChat controllers', function() {
	var mockUsersService;
  beforeEach(module('videoChat.controllers'));
  beforeEach(function(){
  	mockUsersService = jasmine.createSpyObj('usersService', ['register']);
  	module(function($provide){
  		$provide.value('usersService', mockUsersService);
  	});
  	
  })
 
  describe('RegisterCtrl', function(){
  	describe('register', function(){
	    it('should get called', inject(function($controller) {
	      	var scope = {},
	        ctrl = $controller('RegisterCtrl', { $scope: scope });

	        scope.user = {};
	        scope.user.name = "Marek";
	        scope.register();
	 		
	      	expect(mockUsersService.register).toHaveBeenCalled();

	    }));
  	});
 
  });
});