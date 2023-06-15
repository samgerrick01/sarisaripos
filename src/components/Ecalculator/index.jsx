import React, { useState, useEffect } from 'react'
import '../styles/addItems.scss'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify'
import { nanoid } from '@reduxjs/toolkit'

import { BsDatabaseAdd } from 'react-icons/bs'
import { Select, Modal } from 'antd'
//bootstrap
import { Row, Col, Button, FormControl, Card, Table } from 'react-bootstrap'
import { Logout, formatToCurrency } from '../../functions'
import { getItems } from '../../redux/itemsSlice'
import { baseUrl } from '../../api'

let item = []
let total = 0

function index() {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const { items } = useSelector((state) => state.items)

    const [formData, setFormData] = useState({
        id: nanoid(),
        item: '',
        price: '',
        qty: '',
        total: '',
    })
    const [itemToRemove, setItemToRemove] = useState(null)
    const [openModal, setOpenModal] = useState(false)
    const [change, setChange] = useState(0)
    const [cash, setCash] = useState('')

    const addItem = () => {
        if (!formData.item || !formData.qty) {
            toast.warning('Please Fill the Field!')
        } else {
            item.push(formData)
            total = parseFloat(total) + parseFloat(formData.total)
            onClear()
        }
    }

    const onClear = () => {
        setFormData({
            id: nanoid(),
            item: '',
            price: '',
            qty: '',
            total: '',
        })
    }

    const removeItem = () => {
        let idx = item.findIndex((data) => data.id === itemToRemove.id)
        item.splice(idx, 1)
        total = total - itemToRemove.total
        setOpenModal(false)
    }

    useEffect(() => {
        setChange(cash - total)
    }, [cash])

    useEffect(() => {
        setFormData({
            ...formData,
            total: parseFloat(formData.price) * parseFloat(formData.qty) || '',
        })
    }, [formData.qty])

    useEffect(() => {
        if (!sessionStorage.getItem('user')) {
            Logout(dispatch, navigate)
        } else {
            if (!items.length) {
                axios
                    .get(`${baseUrl}/items`)
                    .then((res) => dispatch(getItems(res.data)))
                    .catch((err) => console.log(err))
            }
        }
    }, [])

    return (
        <div className="add-items pt-0">
            <Card
                style={{
                    padding: '12px',
                    background: 'lightblue',
                    margin: '12px',
                    width: '100%',
                }}
            >
                <Card.Body>
                    <Card.Title>E-Calculator</Card.Title>

                    <div style={{ fontSize: '20px' }}>
                        <div className="table-list-ecalcu">
                            <Table
                                striped
                                bordered
                                hover
                                variant="light"
                                className="m-0"
                            >
                                <thead>
                                    <tr>
                                        <th
                                            className="list-utang"
                                            style={{ width: '60%' }}
                                        >
                                            Items
                                        </th>
                                        <th
                                            className="list-utang"
                                            style={{
                                                width: '15%',
                                                textAlign: 'center',
                                            }}
                                        >
                                            Qty
                                        </th>
                                        <th
                                            className="list-utang"
                                            style={{
                                                width: '25%',
                                                textAlign: 'center',
                                            }}
                                        >
                                            Total
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {item.length !== 0 &&
                                        item.map((data) => (
                                            <tr
                                                key={data.id}
                                                onClick={() => {
                                                    setItemToRemove(data)
                                                    setOpenModal(true)
                                                }}
                                            >
                                                <td
                                                    style={{
                                                        width: '60%',
                                                    }}
                                                >
                                                    {data.item}
                                                </td>
                                                <td
                                                    style={{
                                                        width: '15%',
                                                        textAlign: 'center',
                                                    }}
                                                >
                                                    {data.qty}
                                                </td>
                                                <td
                                                    style={{
                                                        width: '25%',
                                                        textAlign: 'center',
                                                    }}
                                                >
                                                    {formatToCurrency(
                                                        data.total,
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </Table>
                        </div>

                        <div className="d-flex justify-content-center mt-2">
                            Total:
                            <span
                                style={{
                                    fontWeight: 'bold',
                                    fontSize: '24px',
                                }}
                            >
                                {formatToCurrency(total)}
                            </span>
                        </div>
                        {total !== 0 && (
                            <Row className="mb-1">
                                <Col>
                                    <FormControl
                                        style={{
                                            height: '45px',
                                        }}
                                        id="cash"
                                        autoComplete="off"
                                        value={cash}
                                        type="number"
                                        onChange={(e) =>
                                            setCash(e.target.value)
                                        }
                                        placeholder="Cash"
                                    />
                                </Col>

                                <Col className=" d-flex align-content-center p-0 m-0">
                                    <div className="d-flex justify-content-start">
                                        Change:
                                        <span
                                            style={{
                                                fontWeight: 'bold',
                                                fontSize: '24px',
                                            }}
                                        >
                                            {formatToCurrency(change)}
                                        </span>
                                    </div>
                                </Col>
                            </Row>
                        )}
                    </div>

                    <Row className="mb-2">
                        <Col>
                            <Select
                                size="large"
                                className="w-100"
                                mode="combobox"
                                showSearch
                                value={formData.item}
                                onChange={(e) => {
                                    const getPrice = items.find(
                                        (el) => el.label === e,
                                    ).price
                                    setFormData({
                                        ...formData,
                                        item: e,
                                        price: getPrice,
                                    })
                                    if (
                                        e !== 'Load' &&
                                        e !== 'Gcash' &&
                                        e !== 'Pera'
                                    ) {
                                        document
                                            .getElementById('quantity')
                                            .focus()
                                    }
                                }}
                            >
                                {items
                                    .filter(
                                        (data) =>
                                            data.label
                                                .toLowerCase()
                                                .includes(
                                                    formData.item.toLowerCase(),
                                                ) ||
                                            data.barcode
                                                .toLowerCase()
                                                .includes(
                                                    formData.item.toLowerCase(),
                                                ),
                                    )
                                    .map((data) => (
                                        <Select.Option
                                            key={data.id}
                                            value={data.label}
                                        >
                                            {data.label}
                                        </Select.Option>
                                    ))}
                            </Select>
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                            <FormControl
                                id="presyo"
                                disabled={
                                    formData.item !== 'Load' &&
                                    formData.item !== 'Gcash' &&
                                    formData.item !== 'Pera'
                                }
                                autoComplete="off"
                                type="number"
                                value={formData.price}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        price: e.target.value,
                                    })
                                }
                                placeholder="Price"
                            />
                        </Col>

                        <Col>
                            <FormControl
                                autoComplete="off"
                                id="quantity"
                                type="number"
                                value={formData.qty}
                                onChange={(e) => {
                                    setFormData({
                                        ...formData,
                                        qty: e.target.value,
                                    })
                                }}
                                placeholder="Qty"
                            />
                        </Col>
                    </Row>
                    <Row className="mt-3">
                        <Col sm className="mb-1">
                            <Button
                                className="w-100"
                                variant="success"
                                onClick={addItem}
                            >
                                <span
                                    style={{
                                        display: 'flex',
                                        gap: '8px',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <BsDatabaseAdd color="black" /> Add
                                </span>
                            </Button>
                        </Col>
                    </Row>
                </Card.Body>
                <ToastContainer position="top-center" />
                <Modal
                    title={
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            Remove Item
                        </div>
                    }
                    closable={false}
                    footer={false}
                    open={openModal}
                >
                    <div className="delete-modal">
                        <div style={{ fontSize: '20px', textAlign: 'center' }}>
                            Remove {itemToRemove !== null && itemToRemove.item}{' '}
                            from item list?
                        </div>
                        <div className="del-modal-btn">
                            <Button
                                className="w-100"
                                variant="danger"
                                onClick={removeItem}
                            >
                                Yes
                            </Button>
                            <Button
                                className="w-100"
                                variant="primary"
                                onClick={() => setOpenModal(false)}
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                </Modal>
            </Card>
        </div>
    )
}

export default index
