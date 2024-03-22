<script>
import LocationPermissions from "../../components/LocationPermissions.svelte";
import {onDestroy, onMount} from "svelte";
import Cookies from "js-cookie";

let gameId = Cookies.get('gameId');
let userId = Cookies.get('userId');
let preyId;
let locationData;
let gameData;
let elapsedTime = '';
let players;
let drawerHidden = true;
import {Map, MapStyle, config, Marker} from '@maptiler/sdk';
import "@maptiler/sdk/dist/maptiler-sdk.css";
import {Alert, Avatar, Badge, Button, Card, Drawer} from "flowbite-svelte";
import {goto} from "$app/navigation";



let map;
let mapContainer;
config.apiKey = import.meta.env.VITE_PUBLIC_MAP_KEY;

// Function to format elapsed time in (hh:mm:ss) format
function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// Recursive function to update elapsed time every second
function updateTime() {
    const startTime = gameData.starttime;
    if (startTime) {
        const currentTime = Math.floor(Date.now() / 1000);
        elapsedTime = formatTime(currentTime - startTime);
        setTimeout(updateTime, 1000);
    }
}


onMount(async () => {
    const response = await fetch(`/api/game?id=${gameId}`, {
        method: 'GET',
        headers: {
            'content-type': 'application/json'
        }
    });

    gameData = await response.json();
    console.log("Game Data: ", gameData);

    if (gameData == null) {
        Alert.show("Game not found");
        await goto('/');
    }

    if (gameData.finished === true) {
        await goto('/game-end');
    }


    players = gameData.players;
    locationData = gameData.locations;
    console.log("location Data: ", gameData.prey);
    preyId = gameData.prey;
    const initialState = { lng: 3.253537, lat: 50.920454, zoom: 14 };

    map = new Map({
        container: mapContainer,
        style: MapStyle.STREETS,
        center: [initialState.lng, initialState.lat],
        zoom: 13,
        positionOptions: {
            enableHighAccuracy: true
        },
        trackUserLocation: true,
        showUserLocation: true,
        enableHighAccuracy: true,
    });

    if (locationData != null) {
        locationData.forEach(location => {
            new Marker({ color: "#FF0000" }).setLngLat([parseFloat(location.lon), parseFloat(location.lat)]).addTo(map);
        });
    }


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
        console.log("Locations: ", locations)
        if (locations == null) {
            return [];
        }
        return locations.map(location => [parseFloat(location.lon), parseFloat(location.lat)]);
    }

    updateTime();


});
const onLocationShare = async () => {
    console.log("Sharing location")
    if (navigator.geolocation) {
        console.log("Geolocation is supported")
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
                    onReload();
                }
            });
        });
    } else {
        Alert.show("Geolocation is not supported by this browser.");
    }
};

async function onLeave() {
    // remove cookie with gameId
    Cookies.remove('gameId');
    await goto('/');
}

function onReload() {
    location.reload();
}
function getPlayerClass(id) {
    return id === userId ? 'bg-green-200' : '';
}

onDestroy(() => {
    clearTimeout(updateTime);
});

</script>

<main>
    <LocationPermissions />
    <div class="top-bar">
        <button on:click={() => {drawerHidden = !drawerHidden}}><i class="fa-solid fa-bars m-2"></i></button>
        <p>
            {#if gameData}
                tijd: {elapsedTime}
            {/if}
        </p>
        <div>
            <Button color="green" on:click={onReload}>Reload</Button>
        </div>
    </div>
    <div class="map-wrap">
        <div class="map" bind:this={mapContainer}>

        </div>
    </div>
    {#if preyId === userId}
        <div id="locationButton" class:invisible={!drawerHidden} >
            <Button on:click={onLocationShare}>Locatie delen</Button>
        </div>
    {/if}
    <Drawer width="w-50" bind:hidden={drawerHidden}>
        <div class="drawer">
            <div class="flex flex-row justify-between">
                <button on:click={() => {drawerHidden = !drawerHidden}}><i class="fa-solid fa-x m-2"></i></button>
                <p>Spelcode: {gameId}</p></div>
            <div class="overflow-scroll mt-2 mb-2">
                {#if gameData != null}
                    {#each gameData.players as player}
                        <Card class="mb-3 {getPlayerClass(player.id)}">
                            <div class="card-body flex flex-row gap-2">
                                <Avatar circle/>
                                <p class="card-title">{player.name}</p>
                                {#if player.id === gameData.host}
                                    <Badge color="yellow">jager</Badge>
                                {/if}

                                {#if player.id === gameData.prey}
                                    <Badge color="blue">loper</Badge>
                                {/if}
                                <!-- Additional player information can be added here if available -->
                            </div>
                        </Card>
                    {/each}
                {:else}
                    <p class="mt-4">No players found for this game.</p>
                {/if}
            </div>

        <Button on:click={onLeave} color="red">Verlaat het spel</Button>

        </div>
    </Drawer>
</main>


<style lang="scss">

  .drawer {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    //background: hotpink;
  }

  main {
    max-height: 100vh;
    position: relative;
    // location button should be over everything
    .invisible {
      display: none;
    }
    #locationButton {
      position: absolute;
      bottom: 0.5rem;
      left: 0.5rem;
      z-index: 99; /* Set a high z-index to ensure the button is placed over everything else */
    }
  }
    .top-bar {
        color: white;
        background: #FE795D;
        height: 10vh;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        padding: 0 1rem;
      button {
        font-size: 2.5rem;
      }
    }
    .map-wrap {
        max-height: 90vh;
        position: relative;
        width: 100%;
        height: 90vh; /* calculate height of the screen minus the heading */
    }

    .map {
        position: absolute;
        width: 100%;
        height: 100%;
    }
</style>