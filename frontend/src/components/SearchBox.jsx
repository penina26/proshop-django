import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';

function SearchBox() {
    const [keyword, setKeyword] = useState('');

    // We need navigate to change the URL, and location to know where we currently are
    const navigate = useNavigate();
    const location = useLocation();

    const submitHandler = (e) => {
        e.preventDefault();

        // If the user typed something, append it to the URL as a query parameter
        if (keyword) {
            navigate(`/?keyword=${keyword}`);
        } else {
            // If they submitted an empty box, just keep them on their current page
            navigate(location.pathname);
        }
    };

    return (
        <Form onSubmit={submitHandler} className='d-flex'>
            <Form.Control
                type='text'
                name='q'
                onChange={(e) => setKeyword(e.target.value)}
                className='mr-sm-2 ml-sm-5'
                placeholder='Search Products...'
            ></Form.Control>

            <Button type='submit' variant='outline-success' className='p-2 ms-2'>
                Submit
            </Button>
        </Form>
    );
}

export default SearchBox;