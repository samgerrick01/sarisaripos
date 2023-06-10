import { configureStore } from '@reduxjs/toolkit'
import loginSlice from './loginSlice'
import itemsSlice from './itemsSlice'
import loadingSlice from './loadingSlice'
import creditSlice from './creditSlice'
import listahanSlice from './listahanSlice'

const store = configureStore({
    reducer: {
        login: loginSlice,
        items: itemsSlice,
        loading: loadingSlice,
        credits: creditSlice,
        listahan: listahanSlice,
    },
})

export default store
