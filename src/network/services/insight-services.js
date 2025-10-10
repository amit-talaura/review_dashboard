import { Endpoints } from "../endpoints/endpoints";
import AxiosService from "../interceptor/interceptor";

const getInsightReview = async (companyId) => {
  const params = { companyId };
  return await AxiosService.get(Endpoints.insightReview, { params });
};

const getStoreById = async (storeId) => {
  return await AxiosService.get(`${Endpoints.store}/${storeId}`);
};

const resolveReview = async (payload) => {
  return await AxiosService.post(Endpoints.resolveReview, payload);
};

const getUserByStore = async (id) => {
  return await AxiosService.get(Endpoints.getUser(id));
};

export default {
  getInsightReview,
  getStoreById,
  resolveReview,
  getUserByStore,
};
