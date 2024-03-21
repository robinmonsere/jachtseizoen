import {sql} from "@vercel/postgres";

export async function POST({request, url}) {
    const gameId = url.searchParams.get('id');
    const requestBody = await request.json();
    const winnerId = requestBody.winnerId;

    if (!winnerId) {
        return new Response('Winner ID missing', {status: 404});
    }

    try {
        // Check if the game is already started
        const gameResult = await sql`SELECT finished FROM games WHERE id = ${gameId}`;
        if (gameResult.rows.length === 0) {
            return new Response('Game not found', {status: 404});
        }

        const gameData = gameResult.rows[0];
        const finished = gameData.finished;

        if (finished) {
            return new Response('Game is already done', {status: 409});
        }

        await sql`UPDATE games SET finished = true, winnerid = ${winnerId} WHERE id = ${gameId}`;

        return new Response(JSON.stringify({success: true}), {status: 200});
    } catch (error) {
        console.error("Error ending game:", error);
        return new Response("Error ending game", {status: 500});
    }
}