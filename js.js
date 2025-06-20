let map = L.map('map').setView([48.85, 2.35], 13);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

console.log(map);

map.addEventListener('click', (e) => {
    let lat = e.latlng.lat.toFixed(6);
    let lon = e.latlng.lng.toFixed(6);
    console.log(`l'atitude = ${lat}`);
    console.log(`longitude = ${lon}`);
    const infoPosition = document.querySelector('.info-position');
    infoPosition.innerHTML = ""; // Nettoie l'affichage à chaque clic

    fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`, {
        headers: { 'User-Agent': 'votre-app/1.0 (email@exemple.com)' }
    })
        .then(response => {
            if (!response.ok) throw new Error('Erreur Nominatim');
            return response.json();
        })
        .then(data => {
            console.log(data);
            const pays = document.createElement('p');
            const city = document.createElement('p');
            pays.textContent = `Pays: ${data.address?.country || "Inconnu"}`;
            city.textContent = `Ville: ${data.address?.city || data.address?.town || data.address?.village || "Inconnu"}`;
            infoPosition.appendChild(pays);
            infoPosition.appendChild(city);
            const cityName = data.address.city || data.address.town || data.address.village;
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
                    console.log(data);
                })
                .catch(err => {
                    const meteoInfo = document.createElement('p');
                    meteoInfo.textContent = "Impossible de récupérer la météo.";
                    infoPosition.appendChild(meteoInfo);
                    console.error(err);
                });
        })
        .catch(err => {
            const errorInfo = document.createElement('p');
            errorInfo.textContent = "Impossible de récupérer les informations de localisation.";
            infoPosition.appendChild(errorInfo);
            console.error(err);
        });
});




