import { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col, Image, ListGroup, Button, Card, Form, ListGroupItem } from 'react-bootstrap'
import Rating from '../components/Rating'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { fetchProductDetails, clearProductDetails, createProductReview, productReviewCreateReset } from '../slices/productSlice'

function ProductScreen() {
    const [qty, setQty] = useState(1)

    // Local state for the review form
    const [rating, setRating] = useState(0)
    const [comment, setComment] = useState('')

    const { id } = useParams()
    const navigate = useNavigate();
    const dispatch = useDispatch()

    // Grab the product state
    const productState = useSelector((state) => state.productList)
    const {
        product, loading, error,
        loadingProductReview, successProductReview, errorProductReview
    } = productState

    // Grab the user state to check if they are logged in
    const userState = useSelector((state) => state.user)
    const { userInfo } = userState

    useEffect(() => {
        // If a review was just successfully submitted, reset the form and refresh the product!
        if (successProductReview) {
            setRating(0)
            setComment('')
            dispatch(productReviewCreateReset())
            dispatch(fetchProductDetails(id))
        } else {
            dispatch(fetchProductDetails(id))
        }

        // reset the product state so the next item doesn't show old data first
        return () => {
            dispatch(clearProductDetails())
        }
    }, [dispatch, id, successProductReview])

    const addToCartHandler = () => {
        navigate(`/cart/${id}?qty=${qty}`);
    }

    // Submit the new review to Django
    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(createProductReview({
            productId: id,
            review: {
                rating,
                comment
            }
        }))
    }

    return (
        <>
            <Link className='btn btn-light my-3' to='/'>Go Back</Link>

            {loading ? (
                <Loader />
            ) : error ? (
                <Message variant='danger'>{error}</Message>
            ) : (
                <>
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
                                                        {[...Array(product.countInStock).keys()].map((x) => (
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

                    {/* REVIEWS SECTION */}
                    <Row className='mt-5'>
                        <Col md={6}>
                            <h2>Reviews</h2>

                            {/* If there are no reviews, show a message */}
                            {product.reviews && product.reviews.length === 0 && (
                                <Message variant='info'>No Reviews</Message>
                            )}

                            <ListGroup variant='flush'>
                                {/* Map through existing reviews */}
                                {product.reviews && product.reviews.map((review) => (
                                    <ListGroup.Item key={review._id} className='px-0'>
                                        <strong>{review.name}</strong>
                                        <Rating value={review.rating} color={'#f8e825'} />
                                        {/* Format the date the review was created*/}
                                        <p>{review.createdAt ? review.createdAt.substring(0, 10) : ''}</p>
                                        <p>{review.comment}</p>
                                    </ListGroup.Item>
                                ))}

                                {/* Write a Review Form */}
                                <ListGroup.Item className='px-0 mt-3'>
                                    <h4>Write a Customer Review</h4>

                                    {loadingProductReview && <Loader />}
                                    {successProductReview && <Message variant='success'>Review submitted successfully</Message>}
                                    {errorProductReview && <Message variant='danger'>{errorProductReview}</Message>}

                                    {userInfo ? (
                                        <Form onSubmit={submitHandler}>
                                            <Form.Group controlId='rating' className='mb-3'>
                                                <Form.Label>Rating</Form.Label>
                                                <Form.Control
                                                    as='select'
                                                    value={rating}
                                                    onChange={(e) => setRating(Number(e.target.value))}
                                                >
                                                    <option value=''>Select...</option>
                                                    <option value='1'>1 - Poor</option>
                                                    <option value='2'>2 - Fair</option>
                                                    <option value='3'>3 - Good</option>
                                                    <option value='4'>4 - Very Good</option>
                                                    <option value='5'>5 - Excellent</option>
                                                </Form.Control>
                                            </Form.Group>

                                            <Form.Group controlId='comment' className='mb-3'>
                                                <Form.Label>Review</Form.Label>
                                                <Form.Control
                                                    as='textarea'
                                                    rows='4'
                                                    value={comment}
                                                    onChange={(e) => setComment(e.target.value)}
                                                ></Form.Control>
                                            </Form.Group>

                                            <Button disabled={loadingProductReview} type='submit' variant='primary'>
                                                Submit
                                            </Button>
                                        </Form>
                                    ) : (
                                        <Message variant='info'>
                                            Please <Link to='/login'>sign in</Link> to write a review.
                                        </Message>
                                    )}
                                </ListGroup.Item>
                            </ListGroup>
                        </Col>
                    </Row>
                </>
            )}
        </>
    )
}

export default ProductScreen