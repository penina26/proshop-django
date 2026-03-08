import React, { useEffect } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faTrash } from '@fortawesome/free-solid-svg-icons';

import Loader from '../components/Loader';
import Message from '../components/Message';
import { listOrders, deleteOrder, orderDeleteReset } from '../slices/orderSlice';

function OrderListScreen() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const orderState = useSelector((state) => state.order);
    const { orderList, loadingOrders, errorOrders, successDelete } = orderState;

    const userState = useSelector((state) => state.user);
    const { userInfo } = userState;

    useEffect(() => {
        if (userInfo && userInfo.isAdmin) {
            // If we successfully deleted an order, reset the state and pull the fresh list
            if (successDelete) {
                dispatch(orderDeleteReset());
                dispatch(listOrders());
            } else {
                dispatch(listOrders());
            }
        } else {
            navigate('/login');
        }
    }, [dispatch, navigate, userInfo, successDelete]);

    const deleteHandler = (id) => {
        if (window.confirm('Are you sure you want to completely delete this order?')) {
            dispatch(deleteOrder(id));
        }
    };

    return (
        <>
            <h1>Orders</h1>
            {loadingOrders ? (
                <Loader />
            ) : errorOrders ? (
                <Message variant='danger'>{errorOrders}</Message>
            ) : (
                <Table striped bordered hover responsive className='table-sm'>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>USER</th>
                            <th>DATE</th>
                            <th>TOTAL</th>
                            <th>PAID</th>
                            <th>DELIVERED</th>
                            <th>ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orderList && orderList.map((order) => (
                            <tr key={order._id}>
                                <td>{order._id}</td>
                                <td>{order.user && order.user.name}</td>
                                <td>{order.createdAt ? order.createdAt.substring(0, 10) : ''}</td>
                                <td>${order.totalPrice}</td>

                                <td>
                                    {order.isPaid ? (
                                        order.paidAt ? order.paidAt.substring(0, 10) : 'Paid'
                                    ) : (
                                        <FontAwesomeIcon icon={faTimes} style={{ color: 'red' }} />
                                    )}
                                </td>

                                <td>
                                    {order.isDelivered ? (
                                        order.deliveredAt ? order.deliveredAt.substring(0, 10) : 'Delivered'
                                    ) : (
                                        <FontAwesomeIcon icon={faTimes} style={{ color: 'red' }} />
                                    )}
                                </td>

                                <td>
                                    <LinkContainer to={`/order/${order._id}`}>
                                        <Button variant='light' className='btn-sm'>
                                            Details
                                        </Button>
                                    </LinkContainer>

                                    {/* The Delete Button */}
                                    <Button variant='danger' className='btn-sm ms-2' onClick={() => deleteHandler(order._id)}>
                                        <FontAwesomeIcon icon={faTrash} />
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </>
    );
}

export default OrderListScreen;