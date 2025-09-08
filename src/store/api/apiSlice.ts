import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { Owner, Property } from '@/interfaces'
import { PropertyWithDetailsDto, PropertyTraceDto, PropertyImageDto } from '@/services/types'

// Base query with error handling
const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
  prepareHeaders: (headers) => {
    // Add auth headers if needed
    const token = localStorage.getItem('token')
    if (token) {
      headers.set('authorization', `Bearer ${token}`)
    }
    return headers
  },
})


export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: baseQuery,
  tagTypes: ['Owner', 'Property', 'PropertyTrace', 'PropertyImage', 'Stats'],
  endpoints: (builder) => ({
    // Owners endpoints
    getOwners: builder.query<Owner[], void>({
      query: () => '/Owner',
      providesTags: ['Owner'],
    }),
    
    getOwnerById: builder.query<PropertyWithDetailsDto, string>({
      query: (id) => `/Owner/${id}/with-properties`,
      providesTags: (result, error, id) => [{ type: 'Owner', id }],
    }),
    
    createOwner: builder.mutation<Owner, Partial<Owner>>({
      query: (owner) => ({
        url: '/Owner',
        method: 'POST',
        body: owner,
      }),
      invalidatesTags: ['Owner', 'Stats'],
    }),
    
    updateOwner: builder.mutation<Owner, { id: string; data: Partial<Owner> }>({
      query: ({ id, data }) => ({
        url: `/Owner/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Owner', id }, 'Owner'],
    }),
    
    deleteOwner: builder.mutation<void, string>({
      query: (id) => ({
        url: `/Owner/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Owner', 'Stats'],
    }),
    
    uploadOwnerPhoto: builder.mutation<{ success: boolean }, { ownerId: string; file: File }>({
      query: ({ ownerId, file }) => {
        const formData = new FormData()
        formData.append('file', file)
        return {
          url: `/Owner/${ownerId}/upload-photo`,
          method: 'POST',
          body: formData,
        }
      },
      invalidatesTags: (result, error, { ownerId }) => [{ type: 'Owner', id: ownerId }],
    }),
    
    // Properties endpoints
    getProperties: builder.query<Property[], { search?: string; filters?: { minPrice?: number; maxPrice?: number; year?: number; ownerId?: string } }>({
      query: ({ search, filters }) => {
        const params = new URLSearchParams()
        if (search) params.append('Name', search)
        if (filters?.minPrice) params.append('MinPrice', filters.minPrice.toString())
        if (filters?.maxPrice) params.append('MaxPrice', filters.maxPrice.toString())
        if (filters?.year) params.append('year', filters.year.toString())
        if (filters?.ownerId) params.append('ownerId', filters.ownerId)
        
        return `/Property?${params.toString()}`
      },
      providesTags: ['Property'],
    }),
    
    getPropertyById: builder.query<PropertyWithDetailsDto, string>({
      query: (id) => `/Property/${id}`,
      providesTags: (result, error, id) => [{ type: 'Property', id }],
    }),
    
    createProperty: builder.mutation<Property, Partial<Property>>({
      query: (property) => ({
        url: '/Property',
        method: 'POST',
        body: property,
      }),
      invalidatesTags: ['Property', 'Stats', 'Owner'],
    }),
    
    updateProperty: builder.mutation<Property, { id: string; data: Partial<Property> }>({
      query: ({ id, data }) => ({
        url: `/Property/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Property', id }, 'Property', 'Owner'],
    }),
    
    deleteProperty: builder.mutation<void, string>({
      query: (id) => ({
        url: `/Property/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Property', 'Stats', 'Owner'],
    }),
    
    // Property Images endpoints
    uploadPropertyImage: builder.mutation<PropertyImageDto, { propertyId: string; file: File; isPrimary?: boolean }>({
      query: ({ propertyId, file, isPrimary = false }) => {
        const formData = new FormData()
        formData.append('propertyId', propertyId)
        formData.append('enabled', isPrimary.toString())
        formData.append('file', file)
        return {
          url: '/PropertyImage/upload',
          method: 'POST',
          body: formData,
        }
      },
      invalidatesTags: (result, error, { propertyId }) => [
        { type: 'Property', id: propertyId },
        'PropertyImage',
        'Owner'
      ],
    }),
    
    deletePropertyImage: builder.mutation<void, { propertyId: string; imageId: string }>({
      query: ({ propertyId, imageId }) => ({
        url: `/PropertyImage/${imageId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { propertyId }) => [
        { type: 'Property', id: propertyId },
        'PropertyImage',
        'Owner'
      ],
    }),
    
    // Property Traces endpoints
    createPropertyTrace: builder.mutation<PropertyTraceDto, Partial<PropertyTraceDto>>({
      query: (trace) => ({
        url: '/PropertyTrace',
        method: 'POST',
        body: trace,
      }),
      invalidatesTags: (result, error, trace) => [
        { type: 'Property', id: trace.idProperty },
        'PropertyTrace',
        'Owner'
      ],
    }),
    
    updatePropertyTrace: builder.mutation<PropertyTraceDto, { id: string; data: Partial<PropertyTraceDto> }>({
      query: ({ id, data }) => ({
        url: `/PropertyTrace/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'PropertyTrace', id },
        'PropertyTrace',
        'Owner'
      ],
    }),
    
    deletePropertyTrace: builder.mutation<void, string>({
      query: (id) => ({
        url: `/PropertyTrace/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['PropertyTrace', 'Owner'],
    }),
    
    // Stats endpoint - se calcula en el hook useStats
    getStats: builder.query<{ totalProperties: number; totalOwners: number }, void>({
      query: () => '/stats-placeholder', // Placeholder, se calcula en el hook
      providesTags: ['Stats'],
    }),
  }),
})

// Export hooks for usage in functional components
export const {
  // Owners
  useGetOwnersQuery,
  useGetOwnerByIdQuery,
  useCreateOwnerMutation,
  useUpdateOwnerMutation,
  useDeleteOwnerMutation,
  useUploadOwnerPhotoMutation,
  
  // Properties
  useGetPropertiesQuery,
  useGetPropertyByIdQuery,
  useCreatePropertyMutation,
  useUpdatePropertyMutation,
  useDeletePropertyMutation,
  
  // Property Images
  useUploadPropertyImageMutation,
  useDeletePropertyImageMutation,
  
  // Property Traces
  useCreatePropertyTraceMutation,
  useUpdatePropertyTraceMutation,
  useDeletePropertyTraceMutation,
  
  // Stats
  useGetStatsQuery,
} = apiSlice
