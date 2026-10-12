import { baseApi } from "./baseApi";

export const bookingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    allbookings: builder.query({
      query: (page) => ({
        url: `/admin/all-bookings?page=${page}`,
        method: "GET",
      }),
      providesTags: ["bookings"],
    }),
  }),
});

export const { useAllbookingsQuery } = bookingApi;
