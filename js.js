let map = L.map('map').setView([100, -0.39], 13);
    
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

console.log(map);


//api goweather meteo
// recuperer la longitude et l'atitude
// recuperer la ville quand on click sur la carte

    map.addEventListener('click', (e) => {
        let lat = e.latlng.lat.toFixed(6);
        let lon = e.latlng.lng.toFixed(6);
        console.log(`l'atitude = ${lat}`);
        console.log(`longitude = ${lon}`);
        fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                const pays = document.createElement('p');
                const city = document.createElement('p');
                const infoPosition = document.querySelector('.info-position');
                pays.textContent = `Pays: ${data.address?.country || "Inconnu"}`;
                city.textContent = `Ville: ${data.address?.city || "Inconnu"}`;
                infoPosition.appendChild(pays);
                infoPosition.appendChild(city);
    const cityName = data.address.city;
                
               /*  const cityName = data.address.county; */
fetch(`https://goweather.xyz/weather/${cityName}`) 
.then(response => response.json())
.then(data => { 
const meteoInfo = document.createElement('p');
infoPosition.appendChild(meteoInfo);
meteoInfo.textContent = `Météo: ${data.temperature}, ${data.wind}`;
console.log(data);

});
                                


})

            });




