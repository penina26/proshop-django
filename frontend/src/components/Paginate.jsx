import React from 'react';
import { Pagination } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function Paginate({ pages, page, keyword = '', isAdmin = false }) {
    // Clean up the keyword string so we can safely attach the page numbers to it
    if (keyword) {
        keyword = keyword.split('?keyword=')[1].split('&')[0];
    }

    // Only show the pagination if there is more than 1 page
    return (
        pages > 1 && (
            <Pagination className='justify-content-center mt-4'>
                {[...Array(pages).keys()].map((x) => (

                    <li key={x + 1} className={`page-item ${x + 1 === page ? 'active' : ''}`}>
                        <Link
                            className="page-link"
                            to={!isAdmin ? `/?keyword=${keyword}&page=${x + 1}` : `/admin/productlist/?keyword=${keyword}&page=${x + 1}`}
                        >
                            {x + 1}
                        </Link>
                    </li>
                ))}
            </Pagination>
        )
    );
}

export default Paginate;