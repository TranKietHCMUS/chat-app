import {Col, Stack, Form, Button, Row, Alert} from 'react-bootstrap'
import { useState } from 'react';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function RegisterPage() {
    let [isButtonHover, setIsButttonHover] = useState(false);
    let buttonColor = "pink";
    let cl = "black";
    if (isButtonHover) {
        buttonColor = "lightpink";
        cl = "white";
    }

    const {registerInfo, updateRegisterInfo, registerUser, registerError, isRegisterLoading} = useContext(AuthContext);
    return (
        <Form onSubmit={registerUser}>
            <Row style={{justifyContent:"center", paddingTop:"5%"}}>
                <Col xs={4}>
                    <Stack gap={3}>
                        <h3 style={{color:"pink"}}>REGISTER</h3>
                        <Form.Control type="email" placeholder="Email"
                            onChange={(e) => {
                                updateRegisterInfo({...registerInfo, email: e.target.value})
                            }}
                        ></Form.Control>
                        <Form.Control type="text" placeholder="Username"
                            onChange={(e) => {
                                updateRegisterInfo({...registerInfo, username: e.target.value})
                            }}
                        ></Form.Control>
                        <Form.Control type="password" placeholder="Password"
                            onChange={(e) => {
                                updateRegisterInfo({...registerInfo, password: e.target.value})
                            }}
                        ></Form.Control>
                        <Form.Control type="text" placeholder="First Name"
                            onChange={(e) => {
                                updateRegisterInfo({...registerInfo, first_name: e.target.value})
                            }}
                        ></Form.Control>
                        <Form.Control type="text" placeholder="Last Name"
                            onChange={(e) => {
                                updateRegisterInfo({...registerInfo, last_name: e.target.value})
                            }}
                        ></Form.Control>
                        <datalist id="gd">
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Others">Others</option>
                        </datalist>
                        <Form.Control type="text" placeholder="Gender" list='gd'
                            onChange={(e) => {
                                updateRegisterInfo({...registerInfo, gender: e.target.value})
                            }}
                        ></Form.Control>
                        <Form.Control type="text" placeholder="Phone Number"
                            onChange={(e) => {
                                updateRegisterInfo({...registerInfo, phone_number: e.target.value})
                            }}
                        ></Form.Control>
                        <Form.Control type="date" placeholder="Birthday"
                            onChange={(e) => {
                                updateRegisterInfo({...registerInfo, birthday: e.target.value})
                            }}
                        ></Form.Control>
                        <Button variant="primary" type="submit" 
                            style={{backgroundColor: buttonColor, border: buttonColor, color:cl, fontWeight: "bold"}}
                            onPointerEnter={() => setIsButttonHover(true)}
                            onPointerLeave={() => setIsButttonHover(false)}
                        >{isRegisterLoading ? "Creating your account" : "REGISTER"}</Button>
                        {registerError?.error && (
                            <Alert variant='danger'>
                            <p>{registerError?.message}</p>
                            </Alert>
                        )}
                    </Stack>
                </Col>
            </Row>
        </Form>
    );
};