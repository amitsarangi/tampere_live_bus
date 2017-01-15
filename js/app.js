var devkit = angular.module('llbdevkit',['ngMaterial','ngMdIcons'])


devkit.controller('MainController',['$scope', '$window','$timeout', function($scope, $window, $timeout){
	var vm = this

	vm.devices = [
	{'name': "iPhone 5" , 'width': 320, 'height':568},
	{'name': "iPhone 6" , 'width': 375, 'height':667},
	{'name': "iPhone 6 Plus" , 'width': 414, 'height':736},
	{'name': "iPad" , 'width': 768, 'height':1024},
	{'name': "Nexus 4" , 'width': 384, 'height':640},
	{'name': "Galaxy S5" , 'width': 360, 'height':640},
	{'name': "Nexus 5X" , 'width': 411, 'height':731},
	{'name': "Nexus 6P" , 'width': 435, 'height':773}
	]

	$timeout(function(){
		vm.rotated = JSON.parse($window.localStorage.getItem('rotated') || 'false');
		vm.showControls = JSON.parse($window.localStorage.getItem('showControls') || 'true');
		vm.deviceIndex = parseInt($window.localStorage.getItem('deviceIndex') || '0');
		vm.tile_height = parseInt($window.localStorage.getItem('tileHeight') || '100');
		vm.fullscreen = JSON.parse($window.localStorage.getItem('fullscreen') || 'false');
	})


	$scope.$watch('vm.fullscreen', function(oldValue, newValue){
		$timeout(function(){
			vm.sendEvent('app', 'window_state', JSON.stringify({fullscreen: vm.fullscreen}))

			if(oldValue == undefined || newValue == undefined || oldValue == newValue) return
			
			$window.localStorage.setItem('fullscreen', vm.fullscreen)

		}, 300)
	})


	watchList = 'vm.rotated+vm.deviceIndex+vm.showControls+vm.tile_height'

	$scope.$watch(watchList, function(oldValue, newValue){
		if(oldValue == undefined || newValue == undefined || oldValue == newValue) return

		$timeout(function(){
			$window.localStorage.setItem('rotated', vm.rotated)
			$window.localStorage.setItem('deviceIndex', vm.deviceIndex)
			$window.localStorage.setItem('showControls', vm.showControls)
			$window.localStorage.setItem('tileHeight', vm.tile_height)
		})
	})


	vm.sendEvent = function(app_id, event_type, event_data)
	{
		data = {}
		data['event_type'] = event_type
		data['event_data'] = event_data

		document.getElementById(app_id).contentWindow.postMessage(JSON.stringify(data), '*')
	}

	vm.setEventData = function()
	{
		switch(vm.event_type)
		{
			case 'location':
				data_to_send = {}
	  			data_to_send['status'] = 'success'
	  			data_to_send['data'] = {}
	  			data_to_send['data']['timestamp'] = Math.floor(Date.now() / 1000)
	  			data_to_send['data']['latitude'] = 0
	  			data_to_send['data']['longitude'] = 0
	  			data_to_send['data']['accuracy'] = 10
				vm.event_data = JSON.stringify(data_to_send)
				break;
			case 'bus':
				vm.event_data = JSON.stringify({bus_no: 13, bus_id: 1121, event_type: 'bus_detected'})
				break;
		}
	}

	listeners = {}


	var dimension_event = function () {
	  		dimension = {}

	  		dimension['fullscreen_width'] = document.getElementById('contentWindow').offsetWidth
	  		dimension['fullscreen_height'] = document.getElementById('contentWindow').offsetHeight
	  		
	  		dimension['tile_width'] = document.getElementById('contentWindow').offsetWidth
	  		dimension['tile_height'] = vm.tile_height

	  		vm.sendEvent('app', 'window_dimensions', JSON.stringify(dimension))
	}
	angular.element($window).bind('resize', dimension_event);


	var eventMethod = $window.addEventListener ? "addEventListener" : "attachEvent";
	var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";

	// Listen to message from child window
	$window[eventMethod](messageEvent,function(e) {
	  	data = JSON.parse(e.data)
	  	if(data.type == 'window_dimensions')
	  	{
	  		dimension = {}

	  		dimension['fullscreen_width'] = document.getElementById('contentWindow').offsetWidth
	  		dimension['fullscreen_height'] = document.getElementById('contentWindow').offsetHeight
	  		
	  		dimension['tile_width'] = document.getElementById('contentWindow').offsetWidth
	  		dimension['tile_height'] = vm.tile_height

	  		vm.sendEvent('app', 'window_dimensions', JSON.stringify(dimension))
	  	}
	  	else if(data.type == 'location')
	  	{
	  		if(('geolocation' in navigator) && ('Permissions' in window))
	  		{
  				navigator.permissions.query({name:'geolocation'}).then(function(result) {
  					if(result.state == 'granted' || result.state == 'prompt')
  					{
  						navigator.geolocation.getCurrentPosition(function(pos){
  							//Got the permission and has location access
	  						data_to_send = {}
				  			data_to_send['status'] = 'success'

				  			data_to_send['data'] = {}
				  			data_to_send['data']['timestamp'] = pos.timestamp
				  			data_to_send['data']['latitude'] = pos.coords.latitude
				  			data_to_send['data']['longitude'] = pos.coords.longitude
				  			data_to_send['data']['accuracy'] = pos.coords.accuracy
				  			vm.sendEvent('app', 'location', JSON.stringify(data_to_send))

  						},function(){
  							//Explicitly denied permission
	  						data_to_send = {}
				  			data_to_send['status'] = 'failure'
				  			data_to_send['reason'] = 'Explicitly denied permission'
				  			vm.sendEvent('app', 'location', JSON.stringify(data_to_send))
  						},{enableHighAccuracy: true, timeout: 5000, maximumAge: 0});
  					}
  					else if(result.state == 'denied')
  					{
  						data_to_send = {}
			  			data_to_send['status'] = 'failure'
			  			data_to_send['reason'] = 'Explicitly denied permission'
			  			vm.sendEvent('app', 'location', JSON.stringify(data_to_send))
  					}
  				})
	  		}
	  	}
	  	else if(data.type == 'notification')
	  	{
	  		if(('Notification' in window))
	  		{
	  			if(Notification.permission == 'default' || Notification.permission == 'granted') 
	  			{
	  				Notification.requestPermission(function(permission){
	  					if(permission == 'granted')
	  					{
	  						new Notification(data.data.notification_title, {body: data.data.notification_body, icon: data.data.notification_icon});
	  						data_to_send = {}
				  			data_to_send['status'] = 'success'
				  			vm.sendEvent('app', 'notification', JSON.stringify(data_to_send))
	  					}
	  					else
	  					{
				  			data_to_send = {}
				  			data_to_send['status'] = 'failure'
				  			data_to_send['reason'] = 'The user has explicitly denied the notification permission'
				  			vm.sendEvent('app', 'notification', JSON.stringify(data_to_send))
	  					}
	  				})
	  			}
	  			else if(Notification.permission == 'denied')
	  			{
		  			data_to_send = {}
		  			data_to_send['status'] = 'failure'
		  			data_to_send['reason'] = 'The user has explicitly denied the notification permission'
		  			vm.sendEvent('app', 'notification', JSON.stringify(data_to_send))
	  			}
	  		}
	  		else
	  		{
	  			data_to_send = {}
	  			data_to_send['status'] = 'failure'
	  			data_to_send['reason'] = 'You have not applied for permission through portal. Or the browser does not support notifications'
	  			vm.sendEvent('app', 'notification', JSON.stringify(data_to_send))
	  		}
	  		
	  	}
	  	else if(data.type == 'exit')
	  	{
	  		$scope.$apply(function(){
	  			vm.fullscreen = false
	  		})
  			data_to_send = {}
  			data_to_send['status'] = 'success'

  			vm.sendEvent('app', 'exit', JSON.stringify(data_to_send))
	  		
	  	}


	},false);
}])
