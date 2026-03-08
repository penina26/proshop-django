import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Row, Col, ListGroup, Image, Card, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
// 1. Import the new delivery actions
import { getOrderDetails, payOrder, orderPayReset, deliverOrder, orderDeliverReset } from '../slices/orderSlice';
import { PayPalButtons } from '@paypal/react-paypal-js';

function OrderScreen() {
    const { id: orderId } = useParams();
    const dispatch = useDispatch();

    // 2. Pull the user state to check if they are an admin
    const userState = useSelector((state) => state.user);
    const { userInfo } = userState;

    // 3. Pull the delivery state from Redux
    const orderState = useSelector((state) => state.order);
    const { orderDetails, error, loading, loadingPay, successPay, loadingDeliver, successDeliver } = orderState;

    useEffect(() => {
        // 4. Update safeguard to trigger a refresh if successDeliver is true!
        if (!orderDetails || successPay || successDeliver || orderDetails._id !== Number(orderId)) {
            dispatch(orderPayReset());
            dispatch(orderDeliverReset()); // Reset delivery state
            dispatch(getOrderDetails(orderId));
        }
    }, [dispatch, orderDetails, orderId, successPay, successDeliver]);

    // Handler for clicking the delivery button
    const deliverHandler = () => {
        dispatch(deliverOrder(orderDetails));
    };

    return loading ? (
        <Loader />
    ) : error ? (
        <Message variant='danger'>{error}</Message>
    ) : (
        <div>
            <h1>Order: {orderDetails._id}</h1>
            <Row>
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

                            {orderDetails.isDelivered ? (
                                <Message variant='success'>Delivered on {orderDetails.deliveredAt?.substring(0, 10)}</Message>
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
                            {orderDetails.isPaid ? (
                                <Message variant='success'>Paid on {orderDetails.paidAt?.substring(0, 10)}</Message>
                            ) : (
                                <div>
                                    <Message variant='warning'>Not Paid</Message>
                                    {loadingPay && <Loader />}

                                    {/* Only show PayPal buttons if the user looking at the screen is NOT an admin */}
                                    {!userInfo?.isAdmin && (
                                        <div className='mt-3'>
                                            <PayPalButtons
                                                createOrder={(data, actions) => {
                                                    return actions.order.create({
                                                        purchase_units: [{ amount: { value: orderDetails.totalPrice } }]
                                                    });
                                                }}
                                                onApprove={(data, actions) => {
                                                    return actions.order.capture().then((details) => {
                                                        dispatch(payOrder({ orderId, paymentResult: details }));
                                                    });
                                                }}
                                            />
                                        </div>
                                    )}
                                </div>
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

                <Col md={4}>
                    <Card>
                        <ListGroup variant='flush'>
                            <ListGroup.Item>
                                <h2>Order Summary</h2>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row><Col>Items:</Col><Col>${orderDetails.orderItems?.reduce((acc, item) => acc + item.price * item.qty, 0).toFixed(2)}</Col></Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row><Col>Shipping:</Col><Col>${orderDetails.shippingPrice}</Col></Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row><Col>Tax:</Col><Col>${orderDetails.taxPrice}</Col></Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row><Col>Total:</Col><Col>${orderDetails.totalPrice}</Col></Row>
                            </ListGroup.Item>

                            {/*  Admin Mark as Delivered Button */}
                            {loadingDeliver && <Loader />}
                            {userInfo && userInfo.isAdmin && orderDetails.isPaid && !orderDetails.isDelivered && (
                                <ListGroup.Item>
                                    <Button type='button' className='btn btn-block w-100' onClick={deliverHandler}>
                                        Mark As Delivered
                                    </Button>
                                </ListGroup.Item>
                            )}
                        </ListGroup>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}

export default OrderScreen;