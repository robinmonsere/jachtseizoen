import Cookies from "js-cookie";

export async function _joinGame(gameId, name, userId) {
  console.log(JSON.stringify({playerId: userId, name: name}));

  const response = await fetch(`/api/players?gameId=${gameId}`, {
    method: 'POST',
    body: JSON.stringify({playerId: userId, playerName: name}),
    headers: {
      'content-type': 'application/json'
    }
  });

  console.log("Response: ", response);

  return response;
}