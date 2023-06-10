import React, { useEffect, useState } from 'react'
import '../styles/homepage.scss'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router'
//bootstrap
import { Row, Col, Button, Card, Spinner, Table } from 'react-bootstrap'
import { Input } from 'antd'
import { Logout, checkIfDone } from '../../functions'
import { getListahan } from '../../redux/listahanSlice'
import { baseUrl } from '../../api'
import axios from 'axios'
import { FaTrash, FaCheck, FaUndo } from 'react-icons/fa'
import { BsDatabaseAdd } from 'react-icons/bs'
import { RiArrowGoBackFill } from 'react-icons/ri'
import { loadingOff, loadingOn } from '../../redux/loadingSlice'

const ViewListahan = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const { listahan } = useSelector((state) => state.listahan)
    const [query, setQuery] = useState('')

    //Change Status
    const setStatus = (data) => {
        dispatch(loadingOn())
        axios
            .put(`${baseUrl}/changeStatus/${data.id}`, {
                status: data.status ? 0 : 1,
            })
            .then((res) => {
                dispatch(loadingOff())
                if (res.data === 'Updated') {
                    getListahanList()
                }
            })
            .catch((err) => {
                dispatch(loadingOff())
                console.log(err)
            })
    }

    //Delete
    const deleteItem = (data) => {
        dispatch(loadingOn())
        axios
            .delete(`${baseUrl}/deleteToListahan/${data.id}`)
            .then((res) => {
                dispatch(loadingOff())
                if (res.data === 'Deleted') {
                    getListahanList()
                }
            })
            .catch((err) => {
                dispatch(loadingOff())
                console.log(err)
            })
    }

    //Load the Listahan Items
    function getListahanList() {
        axios
            .get(`${baseUrl}/listahan`)
            .then((res) => dispatch(getListahan(res.data)))
            .catch((err) => console.log(err))
    }

    useEffect(() => {
        if (!sessionStorage.getItem('user')) {
            Logout(dispatch, navigate)
        } else {
            getListahanList()
        }
    }, [])
    return (
        <div className="homepage">
            <Card
                style={{
                    padding: '12px',
                    background: 'lightblue',
                    margin: '12px',
                    width: '100%',
                }}
            >
                <Card.Body>
                    <Card.Title>Listahan</Card.Title>
                    <Input
                        id="search"
                        type="text"
                        placeholder="Search item here"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        autoComplete="off"
                        allowClear
                        style={{
                            height: '52px',
                            fontWeight: '400',
                            fontSize: '1rem',
                            borderRadius: '0.375rem',
                        }}
                    />
                    {/* Table */}
                    <div className="home-table">
                        {!listahan.length && (
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                            >
                                <Spinner />
                            </div>
                        )}
                        {listahan.length != 0 && (
                            <Table
                                striped
                                bordered
                                hover
                                variant="light"
                                className="my-table"
                            >
                                <thead>
                                    <tr>
                                        <th style={{ width: '50%' }}>Items</th>
                                        <th style={{ width: '20%' }}>Qty</th>
                                        <th style={{ width: '30%' }}>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {listahan
                                        .filter((data) =>
                                            data.item
                                                .toLowerCase()
                                                .includes(query.toLowerCase()),
                                        )
                                        .map((data) => (
                                            <tr
                                                key={data.id}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <td
                                                    className="ps-1 text-capitalize"
                                                    style={checkIfDone(
                                                        data.status,
                                                    )}
                                                    onClick={() =>
                                                        navigate(
                                                            `/update-lista/${data.id}`,
                                                        )
                                                    }
                                                >
                                                    {data.item}
                                                </td>
                                                <td
                                                    onClick={() =>
                                                        navigate(
                                                            `/update-lista/${data.id}`,
                                                        )
                                                    }
                                                    style={{
                                                        width: '20%',
                                                        textAlign: 'center',
                                                    }}
                                                >
                                                    {data.qty}
                                                </td>
                                                <td
                                                    style={{
                                                        width: '20%',
                                                        textAlign: 'center',
                                                    }}
                                                >
                                                    {!data.status ? (
                                                        <FaCheck
                                                            onClick={() =>
                                                                setStatus(data)
                                                            }
                                                        />
                                                    ) : (
                                                        <FaUndo
                                                            onClick={() =>
                                                                setStatus(data)
                                                            }
                                                        />
                                                    )}
                                                    &nbsp;&nbsp;&nbsp;
                                                    <FaTrash
                                                        onClick={() =>
                                                            deleteItem(data)
                                                        }
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </Table>
                        )}
                    </div>

                    <Row>
                        <Col sm className="mb-3">
                            <Button
                                onClick={() => navigate('/add-lista')}
                                variant="success"
                                className="w-100"
                            >
                                <BsDatabaseAdd color="black" /> Mag Add
                            </Button>
                        </Col>
                        <Col sm className="mb-3">
                            <Button
                                onClick={() => navigate('/home-page')}
                                variant="primary"
                                className="w-100"
                            >
                                <RiArrowGoBackFill color="black" /> Back
                            </Button>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        </div>
    )
}

export default ViewListahan
