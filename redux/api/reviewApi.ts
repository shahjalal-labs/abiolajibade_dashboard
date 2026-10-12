import { baseApi } from "./baseApi";

export const reviewApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    userReview: builder.query({
      query: (page) => ({
        url: `/admin/all-user-reviews?page=${page}`,
        method: "GET",
      }),
      providesTags: ["review"],
    }),
    workerReview: builder.query({
      query: (page) => ({
        url: `/admin/all-worker-reviews?page=${page}`,
        method: "GET",
      }),
      providesTags: ["review"],
    }),
  }),
});

export const { useUserReviewQuery, useWorkerReviewQuery } = reviewApi;
