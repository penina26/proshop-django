import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col, Form, Button, InputGroup } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'

import Loader from '../components/Loader'
import Message from '../components/Message'
import { updateUserProfile } from '../slices/userSlice'

function ProfileScreen() {
    // 1. Form State
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [message, setMessage] = useState('')

    // 2. Password Toggle State
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const dispatch = useDispatch()
    const navigate = useNavigate()

    // 3. Pull user state from Redux
    const userState = useSelector((state) => state.user)
    const { userInfo, loading, error, success } = userState

    // 4. Populate the form or redirect if logged out
    useEffect(() => {
        if (!userInfo) {
            navigate('/login')
        } else {
            // Pre-fill the form with the user's current data
            setName(userInfo.name || '')
            setEmail(userInfo.email || '')
        }
    }, [navigate, userInfo])

    // 5. Submit Handler
    const submitHandler = (e) => {
        e.preventDefault()

        if (password !== confirmPassword) {
            setMessage('Passwords do not match')
        } else {
            setMessage('')
            // Dispatch the update action to your Django backend
            dispatch(updateUserProfile({
                'id': userInfo._id,
                'name': name,
                'email': email,
                'password': password
            }))
        }
    }

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

            {/*  User Orders Placeholder */}
            <Col md={9}>
                <h2>My Orders</h2>
                {/* We will build the Order List component here later */}
                <Message variant='info'>Order history will appear here.</Message>
            </Col>
        </Row>
    )
}

export default ProfileScreen