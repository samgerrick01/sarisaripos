import React, { useState } from 'react'
import './navItem.scss'
import { FaBars, FaTimes } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { Logout } from '../../functions'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'

function index() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [click, setClick] = useState(false)

    const handleClick = () => {
        setClick(!click)
    }
    return (
        <>
            <nav className="navbar d-flex align-content-center bg-dark">
                <div className="nav-container">
                    <div className="nav-logo d-flex justify-content-between p-2">
                        <label onClick={() => navigate('/')}>
                            De Silva Store
                        </label>

                        {click ? (
                            <FaTimes className="faBars" onClick={handleClick} />
                        ) : (
                            <FaBars className="faBars" onClick={handleClick} />
                        )}
                    </div>

                    <ul
                        className={
                            click
                                ? 'nav-menu active m-0  bg-dark'
                                : 'nav-menu m-0'
                        }
                    >
                        <li className="nav-item">
                            <div
                                className="nav-links"
                                onClick={() => {
                                    handleClick()
                                    navigate('/')
                                }}
                            >
                                Home
                            </div>
                        </li>
                        <li className="nav-item">
                            <div
                                className="nav-links"
                                onClick={() => {
                                    handleClick()
                                    if (sessionStorage.getItem('user')) {
                                        navigate('/credit-list')
                                    } else {
                                        toast.error('You are not sign in!')
                                    }
                                }}
                            >
                                Credits
                            </div>
                        </li>
                        <li className="nav-item">
                            <div
                                className="nav-links"
                                onClick={() => {
                                    handleClick()
                                    if (sessionStorage.getItem('user')) {
                                        navigate('/listahan')
                                    } else {
                                        toast.error('You are not sign in!')
                                    }
                                }}
                            >
                                Listahan
                            </div>
                        </li>
                        <li className="nav-item">
                            <div
                                className="nav-links"
                                onClick={() => {
                                    handleClick()
                                    if (sessionStorage.getItem('user')) {
                                        Logout(dispatch, navigate)
                                    } else {
                                        toast.warning(
                                            'This feature is not yet available!',
                                        )
                                    }
                                }}
                            >
                                {sessionStorage.getItem('user')
                                    ? 'Log-Out'
                                    : 'Sign Up'}
                            </div>
                        </li>
                    </ul>
                </div>
            </nav>
        </>
    )
}

export default index
