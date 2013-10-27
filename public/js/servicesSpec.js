describe('videoChat services', function() {

	var mockSocketService, usersService;
  beforeEach(module('videoChat.services'));
  beforeEach(function(){
  	mockSocketService = {on: jasmine.createSpy(), emit: jasmine.createSpy()};

  	module(function($provide){
  		$provide.value('socketService', mockSocketService);
  	});

    inject(function($injector) {
      usersService = $injector.get('usersService');
    });
  });
 
  describe('usersService', function(){

    it('should emit "requestUsers" when created', function(){
      expect(mockSocketService.emit).toHaveBeenCalledWith("requestUsers");
    });

  	describe('register', function(){
	    it('should emit "registerUser"', function() {
        usersService.register("Marek", null, null);
        expect(mockSocketService.emit.mostRecentCall.args).toEqual(["registerUser", "Marek"]);
	    });
  	});

    describe('getList', function(){
      it('should emit "requestUsers" when called', function(){
        usersService.getList();
        expect(mockSocketService.emit.mostRecentCall.args).toEqual(["requestUsers"]);
      });
    });
 
  });
});