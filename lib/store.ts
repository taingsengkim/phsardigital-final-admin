import { configureStore } from '@reduxjs/toolkit'

import { categoryApi } from "@/lib/redux/service/categoryApi"
import { marketplaceApi } from "@/lib/features/marketplace/marketplaceApi"
import { buyerApi } from "@/lib/redux/service/buyerApi"
import { sellerApi } from "@/lib/redux/service/sellerApi"
import { sellerApplicationApi } from "@/lib/redux/service/sellerApplicationApi"

export const makeStore = () => {
    return configureStore({
        reducer: {
            [categoryApi.reducerPath]: categoryApi.reducer,
            [marketplaceApi.reducerPath]: marketplaceApi.reducer,
            [buyerApi.reducerPath]: buyerApi.reducer,
            [sellerApi.reducerPath]: sellerApi.reducer,
            [sellerApplicationApi.reducerPath]: sellerApplicationApi.reducer,
        },
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware().concat(
                categoryApi.middleware,
                marketplaceApi.middleware,
                buyerApi.middleware,
                sellerApi.middleware,
                sellerApplicationApi.middleware,
            ),
    })
}

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
