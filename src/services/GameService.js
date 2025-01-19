import { API } from './API';

const baseURL = "/game";

class GameService {

    async guessCorrect(playerID, isCorrect) {
        return await API.post(`${baseURL}`, playerID, isCorrect);
      }
}

export default new GameService();