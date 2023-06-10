import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    listahan: [],
    selectedItem: {},
}
const listahanSlice = createSlice({
    name: 'listahan',
    initialState,
    reducers: {
        getListahan(state, action) {
            function sortByStatus(a, b) {
                if (a.status === b.status) {
                    return 0
                }
                if (a.status) {
                    return 1 // a is true, b is false
                }
                return -1 // a is false, b is true
            }

            return {
                ...state,
                listahan: action.payload.sort(sortByStatus),
            }
        },
        setSelectedItem(state, action) {
            return { ...state, selectedItem: action.payload }
        },
    },
})

export const { getListahan, setSelectedItem } = listahanSlice.actions
export default listahanSlice.reducer
