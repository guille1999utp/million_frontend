// Redux hooks (nuevos - reemplazan los hooks legacy)
export {
  useOwners,
  useOwnerWithProperties,
  useProperties,
  usePropertyDetail,
  useStats,
  useOwnerMutations,
  usePropertyMutations,
  useUI,
} from './useRedux'

// Hooks legacy (mantener para compatibilidad temporal)
export { useFeaturedProperties } from './useFeaturedProperties';
export { useDebounce } from './useDebounce';
