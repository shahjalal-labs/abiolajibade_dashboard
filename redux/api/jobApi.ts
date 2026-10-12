import { baseApi } from "./baseApi";

export const jobApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    allJobs: builder.query({
      query: ({ page, searchTerm }) => ({
        url: `/admin/all-jobs?page=${page}&search=${searchTerm}`,
        method: "GET",
      }),
      providesTags: ["jobs"],
    }),
    overview: builder.query({
      query: () => ({
        url: `/admin/overview`,
        method: "GET",
      }),
      providesTags: ["jobs"],
    }),
    earningSummary: builder.query({
      query: (type) => ({
        url: `/admin/earnings-summary?type=${type}`,
        method: "GET",
      }),
      providesTags: ["jobs"],
    }),
    topWorkers: builder.query({
      query: () => ({
        url: `/admin/top-workers`,
        method: "GET",
      }),
      providesTags: ["jobs"],
    }),
    deleteJob: builder.mutation({
      query: (id) => ({
        url: `/job/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["jobs"],
    }),
  }),
});

export const { useAllJobsQuery, useOverviewQuery, useEarningSummaryQuery, useTopWorkersQuery, useDeleteJobMutation } = jobApi;
