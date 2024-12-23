import React, { useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import Product from "../components/Product";
import { useDispatch, useSelector } from "react-redux";
import { listProducts } from "../actions/productActions";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Paginate from "../components/Paginate";
import ProductCarousel from "../components/ProductCarousel";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";

const HomeScreen = () => {
  const location = useLocation();
  const history = useNavigate();
  const dispatch = useDispatch();

  let keyword = location.search || "";

  const productList = useSelector((state) => state.productList);
  const { error, loading, products, page, pages } = productList;

  // console.log(keyword); // "bar"

  // const [searchParams, setSearchParams] = useSearchParams()
  // const keyword = searchParams.get('search')

  // const postQuery = searchParams.get('post') || ''

  useEffect(() => {
    dispatch(listProducts(keyword));
  }, [dispatch, keyword]);

  return (
    <div>
      {!keyword && <ProductCarousel />}

      <h1>Latest Products</h1>

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <div>
          <Row>
            {products.map((product) => (
              <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                <Product product={product} />
              </Col>
            ))}
          </Row>

          <Paginate page={page} pages={pages} keyword={keyword} />
        </div>
      )}
    </div>
  );
};

export default HomeScreen;
