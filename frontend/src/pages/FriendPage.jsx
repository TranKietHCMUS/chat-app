import {Col, Stack, Form, Button, Row, Alert} from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';
import { useState, useContext } from 'react';

export default function FriendPage() {
    let [isButtonHover, setIsButttonHover] = useState(false);
    let buttonColor = "pink";
    let cl = "black";
    if (isButtonHover) {
        buttonColor = "lightpink";
        cl = "white";
    }

    const {findFriend, updateFriendInfo, friendInfo, isFriendLoading, findFriendError} = useContext(AuthContext)

    return (
        <Form onSubmit={findFriend}>
            <Row style={{justifyContent:"center", paddingTop:"10%"}}>
                <Col xs={4}>
                    <Stack gap={3}>
                        <h3 style={{color:"pink"}}>Enter username of your friend</h3>
                        <Form.Control type="text" placeholder="Username1"
                                    onChange={(e) => updateFriendInfo({...friendInfo, username1: e.target.value})}
                        ></Form.Control>
                        <Form.Control type="text" placeholder="Username2"
                                    onChange={(e) => updateFriendInfo({...friendInfo, username2: e.target.value})}
                        ></Form.Control>
                        <Button variant="primary" type="submit" 
                            style={{backgroundColor: buttonColor, border: buttonColor, color: cl, fontWeight: "bold"}}
                            onPointerEnter={() => setIsButttonHover(true)}
                            onPointerLeave={() => setIsButttonHover(false)}
                        >{isFriendLoading ? "Finding your friend" : "Find"}</Button>
                        {findFriendError?.error && (
                            <Alert variant='danger'>
                            <p>{findFriendError?.message}</p>
                            </Alert>
                        )}
                    </Stack>
                </Col>
            </Row>
        </Form>
    );
}