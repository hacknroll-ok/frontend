import { API } from './API';

const baseURL = "/game";

class GameService {

    async sendGuess(playerID, guess) {
        return await API.post(`${baseURL}`, playerID,  guess);
      }
}

export default new GameService();