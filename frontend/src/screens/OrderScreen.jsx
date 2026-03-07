import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Row, Col, ListGroup, Image, Card } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { getOrderDetails } from '../slices/orderSlice';

function OrderScreen() {
    const { id: orderId } = useParams();
    const dispatch = useDispatch();

    // Pull the order details, loading status, and error from Redux
    const orderState = useSelector((state) => state.order);
    const { orderDetails, error, loading } = orderState;

    useEffect(() => {
        // SAFEGUARD: If we don't have order data yet, OR if the data we have 
        // belongs to a different order, fetch the correct one from Django!
        if (!orderDetails || orderDetails._id !== Number(orderId)) {
            dispatch(getOrderDetails(orderId));
        }
    }, [dispatch, orderDetails, orderId]);

    // Show a spinner while fetching, or an error if it fails
    return loading ? (
        <Loader />
    ) : error ? (
        <Message variant='danger'>{error}</Message>
    ) : (
        <div>
            <h1>Order: {orderDetails._id}</h1>
            <Row>
                {/* LEFT COLUMN: Order Details */}
                <Col md={8}>
                    <ListGroup variant='flush'>
                        <ListGroup.Item>
                            <h2>Shipping</h2>
                            <p><strong>Name: </strong> {orderDetails.user?.name || orderDetails.user?.username}</p>
                            <p><strong>Email: </strong><a href={`mailto:${orderDetails.user?.email}`}>{orderDetails.user?.email}</a></p>
                            <p>
                                <strong>Address: </strong>
                                {orderDetails.shippingAddress?.address}, {orderDetails.shippingAddress?.city}
                                {' '}
                                {orderDetails.shippingAddress?.postalCode},
                                {' '}
                                {orderDetails.shippingAddress?.country}
                            </p>

                            {/* Delivery Status Alert */}
                            {orderDetails.isDelivered ? (
                                <Message variant='success'>Delivered on {orderDetails.deliveredAt}</Message>
                            ) : (
                                <Message variant='warning'>Not Delivered</Message>
                            )}
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <h2>Payment Method</h2>
                            <p>
                                <strong>Method: </strong>
                                {orderDetails.paymentMethod}
                            </p>
                            {/* Payment Status Alert */}
                            {orderDetails.isPaid ? (
                                <Message variant='success'>Paid on {orderDetails.paidAt}</Message>
                            ) : (
                                <Message variant='warning'>Not Paid</Message>
                            )}
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <h2>Order Items</h2>
                            {orderDetails.orderItems?.length === 0 ? (
                                <Message variant='info'>Order is empty</Message>
                            ) : (
                                <ListGroup variant='flush'>
                                    {orderDetails.orderItems?.map((item, index) => (
                                        <ListGroup.Item key={index}>
                                            <Row>
                                                <Col md={1}>
                                                    <Image src={item.image} alt={item.name} fluid rounded />
                                                </Col>
                                                <Col>
                                                    <Link to={`/product/${item.product}`}>{item.name}</Link>
                                                </Col>
                                                <Col md={4}>
                                                    {item.qty} X ${item.price} = ${(item.qty * item.price).toFixed(2)}
                                                </Col>
                                            </Row>
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            )}
                        </ListGroup.Item>
                    </ListGroup>
                </Col>

                {/* RIGHT COLUMN: Order Summary Card */}
                <Col md={4}>
                    <Card>
                        <ListGroup variant='flush'>
                            <ListGroup.Item>
                                <h2>Order Summary</h2>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Row>
                                    <Col>Items:</Col>
                                    <Col>${orderDetails.orderItems?.reduce((acc, item) => acc + item.price * item.qty, 0).toFixed(2)}</Col>
                                </Row>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Row>
                                    <Col>Shipping:</Col>
                                    <Col>${orderDetails.shippingPrice}</Col>
                                </Row>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Row>
                                    <Col>Tax:</Col>
                                    <Col>${orderDetails.taxPrice}</Col>
                                </Row>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Row>
                                    <Col>Total:</Col>
                                    <Col>${orderDetails.totalPrice}</Col>
                                </Row>
                            </ListGroup.Item>
                        </ListGroup>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}

export default OrderScreen;