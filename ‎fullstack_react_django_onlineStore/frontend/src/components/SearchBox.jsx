import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";

const SearchBox = () => {
  const [keyword, setKeyword] = useState("");

  let history = useNavigate();
  let location = useLocation();

  const submitHandler = (e) => {
    e.preventDefault()
    if (keyword) {
        history(`/?keyword=${keyword}&page=1`)
    } else {
        // history(history(location.pathname))
        history(history(history.location.pathname))
    }
}

  return (
    <Form onSubmit={submitHandler}>
      <Form.Control
        onChange={(e) => setKeyword(e.target.value)}
        className="mr-sm-2 ml-2sm-5"
        type="text"
        name="q"
      ></Form.Control>

      <Button type="submit" variant="outline-success" className="p-2">
        Submit
      </Button>
    </Form>
  );
};

export default SearchBox;
