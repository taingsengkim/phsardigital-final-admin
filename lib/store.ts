import { configureStore } from '@reduxjs/toolkit'

import { categoriesApi } from "@/lib/features/categories/categoriesApi"
import { marketplaceApi } from "@/lib/features/marketplace/marketplaceApi"

export const makeStore = () => {
    return configureStore({
        reducer: {
            [categoriesApi.reducerPath]: categoriesApi.reducer,
            [marketplaceApi.reducerPath]: marketplaceApi.reducer,
        },
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware().concat(categoriesApi.middleware, marketplaceApi.middleware),
    })
}

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']