import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router'
import '../styles/addItems.scss'
import '../styles/deleteModal.scss'
import axios from 'axios'
import { baseUrl } from '../../api'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { setSelectedItem } from '../../redux/listahanSlice'
import { loadingOff, loadingOn } from '../../redux/loadingSlice'
import { BsDatabaseAdd } from 'react-icons/bs'
import { RiArrowGoBackFill } from 'react-icons/ri'
import { Logout } from '../../functions'
//bootstrap
import { Row, Col, Button, FormControl, Card } from 'react-bootstrap'

const UpdateLista = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    let { id } = useParams()

    const { selectedItem } = useSelector((state) => state.listahan)

    const [formData, setFormData] = useState({
        item: '',
        qty: '',
    })

    const updateItem = (e) => {
        if (!formData.item || !formData.qty) {
            toast.warning('Please Fill the Field!')
        } else {
            dispatch(loadingOn())
            axios
                .put(`${baseUrl}/updateToListahan/${id}`, formData)
                .then((res) => {
                    toast.success(res.data)
                    navigate('/listahan')
                    dispatch(loadingOff())
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
        if (Object.keys(selectedItem).length !== 0) {
            setFormData({
                ...formData,
                item:
                    Object.keys(selectedItem).length !== 0
                        ? selectedItem.item
                        : '',
                qty:
                    Object.keys(selectedItem).length !== 0
                        ? selectedItem.qty
                        : '',
            })
        }
    }, [selectedItem])

    useEffect(() => {
        if (!sessionStorage.getItem('user')) {
            Logout(dispatch, navigate)
        } else {
            axios
                .post(`${baseUrl}/selected-lista`, { id })
                .then((res) => dispatch(setSelectedItem(res.data)))
                .catch((err) => console.log(err))
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
                        <BsDatabaseAdd color="black" /> Update Items
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
                        <Col sm className="mb-1">
                            <Button
                                onClick={updateItem}
                                variant="success"
                                className="w-100"
                            >
                                <BsDatabaseAdd color="black" /> Update
                            </Button>
                        </Col>
                        <Col sm className="mb-1">
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

export default UpdateLista
