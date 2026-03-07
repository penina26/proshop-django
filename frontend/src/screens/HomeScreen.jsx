import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col } from 'react-bootstrap'
import Product from '../components/Product'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { fetchProducts } from '../slices/productSlice'

function HomeScreen() {
    const dispatch = useDispatch()

    // Select the data from the store (using the name 'productList' from store.js)
    const productList = useSelector((state) => state.productList)
    const { products, loading, error } = productList

    useEffect(() => {
        // 2. Dispatch the action to trigger the API call in our slice
        dispatch(fetchProducts())
    }, [dispatch])

    return (
        <div>
            <h1>Latest Products</h1>

            {/* Handle the different states: Loading, Error, or Success */}
            {loading ? (
                <Loader />
            ) : error ? (
                <Message variant={danger} style={{ color: 'red' }}>{error}</Message>
            ) : (
                <Row>
                    {products.map((product) => (
                        <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                            <Product product={product} />
                        </Col>
                    ))}
                </Row>
            )}
        </div>
    )
}

export default HomeScreen