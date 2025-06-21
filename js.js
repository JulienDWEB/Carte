let map = L.map('map', {
  maxBounds: [
    [-85, -180],
    [85, 180]
  ],
  maxBoundsViscosity: 1.0 
}).setView([48.85, 2.35 ], 13);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 20,
    minZoom: 3, 
    noWrap: true,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

console.log(map);   

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

console.log(map);

let currentMarker = null;


map.addEventListener('click', (e) => {
    let lat = e.latlng.lat.toFixed(6);
    let lon = e.latlng.lng.toFixed(6);
    
    // Ajoute un marqueur à l'endroit du clic
if (currentMarker) {
        map.removeLayer(currentMarker);
    }
    currentMarker = L.marker([lat, lon]).addTo(map);


    const infoPosition = document.querySelector('.info-position');
    infoPosition.innerHTML = ""; // Nettoie l'affichage à chaque clic

    // Positionne la div à la position du curseur
    // e.originalEvent contient les coordonnées du clic souris
    infoPosition.style.left = `${e.originalEvent.clientX + 10}px`;
    infoPosition.style.top = `${e.originalEvent.clientY + 10}px`;
    infoPosition.style.display = "block";

    fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`)
        .then(response => {
            if (!response.ok) throw new Error('Erreur Nominatim');
            return response.json();
        })
        .then(data => {
            console.log(data);
            
            const pays = document.createElement('p');
            const city = document.createElement('p');
            pays.textContent = `Pays: ${data.address?.country || "Inconnu"}`;
            const cityParts = [
                data.address?.city,
                data.address?.city_block,
                data.address?.region,
                data.address?.town,
                data.address?.postcode,
                data.address?.village
            ].filter(Boolean);
            city.textContent = `Ville: ${cityParts.length ? cityParts.join(', ') : "Inconnu"}`;
            infoPosition.appendChild(pays);
            infoPosition.appendChild(city);
            const cityName = cityParts[0];
            if (!cityName) return;

            fetch(`https://goweather.xyz/weather/${cityName}`)
                .then(response => {
                    if (!response.ok) throw new Error('Erreur météo');
                    return response.json();
                })
                .then(data => {
                    const meteoInfo = document.createElement('p');
                    meteoInfo.textContent = `Météo: ${data.temperature || "N/A"}, ${data.wind || "N/A"}`;
                    infoPosition.appendChild(meteoInfo);
                })
                .catch(() => {
                    const meteoInfo = document.createElement('p');
                    meteoInfo.textContent = "Impossible de récupérer la météo.";
                    infoPosition.appendChild(meteoInfo);
                });
        })
        .catch(() => {
            const errorInfo = document.createElement('p');
            errorInfo.textContent = "Impossible de récupérer les informations de localisation.";
            infoPosition.appendChild(errorInfo);
        });
});

fetch('https://router.project-osrm.org/route/v1/driving/2.35,48.85;2.36,48.86?overview=false')
  .then(r => r.json())
  .then(console.log)


// Gestion de l'itinéraire
let routeStart = null;
let routeEnd = null;
let routeControl = null;

map.on('contextmenu', function(e) { // clic droit pour l'itinéraire
    if (!routeStart) {
        routeStart = L.latLng(e.latlng.lat, e.latlng.lng);
        L.marker(routeStart).addTo(map).bindPopup("Départ").openPopup();
    } else if (!routeEnd) {
        routeEnd = L.latLng(e.latlng.lat, e.latlng.lng);
        L.marker(routeEnd).addTo(map).bindPopup("Arrivée").openPopup();

        if (routeControl) {
            map.removeControl(routeControl);
        }
        routeControl = L.Routing.control({
            waypoints: [
                routeStart,
                routeEnd
            ],
            routeWhileDragging: false,
            draggableWaypoints: false,
            addWaypoints: false,
            show: false
        }).addTo(map);
    } else {
        // Reset pour un nouvel itinéraire
        map.eachLayer(layer => {
            if (layer instanceof L.Marker && !layer._icon.classList.contains('leaflet-control')) {
                map.removeLayer(layer);
            }
        });
        if (routeControl) {
            map.removeControl(routeControl);
            routeControl = null;
        }
        routeStart = L.latLng(e.latlng.lat, e.latlng.lng);
        routeEnd = null;
        L.marker(routeStart).addTo(map).bindPopup("Départ").openPopup();
    }
  
});
  L.Routing.control({
    waypoints: [
        L.latLng(48.85, 2.35),
        L.latLng(48.86, 2.36)
    ]
}).addTo(map);
