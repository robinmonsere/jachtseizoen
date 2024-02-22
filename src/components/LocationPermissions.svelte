<script>
    let latitude = null;
    let longitude = null;
    let error = null;

    async function getLocation() {
        if ("geolocation" in navigator) {
            try {
                const position = await new Promise((resolve, reject) => {
                    navigator.geolocation.getCurrentPosition(resolve, reject);
                });
                latitude = position.coords.latitude;
                longitude = position.coords.longitude;
                error = null;
            } catch (err) {
                error = err.message;
                console.error("Error getting location:", error);
            }
        } else {
            error = "Geolocation is not supported by this browser.";
        }
    }
</script>

<div>
    <button on:click={getLocation()}><i class="fa-solid fa-location-pin-lock"></i></button>
    <i class="fa-solid fa-location-dot"></i>
    {#if latitude !== null && longitude !== null}
        <p>Latitude: {latitude}</p>
        <p>Longitude: {longitude}</p>
    {:else if error !== null}
        <p>{error}</p>
    {/if}
</div>
