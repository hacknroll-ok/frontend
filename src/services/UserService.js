import { API } from './API';

const baseURL = "/user";

class UserService {

    async sendName(name) {
        return await API.post(`${baseURL}`, name);
      }
}

export default new UserService();