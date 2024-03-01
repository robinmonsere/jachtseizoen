<script>
import LocationPermissions from "../../components/LocationPermissions.svelte";
import {onMount} from "svelte";
import Cookies from "js-cookie";

let gameId = Cookies.get('gameId');
let userId = Cookies.get('userId');
let preyId;
let locationData;
let gameData;
import {Map, MapStyle, config, Marker} from '@maptiler/sdk';
import "@maptiler/sdk/dist/maptiler-sdk.css";
import {Alert, Button} from "flowbite-svelte";


let map;
let mapContainer;
config.apiKey = import.meta.env.VITE_PUBLIC_MAP_KEY;

onMount(async () => {
    const response = await fetch(`/api/game?id=${gameId}`, {
        method: 'GET',
        headers: {
            'content-type': 'application/json'
        }
    });

    gameData = await response.json();
    locationData = gameData.locations;
    console.log("location Data: ", gameData.prey);
    preyId = gameData.prey;
    const initialState = { lng: 3.2690188, lat: 50.9164767, zoom: 14 };

    map = new Map({
        container: mapContainer,
        style: MapStyle.STREETS,
        center: [initialState.lng, initialState.lat],
        zoom: 14
    });

    locationData.forEach(location => {
        new Marker({ color: "#FF0000" }).setLngLat([parseFloat(location.lon), parseFloat(location.lat)]).addTo(map);
    });

    const locationList = convertToCoordinatesArray(locationData);

    map.on('load', async function() {
        map.addSource('route', {
            'type': 'geojson',
            'data': {
                'type': 'Feature',
                'properties': {},
                'geometry': {
                    'type': 'LineString',
                    'coordinates': locationList
                }
            }
        });

        map.addLayer({
            'id': 'route',
            'type': 'line',
            'source': 'route',
            'layout': {
                'line-join': 'round',
                'line-cap': 'round'
            },
            'paint': {
                'line-color': '#0022fd',
                'line-width': 15
            }
        });
    })

    function convertToCoordinatesArray(locations) {
        return locations.map(location => [parseFloat(location.lon), parseFloat(location.lat)]);
    }



});
const onLocationShare = async () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const {latitude, longitude} = position.coords;
            console.log("Latitude: ", latitude, "Longitude: ", longitude);
            fetch(`/api/location?gameId=${gameId}`, {
                method: 'POST',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify({lat: latitude, lon: longitude})
            }).then(response => {
                if (response.ok) {
                    console.log("Location added");
                }
            });
        });
    } else {
        Alert.show("Geolocation is not supported by this browser.");
    }
};

function onReload() {
    location.reload();
}


</script>

<main>
    <LocationPermissions />
    <div class="map-wrap">
        <div class="map" bind:this={mapContainer}></div>
    </div>
    {#if preyId === userId}
        <Button on:click={onLocationShare}>Locatie delen</Button>

    {/if}
    <Button on:click={onReload}>Reload</Button>
</main>


<style>
    .map-wrap {
        max-height: 80vh;
        position: relative;
        width: 100%;
        height: calc(100vh - 77px); /* calculate height of the screen minus the heading */
    }

    .map {
        position: absolute;
        width: 100%;
        height: 100%;
    }
</style>