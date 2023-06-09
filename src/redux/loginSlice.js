import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    user: {},
    loginSuccess: false,
}
const loginSlice = createSlice({
    name: 'login',
    initialState,
    reducers: {
        loginStatus(state, action) {
            return { ...state, loginSuccess: action.payload }
        },
        setUser(state, action) {
            return { ...state, user: action.payload }
        },
    },
})

export const { loginStatus, setUser } = loginSlice.actions
export default loginSlice.reducer
