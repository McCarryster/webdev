import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { Button, Row, Col, ListGroup, Image, Card } from "react-bootstrap";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { getOrderDetails, payOrder, deliverOrder } from "../actions/orderActions";
import { ORDER_PAY_RESET, ORDER_DELIVER_RESET } from "../constants/orderConstants";

// CLIENT ID - ARsKkK3_OnQVuzVGSA_-PTuO18wz2ltocYEYcEKdDD0bzvIkzkTAJsFirUfmGuTwdaxNNCQ2rCWW89eI

const OrderScreen = () => {
  const dispatch = useDispatch();
    const history = useNavigate();
  const { id } = useParams();
  const [sdkReady, setSdkReady] = useState(false);

  const orderDetails = useSelector((state) => state.orderDetails);
  const { order, error, loading } = orderDetails;

  const orderPay = useSelector((state) => state.orderPay);
  const { loading: loadingPay, success: successPay } = orderPay;

  const orderDeliver = useSelector((state) => state.orderDeliver);
  const { loading: loadingDeliver, success: successDeliver } = orderDeliver;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const addPayPalScript = () => {
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src =
      "https://www.paypal.com/sdk/js?client-id=ARsKkK3_OnQVuzVGSA_-PTuO18wz2ltocYEYcEKdDD0bzvIkzkTAJsFirUfmGuTwdaxNNCQ2rCWW89eI";
    script.async = true;
    script.onload = () => {
      setSdkReady(true);
    };
    document.body.appendChild(script);
  };

  useEffect(() => {

    if(!userInfo){
      history('/login')
    }

    if (!order || successPay || order._id !== Number(id) || successDeliver) {
      dispatch({ type: ORDER_PAY_RESET });
      dispatch({ type: ORDER_DELIVER_RESET });
      dispatch(getOrderDetails(id));
    } else if (!order.isPaid) {
      if (!window.paypal) {
        addPayPalScript();
      } else {
        setSdkReady(true);
      }
    }
    console.log('PAID!!!!!')
  }, [dispatch, order, id, successPay, successDeliver]);

  const successPaymentHandler = (paymentResult) => {
    dispatch(payOrder(id, paymentResult));
  };

  const deliverHandler = () => {
    dispatch(deliverOrder(order))
  }

  if (!loading && !error) {
    order.itemsPrice = order.orderItems
      .reduce((acc, item) => acc + item.price * item.qty, 0)
      .toFixed(2);
  }

  return loading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{error}</Message>
  ) : (
    <div>
      <h1>Order: {order._id}</h1>

      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Shipping</h2>

              <p>
                <strong>Name: </strong> {order.user.name}
              </p>
              <p>
                <strong>Email: </strong>{" "}
                <a href={`mailto:${order.user.email}`}>{order.user.email}</a>
              </p>

              <p>
                <strong>Shipping Address: </strong>
                {order.shippingAdress.adress}, {order.shippingAdress.city}
                {"      "}
                {order.shippingAdress.postalCode},
                {"      "}
                {order.shippingAdress.country}
              </p>

              {order.isDelivered ? (
                <Message variant="success">
                  Delivered on: {order.deliveredAt}
                </Message>
              ) : (
                <Message variant="warning">Waiting for Delivering</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Payment Method</h2>

              <p>
                <strong>Method: </strong>
                {order.paymentMethod}
              </p>

              {order.isPaid ? (
                <Message variant='success'>Paid on {order.paidAt}</Message>
              ) : (
                <Message variant="warning">Waiting for Payment</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Order Items</h2>
              {order.orderItems.length === 0 ? (
                <Message variant="info">Order is empty</Message>
              ) : (
                <ListGroup variant="flush">
                  {order.orderItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={1}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            fluid
                            rounded
                          />
                        </Col>

                        <Col>
                          <Link to={`/product/${item.product}`}>
                            {item.name}
                          </Link>
                        </Col>

                        <Col md={4}>
                          {item.qty} X ${item.price} = $
                          {(item.qty * item.price).toFixed(2)}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>

        <Col md={4}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Items:</Col>
                  <Col>${order.itemsPrice}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Shipping:</Col>
                  <Col>${order.shippingPrice}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Tax:</Col>
                  <Col>${order.taxPrice}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Total:</Col>
                  <Col>${order.totalPrice}</Col>
                </Row>
              </ListGroup.Item>

              {!order.isPaid && (
                <ListGroup.Item>
                  {loadingPay && <Loader />}

                  {!sdkReady ? (
                    <Loader />
                  ) : (
                    <PayPalScriptProvider
                      options={{
                        "client-id":
                          "ARsKkK3_OnQVuzVGSA_-PTuO18wz2ltocYEYcEKdDD0bzvIkzkTAJsFirUfmGuTwdaxNNCQ2rCWW89eI",
                      }}
                    >
                      {/* <PayPalButtons
                        amount={order.totalPrice}
                        onSuccess={successPaymentHandler}
                      /> */}

                      <PayPalButtons
                        onApprove={successPaymentHandler}
                        createOrder={(data, actions) => {
                          return actions.order.create({
                            purchase_units: [
                              {
                                amount: {
                                  value: String(order.totalPrice) ,
                                },
                              },
                            ],
                          });
                        }}
                      />
                    </PayPalScriptProvider>
                  )}
                </ListGroup.Item>
              )}
            </ListGroup>

          {loadingDeliver && <Loader/> }
            {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
              <ListGroup.Item>
                <Button onClick={deliverHandler} type="button" className="btn-block">
                  Mark As Delivered
                </Button>
              </ListGroup.Item>
            )}

          </Card>
        </Col>
      </Row>

    </div>
  );
};

export default OrderScreen;
