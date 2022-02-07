import React from "react";
import { Navbar, Container, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { setKey } from "../store/appSlice";
import { RootState } from "../store/store";
import { deleteKeyFromLocalStorage } from "../utils";
import { barApi, DISCOUNT_TAG, ORDER_TAG } from "../store/services/bar";

export const NavBar = () => {

  const key = useSelector((state: RootState) => state.app.key);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(setKey(""));
    dispatch(barApi.util.invalidateTags([DISCOUNT_TAG, ORDER_TAG]));
    deleteKeyFromLocalStorage()
  }

  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand href="#home">SOSEMTCC Bar Dashboard</Navbar.Brand>
        {key && (
          <Navbar.Collapse className="justify-content-end">
            <Navbar.Text>
              <Button variant={"primary"} onClick={handleLogout}>
                Logout
              </Button>
            </Navbar.Text>
          </Navbar.Collapse>
        )}
      </Container>
    </Navbar>
  );
};
