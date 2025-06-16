
      maptilersdk.config.apiKey = mapTocken;

      // const mapContainer = document.getElementById('map');

    //   const map = new maptilersdk.Map({
    //     container: 'map',
    //     style: maptilersdk.MapStyle.STREETS_DARK,
    //     hash: true,
    
    //   })

console.log(campground)
console.log(campground.geometry.coordinates)
    const map = new maptilersdk.Map({
    container: 'map',                 // ✅ matches the div id
    style: maptilersdk.MapStyle.OUTDOOR,
    //style: maptilersdk.MapStyle.STREETS	,   // or MapStyle.HYBRID	 / MapStyle.DARK
    center: campground.geometry.coordinates,                 // lng, lat – optional but nice
    zoom: 9
  });


  const popup = new maptilersdk.Popup({ offset: 25 }).setHTML(`
    <h5>${campground.title}</h5>
    <p>${campground.location}</p>
  `);

  const marker = new maptilersdk.Marker()
  .setLngLat(campground.geometry.coordinates)
  .setPopup(popup)
  .addTo(map);