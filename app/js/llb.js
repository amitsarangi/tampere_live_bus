

var llb_app = {}

llb_app.listeners = {}


llb_app.addListener = function(type, callback)
{
	if(llb_app.listeners[type] == undefined)
	{
		llb_app.listeners[type] = []

	}

	llb_app.listeners[type].push(callback)
}

llb_app.removeListener = function(type, callback)
{
	if(llb_app.listeners[type] != undefined)
	{
		if(llb_app.listeners[type].indexOf(callback) != -1)
		{
			llb_app.listeners[type].splice(llb_app.listeners[type].indexOf(callback),1)
		}
	}
}


llb_app.request = function(event_type, data_to_send)
{
	data = {}
	data['type'] = event_type
	
	if(data_to_send != undefined)
	{
		data['data'] = data_to_send	
	}

	parent.postMessage(JSON.stringify(data) , '*')
}

window.addEventListener('message', function(event){
	msg = JSON.parse(event.data)

	if(llb_app.listeners[msg.event_type] != undefined)
	{

		for(var i=0;i<llb_app.listeners[msg.event_type].length;i++)
		{

			try
			{
				llb_app.listeners[msg.event_type][i](JSON.parse(msg.event_data))
			}
			catch(e)
			{
				console.log(e)
			}
		}

	}
})