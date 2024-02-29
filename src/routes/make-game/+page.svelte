<script>
    import { onMount } from 'svelte';
    import {Button, Input} from 'flowbite-svelte';

    export let data;
    console.log(data.players);
    let players = data.players;

    function reload() {
        location.reload();
    }
</script>

<h1>Players in Game 1</h1>

{#if players.length > 0}
    <ul>
        {#each players as player}
            <li>{player.name}</li>
        {/each}
    </ul>

    <Button on:click={reload}>Reload</Button>
{:else}
    <p>No players found for this game.</p>
{/if}
