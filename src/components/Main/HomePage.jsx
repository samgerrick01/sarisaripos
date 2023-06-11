import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router'
import { getItems } from '../../redux/itemsSlice'
import '../styles/homepage.scss'
import { baseUrl } from '../../api'
import { BsDatabaseAdd } from 'react-icons/bs'
import { AiOutlineUnorderedList } from 'react-icons/ai'
import { Logout, formatToCurrency } from '../../functions'

import { Input } from 'antd'

//bootstrap
import { Row, Col, Button, Card, Table, Spinner } from 'react-bootstrap'

const HomePage = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const { items } = useSelector((state) => state.items)

    let user = sessionStorage.getItem('user')
        ? JSON.parse(sessionStorage.getItem('user'))
        : {}

    const [query, setQuery] = useState('')

    //Load the Items
    useEffect(() => {
        if (!sessionStorage.getItem('user')) {
            Logout(dispatch, navigate)
        } else {
            axios
                .get(`${baseUrl}/items`)
                .then((res) => dispatch(getItems(res.data)))
                .catch((err) => console.log(err))
        }
    }, [])

    const addItems = () => {
        navigate('/add-items')
    }

    const onLogout = () => {
        Logout(dispatch, navigate)
    }

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
                    <div className="d-flex justify-content-between w-100 mb-1">
                        <label className="component-title ">
                            <AiOutlineUnorderedList color="red" />
                            List of Items
                        </label>
                        <label className="component-title ">
                            Total Items:{items.length}
                        </label>
                    </div>

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
                        {!items.length && (
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
                        {items.length != 0 && (
                            <Table
                                striped
                                bordered
                                hover
                                variant="light"
                                className="my-table"
                            >
                                <thead>
                                    <tr>
                                        <th style={{ width: '60%' }}>Items</th>
                                        <th style={{ width: '20%' }}>Price</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items
                                        .filter((data) =>
                                            data.label
                                                .toLowerCase()
                                                .includes(query.toLowerCase()),
                                        )
                                        .map((data) => (
                                            <tr
                                                key={data.id}
                                                onClick={() => {
                                                    if (
                                                        user.status !== 'user'
                                                    ) {
                                                        navigate(
                                                            `/update/${data.id}`,
                                                        )
                                                    }
                                                }}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <td className="ps-1">
                                                    {data.label}
                                                </td>
                                                <td
                                                    style={{
                                                        width: '20%',
                                                        textAlign: 'center',
                                                    }}
                                                >
                                                    {formatToCurrency(
                                                        data.price,
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </Table>
                        )}
                    </div>
                    <Row>
                        {Object.keys(user).length ? (
                            user.status === 'user' ? null : (
                                <Col sm>
                                    <Button
                                        variant="success"
                                        className="w-100 mb-1"
                                        onClick={addItems}
                                    >
                                        <BsDatabaseAdd color="black" /> Add
                                        Items
                                    </Button>
                                </Col>
                            )
                        ) : null}
                    </Row>
                </Card.Body>
            </Card>
        </div>
    )
}

export default HomePage
