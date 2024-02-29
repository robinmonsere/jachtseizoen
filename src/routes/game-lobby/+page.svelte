<script>
    import { onMount } from 'svelte';
    import {Avatar, Badge, Button, Card, Input, Listgroup} from 'flowbite-svelte';
    import Cookies from "js-cookie";
    import {goto} from "$app/navigation";

    let game;
    let players;
    let gameId = Cookies.get("gameId");
    async function getData() {


        console.log("Game ID: ", gameId)

        if (!gameId) {
            return {};
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

        if (game.started === true) {
            await goto("/game")
        }

    });

    function reload() {
        location.reload();
    }
</script>

<div class="flex flex-col items-center">
    <h1 class="display-4">Spel met code: {gameId}</h1>

    {#if players}
        {#each players as player}
            <Card class="mb-3">
                <div class="card-body flex flex-row gap-2">
                    <Avatar circle/>
                    <p class="card-title">{player.name}</p>
                    {#if player.id === game.host}
                        <Badge color="yellow">Host</Badge>
                    {/if}
                    <!-- Additional player information can be added here if available -->
                </div>
            </Card>
        {/each}

        <Button class="mt-4" on:click={reload} color="primary">Reload</Button>
    {:else}
        <p class="mt-4">No players found for this game.</p>
    {/if}
</div>
