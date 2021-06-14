const api_URL = 'http://localhost/mapa/api/apiRestaurants.php'
var data_markers = [];
var markers = L.markerClusterGroup(); //en el clusters almaceno todos los markers
let kind = [];
let first_time = true;
let marker = L.marker();
var map = L.map('mapid').on('load', onMapLoad).locate({setView: true,maxZoom: 17,}, 17);
var tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {}).addTo(map);
//	FASE 3.1 //get all data from API
async function getINF(){
	const resp = await fetch(api_URL)
	const data = await resp.json()
	// sorting the data 
	for(let i=0;i<data.length;i++){
		// fill data_marker //	1) Relleno el data_markers con una petición a la api
		let basicInfo = {
			name: data[i].name,
			kind: data[i].kind_food.split(','),
			photo: data[i].photo,
			adress: data[i].adress,			
			lat: data[i].lat,
			lng:  data[i].lng
		}
		// getting the kind of food's restaurant
		data_markers.push(basicInfo)
		kind = kind.concat(data[i].kind_food.split(','))
	}
	// displaying on selecting element  //	2) Añado de forma dinámica en el select los posibles tipos de restaurantes
	kind = [...new Set(kind)];
	for(let i=0; i<kind.length;i++){
		$('#kind_food_selector').append('<option>'+kind[i]+'</option>');
	}
	render_to_map(data_markers, 'all')
}
function onMapLoad() {
	//	3) Llamo a la función para --> render_to_map(data_markers, 'all'); <-- para mostrar restaurantes en el mapa
	getINF();
	console.log("Mapa cargado");
}
$('#kind_food_selector').on('change', function() {
  console.log(this.value);
  render_to_map(data_markers, this.value);
});
function render_to_map(data_markers, filter){
	if (first_time) {
		first_time = false
		filter = 'all'
	}
//	FASE 3.2	1) Limpio todos los marcadores
	if(marker){
		markers.clearLayers();
	}
	//	2) Realizo un bucle para decidir que marcadores cumplen el filtro, y los agregamos al mapa
	if (filter !== 'all'){
		for(let i =0; i< data_markers.length;i++){
			for(let y=0; y<data_markers[i].kind.length;y++){
				if( filter == data_markers[i].kind[y]){
					marker = new L.marker([data_markers[i].lat,data_markers[i].lng])
					.bindPopup('<h2>'+ data_markers[i].name+'</h2> <p>'+ data_markers[i].adress + '</p> <br> <img src=images/'+ data_markers[i].photo+'></img>')
					markers.addLayer(marker)
				}
			}
		}
	}
	else{
		data_markers.forEach(x => {marker = new L.marker([x.lat,x.lng])
			.bindPopup('<h2>'+ x.name+'</h2> <p>'+ x.adress + '</p> <br> <img src=images/'+ x.photo+'></img>');
				markers.addLayer(marker)
		});
	}
	map.addLayer(markers);
}
marker.on('click'(function (e) { 
	marker.openPopup()
}))