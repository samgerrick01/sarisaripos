import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router'
import { Modal, Select } from 'antd'
import '../styles/addItems.scss'
import '../styles/deleteModal.scss'
import axios from 'axios'
import { baseUrl } from '../../api'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { loadingOff, loadingOn } from '../../redux/loadingSlice'
import { BsDatabaseAdd } from 'react-icons/bs'
import { GrPowerReset } from 'react-icons/gr'
import { RiArrowGoBackFill } from 'react-icons/ri'
import { Logout, formatToCurrency } from '../../functions'
import { setSelectedCredit } from '../../redux/creditSlice'
import { getItems } from '../../redux/itemsSlice'
import { AiOutlineUnorderedList } from 'react-icons/ai'

//bootstrap
import { Row, Col, Button, FormControl, Card, Table } from 'react-bootstrap'

let item = []
let total = 0

const UpdatedCredits = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    let { id } = useParams()

    const { selectedCredit } = useSelector((state) => state.credits)

    const { items } = useSelector((state) => state.items)

    const [openModal, setOpenModal] = useState(false)

    const [openModal1, setOpenModal1] = useState(false)

    const [openModal2, setOpenModal2] = useState(false)

    const [formData, setFormData] = useState({
        id: '',
        item: '',
        price: '',
        qty: '',
        total: '',
    })

    useEffect(() => {
        const idVal =
            Object.keys(selectedCredit).length !== 0
                ? selectedCredit.item.length !== 0 &&
                  selectedCredit.item[selectedCredit.item.length - 1].id
                : 0

        setFormData({ ...formData, id: idVal + 1 })
    }, [selectedCredit])

    const addItem = () => {
        if (!formData.item || !formData.qty) {
            toast.warning('Please Fill the Field!')
        } else {
            item.push(formData)
            total = parseFloat(total) + parseFloat(formData.total)
            dispatch(loadingOn())
            axios
                .put(`${baseUrl}/updateCredit/${id}`, { item, total })
                .then((res) => {
                    item = []
                    total = 0
                    toast.success(res.data)
                    dispatch(loadingOff())
                    callSelectedAPI()
                    onClear()
                })
                .catch((err) => {
                    toast.error('Server Error!')
                    dispatch(loadingOff())
                    onClear()
                })
        }
    }

    const paidHandle = () => {
        dispatch(loadingOn())
        axios
            .delete(`${baseUrl}/deleteCredit/${id}`)
            .then((res) => {
                toast.success(res.data)
                navigate('/credit-list')
                setOpenModal(false)
                setOpenModal1(false)
                dispatch(loadingOff())
            })
            .catch((err) => {
                toast.error('Server Error!')
                dispatch(loadingOff())
            })
    }

    const onClear = () => {
        setFormData({ ...formData, item: '', price: '', qty: '', total: '' })
        toast.dismiss()
    }

    const onBack = () => {
        navigate('/credit-list')
    }

    const callSelectedAPI = () => {
        axios
            .post(`${baseUrl}/selectedCredit`, { id })
            .then((res) => {
                dispatch(setSelectedCredit(res.data))
                if (res.data.item.length !== 0) {
                    item = item.concat(res.data.item)
                    total = res.data.total
                }
            })
            .catch((err) => console.log(err))
    }

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
            total = 0
            item = []
            callSelectedAPI()
        }
    }, [])

    useEffect(() => {
        setFormData({
            ...formData,
            total: parseFloat(formData.price) * parseFloat(formData.qty) || '',
        })
    }, [formData.qty])

    const [itemToRemove, setItemToRemove] = useState(null)
    const removeItem = () => {
        let idx = item.findIndex((data) => data.id === itemToRemove.id)
        item.splice(idx, 1)
        total = total - itemToRemove.total
        dispatch(loadingOn())
        axios
            .put(`${baseUrl}/updateCredit/${id}`, { item, total })
            .then((res) => {
                item = []
                total = 0
                toast.success('Remove Success!')
                dispatch(loadingOff())
                callSelectedAPI()
            })
            .catch((err) => {
                toast.error('Server Error!')
                dispatch(loadingOff())
            })

        setOpenModal2(false)
    }

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
                        <BsDatabaseAdd color="black" /> Mag add ng item
                    </Card.Title>
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
                                    if (e !== 'Load') {
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
                                disabled={formData.item !== 'Load'}
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

                        <Col sm className="mb-1">
                            <Button
                                className="w-100"
                                variant="warning"
                                onClick={() => setOpenModal(true)}
                            >
                                <span
                                    style={{
                                        display: 'flex',
                                        gap: '8px',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <AiOutlineUnorderedList color="black" />{' '}
                                    View Items
                                </span>
                            </Button>
                        </Col>
                    </Row>

                    <Row>
                        <Col sm className="mb-1">
                            <Button
                                className="w-100"
                                variant="secondary"
                                onClick={onClear}
                            >
                                <span
                                    style={{
                                        display: 'flex',
                                        gap: '8px',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <GrPowerReset color="black" /> Clear
                                </span>
                            </Button>
                        </Col>

                        <Col sm className="mb-1">
                            <Button
                                className="w-100"
                                variant="primary"
                                onClick={onBack}
                            >
                                <span
                                    style={{
                                        display: 'flex',
                                        gap: '8px',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <RiArrowGoBackFill color="black" /> Back
                                </span>
                            </Button>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

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
                        {selectedCredit.total === 0
                            ? 'Notice'
                            : 'List of Items'}
                    </div>
                }
                closable={false}
                footer={false}
                open={openModal}
            >
                <div className="delete-modal">
                    {selectedCredit.total !== 0 && (
                        <div
                            style={{ fontSize: '14px', color: 'red' }}
                            className="d-flex justify-content-center"
                        >
                            ⬇️ Click the item to remove!⬇️
                        </div>
                    )}

                    <div style={{ fontSize: '20px' }}>
                        {selectedCredit.total !== 0 && (
                            <div className="table-list-items">
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
                                        {Object.keys(selectedCredit).length
                                            ? selectedCredit.item.length !==
                                                  0 &&
                                              selectedCredit.item.map(
                                                  (data) => (
                                                      <tr
                                                          key={data.id}
                                                          onClick={() => {
                                                              setItemToRemove(
                                                                  data,
                                                              )
                                                              setOpenModal2(
                                                                  true,
                                                              )
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
                                                                  textAlign:
                                                                      'center',
                                                              }}
                                                          >
                                                              {data.qty}
                                                          </td>
                                                          <td
                                                              style={{
                                                                  width: '25%',
                                                                  textAlign:
                                                                      'center',
                                                              }}
                                                          >
                                                              {formatToCurrency(
                                                                  data.total,
                                                              )}
                                                          </td>
                                                      </tr>
                                                  ),
                                              )
                                            : null}
                                    </tbody>
                                </Table>
                            </div>
                        )}

                        {selectedCredit.total === 0 && (
                            <div className="d-flex justify-content-center">
                                Delete this data?
                            </div>
                        )}

                        {selectedCredit.total !== 0 && (
                            <div className="d-flex justify-content-center mt-2">
                                Total:
                                <span
                                    style={{
                                        fontWeight: 'bold',
                                        fontSize: '24px',
                                    }}
                                >
                                    {formatToCurrency(selectedCredit.total)}
                                </span>
                            </div>
                        )}
                    </div>
                    <div className="del-modal-btn">
                        <Button
                            className="w-100"
                            variant="danger"
                            onClick={() => {
                                if (selectedCredit.total !== 0) {
                                    setOpenModal1(true)
                                } else {
                                    paidHandle()
                                }
                            }}
                        >
                            {selectedCredit.total === 0 ? 'Yes' : 'Paid'}
                        </Button>

                        <Button
                            className="w-100"
                            variant="primary"
                            onClick={() => setOpenModal(false)}
                        >
                            {selectedCredit.total === 0 ? 'No' : 'Cancel'}
                        </Button>
                    </div>
                </div>
            </Modal>

            <Modal
                title={
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        Delete Credit
                    </div>
                }
                closable={false}
                footer={false}
                open={openModal1}
            >
                <div className="delete-modal">
                    <div style={{ fontSize: '20px', textAlign: 'center' }}>
                        Are you sure {selectedCredit.name} is paid?
                    </div>
                    <div className="del-modal-btn">
                        <Button
                            className="w-100"
                            variant="danger"
                            onClick={paidHandle}
                        >
                            Yes
                        </Button>
                        <Button
                            className="w-100"
                            variant="primary"
                            onClick={() => setOpenModal1(false)}
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            </Modal>

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
                open={openModal2}
            >
                <div className="delete-modal">
                    <div style={{ fontSize: '20px', textAlign: 'center' }}>
                        Remove {itemToRemove !== null && itemToRemove.item} from
                        item list?
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
                            onClick={() => setOpenModal2(false)}
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}

export default UpdatedCredits
