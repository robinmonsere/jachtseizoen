<script>
    import { onMount, onDestroy } from 'svelte'
    import {Map, MapStyle, config, Marker} from '@maptiler/sdk';
    import "@maptiler/sdk/dist/maptiler-sdk.css";

    let map;
    let mapContainer;
    export let locData;
    config.apiKey = import.meta.env.VITE_PUBLIC_MAP_KEY;

    onMount(() => {
        console.log(locData, "locData")
        const initialState = { lng: 3.2690188, lat: 50.9164767, zoom: 14 };

        map = new Map({
            container: mapContainer,
            style: MapStyle.STREETS,
            center: [initialState.lng, initialState.lat],
            zoom: initialState.zoom
        });

        new Marker({color: "#FF0000"})
            .setLngLat([3.2690188,50.9164767])
            .addTo(map);

    });

</script>

<div class="map-wrap">
    <div class="map" bind:this={mapContainer}></div>
</div>

<style>
    .map-wrap {
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