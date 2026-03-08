import React, { useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Table, Button, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Paginate from '../components/Paginate';

import { fetchProducts, deleteProduct, createProduct, productCreateReset } from '../slices/productSlice';

function ProductListScreen() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const location = useLocation();
    let keyword = location.search;

    //  Pull all the new state variables we just made in the slice
    const productState = useSelector((state) => state.productList);
    const {
        products, loading, error,
        loadingDelete, errorDelete, successDelete,
        loadingCreate, errorCreate, successCreate, createdProduct,
        page, pages
    } = productState;

    const userState = useSelector((state) => state.user);
    const { userInfo } = userState;

    useEffect(() => {
        // Clear out the create state so it doesn't immediately redirect us next time we visit the page
        dispatch(productCreateReset());

        if (!userInfo || !userInfo.isAdmin) {
            navigate('/login');
        }

        // If we just created a product, immediately send the user to edit it
        if (successCreate) {
            navigate(`/admin/product/${createdProduct._id}/edit`);
        } else {
            // Otherwise, just fetch the normal list of products. 
            // This also runs again automatically if successDelete changes to true
            // Pass the keyword (which contains the page number) into the fetch
            dispatch(fetchProducts(keyword));
        }
    }, [dispatch, navigate, userInfo, successDelete, successCreate, createdProduct, keyword]);

    //  Dispatch the actual delete action
    const deleteHandler = (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            dispatch(deleteProduct(id));
        }
    };

    //  Dispatch the actual create action
    const createProductHandler = () => {
        dispatch(createProduct());
    };

    return (
        <div>
            <Row className='align-items-center mb-3'>
                <Col>
                    <h1>Products</h1>
                </Col>
                <Col className='text-end'>
                    <Button className='my-3' onClick={createProductHandler}>
                        <FontAwesomeIcon icon={faPlus} /> Create Product
                    </Button>
                </Col>
            </Row>

            {/* Display alerts if creating or deleting fails */}
            {loadingDelete && <Loader />}
            {errorDelete && <Message variant='danger'>{errorDelete}</Message>}

            {loadingCreate && <Loader />}
            {errorCreate && <Message variant='danger'>{errorCreate}</Message>}

            {loading ? (
                <Loader />
            ) : error ? (
                <Message variant='danger'>{error}</Message>
            ) : (
                <Table striped bordered hover responsive className='table-sm'>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>NAME</th>
                            <th>PRICE</th>
                            <th>CATEGORY</th>
                            <th>BRAND</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product) => (
                            <tr key={product._id}>
                                <td>{product._id}</td>
                                <td>{product.name}</td>
                                <td>${product.price}</td>
                                <td>{product.category}</td>
                                <td>{product.brand}</td>
                                <td>
                                    <Button as={Link} to={`/admin/product/${product._id}/edit`} variant='light' className='btn-sm me-2'>
                                        <FontAwesomeIcon icon={faEdit} />
                                    </Button>

                                    <Button variant='danger' className='btn-sm' onClick={() => deleteHandler(product._id)}>
                                        <FontAwesomeIcon icon={faTrash} style={{ color: 'white' }} />
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>

            )}
            <Paginate pages={pages} page={page} isAdmin={true} />
        </div>
    );
}

export default ProductListScreen;