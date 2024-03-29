import {sql} from "@vercel/postgres";

export async function POST({request, url}) {
    const gameId = url.searchParams.get('gameId');
    const requestBody = await request.json();
    const preyId = requestBody.preyId;

    try {
        // Check if the game is already started
        const gameResult = await sql`SELECT started FROM games WHERE id = ${gameId}`;
        if (gameResult.rows.length === 0) {
            return new Response('Game not found', {status: 404});
        }

        const gameData = gameResult.rows[0];
        const started = gameData.started;

        if (started) {
            return new Response('Game is already started', {status: 409});
        }

        // Update the game to mark it as started
        await sql`UPDATE games SET prey = ${preyId} WHERE id = ${gameId}`;

        return new Response(JSON.stringify({success: true}), {status: 200});
    } catch (error) {
        console.error("Error starting game:", error);
        return new Response("Error starting game", {status: 500});
    }
}


export async function DELETE({request, url}) {
    const gameId = url.searchParams.get('gameId');

    console.log("Deleting prey from game", gameId)
    try {
        // Check if the game is already started
        const gameResult = await sql`SELECT * FROM games WHERE id = ${gameId}`;
        if (gameResult.rows.length === 0) {
            return new Response('Game not found', {status: 404});
        }

        const gameData = gameResult.rows[0];
        const started = gameData.started;

        if (started) {
            return new Response('Game is already started', {status: 409});
        }

        // Update the game to mark it as started
        await sql`UPDATE games SET prey = ${null} WHERE id = ${gameId}`;

        return new Response(JSON.stringify({success: true}), {status: 200});
    } catch (error) {
        console.error("Error starting game:", error);
        return new Response("Error starting game", {status: 500});
    }
}