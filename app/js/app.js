document.addEventListener('DOMContentLoaded', function(){

    var tile = document.querySelectorAll('.tile')[0];
    var fullscreen = document.querySelectorAll('.fullscreen')[0];

    var isFullScren = false;
    llb_app.addListener('window_state', function(data){

        isFullScren = data.fullscreen;

        tile.classList.toggle('active', !data.fullscreen);
        fullscreen.classList.toggle('active', data.fullscreen);        
    });

    var centerMap = new google.maps.LatLng(61.6507737,23.6338258);
    var mapOptions = {
        zoom: 10,
        center: centerMap,
        draggable: true,
        fullscreenControl: false,
        streetViewControl: false,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    }

    var map = new google.maps.Map(document.querySelector('.fullscreen'), mapOptions);

    var markerIcon = {
        url: 'http://findicons.com/files/icons/2219/dot_pictograms/128/bus.png', // url
        scaledSize: new google.maps.Size(20, 20), // scaled size
        origin: new google.maps.Point(0,0), // origin
        anchor: new google.maps.Point(0, 0) // anchor
    };

    var fetchUrl = 'http://data.itsfactory.fi/siriaccess/vm/json';

    var markers = [];
    var infoWindow = new google.maps.InfoWindow();

    var setInfoWindowString = function(busData){
        var infoString =   "Line : " + busData.line + "<br \>" 
                        +  "From : " + busData.from + "<br \>" 
                        +  "To : " + busData.to
        infoWindow.setContent(infoString);
    }

    var fetchDataAndRender = function() {
        if(!isFullScren) return;

        llb_app.fetch(fetchUrl)
        .then(data => data.Siri.ServiceDelivery.VehicleMonitoringDelivery["0"].VehicleActivity)
        .then((data) => {

            //Set the marker null for each previous markers
            markers
            .forEach( marker => {
                google.maps.event.clearInstanceListeners(marker);
                marker.setMap(null);

            });

            markers = [];

            data
            .map( data=> data.MonitoredVehicleJourney)
            .forEach( bus => {
                var busData = {}
                busData.ref = bus.VehicleRef.value
                busData.from = bus.OriginName.value
                busData.to = bus.DestinationName.value
                busData.line = bus.LineRef.value
                busData.location = { 
                    lat: bus.VehicleLocation.Latitude,
                    lng: bus.VehicleLocation.Longitude
                }

                marker = new google.maps.Marker({
                    position: new google.maps.LatLng(busData.location),
                    icon: markerIcon,
                    map: map,
                    title: busData.line
                })

                google.maps.event.addListener(marker, 'click', function() {
                    setInfoWindowString(busData);
                    infoWindow.open(map, marker);
                });

                markers.push(marker);
            });
        });
    }

    setInterval(fetchDataAndRender, 3000);


    llb_app.request('location');
    llb_app.addListener('location', function(data){
        var pos = new google.maps.LatLng(data.data.latitude, data.data.longitude)
        map.setCenter(pos);
        
        var marker = new google.maps.Marker({
            position: pos,
            map: map,
            title: 'Current Position'
        })
    })
});


