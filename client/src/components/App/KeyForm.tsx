import React, { useState } from "react";
import { Form, Button, Card, Alert } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { setKey } from "../../store/appSlice";
import { saveKeyToLocalStorage } from "../../utils";

export const KeyForm = () => {
  const dispatch = useDispatch();
  const [key, setKeyValue] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (key) {
      dispatch(setKey(key));
      saveKeyToLocalStorage(key);
    } else {
      setError("Please enter a key");
    }
  };

  return (
    <Card>
      <Card.Header as="h5">Enter Key</Card.Header>
      <Card.Body>
        <Form>
          <Form.Group controlId="formKey">
            <Form.Control
              type="text"
              placeholder="Key"
              onChange={(e) => {
                setError("");
                setKeyValue(e.target.value);
              }}
            />
          </Form.Group>
          <Button variant="primary" type="submit" onClick={handleSubmit}>
            Submit
          </Button>
          {error && <Alert variant={"danger"}>{error}</Alert>}
        </Form>
      </Card.Body>
    </Card>
  );
};
