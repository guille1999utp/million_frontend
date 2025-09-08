// Redux hooks (nuevos - reemplazan los hooks legacy)
export {
  useOwners,
  useOwnerWithProperties,
  useProperties,
  usePropertiesWithDebounce,
  usePropertyDetail,
  useStats,
  useOwnerMutations,
  usePropertyMutations,
  useUI,
} from './useRedux'

// Hooks legacy (mantener para compatibilidad temporal)
export { useApi, useApiRequest } from './useApi';
export { useFeaturedProperties } from './useFeaturedProperties';
export { useDebounce } from './useDebounce';
