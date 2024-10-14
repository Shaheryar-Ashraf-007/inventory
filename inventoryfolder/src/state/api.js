import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Create the API slice
export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:8000"}),
  reducerPath: "api",
  tagTypes: ["DashboardMetrics", "Products", "Users", "Salaries", "Expenses", "Purchases"],
  endpoints: (build) => ({
    // Get dashboard metrics
    getDashboardMetrics: build.query({
      query: () => "/dashboard",
      method: "GET",
      providesTags: ["DashboardMetrics"],
    }),

    // Get products with optional search
    getProducts: build.query({
      query: (search) => ({
        url: "/products",
        method: "GET",
        params: search ? { search } : {},
      }),
      providesTags: ["Products"],
    }),

    // Create new product
    createProducts: build.mutation({
      query: (newProduct) => ({
        url: "/products",
        method: "POST",
        body: newProduct,
      }),
      invalidatesTags: ["Products"],
    }),

    // Delete a product using its ID
    deleteProduct: build.mutation({
      query: (productId) => ({
        url: `/products/${productId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Products"],
    }),

    // Get list of users
    getUsers: build.query({
      query: (search) => ({
        url: "/users",
        method: "GET",
        params: search ? { search } : {},
      }),
      providesTags: ["Users"],
    }),

    // Create a new user
    createUsers: build.mutation({
      query: (newUser) => ({
        url: "/users",
        method: "POST",
        body: newUser,
      }),
      invalidatesTags: ["Users"],
    }),
    deleteUsers: build.mutation({
      query: (userId) => ({
        url: `/users/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Users"],
    }),


    // Get salaries with optional search
    getSalaries: build.query({
      query: (search) => ({
        url: "/salaries",
        method: "GET",
        params: search ? { search } : {},
      }),
      providesTags: ["Salaries"],
    }),

    // Create a new salary entry
    createSalaries: build.mutation({
      query: (newSalary) => ({
        url: "/salaries",
        method: "POST",
        body: newSalary,
      }),
      invalidatesTags: ["Salaries"],
    }),

    deleteSalaries: build.mutation({
      query: (userId) => ({
        url: `/salaries/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Salaries"],
    }),

    // Get expenses by category
    getExpensesByCategory: build.query({
      query: (search) => ({
        url: "/expenses",
        method: "GET",
        params: search ? { search } : {},
      }),
      providesTags: ["Expenses"],
    }),

    // Create a new expense
    createExpense: build.mutation({
      query: (newExpense) => ({
        url: "/expenses",
        method: "POST",
        body: newExpense,
      }),
      invalidatesTags: ["Expenses"],
    }),

    // Delete an expense using its ID
    deleteExpense: build.mutation({
      query: (expenseId) => ({
        url: `/expenses/${expenseId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Expenses"],
    }),

    // Get purchases with optional search
  }),
});

// Export hooks for all the endpoints
export const {
  useGetDashboardMetricsQuery,
  useGetProductsQuery,
  useCreateProductsMutation,
  useDeleteProductMutation,
  useGetUsersQuery,
  useCreateUsersMutation,
  useDeleteUsersMutation,
  useGetSalariesQuery,
  useCreateSalariesMutation,
  useDeleteSalariesMutation,
  useGetExpensesByCategoryQuery,
  useCreateExpenseMutation,
  useDeleteExpenseMutation,
} = api;