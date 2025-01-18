import { API } from './API';

const baseURL = "/users";

class UserService {

    async sendName(name) {
      return await API.post(`${baseURL}`, name);
    }

    async getPlayers() {
      return await API.get(`${baseURL}/players`);
    }
}

export default new UserService();