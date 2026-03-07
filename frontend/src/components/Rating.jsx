import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar, faStarHalfAlt } from '@fortawesome/free-solid-svg-icons';
import { faStar as farStar } from '@fortawesome/free-regular-svg-icons';

function Rating({ value, text, color }) {
    return (
        <div className='rating'>
            {[1, 2, 3, 4, 5].map((index) => (
                <span key={index}>
                    <FontAwesomeIcon
                        style={{ color }}
                        icon={
                            value >= index
                                ? faStar
                                : value >= index - 0.5
                                    ? faStarHalfAlt
                                    : farStar
                        }
                    />
                </span>
            ))}
            <span className="ms-2">{text && text}</span>
        </div>
    )
}

export default Rating
