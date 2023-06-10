import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router'
import '../styles/addItems.scss'
import axios from 'axios'
import { baseUrl } from '../../api'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { loadingOff, loadingOn } from '../../redux/loadingSlice'
import { BsDatabaseAdd } from 'react-icons/bs'
import { GrPowerReset } from 'react-icons/gr'
import { RiArrowGoBackFill } from 'react-icons/ri'
import { Logout } from '../../functions'

//bootstrap
import { Row, Col, Button, FormControl, Card } from 'react-bootstrap'

const AddLista = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        item: '',
        qty: '',
        status: 0,
    })

    const addItems = (e) => {
        if (!formData.item || !formData.qty) {
            toast.warning('Please Fill the Field!')
        } else {
            dispatch(loadingOn())
            axios
                .post(`${baseUrl}/addToListahan`, formData)
                .then((res) => {
                    toast.success(res.data)
                    dispatch(loadingOff())
                    setFormData({
                        item: '',
                        qty: '',
                    })
                })
                .catch((err) => {
                    toast.error('Server Error!')
                    dispatch(loadingOff())
                })
        }
    }

    const onBack = () => {
        navigate('/listahan')
    }

    useEffect(() => {
        if (!sessionStorage.getItem('user')) {
            Logout(dispatch, navigate)
        }
    }, [])
    return (
        <div className="add-items">
            <Card
                style={{
                    padding: '12px',
                    background: 'lightblue',
                    margin: '12px',
                    width: '100%',
                }}
            >
                <Card.Body>
                    <Card.Title>
                        <BsDatabaseAdd color="black" /> Add Item
                    </Card.Title>

                    <Row>
                        <Col sm className="mb-3">
                            <FormControl
                                autoComplete="off"
                                placeholder="Name of the item"
                                value={formData.item}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        item: e.target.value,
                                    })
                                }
                            />
                        </Col>
                        <Col sm className="mb-3">
                            <FormControl
                                autoComplete="off"
                                placeholder="Quantity"
                                value={formData.qty}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        qty: e.target.value,
                                    })
                                }
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col sm className="mb-3">
                            <Button
                                onClick={addItems}
                                variant="success"
                                className="w-100"
                            >
                                <BsDatabaseAdd color="black" />
                                &nbsp;Mag Add
                            </Button>
                        </Col>

                        <Col sm className="mb-3">
                            <Button
                                onClick={onBack}
                                variant="primary"
                                className="w-100"
                            >
                                <RiArrowGoBackFill color="black" /> Back
                            </Button>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
            <ToastContainer position="top-center" />
        </div>
    )
}

export default AddLista
