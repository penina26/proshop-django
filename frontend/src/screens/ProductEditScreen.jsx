import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Form, Button, Row, Col, Container } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { fetchProductDetails, updateProduct, uploadProductImage, productUpdateReset } from '../slices/productSlice';

function ProductEditScreen() {
    const { id: productId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Local state for all our form fields
    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [image, setImage] = useState('');
    const [brand, setBrand] = useState('');
    const [category, setCategory] = useState('');
    const [countInStock, setCountInStock] = useState(0);
    const [description, setDescription] = useState('');

    const productState = useSelector((state) => state.productList);
    const {
        product, loading, error,
        loadingUpdate, errorUpdate, successUpdate,
        loadingUpload, errorUpload
    } = productState;

    useEffect(() => {
        // If we successfully updated, reset the state and send user back to the list
        if (successUpdate) {
            dispatch(productUpdateReset());
            navigate('/admin/productlist');
        } else {
            // If we don't have a product, or the ID doesn't match the URL, fetch it!
            if (!product.name || product._id !== Number(productId)) {
                dispatch(fetchProductDetails(productId));
            } else {
                // Populate our local state form fields with the database data
                setName(product.name);
                setPrice(product.price);
                setImage(product.image);
                setBrand(product.brand);
                setCategory(product.category);
                setCountInStock(product.countInStock);
                setDescription(product.description);
            }
        }
    }, [dispatch, product, productId, navigate, successUpdate]);

    // Handle standard text updates
    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(updateProduct({
            _id: productId,
            name,
            price,
            image,
            brand,
            category,
            countInStock,
            description
        }));
    };

    // Handle heavy image file uploads
    const uploadFileHandler = async (e) => {
        const file = e.target.files[0];
        const formData = new FormData();

        // Append the file and the ID so Django knows which product to attach it to
        formData.append('image', file);
        formData.append('product_id', productId);

        // Dispatch the upload action. Once it finishes, re-fetch the product to grab the new image URL
        dispatch(uploadProductImage(formData)).then(() => {
            dispatch(fetchProductDetails(productId));
        });
    };

    return (
        <Container>
            <Link to='/admin/productlist' className='btn btn-light my-3'>
                Go Back
            </Link>

            <Row className="justify-content-md-center">
                <Col xs={12} md={6}>
                    <h1>Edit Product</h1>

                    {loadingUpdate && <Loader />}
                    {errorUpdate && <Message variant='danger'>{errorUpdate}</Message>}
                    {errorUpload && <Message variant='danger'>{errorUpload}</Message>}

                    {loading ? (
                        <Loader />
                    ) : error ? (
                        <Message variant='danger'>{error}</Message>
                    ) : (
                        <Form onSubmit={submitHandler}>
                            <Form.Group controlId='name' className='mb-3'>
                                <Form.Label>Name</Form.Label>
                                <Form.Control type='text' placeholder='Enter name' value={name} onChange={(e) => setName(e.target.value)} />
                            </Form.Group>

                            <Form.Group controlId='price' className='mb-3'>
                                <Form.Label>Price</Form.Label>
                                <Form.Control type='number' placeholder='Enter price' value={price} onChange={(e) => setPrice(e.target.value)} />
                            </Form.Group>

                            {/* IMAGE UPLOAD SECTION */}
                            <Form.Group className='mb-3'>
                                <Form.Label>Image</Form.Label>
                                <Form.Control type='text' placeholder='Enter image url' value={image || ''} onChange={(e) => setImage(e.target.value)} className='mb-2' />
                                <Form.Control type='file' label='Choose File' onChange={uploadFileHandler} />
                                {loadingUpload && <Loader />}
                            </Form.Group>

                            <Form.Group controlId='brand' className='mb-3'>
                                <Form.Label>Brand</Form.Label>
                                <Form.Control type='text' placeholder='Enter brand' value={brand} onChange={(e) => setBrand(e.target.value)} />
                            </Form.Group>

                            <Form.Group controlId='countinstock' className='mb-3'>
                                <Form.Label>Stock</Form.Label>
                                <Form.Control type='number' placeholder='Enter stock' value={countInStock} onChange={(e) => setCountInStock(e.target.value)} />
                            </Form.Group>

                            <Form.Group controlId='category' className='mb-3'>
                                <Form.Label>Category</Form.Label>
                                <Form.Control type='text' placeholder='Enter category' value={category} onChange={(e) => setCategory(e.target.value)} />
                            </Form.Group>

                            <Form.Group controlId='description' className='mb-3'>
                                <Form.Label>Description</Form.Label>
                                <Form.Control as="textarea" rows={4} placeholder='Enter description' value={description} onChange={(e) => setDescription(e.target.value)} />
                            </Form.Group>

                            <Button type='submit' variant='primary' className='mt-3 w-100'>
                                Update
                            </Button>
                        </Form>
                    )}
                </Col>
            </Row>
        </Container>
    );
}

export default ProductEditScreen;