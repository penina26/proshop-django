import { useState, useEffect } from 'react';
import { Form, Button, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { savePaymentMethod } from '../slices/cartSlice';

function PaymentScreen() {
    const cart = useSelector((state) => state.cart);
    const { shippingAddress } = cart;

    const navigate = useNavigate();
    const dispatch = useDispatch();

    // 1. SAFEGUARD: If they somehow got here without a shipping address, send them back!
    useEffect(() => {
        if (!shippingAddress || !shippingAddress.address) {
            navigate('/shipping');
        }
    }, [shippingAddress, navigate]);

    // 2. Default to PayPal (you can add Stripe or M-Pesa logic here later!)
    const [paymentMethod, setPaymentMethod] = useState('PayPal');

    const submitHandler = (e) => {
        e.preventDefault();

        // 3. Dispatch to Redux, then jump to the final Place Order screen
        dispatch(savePaymentMethod(paymentMethod));
        navigate('/placeorder');
    };

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h1>Payment Method</h1>
            <Form onSubmit={submitHandler}>
                <Form.Group>
                    <Form.Label as='legend'>Select Method</Form.Label>
                    <Col>
                        <Form.Check
                            type='radio'
                            label='PayPal or Credit Card'
                            id='paypal'
                            name='paymentMethod'
                            value='PayPal'
                            checked={paymentMethod === 'PayPal'}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                        ></Form.Check>

                        {/* Example of how you would add a second option like Stripe */}
                        {/* <Form.Check
                            type='radio'
                            label='Stripe'
                            id='stripe'
                            name='paymentMethod'
                            value='Stripe'
                            checked={paymentMethod === 'Stripe'}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                        ></Form.Check> 
                        */}
                    </Col>
                </Form.Group>

                <Button type='submit' variant='primary' className='mt-3'>
                    Continue
                </Button>
            </Form>
        </div>
    );
}

export default PaymentScreen;