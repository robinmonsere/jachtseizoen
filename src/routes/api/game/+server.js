import {db, Pool, sql} from "@vercel/postgres";

export async function GET({url}) {
    console.log(url.searchParams.get('id'));
    let gameId = url.searchParams.get('id');
    let game;

    try {
        //await db.connect();
        const result = await sql`SELECT * from games where id=${gameId}`;


        // Check if any rows are returned
        if (result.rows.length === 0) {
            return new Response('No game found with the provided ID', {status: 404});
        }

        console.log(result.rows[0]);
        game = result.rows[0];
    } finally {

    }
    return new Response(JSON.stringify(game), {status: 200});
}


export async function POST({request}) {
    const requestBody = await request.json();
    console.log(requestBody)
    const gameId = requestBody.id;
    const host = requestBody.host;

    if (!gameId || !host) {
        return new Response('Game ID or Host ID is missing', {status: 400});
    }

    const finished = false;


    try {
        // Here you would insert the new game into your database
        // For the sake of this example, let's assume a successful insertion
        // await db.connect();
        await sql`INSERT INTO games (id, finished, host) VALUES (${gameId}, ${finished}, ${host})`;

        // Construct the response
        const responseBody = {
            id: gameId,
            finished: finished,
            host: host
        };

        return new Response(JSON.stringify(responseBody), {status: 200});
    } catch (error) {
        console.error("Error creating game:", error);
        return new Response("Error creating game", {status: 500});
    }
}

export async function DELETE({ url }) {
    try {
        const gameId = url.searchParams.get('id');

        // Check if gameId is provided
        if (!gameId) {
            return new Response('Game ID is missing', { status: 400 });
        }

        // Perform deletion of the game
        // For the sake of this example, let's assume successful deletion
        // await db.connect();
        await sql`DELETE FROM games WHERE id=${gameId}`;

        // Return success response
        return new Response('Game deleted successfully', { status: 200 });
    } catch (error) {
        console.error("Error deleting game:", error);
        return new Response("Error deleting game", { status: 500 });
    }
}
