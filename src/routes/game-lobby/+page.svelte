<script>
    import { onMount } from 'svelte';
    import {Avatar, Badge, Button, Card, Input, Listgroup, Range} from 'flowbite-svelte';
    import Cookies from "js-cookie";
    import {goto} from "$app/navigation";

    let game;
    let players;
    let gameId = Cookies.get("gameId");
    let userId = Cookies.get("userId");
    let host = false;
    let timeRangeValue = 60;
    async function getData() {


        console.log("Game ID: ", gameId)

        if (!gameId) {
            await goto("/");
        }

        const response = await fetch(`/api/game?id=${gameId}`, {
            method: 'GET',
            headers: {
                'content-type': 'application/json'
            }
        });

        return response.json()
    }


    onMount(async () => {
        game = await getData();
        console.log(game)
        players = game.players

        if (game.host === userId) {
            host = true;
        }
        console.log("Host: ", host)
        if (game.started === true) {
            await goto("/game")
        }

    });

    function reload() {
        location.reload();
    }

    function handleStart() {
        fetch(`/api/start?id=${gameId}`, {
            method: 'POST',
            body: JSON.stringify({gameTime: timeRangeValue * 60}),
            headers: {
                'content-type': 'application/json'
            }
        }).then(async () => {
            await goto("/game");
        })
    }

    async function onMakePrey(playerId) {
        console.log(playerId)

        try {
            const response = await fetch(`/api/prey?gameId=${gameId}`, {
                method: 'POST',
                body: JSON.stringify({preyId: playerId}),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Failed to make prey: ${response.statusText}`);
            }

            // Handle success response
            console.log('Prey assigned successfully');
            reload();
        } catch (error) {
            console.error('Error making prey:', error);
            // Handle error
        }
    }

    async function resetPrey() {
        try {
            const response = await fetch(`/api/prey?gameId=${gameId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Failed to reset prey: ${response.statusText}`);
            }

            // Handle success response
            console.log('Prey reset successfully');
            reload();
        } catch (error) {
            console.error('Error resetting prey:', error);
            // Handle error
        }
    }


    function getPlayerClass(id) {
        return id === userId ? 'bg-green-200' : '';
    }
</script>

<div class="flex flex-col items-center p-3">
    <h1 class="display-4">Spelcode: {gameId}</h1>

    {#if players}
        {#each players as player}
            <Card class="mb-3 {getPlayerClass(player.id)}">
                <div class="card-body flex flex-row gap-2">
                    <Avatar circle/>
                    <p class="card-title">{player.name}</p>
                    {#if player.id === game.host}
                        <Badge color="yellow">jager</Badge>
                    {/if}

                    {#if player.id === game.prey}
                        <Badge color="blue">loper</Badge>
                    {/if}

                    {#if host && game.prey === null}
                        <Button on:click={() => onMakePrey(player.id)} color="red">Selecteer als loper</Button>
                    {/if}
                    <!-- Additional player information can be added here if available -->
                </div>
            </Card>
        {/each}
        {#if game.host === userId}
            <div class="w-9/12"><h3>Duur van het spel</h3>
                <Range id="range-minmax" min="30" max="180" bind:value={timeRangeValue} step="5"></Range>
                <p>{timeRangeValue} minuten</p></div>
        {/if}
        <div id="buttons">
            <Button class="mt-4" on:click={reload} color="primary">Herladen</Button>
            {#if host}
                <Button class="mt-4" on:click={handleStart} color="green">Start spel</Button>
                <Button class="mt-4" on:click={resetPrey} color="blue">reset loper</Button>
            {/if}
        </div>
    {:else}
        <p class="mt-4">No players found for this game.</p>
    {/if}
</div>

<style>
    #buttons {
        display: flex;
        flex-direction: row;
        gap: 1rem;
    }
</style>
