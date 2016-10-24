var devkit = angular.module('llbdevkit',['ngMaterial','ngMdIcons'])


devkit.controller('MainController',['$scope', '$window', function($scope, $window){
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

	vm.rotated = false;
	vm.showControls = true;


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
				vm.event_data = JSON.stringify({latitude: 0.00000, longitude: 0.00000})
				break;
			case 'bus':
				vm.event_data = JSON.stringify({bus_no: 13, bus_id: 1121, event_type: 'bus_detected'})
				break;
		}
	}

	$scope.$watch('vm.fullscreen', function(){
		vm.sendEvent('app', 'window_state', JSON.stringify({fullscreen: vm.fullscreen}))
	})

	vm.fullscreen = false;

	var eventMethod = $window.addEventListener ? "addEventListener" : "attachEvent";
	var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";

	// Listen to message from child window
	$window[eventMethod](messageEvent,function(e) {
	  	data = JSON.parse(e.data)
	  	if(data.type == 'window_dimensions')
	  	{
	  		dimension = {}

	  		dimension['fullscreen_width'] = vm.devices[vm.deviceIndex].width
	  		dimension['fullscreen_height'] = vm.devices[vm.deviceIndex].height
	  		
	  		dimension['tile_width'] = vm.devices[vm.deviceIndex].width
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