import { apiSlice } from './apiSlice'

export const imagesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // 1. Upload image (used in CreateChallengeModal)
    uploadImage: builder.mutation<{ imageUrl: string }, FormData>({
      query: (formData) => ({
        url: '/images/upload',
        method: 'POST',
        body: formData,
      }),
    }),
  }),
})

export const {
  useUploadImageMutation,
} = imagesApi 