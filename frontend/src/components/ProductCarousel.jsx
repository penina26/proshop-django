import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Carousel, Image } from 'react-bootstrap';
import Loader from './Loader';
import Message from './Message';
import { fetchTopRatedProducts } from '../slices/productSlice';

function ProductCarousel() {
    const dispatch = useDispatch();

    const productState = useSelector((state) => state.productList);
    const { topProducts, loadingTop, errorTop } = productState;

    useEffect(() => {
        dispatch(fetchTopRatedProducts());
    }, [dispatch]);

    return loadingTop ? (
        <Loader />
    ) : errorTop ? (
        <Message variant='danger'>{errorTop}</Message>
    ) : (
        <Carousel pause='hover' className='bg-dark mb-4'>
            {topProducts.map((product) => (
                <Carousel.Item key={product._id}>
                    <Link to={`/product/${product._id}`}>
                        <Image src={product.image} alt={product.name} fluid />
                        <Carousel.Caption className='carousel.caption'>
                            <h4>
                                {product.name} (${product.price})
                            </h4>
                        </Carousel.Caption>
                    </Link>
                </Carousel.Item>
            ))}
        </Carousel>
    );
}

export default ProductCarousel;