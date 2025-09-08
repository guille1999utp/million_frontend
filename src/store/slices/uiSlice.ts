import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Owner, Property } from '@/interfaces'

interface UIState {
  // Loading states
  isGlobalLoading: boolean
  loadingMessage: string
  
  // Modal states
  isEditOwnerModalOpen: boolean
  isDeleteOwnerModalOpen: boolean
  isEditPropertyModalOpen: boolean
  isDeletePropertyModalOpen: boolean
  
  // Selected items for modals
  selectedOwner: Owner | null
  selectedProperty: Property | null
  
  // Search and filters
  searchTerm: string
  propertyFilters: {
    minPrice: number | null
    maxPrice: number | null
    year: number | null
    ownerId: string | null
  }
  
  // Pagination
  currentPage: number
  itemsPerPage: number
  
  // Theme and preferences
  theme: 'light' | 'dark'
  sidebarCollapsed: boolean
}

const initialState: UIState = {
  isGlobalLoading: false,
  loadingMessage: '',
  
  isEditOwnerModalOpen: false,
  isDeleteOwnerModalOpen: false,
  isEditPropertyModalOpen: false,
  isDeletePropertyModalOpen: false,
  
  selectedOwner: null,
  selectedProperty: null,
  
  searchTerm: '',
  propertyFilters: {
    minPrice: null,
    maxPrice: null,
    year: null,
    ownerId: null,
  },
  
  currentPage: 1,
  itemsPerPage: 10,
  
  theme: 'dark',
  sidebarCollapsed: false,
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // Loading actions
    setGlobalLoading: (state, action: PayloadAction<{ loading: boolean; message?: string }>) => {
      state.isGlobalLoading = action.payload.loading
      state.loadingMessage = action.payload.message || ''
    },
    
    // Modal actions
    openEditOwnerModal: (state, action: PayloadAction<Owner>) => {
      state.isEditOwnerModalOpen = true
      state.selectedOwner = action.payload
    },
    closeEditOwnerModal: (state) => {
      state.isEditOwnerModalOpen = false
      state.selectedOwner = null
    },
    
    openDeleteOwnerModal: (state, action: PayloadAction<Owner>) => {
      state.isDeleteOwnerModalOpen = true
      state.selectedOwner = action.payload
    },
    closeDeleteOwnerModal: (state) => {
      state.isDeleteOwnerModalOpen = false
      state.selectedOwner = null
    },
    
    openEditPropertyModal: (state, action: PayloadAction<Property>) => {
      state.isEditPropertyModalOpen = true
      state.selectedProperty = action.payload
    },
    closeEditPropertyModal: (state) => {
      state.isEditPropertyModalOpen = false
      state.selectedProperty = null
    },
    
    openDeletePropertyModal: (state, action: PayloadAction<Property>) => {
      state.isDeletePropertyModalOpen = true
      state.selectedProperty = action.payload
    },
    closeDeletePropertyModal: (state) => {
      state.isDeletePropertyModalOpen = false
      state.selectedProperty = null
    },
    
    // Search and filter actions
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload
    },
    
    setPropertyFilters: (state, action: PayloadAction<Partial<UIState['propertyFilters']>>) => {
      state.propertyFilters = { ...state.propertyFilters, ...action.payload }
    },
    
    clearPropertyFilters: (state) => {
      state.propertyFilters = {
        minPrice: null,
        maxPrice: null,
        year: null,
        ownerId: null,
      }
    },
    
    // Pagination actions
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload
    },
    
    setItemsPerPage: (state, action: PayloadAction<number>) => {
      state.itemsPerPage = action.payload
    },
    
    // Theme actions
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload
    },
    
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed
    },
  },
})

export const {
  setGlobalLoading,
  openEditOwnerModal,
  closeEditOwnerModal,
  openDeleteOwnerModal,
  closeDeleteOwnerModal,
  openEditPropertyModal,
  closeEditPropertyModal,
  openDeletePropertyModal,
  closeDeletePropertyModal,
  setSearchTerm,
  setPropertyFilters,
  clearPropertyFilters,
  setCurrentPage,
  setItemsPerPage,
  setTheme,
  toggleSidebar,
} = uiSlice.actions

export default uiSlice.reducer
