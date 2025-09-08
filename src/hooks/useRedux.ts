import { useAppSelector, useAppDispatch } from '@/store/hooks'
import { Owner, Property } from '@/interfaces'
import { 
  useGetOwnersQuery,
  useGetOwnerByIdQuery,
  useGetPropertiesQuery,
  useGetPropertyByIdQuery,
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
export const useProperties = (filters?: { Name?: string; MinPrice?: number; MaxPrice?: number }) => {
  const { data, isLoading: loading, error } = useGetPropertiesQuery({
    search: filters?.Name || undefined,
    filters: {
      minPrice: filters?.MinPrice,
      maxPrice: filters?.MaxPrice,
      year: undefined,
      ownerId: undefined,
    },
  })
  
  const properties = data || []
  const totalCount = properties.length
  
  return { 
    properties, 
    loading, 
    error: error ? (error as { message?: string })?.message || 'Error al cargar propiedades' : null,
    totalCount,
    refetch: () => {} // Placeholder para compatibilidad
  }
}

// Reemplaza usePropertiesWithDebounce
export const usePropertiesWithDebounce = (searchTerm: string) => {
  const propertyFilters = useAppSelector(state => state.ui.propertyFilters)
  
  const { data: properties = [], isLoading: loading, error } = useGetPropertiesQuery({
    search: searchTerm || undefined,
    filters: {
      minPrice: propertyFilters.minPrice ?? undefined,
      maxPrice: propertyFilters.maxPrice ?? undefined,
      year: propertyFilters.year ?? undefined,
      ownerId: propertyFilters.ownerId ?? undefined,
    },
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
    setPropertyFilters: (filters: { minPrice?: number; maxPrice?: number; year?: number; ownerId?: string }) => dispatch(setPropertyFilters(filters)),
    clearPropertyFilters: () => dispatch(clearPropertyFilters()),
    
    // Modal actions
    openEditOwnerModal: (owner: Owner) => dispatch(openEditOwnerModal(owner)),
    closeEditOwnerModal: () => dispatch(closeEditOwnerModal()),
    openDeleteOwnerModal: (owner: Owner) => dispatch(openDeleteOwnerModal(owner)),
    closeDeleteOwnerModal: () => dispatch(closeDeleteOwnerModal()),
    openEditPropertyModal: (property: Property) => dispatch(openEditPropertyModal(property)),
    closeEditPropertyModal: () => dispatch(closeEditPropertyModal()),
    openDeletePropertyModal: (property: Property) => dispatch(openDeletePropertyModal(property)),
    closeDeletePropertyModal: () => dispatch(closeDeletePropertyModal()),
    
    // Loading actions
    setGlobalLoading: (loading: boolean, message?: string) => 
      dispatch(setGlobalLoading({ loading, message })),
  }
}
