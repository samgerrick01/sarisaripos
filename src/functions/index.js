import { loadingOff, loadingOn } from '../redux/loadingSlice'
import { setUser } from '../redux/loginSlice'

export const Logout = async (dispatch, navigate) => {
    dispatch(loadingOn())
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
    await delay(500)
    dispatch(loadingOff())
    dispatch(setUser({}))
    sessionStorage.removeItem('user')
    navigate('/')
}

export const getClassName = (value) => {
    if (value <= 100) {
        return { color: 'black' }
    } else if (value >= 101 && value <= 250) {
        return { color: 'yellow' }
    } else {
        return { color: 'red' }
    }
}

export const formatToCurrency = (number) => {
    const formatter = new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP',
    })

    return formatter.format(number)
}

export const checkIfDone = (value) => {
    if (value === true || value === 1) {
        return { textDecoration: 'line-through', color: 'green' }
    } else {
        return { color: 'red' }
    }
}
