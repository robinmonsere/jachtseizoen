import {sql} from "@vercel/postgres";

export async function POST({request, url}) {
    const gameId = url.searchParams.get('gameId');
    const requestBody = await request.json();
    const lat = requestBody.lat;
    const lon = requestBody.lon;

    try {
        // Check if the game is already started
        const gameResult = await sql`SELECT * FROM games WHERE id = ${gameId}`;
        if (gameResult.rows.length === 0) {
            return new Response('Game not found', {status: 404});
        }

        const gameData = gameResult.rows[0];
        const started = gameData.started;

        if (!started) {
            return new Response('Game is not yet started', {status: 409});
        }

        const locations = gameData.locations || [];
        console.log("adding these locations")
        console.log(locations)
        locations.push({lat: lat, lon: lon});


        // Update the game to mark it as started
        await sql`UPDATE games SET locations = ${JSON.stringify(locations)} WHERE id = ${gameId}`;

        return new Response(JSON.stringify({success: true}), {status: 200});
    } catch (error) {
        console.error("Error starting game:", error);
        return new Response("Error starting game", {status: 500});
    }
}

export async function GET({request, url}) {
    const gameId = url.searchParams.get('gameId');
    try {
        // Retrieve game data from the database based on gameId
        const result = await sql`SELECT locations from games where id=${gameId}`;

        // Check if the game exists
        if (result.rows.length === 0) {
            return new Response('Game not found', { status: 404 });
        }

        // Return game data
        return new Response(JSON.stringify(result.rows[0].locations), { status: 200 });
    } catch (error) {
        console.error("Error retrieving game data:", error);
        return new Response("Error retrieving game data", { status: 500 });
    }
}