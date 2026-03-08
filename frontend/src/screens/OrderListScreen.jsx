import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Table, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { listOrders } from '../slices/orderSlice';

function OrderListScreen() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const orderState = useSelector((state) => state.order);
    const { orderList, loadingOrders, errorOrders } = orderState;

    const userState = useSelector((state) => state.user);
    const { userInfo } = userState;

    useEffect(() => {
        // SECURITY: If the user is an admin, fetch all orders. Otherwise, kick them to login!
        if (userInfo && userInfo.isAdmin) {
            dispatch(listOrders());
        } else {
            navigate('/login');
        }
    }, [dispatch, navigate, userInfo]);

    return (
        <div>
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
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {orderList.map((order) => (
                            <tr key={order._id}>
                                <td>{order._id}</td>
                                <td>{order.user && order.user.name}</td>
                                <td>{order.createdAt?.substring(0, 10)}</td>
                                <td>${order.totalPrice}</td>
                                <td>
                                    {order.isPaid ? (
                                        order.paidAt?.substring(0, 10)
                                    ) : (
                                        <FontAwesomeIcon icon={faTimes} style={{ color: 'red' }} />
                                    )}
                                </td>
                                <td>
                                    {order.isDelivered ? (
                                        order.deliveredAt?.substring(0, 10)
                                    ) : (
                                        <FontAwesomeIcon icon={faTimes} style={{ color: 'red' }} />
                                    )}
                                </td>
                                <td>
                                    <Button as={Link} to={`/order/${order._id}`} variant='light' className='btn-sm'>
                                        Details
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </div>
    );
}

export default OrderListScreen;