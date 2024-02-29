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


export async function _createGame(userId) {

  let gameId = _createGameId();

  const response = await fetch(`/api/game`, {
    method: 'POST',
    body: JSON.stringify({id: gameId, host: userId}),
    headers: {
      'content-type': 'application/json'
    }
  });

  console.log("Response: ", response);

  return response;
}

export function _createGameId() {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let code = '';
  for (let i = 0; i < 5; i++) {
    const randomIndex = Math.floor(Math.random() * letters.length);
    code += letters.charAt(randomIndex);
  }
  return code;
}