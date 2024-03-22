import {sql} from "@vercel/postgres";

export async function POST({request, url}) {
    const gameId = url.searchParams.get('id');
    const requestBody = await request.json();
    const gameTime = requestBody.gameTime;

    if (!gameTime) {
        return new Response('game time is missing', {status: 404});
    }


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
        const startTimeUnix = Math.floor(Date.now() / 1000); // Calculate the current Unix time

        await sql`UPDATE games SET started = true, startTime = ${startTimeUnix}, gametime = ${gameTime} WHERE id = ${gameId}`;

        return new Response(JSON.stringify({success: true}), {status: 200});
    } catch (error) {
        console.error("Error starting game:", error);
        return new Response("Error starting game", {status: 500});
    }
}