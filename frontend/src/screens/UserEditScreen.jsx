import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { fetchUserDetails, adminUpdateUser, resetAdminUpdateSuccess } from '../slices/userSlice';

function UserEditScreen() {
    // Grab the user's ID from the URL bar (e.g., /admin/user/5/edit)
    const { id: userId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);

    const userState = useSelector((state) => state.user);
    const { userDetails, loadingDetails, errorDetails, successAdminUpdate } = userState;

    useEffect(() => {
        // If we just successfully updated the user, reset the state and send admin back to the list
        if (successAdminUpdate) {
            dispatch(resetAdminUpdateSuccess());
            navigate('/admin/userlist');
        } else {
            // If the user details aren't loaded, or we are looking at a different user's ID, fetch them
            if (!userDetails || !userDetails.name || String(userDetails._id) !== String(userId)) {
                dispatch(fetchUserDetails(userId));
            } else {
                // Pre-fill the form with the user's current data
                setName(userDetails.name);
                setEmail(userDetails.email);
                setIsAdmin(userDetails.isAdmin);
            }
        }
    }, [dispatch, navigate, userId, userDetails, successAdminUpdate]);

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(adminUpdateUser({ _id: userId, name, email, isAdmin }));
    };

    return (
        <div>
            <Link to='/admin/userlist' className='btn btn-light my-3'>
                Go Back
            </Link>

            <Row className='justify-content-md-center'>
                <Col xs={12} md={6}>
                    <h1>Edit User</h1>
                    {loadingDetails && <Loader />}
                    {errorDetails && <Message variant='danger'>{errorDetails}</Message>}

                    {userDetails && (
                        <Form onSubmit={submitHandler}>
                            <Form.Group controlId='name' className='mb-3'>
                                <Form.Label>Name</Form.Label>
                                <Form.Control
                                    type='text'
                                    placeholder='Enter name'
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                ></Form.Control>
                            </Form.Group>

                            <Form.Group controlId='email' className='mb-3'>
                                <Form.Label>Email Address</Form.Label>
                                <Form.Control
                                    type='email'
                                    placeholder='Enter email'
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                ></Form.Control>
                            </Form.Group>

                            <Form.Group controlId='isadmin' className='mb-4'>
                                <Form.Check
                                    type='checkbox'
                                    label='Is Admin'
                                    checked={isAdmin}
                                    onChange={(e) => setIsAdmin(e.target.checked)}
                                ></Form.Check>
                            </Form.Group>

                            <Button type='submit' variant='primary'>
                                Update User
                            </Button>
                        </Form>
                    )}
                </Col>
            </Row>
        </div>
    );
}

export default UserEditScreen;