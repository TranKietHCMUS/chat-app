import {Col, Stack, Form, Button, Row, Alert} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function LoginPage() {
    let [isButtonHover, setIsButttonHover] = useState(false);
    let buttonColor = "pink";
    let cl = "black";
    if (isButtonHover) {
        buttonColor = "lightpink";
        cl = "white";
    }

    const {loginUser, loginInfo, updateLoginInfo, loginError, isLoginLoading} = useContext(AuthContext);
    return (
        <Form onSubmit={loginUser}>
            <Row style={{justifyContent:"center", paddingTop:"10%"}}>
                <Col xs={4}>
                    <Stack gap={3}>
                        <h3 style={{color:"pink"}}>LOGIN</h3>
                        <Form.Control type="text" placeholder="Username"
                                    onChange={(e) => updateLoginInfo({...loginInfo, username: e.target.value})}
                        ></Form.Control>
                        <Form.Control type="password" placeholder="Password"
                                    onChange={(e) => updateLoginInfo({...loginInfo, password: e.target.value})}
                        ></Form.Control>
                        <Button variant="primary" type="submit" 
                            style={{backgroundColor: buttonColor, border: buttonColor, color: cl, fontWeight: "bold"}}
                            onPointerEnter={() => setIsButttonHover(true)}
                            onPointerLeave={() => setIsButttonHover(false)}
                        >{isLoginLoading ? "Loading your account" : "LOGIN"}</Button>
                        <p>If you don't have an account. Let's <Link to="/register" 
                                className="light-link text-decoration-none"
                                style={{color: "pink"}}
                            >Register</Link></p>
                        {loginError?.error && (
                            <Alert variant='danger'>
                            <p>{loginError?.message}</p>
                            </Alert>
                        )}
                    </Stack>
                </Col>
            </Row>
        </Form>
    );
};