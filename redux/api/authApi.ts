import { baseApi } from "./baseApi";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    adminLogin: builder.mutation({
      query: (body) => ({
        url: `/admin/login`,
        method: `POST`,
        body: body,
      }),
    }),
    forgotPassword: builder.mutation({
      query: (body) => ({
        url: `/auth/send-otp`,
        method: `POST`,
        body: body,
      }),
    }),
    verifyOTP: builder.mutation({
      query: (body) => ({
        url: `/auth/verify-otp`,
        method: `POST`,
        body: body,
      }),
    }),
    resetPassword: builder.mutation({
      query: (body) => {
        return {
          url: `/auth/reset-password`,
          method: `PATCH`,
          body: body,
        };
      },
    }),
    changePassword: builder.mutation({
      query: (body) => ({
        url: `/auth/change-password`,
        method: `PATCH`,
        body: body,
      }),
    }),
    getMyProfile: builder.query({
      query: () => ({
        url: `/users/profile`,
        method: "GET",
      }),
      providesTags: ["profile"],
    }),
    userDetails: builder.query({
      query: (id) => ({
        url: `/admin/user-details/${id}`,
        method: "GET",
      }),
      providesTags: ["profile"],
    }),
    workerDetails: builder.query({
      query: (id) => ({
        url: `/admin/worker-details/${id}`,
        method: "GET",
      }),
      providesTags: ["profile"],
    }),
    allUsers: builder.query({
      query: ({ page, searchTerm }) => ({
        url: `/admin/all-users?page=${page}&search=${searchTerm}`,
        method: "GET",
      }),
      providesTags: ["profile"],
    }),
    allWorkers: builder.query({
      query: ({ page, searchTerm }) => ({
        url: `/admin/all-workers?page=${page}&search=${searchTerm}`,
        method: "GET",
      }),
      providesTags: ["profile"],
    }),
    allPendingWorkers: builder.query({
      query: ({ page, searchTerm }) => ({
        url: `/admin/all-pending-workers?page=${page}&search=${searchTerm}`,
        method: "GET",
      }),
      providesTags: ["profile"],
    }),
    updateMyProfile: builder.mutation({
      query: (body) => ({
        url: `/admin/update-profile`,
        method: `PUT`,
        body: body,
      }),
      invalidatesTags: ["profile"],
    }),
    blockUnblock: builder.mutation({
      query: (id) => ({
        url: `/admin/block-unblock/${id}`,
        method: `PATCH`,
      }),
      invalidatesTags: ["profile"],
    }),
    acceptReject: builder.mutation({
      query: (payload) => ({
        url: `/admin/accept-reject-application`,
        method: `PUT`,
        body: payload,
      }),
      invalidatesTags: ["profile"],
    }),
  }),
});

export const {
  useAdminLoginMutation,
  useForgotPasswordMutation,
  useVerifyOTPMutation,
  useAllUsersQuery,
  useResetPasswordMutation,
  useChangePasswordMutation,
  useGetMyProfileQuery,
  useUpdateMyProfileMutation,
  useAllPendingWorkersQuery,
  useWorkerDetailsQuery,
  useUserDetailsQuery,
  useBlockUnblockMutation,
  useAcceptRejectMutation,
  useAllWorkersQuery,
} = authApi;
