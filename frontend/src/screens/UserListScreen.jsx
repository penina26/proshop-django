import React, { useEffect } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

import Loader from '../components/Loader';
import Message from '../components/Message';
import { fetchUsers, deleteUser, resetDeleteSuccess } from '../slices/userSlice';

function UserListScreen() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const userState = useSelector((state) => state.user);
    const { users, loadingUsers, errorUsers, userInfo, successDelete } = userState;

    useEffect(() => {
        if (userInfo && userInfo.isAdmin) {
            if (successDelete) {
                dispatch(resetDeleteSuccess());
                dispatch(fetchUsers());
            } else {
                dispatch(fetchUsers());
            }
        } else {
            navigate('/login');
        }
    }, [dispatch, navigate, userInfo, successDelete]);

    const deleteHandler = (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            dispatch(deleteUser(id));
        }
    };

    return (
        <>
            <h1>Users</h1>
            {loadingUsers ? (
                <Loader />
            ) : errorUsers ? (
                <Message variant='danger'>{errorUsers}</Message>
            ) : (
                <Table striped bordered hover responsive className='table-sm'>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>NAME</th>
                            <th>EMAIL</th>
                            <th>ADMIN</th>
                            <th>ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users && users.map((user) => (
                            <tr key={user._id}>
                                <td>{user._id}</td>
                                <td>{user.name}</td>
                                <td><a href={`mailto:${user.email}`}>{user.email}</a></td>
                                <td>
                                    {user.isAdmin ? (
                                        <FontAwesomeIcon icon={faCheck} style={{ color: 'green' }} />
                                    ) : (
                                        <FontAwesomeIcon icon={faTimes} style={{ color: 'red' }} />
                                    )}
                                </td>
                                <td>
                                    <LinkContainer to={`/admin/user/${user._id}/edit`}>
                                        <Button variant='light' className='btn-sm'>
                                            <FontAwesomeIcon icon={faEdit} />
                                        </Button>
                                    </LinkContainer>
                                    <Button variant='danger' className='btn-sm ms-2' onClick={() => deleteHandler(user._id)}>
                                        <FontAwesomeIcon icon={faTrash} />
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </>
    );
}

export default UserListScreen;