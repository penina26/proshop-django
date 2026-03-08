import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, Form, Button, InputGroup, Table } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faTimes } from '@fortawesome/free-solid-svg-icons';

import Loader from '../components/Loader';
import Message from '../components/Message';
import { updateUserProfile } from '../slices/userSlice';
import { listMyOrders } from '../slices/orderSlice';

function ProfileScreen() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Pull user state
    const userState = useSelector((state) => state.user);
    const { userInfo, loading, error, success } = userState;

    // Pull order state for the table
    const orderState = useSelector((state) => state.order);
    const { myOrders, loadingMyOrders, errorMyOrders } = orderState;

    useEffect(() => {
        if (!userInfo) {
            navigate('/login');
        } else {
            setName(userInfo.name || '');
            setEmail(userInfo.email || '');

            // Dispatch the thunk to grab the user's order history!
            dispatch(listMyOrders());
        }
    }, [navigate, userInfo, dispatch]);

    const submitHandler = (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setMessage('Passwords do not match');
        } else {
            setMessage('');
            dispatch(updateUserProfile({
                'id': userInfo._id,
                'name': name,
                'email': email,
                'password': password
            }));
        }
    };

    // Create a sorted copy of the orders to display in the table
    const sortedOrders = myOrders ? [...myOrders].sort((a, b) => {
        // Priority 1: If 'a' is paid and 'b' is not, put 'a' higher up
        if (a.isPaid && !b.isPaid) return -1;
        if (!a.isPaid && b.isPaid) return 1;

        // Priority 2: If they have the same paid status, put the newest order first
        return new Date(b.createdAt) - new Date(a.createdAt);
    }) : [];

    return (
        <Row className="mt-5">
            {/* LEFT COLUMN: User Profile Form */}
            <Col md={3}>
                <h2>User Profile</h2>

                {message && <Message variant='danger'>{message}</Message>}
                {error && <Message variant='danger'>{error}</Message>}
                {success && <Message variant='success'>Profile Updated Successfully!</Message>}
                {loading && <Loader />}

                <Form onSubmit={submitHandler}>
                    <Form.Group className="mb-3" controlId="name">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="email">
                        <Form.Label>Email Address</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="Enter Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="password">
                        <Form.Label>Password</Form.Label>
                        <InputGroup>
                            <Form.Control
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Update Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <Button
                                type="button"
                                variant="outline-secondary"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                            </Button>
                        </InputGroup>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="passwordConfirm">
                        <Form.Label>Confirm Password</Form.Label>
                        <InputGroup>
                            <Form.Control
                                type={showConfirmPassword ? 'text' : 'password'}
                                placeholder="Confirm Password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                            <Button
                                type="button"
                                variant="outline-secondary"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
                            </Button>
                        </InputGroup>
                    </Form.Group>

                    <Button type="submit" variant="primary" className="mt-3">
                        Update
                    </Button>
                </Form>
            </Col>

            {/* RIGHT COLUMN: My Orders Table */}
            <Col md={9}>
                <h2>My Orders</h2>
                {loadingMyOrders ? (
                    <Loader />
                ) : errorMyOrders ? (
                    <Message variant='danger'>{errorMyOrders}</Message>
                ) : myOrders?.length === 0 ? (
                    <Message variant='info'>You have no previous orders.</Message>
                ) : (
                    <Table striped responsive className='table-sm'>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Date</th>
                                <th>Total</th>
                                <th>Paid</th>
                                <th>Delivered</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedOrders.map((order) => (
                                <tr key={order._id}>
                                    <td>{order._id}</td>
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
                                        <Button as={Link} to={`/order/${order._id}`} className='btn-sm' variant='light'>
                                            Details
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                )}
            </Col>
        </Row>
    );
}

export default ProfileScreen;