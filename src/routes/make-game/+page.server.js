import {db, Pool, sql} from "@vercel/postgres";


async function getGamePlayers(gameId) {
    try {
        //await db.connect();
        const result = await sql`SELECT players from games where id=${gameId}`;
        console.log(result.rows[0].players);
        return result.rows[0].players;
    } finally {
    }
}

export async function load({ locals }) {
    return {
        players: await getGamePlayers('BABA'),
    }
}