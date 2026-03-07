import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col, Form, Button, InputGroup, Container } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'

import Loader from '../components/Loader'
import Message from '../components/Message'
import { loginUser } from '../slices/userSlice'

function LoginScreen() {
    // State for form inputs
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    // State for the password toggle
    const [showPassword, setShowPassword] = useState(false)

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const location = useLocation()

    // Pull RTK state
    const userState = useSelector((state) => state.user)
    const { userInfo, loading, error } = userState

    const redirect = location.search ? location.search.split('=')[1] : '/'

    // Redirect if already logged in
    useEffect(() => {
        if (userInfo) {
            // navigate(redirect)
            // This checks if the redirect URL already has a slash. If not, it adds one!
            navigate(redirect.startsWith('/') ? redirect : `/${redirect}`)

        }
    }, [navigate, userInfo, redirect])

    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(loginUser({ email, password }))
    }

    return (
        <Container>
            <Row className="justify-content-md-center mt-5">
                <Col xs={12} md={6}>
                    <h1>Sign In</h1>

                    {error && <Message variant='danger'>{error}</Message>}
                    {loading && <Loader />}

                    <Form onSubmit={submitHandler}>
                        <Form.Group className="mb-3" controlId="email">
                            <Form.Label>Email Address</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="password">
                            <Form.Label>Password</Form.Label>
                            <InputGroup>
                                <Form.Control
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Enter Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
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

                        <Button type="submit" variant="primary" className="mt-3">
                            Sign In
                        </Button>
                    </Form>

                    <Row className="py-3">
                        <Col>
                            New Customer?{' '}
                            <Link to={redirect !== '/' ? `/register?redirect=${redirect}` : '/register'}>
                                Register
                            </Link>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Container>
    )
}

export default LoginScreen