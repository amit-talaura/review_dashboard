import { Endpoints } from "../endpoints/endpoints";
import AxiosService from "../interceptor/interceptor";

const getLogin = async (body) => {
  return await AxiosService.post(Endpoints.login, body);
};

export default {
  getLogin,
};
