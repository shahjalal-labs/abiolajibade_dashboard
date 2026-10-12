import { baseApi } from "./baseApi";

export const reportApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    userReports: builder.query({
      query: (page) => ({
        url: `/admin/user-reports?page=${page}`,
        method: "GET",
      }),
      providesTags: ["report"],
    }),
    workerReports: builder.query({
      query: (page) => ({
        url: `/admin/worker-reports?page=${page}`,
        method: "GET",
      }),
      providesTags: ["report"],
    }),
    responseUserReport: builder.mutation({
      query: (payload) => ({
        url: `/admin/response-user-report`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["report"],
    }),
    responseWorkerReport: builder.mutation({
      query: (payload) => ({
        url: `/admin/response-worker-report`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["report"],
    }),
  }),
});

export const {
  useUserReportsQuery,
  useWorkerReportsQuery,
  useResponseUserReportMutation,
  useResponseWorkerReportMutation,
} = reportApi;
