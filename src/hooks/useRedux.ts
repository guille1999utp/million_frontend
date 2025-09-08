import { useAppSelector, useAppDispatch } from '@/store/hooks'
import { 
  useGetOwnersQuery,
  useGetOwnerByIdQuery,
  useGetPropertiesQuery,
  useGetPropertyByIdQuery,
  useGetStatsQuery,
  useCreateOwnerMutation,
  useUpdateOwnerMutation,
  useDeleteOwnerMutation,
  useCreatePropertyMutation,
  useUpdatePropertyMutation,
  useDeletePropertyMutation,
  useUploadOwnerPhotoMutation,
  useUploadPropertyImageMutation,
  useCreatePropertyTraceMutation,
} from '@/store/api/apiSlice'
import {
  setSearchTerm,
  setPropertyFilters,
  clearPropertyFilters,
  openEditOwnerModal,
  closeEditOwnerModal,
  openDeleteOwnerModal,
  closeDeleteOwnerModal,
  openEditPropertyModal,
  closeEditPropertyModal,
  openDeletePropertyModal,
  closeDeletePropertyModal,
  setGlobalLoading,
} from '@/store/slices/uiSlice'

// Reemplaza useOwners
export const useOwners = () => {
  const { data: owners = [], isLoading: loading, error, refetch } = useGetOwnersQuery()
  return { owners, loading, error, refetch }
}

// Reemplaza useOwnerWithProperties
export const useOwnerWithProperties = (ownerId: string) => {
  const { data: owner, isLoading: loading, error, refetch } = useGetOwnerByIdQuery(ownerId)
  return { owner, loading, error, refetch }
}

// Reemplaza useProperties
export const useProperties = (filters?: any) => {
  const { data, isLoading: loading, error } = useGetPropertiesQuery({
    search: filters?.Name || undefined,
    filters: {
      minPrice: filters?.MinPrice,
      maxPrice: filters?.MaxPrice,
      year: null,
      ownerId: null,
    },
  })
  
  const properties = data || []
  const totalCount = properties.length
  
  return { 
    properties, 
    loading, 
    error: error ? (error as any)?.message || 'Error al cargar propiedades' : null,
    totalCount,
    refetch: () => {} // Placeholder para compatibilidad
  }
}

// Reemplaza usePropertiesWithDebounce
export const usePropertiesWithDebounce = (searchTerm: string, debounceMs: number = 500) => {
  const propertyFilters = useAppSelector(state => state.ui.propertyFilters)
  
  const { data: properties = [], isLoading: loading, error } = useGetPropertiesQuery({
    search: searchTerm || undefined,
    filters: propertyFilters,
  })
  
  return { properties, loading, error }
}

// Reemplaza usePropertyDetail
export const usePropertyDetail = (propertyId: string) => {
  const { data: property, isLoading: loading, error } = useGetPropertyByIdQuery(propertyId)
  return { property, loading, error }
}

// Reemplaza useStats
export const useStats = () => {
  const { data: owners = [], isLoading: ownersLoading } = useGetOwnersQuery()
  const { data: properties = [], isLoading: propertiesLoading } = useGetPropertiesQuery({})
  
  const loading = ownersLoading || propertiesLoading
  
  return {
    totalProperties: properties.length,
    totalOwners: owners.length,
    loading,
    error: null
  }
}

// Hooks para mutaciones
export const useOwnerMutations = () => {
  const [createOwner] = useCreateOwnerMutation()
  const [updateOwner] = useUpdateOwnerMutation()
  const [deleteOwner] = useDeleteOwnerMutation()
  const [uploadOwnerPhoto] = useUploadOwnerPhotoMutation()
  
  return {
    createOwner,
    updateOwner,
    deleteOwner,
    uploadOwnerPhoto,
  }
}

export const usePropertyMutations = () => {
  const [createProperty] = useCreatePropertyMutation()
  const [updateProperty] = useUpdatePropertyMutation()
  const [deleteProperty] = useDeletePropertyMutation()
  const [uploadPropertyImage] = useUploadPropertyImageMutation()
  const [createPropertyTrace] = useCreatePropertyTraceMutation()
  
  return {
    createProperty,
    updateProperty,
    deleteProperty,
    uploadPropertyImage,
    createPropertyTrace,
  }
}

// Hooks para UI state
export const useUI = () => {
  const dispatch = useAppDispatch()
  const uiState = useAppSelector(state => state.ui)
  
  return {
    ...uiState,
    // Search actions
    setSearchTerm: (term: string) => dispatch(setSearchTerm(term)),
    
    // Filter actions
    setPropertyFilters: (filters: any) => dispatch(setPropertyFilters(filters)),
    clearPropertyFilters: () => dispatch(clearPropertyFilters()),
    
    // Modal actions
    openEditOwnerModal: (owner: any) => dispatch(openEditOwnerModal(owner)),
    closeEditOwnerModal: () => dispatch(closeEditOwnerModal()),
    openDeleteOwnerModal: (owner: any) => dispatch(openDeleteOwnerModal(owner)),
    closeDeleteOwnerModal: () => dispatch(closeDeleteOwnerModal()),
    openEditPropertyModal: (property: any) => dispatch(openEditPropertyModal(property)),
    closeEditPropertyModal: () => dispatch(closeEditPropertyModal()),
    openDeletePropertyModal: (property: any) => dispatch(openDeletePropertyModal(property)),
    closeDeletePropertyModal: () => dispatch(closeDeletePropertyModal()),
    
    // Loading actions
    setGlobalLoading: (loading: boolean, message?: string) => 
      dispatch(setGlobalLoading({ loading, message })),
  }
}
