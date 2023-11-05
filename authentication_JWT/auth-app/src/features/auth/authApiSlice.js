import { apiSlice } from "../../app/api/apiSlice";

export const authApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        login: builder.mutation({
            query: credentials => ({
                url: '/user/login',
                method: 'post',
                body: { ...credentials }
            })
        })
    })
})

export const {
    useLoginMutation
} = authApiSlice 