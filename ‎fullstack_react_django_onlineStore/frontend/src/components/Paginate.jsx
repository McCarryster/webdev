import React from "react";
import { Pagination } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

const Paginate = ({ pages, page, keyword = "", isAdmin = false }) => {
  console.log("KEYWORD:", keyword);

  if (keyword) {
    keyword = keyword.split("keyword=")[1].split("&")[0];
  }

  return (
    pages > 1 && (
      <Pagination>
        {[...Array(pages).keys()].map((x) => (
          <LinkContainer
            key={x + 1}
            to={
              !isAdmin 
                ? { search: `keyword=${keyword}&page=${x + 1}` }
                : {search: `/admin/productlist/?keyword=${keyword}&page=${x + 1}`} }>
            <Pagination.Item active={x + 1 === page}>{x + 1}</Pagination.Item>
          </LinkContainer>

        //   <LinkContainer key={x + 1} to={!isAdmin ?{ search: `keyword=${keyword}&page=${x + 1}` : `/admin/productlist`}}>
        //     <Pagination.Item active={x + 1 === page}>{x + 1}</Pagination.Item>
        //   </LinkContainer>
        ))}
      </Pagination>
    )
  );
};

export default Paginate;
