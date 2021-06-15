const api_URL = 'http://localhost/mapa/api/apiRestaurants.php'
var data_markers = [];
var markers = L.markerClusterGroup(); //en el clusters almaceno todos los markers
let kind = [];
let first_time = true;
let marker = L.marker();
var map = L.map('mapid').on('load', onMapLoad).locate({setView: true,maxZoom: 17,}, 17);
var tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {}).addTo(map);
async function getINF(){ //	FASE 3.1 //get all data from API
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
	markers.clearLayers(); //	FASE 3.2	1) Limpio todos los marcadores
	if (first_time || filter =='all') {
		first_time = false
		data_markers.forEach(x => {marker = new L.marker([x.lat,x.lng])
			.bindPopup('<h2>'+ x.name+'</h2> <p>'+ x.adress + '</p> <br> <img src=images/'+ x.photo+'></img>');
			markers.addLayer(marker)});
	}
 	//	2) Realizo un bucle para decidir que marcadores cumplen el filtro, y los agregamos al mapa
	for(let i =0; i< data_markers.length;i++){
		if(data_markers[i].kind.includes(filter)){
			marker = new L.marker([data_markers[i].lat,data_markers[i].lng])
				.bindPopup('<h2>'+ data_markers[i].name+'</h2> <p>'+ data_markers[i].adress + '</p> <br> <img src=images/'+ data_markers[i].photo+'></img>')
				markers.addLayer(marker)
		}
	}
	map.addLayer(markers);
}
marker.on('click',function () { 
	marker.openPopup()
})