<script>
    // Import required modules
    import { onMount } from 'svelte';
    import Cookies from 'js-cookie'; // Assuming you've imported the js-cookie library

    // Get userId from Cookies
    let userId = Cookies.get("userId");
    let gameId = Cookies.get('gameId');
    let players = [];
    let gameData;
    let winnerId;
    // Initialize winner and loser objects
    let winner;
    let isWinner = false;

    // Find winner object based on userId
    onMount(async () => {
        const response = await fetch(`/api/game?id=${gameId}`, {
            method: 'GET',
            headers: {
                'content-type': 'application/json'
            }
        });
        gameData = await response.json();
        players = gameData.players;
        console.log(players);
        winnerId = gameData.winnerid;

        winner = players.find(player => player.id === winnerId);
        console.log(winner);
        isWinner = winner.id === userId;
    });
</script>

<!-- Winner or Loser Screen Layout -->
<!-- Chatgpt aaah code-->
<!-- Winner or Loser Screen Layout -->
{#if isWinner}
    <div class="bg-gradient-to-r from-purple-600 to-pink-500 min-h-screen flex items-center justify-center">
        <div class="w-full sm:w-3/4 lg:w-2/4 p-6 bg-white shadow-md rounded-lg transform hover:scale-105 transition-transform duration-300">
            <h1 class="text-3xl font-semibold text-center mb-6 text-purple-800">🏆 Winnaar! 🎉</h1>
            <div class="flex justify-center items-center">
                <div class="flex-shrink-0 h-20 w-20">
                    <img class="h-full w-full object-cover rounded-full border-4 border-purple-600" src="https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3hrMmZtZHF2ZmM0MHN3OGdkZGMxNnJyNGU0YW0xOTg1aGlmZ2pyZyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/ytTYwIlbD1FBu/giphy.gif" alt="Winnaar Avatar">
                </div>
                <div class="ml-4">
                    <h2 class="text-2xl font-semibold text-purple-800">{winner ? winner.name : 'Laden...'}</h2>
                    <p class="text-lg text-gray-700">Gefeliciteerd! Je hebt gewonnen!</p>
                </div>
            </div>
            <div class="mt-6">
                <h3 class="text-lg font-semibold mb-2 text-purple-800">Andere Spelers:</h3>
                <ul>
                    {#each players as player}
                        {#if player.id !== userId}
                            <li class="flex items-center space-x-2 text-gray-700">
                                <span class="bg-purple-200 rounded-full px-2 py-1 text-xs font-semibold">{player.name.charAt(0)}</span>
                                <span>{player.name}</span>
                            </li>
                        {/if}
                    {/each}
                </ul>
            </div>
        </div>
    </div>
{:else}
    <div class="bg-gray-800 min-h-screen flex flex-col items-center justify-center text-white">
        <div class="p-6 bg-gray-900 shadow-md rounded-lg mb-4">
            <h1 class="text-3xl font-semibold text-center mb-6">Volgende keer beter!</h1>
            <p class="text-lg text-center">Helaas, je hebt deze keer niet gewonnen. Blijf proberen!</p>
        </div>
        <div class="bg-gray-700 p-4 rounded-lg">
            <h2 class="text-xl font-semibold text-gray-200 mb-2">Spelers:</h2>
            <ul>
                {#each players as player}
                    {#if player.id === winnerId}
                        <li class="text-yellow-500 font-semibold flex items-center space-x-2">
                            <span>👑</span>
                            <span>{player.name}</span>
                        </li>
                    {:else}
                        <li class="text-gray-400">{player.name}</li>
                    {/if}
                {/each}
            </ul>
        </div>
    </div>
{/if}
