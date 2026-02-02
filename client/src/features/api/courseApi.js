import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const COURSE_API = `https://lms-r2sm.onrender.com/api/v1/course`;

export const courseApi = createApi({
  reducerPath: "courseApi",

  baseQuery: fetchBaseQuery({
    baseUrl: COURSE_API,
    credentials: "include", // kept as-is
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token"); // ✅ ADD
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),

  tagTypes: [
    "CreatorCourse",
    "Course",
    "Lecture",
    "PublishedCourse",
  ],

  endpoints: (builder) => ({

    /* ================= CREATE COURSE ================= */
    createCourse: builder.mutation({
      query: ({ courseTitle, category }) => ({
        url: "/",
        method: "POST",
        body: { courseTitle, category },
      }),
      invalidatesTags: ["CreatorCourse"],
    }),

    /* ================= SEARCH COURSE ================= */
    getSearchCourse: builder.query({
      query: ({ searchQuery, categories, sortByPrice }) => {
        const params = new URLSearchParams();
        if (searchQuery) params.append("query", searchQuery);
        if (categories?.length) params.append("categories", categories.join(","));
        if (sortByPrice) params.append("sortByPrice", sortByPrice);
        return `/search?${params.toString()}`;
      },
    }),

    /* ================= PUBLISHED COURSES ================= */
    getPublishedCourse: builder.query({
      query: () => "/published-courses",
      providesTags: ["PublishedCourse"],
    }),

    /* ================= CREATOR COURSES ================= */
    getCreatorCourse: builder.query({
      query: () => "/",
      providesTags: ["CreatorCourse"],
    }),

    /* ================= COURSE BY ID ================= */
    getCourseById: builder.query({
      query: (courseId) => `/${courseId}`,
      providesTags: (r, e, courseId) => [
        { type: "Course", id: courseId },
      ],
    }),

    /* ================= EDIT COURSE ================= */
    editCourse: builder.mutation({
      query: ({ courseId, formData }) => ({
        url: `/${courseId}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: (r, e, { courseId }) => [
        "CreatorCourse",
        "PublishedCourse",
        { type: "Course", id: courseId },
      ],
    }),

    /* ================= CREATE LECTURE ================= */
    createLecture: builder.mutation({
      query: ({ courseId, lectureTitle }) => ({
        url: `/${courseId}/lecture`,
        method: "POST",
        body: { lectureTitle },
      }),
      invalidatesTags: (r, e, { courseId }) => [
        { type: "Lecture", id: courseId },
        { type: "Course", id: courseId },
      ],
    }),

    /* ================= GET LECTURES ================= */
    getCourseLecture: builder.query({
      query: (courseId) => `/${courseId}/lecture`,
      providesTags: (r, e, courseId) => [
        { type: "Lecture", id: courseId },
      ],
    }),

    /* ================= EDIT LECTURE ================= */
    editLecture: builder.mutation({
      query: ({ courseId, lectureId, formData }) => ({
        url: `/${courseId}/lecture/${lectureId}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: (r, e, { courseId, lectureId }) => [
        { type: "Lecture", id: courseId },
        { type: "Course", id: courseId },
        { type: "Lecture", id: lectureId },
      ],
    }),

    /* ================= DELETE LECTURE ================= */
    removeLecture: builder.mutation({
      query: (lectureId) => ({
        url: `/lecture/${lectureId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Lecture"],
    }),

    /* ================= LECTURE BY ID ================= */
    getLectureById: builder.query({
      query: (lectureId) => `/lecture/${lectureId}`,
      providesTags: (r, e, lectureId) => [
        { type: "Lecture", id: lectureId },
      ],
    }),

    /* ================= PUBLISH / UNPUBLISH ================= */
    publishCourse: builder.mutation({
      query: ({ courseId, publish }) => ({
        url: `/${courseId}?publish=${publish}`,
        method: "PATCH",
      }),
      invalidatesTags: (r, e, { courseId }) => [
        "CreatorCourse",
        "PublishedCourse",
        { type: "Course", id: courseId },
      ],
    }),
  }),
});

export const {
  useCreateCourseMutation,
  useGetSearchCourseQuery,
  useGetPublishedCourseQuery,
  useGetCreatorCourseQuery,
  useGetCourseByIdQuery,
  useEditCourseMutation,
  useCreateLectureMutation,
  useGetCourseLectureQuery,
  useEditLectureMutation,
  useRemoveLectureMutation,
  useGetLectureByIdQuery,
  usePublishCourseMutation,
} = courseApi;