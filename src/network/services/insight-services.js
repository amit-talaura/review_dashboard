import { Endpoints } from "../endpoints/endpoints";
import AxiosService from "../interceptor/interceptor";

const getInsightReview = async (companyId) => {
  const params = { companyId };
  return await AxiosService.get(Endpoints.insightReview, { params });
};

export default {
  getInsightReview,
};


