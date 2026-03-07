import { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col, Image, ListGroup, Button, Card, Form, ListGroupItem } from 'react-bootstrap'
import Rating from '../components/Rating'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { fetchProductDetails, clearProductDetails } from '../slices/productSlice'

function ProductScreen() {
    const [qty, setQty] = useState(1)
    const { id } = useParams()
    const navigate = useNavigate();
    const dispatch = useDispatch()

    // Grab the state from the 'productList' key we set in store.js
    const { product, loading, error } = useSelector((state) => state.productList)

    useEffect(() => {
        dispatch(fetchProductDetails(id))

        //   reset the product state so the next item doesn't show old data first
        return () => {
            dispatch(clearProductDetails())
        }
    }, [dispatch, id])

    const addToCartHandler = () => {
        navigate(`/cart/${id}?qty=${qty}`);
    }

    return (
        <>
            <Link className='btn btn-light my-3' to='/'>Go Back</Link>

            {loading ? (
                <Loader />
            ) : error ? (
                <Message variant={danger} style={{ color: 'red' }}>{error}</Message>
            ) : (
                <Row>
                    <Col md={6}>
                        <Image src={product.image} alt={product.name} fluid />
                    </Col>

                    <Col md={3}>
                        <ListGroup variant='flush'>
                            <ListGroup.Item className='border-bottom border-secondary border-opacity-25'>
                                <h3>{product.name}</h3>
                            </ListGroup.Item>
                            <ListGroup.Item className='border-bottom border-secondary border-opacity-25'>
                                <Rating value={product.rating} text={`${product.numReviews} reviews`} color={'#f8e825'} />
                            </ListGroup.Item>
                            <ListGroup.Item className='border-bottom border-secondary border-opacity-25'>
                                Price: ${product.price}
                            </ListGroup.Item>
                            <ListGroup.Item>
                                Description: {product.description}
                            </ListGroup.Item>
                        </ListGroup>
                    </Col>

                    <Col md={3}>
                        <Card>
                            <ListGroup variant='flush'>
                                <ListGroup.Item className='border-bottom border-secondary border-opacity-25'>
                                    <Row>
                                        <Col>Price:</Col>
                                        <Col><strong>${product.price}</strong></Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item className='border-bottom border-secondary border-opacity-25'>
                                    <Row>
                                        <Col>Status:</Col>
                                        <Col>{product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}</Col>
                                    </Row>
                                </ListGroup.Item>
                                {product.countInStock > 0 && (
                                    <ListGroupItem>
                                        <Row>
                                            <Col>Qty</Col>
                                            <Col xs='auto' className='my-1'>
                                                <Form.Control
                                                    as="select"
                                                    value={qty}
                                                    onChange={(e) => setQty(e.target.value)}
                                                >

                                                    {[...Array(product.countInStock).keys()]
                                                        .map((x) => (
                                                            <option key={x + 1} value={x + 1}>
                                                                {x + 1}
                                                            </option>
                                                        ))}
                                                </Form.Control>
                                            </Col>
                                        </Row>
                                    </ListGroupItem>
                                )}
                                <ListGroup.Item>
                                    <Button
                                        className='btn-block w-100'
                                        type='button'
                                        disabled={product.countInStock === 0}
                                        onClick={addToCartHandler}
                                    >
                                        Add To Cart
                                    </Button>
                                </ListGroup.Item>
                            </ListGroup>
                        </Card>
                    </Col>
                </Row>
            )}
        </>
    )
}

export default ProductScreen