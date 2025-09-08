import { configureStore } from '@reduxjs/toolkit'
import { apiSlice } from './api/apiSlice'
import uiSlice from './slices/uiSlice'

export const store = configureStore({
  reducer: {
    api: apiSlice.reducer,
    ui: uiSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [apiSlice.util.resetApiState.type],
      },
    }).concat(apiSlice.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
