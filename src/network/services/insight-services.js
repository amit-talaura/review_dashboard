import { Endpoints } from "../endpoints/endpoints";
import AxiosService from "../interceptor/interceptor";

const getInsightReview = async (companyId) => {
  const params = { companyId };
  return await AxiosService.get(Endpoints.insightReview, { params });
};

const getStoreById = async (storeId) => {
  return await AxiosService.get(`${Endpoints.store}/${storeId}`);
};

export default {
  getInsightReview,
  getStoreById,
};


