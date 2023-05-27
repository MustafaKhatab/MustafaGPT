import { apiSlice } from "../../app/api/apiSlice"

export const dallEApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDallEImage: builder.query({
      query: (prompt) => ({
        url: `/dalle/${prompt}`,
        method: 'GET',
      }),
    }),
  }),
});

export const {
  useGetDallEImageQuery,
} = dallEApiSlice;
