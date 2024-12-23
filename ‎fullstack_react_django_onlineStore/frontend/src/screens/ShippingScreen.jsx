import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Form, Button } from "react-bootstrap";
import FormContainer from "../components/FormContainer";
import { saveShippingAdress } from '../actions/cartActions'
import CheckoutSteps from '../components/CheckoutSteps'

const ShippingScreen = () => {

    const cart = useSelector(state => state.cart);
    const { shippingAdress } = cart

    const dispatch = useDispatch();
    const history = useNavigate();

    const [adress, setAdress] = useState(shippingAdress.adress);
    const [city, setCity] = useState(shippingAdress.city);
    const [postalCode, setPostalCode] = useState(shippingAdress.postalCode);
    const [country, setCountry] = useState(shippingAdress.country);

    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(saveShippingAdress({ adress, city, postalCode, country }))
        history('/payment')
    }

  return (
    <FormContainer>

      <CheckoutSteps step1 step2/>

        <h1>Shipping</h1>

        <Form onSubmit={submitHandler}>

        <Form.Group controlId="adress">
          <Form.Label>Address</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="Enter Address"
            value={adress ? adress : ''}
            onChange={(e) => setAdress(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId="city">
          <Form.Label>City</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="Enter City"
            value={city ? city : ''}
            onChange={(e) => setCity(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId="postalCode">
          <Form.Label>Postal Code</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="Enter Postal Code"
            value={postalCode ? postalCode : ''}
            onChange={(e) => setPostalCode(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId="country">
          <Form.Label>Country</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="Enter Country"
            value={country ? country : ''}
            onChange={(e) => setCountry(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Button type="submit" variant="primary">
            Continue
        </Button>

        </Form>
    </FormContainer>
  )
}

export default ShippingScreen