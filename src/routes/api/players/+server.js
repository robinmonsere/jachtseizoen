import {sql} from "@vercel/postgres";
import {json} from "@sveltejs/kit";

export async function GET({ url }) {
    const gameId = url.searchParams.get('gameId');

    try {
        // Retrieve game data from the database based on gameId
        const result = await sql`SELECT players from games where id=${gameId}`;

        // Check if the game exists
        if (result.rows.length === 0) {
            return new Response('Game not found', { status: 404 });
        }

        // Return game data
        return new Response(JSON.stringify(result.rows[0].players), { status: 200 });
    } catch (error) {
        console.error("Error retrieving game data:", error);
        return new Response("Error retrieving game data", { status: 500 });
    }
}

// POST function to add a players to the game
export async function POST({ request, url }) {
    const requestBody = await request.json();
    console.log(requestBody)
    const gameId = url.searchParams.get('gameId');
    console.log(gameId)
    const playerId = requestBody.playerId;
    const playerName = requestBody.playerName;

    if (!playerId || !playerName) {
        return new Response('Name or ID missing', { status: 404 })
    }

    try {
        // Retrieve game data from the database based on gameId
        const gameResult = await sql`SELECT * from games where id=${gameId}`;
        // Check if the game exists
        if (gameResult.rows.length === 0) {
            return new Response('Game not found', { status: 404 });
        }
        // Extract the existing players array from the game data
        const gameData = gameResult.rows[0];
        const players = gameData.players || [];

        // check if playerId is already in players
        const playerExists = players.some(player => player.id === playerId);
        if (playerExists) {
            return new Response('Player already exists in the game', { status: 200 });
        }

        // Append the new player object to the players array
        players.push({ id: playerId, name: playerName });
        console.log("adding these players")
        console.log(players)
        // Add the players to the game
        // For the sake of this example, let's assume successful addition
        await sql`UPDATE games SET players=${JSON.stringify(players)} WHERE id=${gameId}`
        // Return success response
        return new Response('Player added to the game', { status: 200 });
    } catch (error) {
        console.error("Error adding players to the game:", error);
        return new Response("Error adding players to the game", { status: 500 });
    }
}