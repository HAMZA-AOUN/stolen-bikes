import React from "react";

const Pagination = ({
  totalBikes,
  bikesPerPage,
  currentPage,
  onPageChange,
  searchValue,
  stolenness,
}) => {
  const totalPages = Math.ceil(totalBikes / bikesPerPage);
  const pageNumbers = [];

  for (let i = 1; i <= totalPages; i++) {
    if (
      i <= 3 ||
      (i === totalPages && searchValue === "" && stolenness !== "proximity") ||
      (i >= currentPage - 1 && i <= currentPage + 1)
    ) {
      pageNumbers.push(i);
    } else if (i === currentPage - 2 || i === currentPage + 2) {
      pageNumbers.push("...");
    }
  }

  return (
    <div>
      {pageNumbers.map((number, index) => (
        <button
          key={index}
          onClick={() => typeof number === "number" && onPageChange(number)}
          disabled={number === "..." || number === currentPage}
          className={`${
            number === currentPage ? "bg-blue-500 " : ""
          } m-2 md:mx-4 py-1 px-3 bg-blue-300 rounded-sm outline-none `}
        >
          {number}
        </button>
      ))}
    </div>
  );
};

export default Pagination;
