import { baseApi } from "./baseApi";

export const withdrawApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    allWithdraws: builder.query({
      query: ({ page, status }) => ({
        url: `/admin/withdraw-requests?page=${page}&status=${status}`,
        method: "GET",
      }),
      providesTags: ["withdraw"],
    }),
    rejectWithdrawRequest: builder.mutation({
      query: (id) => ({
        url: `/admin/reject-withdraw-request/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["withdraw"],
    }),
    acceptWithdrawRequest: builder.mutation({
      query: (id) => ({
        url: `/admin/accept-withdraw-request/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["withdraw"],
    }),
  }),
});

export const { useAllWithdrawsQuery, useRejectWithdrawRequestMutation, useAcceptWithdrawRequestMutation } =
  withdrawApi;
