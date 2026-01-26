import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const PURCHASE_API =`${import.meta.env.VITE_API_URL}/api/v1/purchase`;
//const PURCHASE_API =`https://lms-deep-project.vercel.app/api/v1/purchase`;

export const purchaseApi = createApi({
  reducerPath: "purchaseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: PURCHASE_API,
    credentials: "include",
  }),
  tagTypes: ["Purchases"],

  endpoints: (builder) => ({
    // ================= CREATE CHECKOUT SESSION =================
    createCheckoutSession: builder.mutation({
      query: (courseId) => ({
        url: "checkout/create-checkout-session",
        method: "POST",
        body: { courseId },
      }),
    }),

    // ================= GET PURCHASED COURSES =================
    getPurchasedCourses: builder.query({
      query: () => ({
        url: "/",
        method: "GET",
      }),
      providesTags: ["Purchases"],
    }),

    // ================= GET COURSE DETAIL (With Purchase Status) =================
    getCourseDetailWithStatus: builder.query({
      query: (courseId) => ({
        url: `/course/${courseId}/detail-with-status`,
        method: "GET",
      }),
      providesTags: ["Purchases"],
    }),
  }),
});

export const {
  useCreateCheckoutSessionMutation,
  useGetPurchasedCoursesQuery,
  useGetCourseDetailWithStatusQuery,
} = purchaseApi;