import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store/store";
import { JWTDecodeToken } from "@/lib/jwtDecode";

const baseUrl = "http://206.162.244.144:4008/api/v1";
// const baseUrl = "http://localhost:4008/api/v1";

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrl,
    prepareHeaders: (headers, { getState }) => {
      const state = getState() as RootState;
      // const token = state?.auth?.token;
      // console.log(token);

     const {token} = JWTDecodeToken()

      headers.set(
        "Authorization",
        `${token}`
      );

      return headers;
    },
  }),
  endpoints: () => ({}),
  tagTypes: [
    "profile",
    "report",
    "jobs",
    "expert",
    "report",
    "user",
    "withdraw",
    "admin",
    "content",
    "bookings",
    "review",
    "subscription",
  ],
});
