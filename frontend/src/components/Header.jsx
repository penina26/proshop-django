import { useDispatch, useSelector } from 'react-redux'
import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShoppingCart, faUser } from '@fortawesome/free-solid-svg-icons'
import SearchBox from './SearchBox';

// Import the logout action from your user slice
import { logout } from '../slices/userSlice'

function Header() {
    const dispatch = useDispatch()

    // Pull the user state from the Redux store
    const userState = useSelector((state) => state.user)
    const { userInfo } = userState

    // Handle the logout click
    const logoutHandler = () => {
        dispatch(logout())
    }

    return (
        <header>
            <Navbar expand="lg" variant="dark" className="bg-dark" collapseOnSelect>
                <Container>
                    <LinkContainer to='/'>
                        <Navbar.Brand>ProShop</Navbar.Brand>
                    </LinkContainer>

                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <SearchBox />
                        <Nav className="ms-auto">
                            <LinkContainer to='/cart'>
                                <Nav.Link>
                                    <FontAwesomeIcon icon={faShoppingCart} /> Cart
                                </Nav.Link>
                            </LinkContainer>

                            {/* CONDITIONAL RENDERING: Show dropdown if logged in, else show Login link */}
                            {userInfo ? (
                                <NavDropdown title={userInfo.name} id='username'>
                                    <LinkContainer to='/profile'>
                                        <NavDropdown.Item>Profile</NavDropdown.Item>
                                    </LinkContainer>

                                    <NavDropdown.Item onClick={logoutHandler}>
                                        Logout
                                    </NavDropdown.Item>
                                </NavDropdown>
                            ) : (
                                <LinkContainer to='/login'>
                                    <Nav.Link>
                                        <FontAwesomeIcon icon={faUser} /> Login
                                    </Nav.Link>
                                </LinkContainer>
                            )}

                            {/* ADMIN MENU */}
                            {userInfo && userInfo.isAdmin && (
                                <NavDropdown title='Admin' id='adminmenu'>
                                    <LinkContainer to='/admin/productlist'>
                                        <NavDropdown.Item>Products</NavDropdown.Item>
                                    </LinkContainer>

                                    <LinkContainer to='/admin/orderlist'>
                                        <NavDropdown.Item>Orders</NavDropdown.Item>
                                    </LinkContainer>

                                    {/* NEW: Users Link */}
                                    <LinkContainer to='/admin/userlist'>
                                        <NavDropdown.Item>Users</NavDropdown.Item>
                                    </LinkContainer>
                                </NavDropdown>
                            )}

                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </header>
    )
}

export default Header