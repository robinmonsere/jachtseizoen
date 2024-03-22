<script>

    import {Alert, Button, Heading, Toast} from "flowbite-svelte";
    import {goto} from "$app/navigation";
    import {onMount} from "svelte";
    import Cookies from "js-cookie";
    let gameId = Cookies.get('gameId');
    let userId = Cookies.get('userId');
    let gameData;
    let hostId;

    onMount(async () => {
        const response = await fetch(`/api/game?id=${gameId}`, {
            method: 'GET',
            headers: {
                'content-type': 'application/json'
            }
        });
        gameData = await response.json();
        hostId = gameData.host;
        console.log(gameData)
    });

    function onCatched() {
        fetch(`/api/game/end?id=${gameId}`, {
            method: 'POST',
            body: JSON.stringify({
                winnerId: gameId
            }),
            headers: {
                'content-type': 'application/json'
            }
        });
        console.log("Game ended")
        goto("/game")
    }

    function onNotCatched() {
        //goto("/game")
    }
</script>

<button on:click={() => {goto("/game")}} ><i class="fa-solid fa-arrow-left"></i></button>

<div class="h-screen flex flex-col items-center gap-10">


    {#if userId === hostId}
            <h1>Is de loper gevangen?</h1>
        <Alert border dismissable={false} color="red" contentClass="bg-red-500">
            <p class="text-red-700">Let op! Dit beëindigt het spel!</p>
        </Alert>
        <div class="flex-row gap-10 flex">
            <Button on:click={() => {onCatched()}} >Ja</Button>
            <Button on:click={() => {onNotCatched()}}>Nee</Button>
        </div>

    {:else}
            <h1>Enkel de host kan het spel beëindigen</h1>

    {/if}
</div>




<style>
    i {
        margin-top: 2rem;
        margin-left: 2rem;
        font-size: 3rem;
    }
    h1  {
        font-size: 2rem;
    }
</style>

