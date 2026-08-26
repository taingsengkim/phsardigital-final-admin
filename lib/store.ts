import { configureStore } from '@reduxjs/toolkit'

import { categoryApi } from "@/lib/redux/service/categoryApi"
import { marketplaceApi } from "@/lib/features/marketplace/marketplaceApi"
import { listingsApi } from "@/lib/features/listings/listingsApi"
import { buyerApi } from "@/lib/redux/service/buyerApi"
import { sellerApi } from "@/lib/redux/service/sellerApi"
import { sellerApplicationApi } from "@/lib/redux/service/sellerApplicationApi"
import { purchaseApi } from "@/lib/redux/service/purchaseApi"
import { dashboardApi } from "@/lib/redux/service/dashboardApi"
import { subscriptionApi } from "@/lib/redux/service/subscriptionApi"

export const makeStore = () => {
    return configureStore({
        reducer: {
            [categoryApi.reducerPath]: categoryApi.reducer,
            [marketplaceApi.reducerPath]: marketplaceApi.reducer,
            [listingsApi.reducerPath]: listingsApi.reducer,
            [buyerApi.reducerPath]: buyerApi.reducer,
            [sellerApi.reducerPath]: sellerApi.reducer,
            [sellerApplicationApi.reducerPath]: sellerApplicationApi.reducer,
            [purchaseApi.reducerPath]: purchaseApi.reducer,
            [dashboardApi.reducerPath]: dashboardApi.reducer,
            [subscriptionApi.reducerPath]: subscriptionApi.reducer,
        },
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware().concat(
                categoryApi.middleware,
                marketplaceApi.middleware,
                listingsApi.middleware,
                buyerApi.middleware,
                sellerApi.middleware,
                sellerApplicationApi.middleware,
                purchaseApi.middleware,
                dashboardApi.middleware,
                subscriptionApi.middleware,
            ),
    })
}

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
