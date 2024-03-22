<script>
    import {onMount} from "svelte";
    import {Map, MapStyle, config, Marker} from '@maptiler/sdk';
    import "@maptiler/sdk/dist/maptiler-sdk.css";
    import {goto} from "$app/navigation";


    let map;
    let mapContainer;
    config.apiKey = import.meta.env.VITE_PUBLIC_MAP_KEY;

    const initialState = { lng: 3.253537, lat: 50.920454, zoom: 14 };

    onMount(async () => {
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
    });
</script>


<button on:click={() => {goto("/")}} ><i class="fa-solid fa-arrow-left"></i></button>
<div class="map-wrap">
    <div class="map" bind:this={mapContainer}>

    </div>
</div>


<style>
    button {
        position: absolute;
        z-index: 9;
    }
    i {
        margin-top: 1rem;
        margin-left: 1rem;
        font-size: 3rem;
    }

    .map-wrap {
        max-height: 100vh;
        position: relative;
        width: 100%;
        height: 100vh; /* calculate height of the screen minus the heading */
    }

    .map {
        position: absolute;
        width: 100%;
        height: 100%;
    }
</style>