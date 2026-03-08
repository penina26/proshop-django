import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col } from 'react-bootstrap'
import { useLocation } from 'react-router-dom';
import Product from '../components/Product'
import Loader from '../components/Loader'
import Message from '../components/Message'
import Paginate from '../components/Paginate';
import { fetchProducts } from '../slices/productSlice'
import ProductCarousel from '../components/ProductCarousel';

function HomeScreen() {
    const dispatch = useDispatch()

    const location = useLocation();
    let keyword = location.search;

    // Select the data from the store (using the name 'productList' from store.js)
    const productList = useSelector((state) => state.productList)
    const { products, loading, error, page, pages } = productList;

    useEffect(() => {
        // Dispatch the action to trigger the API call in our slice
        dispatch(fetchProducts(keyword))
    }, [dispatch, keyword])

    return (
        <div>
            {/* Show Carousel only if there is NO search keyword */}
            {!keyword && <ProductCarousel />}

            <h1>Latest Products</h1>
            {/* Handle the different states: Loading, Error, or Success */}
            {loading ? (
                <Loader />
            ) : error ? (
                <Message variant='danger' style={{ color: 'red' }}>{error}</Message>
            ) : (
                <Row>
                    {products.map((product) => (
                        <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                            <Product product={product} />
                        </Col>
                    ))}
                </Row>
            )}

            <Paginate page={page} pages={pages} keyword={keyword} />
        </div>
    )
}

export default HomeScreen