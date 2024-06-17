import React, { useState, useEffect } from "react";
import { fetchData, fetchDataTotalLength } from "../lib/data";
import Pagination from "../components/Pagination";
import BikeCard from "../components/BikeCard";
import { BikesPageSkeleton } from "../components/Skeleton";

const BikesPage = () => {
  const [bikes, setBikes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [totalBikes, setTotalBikes] = useState(0);
  const [totalBikesForPagination, setTotalBikesForPagination] =
    useState(totalBikes);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchValue, setSearchValue] = useState("");

  const bikesPerPage = 10;

  const handlePageChange = (number) => {
    setCurrentPage(number);
  };

  useEffect(() => {
    const fetchDataAsync = async () => {
      setLoading(true);
      try {
        const bikes = await fetchData(currentPage, searchQuery);
        setBikes(bikes);
        bikes.length < 10
          ? setTotalBikesForPagination(0)
          : setTotalBikesForPagination(totalBikes);

        if (bikes.length === 0) {
          setTotalBikesForPagination(currentPage * bikesPerPage);
        }
        setLoading(false);
      } catch (error) {
        setError(error);
      }
    };
    fetchDataAsync();
  }, [currentPage, searchQuery, refresh]);

  useEffect(() => {
    const fetchDataTotalLengthAsync = async () => {
      try {
        setLoading(true);
        const length = await fetchDataTotalLength();
        setTotalBikes(length);
        setTotalBikesForPagination(length);
        setLoading(false);
      } catch (error) {
        setError(error);
      }
    };
    fetchDataTotalLengthAsync();
  }, []);

  useEffect(() => {
    if (searchValue.trim() === "") {
      setCurrentPage(1);
      setSearchQuery("");
    }
  }, [searchValue]);

  if (loading) return <BikesPageSkeleton />;
  else if (error)
    return (
      <div className="flex flex-col md:flex-row w-full h-screen items-center justify-center gap-2 md:gap-8 px-4">
        {" "}
        <p className="  text-xl sm:text-2xl lg:text-3xl text-red-500 font-bold">
          faild to fetch data ! ... please try again
        </p>
        <button
          className="  sm:text-xl lg:text-2xl hover:text-gray-500 font-bold text-gray-400"
          onClick={() => setRefresh(!refresh)}
        >
          try again
        </button>
      </div>
    );

  return (
    <div className="flex flex-col items-center justify-between gap-10 mt-10 m-1  sm:m-20 lg:mx-40">
      <h1 className="flex  w-full text-xl md:text-2xl font-bold text-blue-400">
        Total Bikes number:{" "}
        <span className="text-blue-600">&nbsp; {totalBikes} </span>
      </h1>
      <div className="flex w-full gap-4  items-center justify-between ">
        <input
          type="text"
          placeholder="Search bikes by title..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="peer w-full block  rounded-md  border-gray-200 border-2 py-[9px] pl-10 text-sm outline-2 outline-blue-400 placeholder:text-gray-500"
        />
        <button
          onClick={() => {
            setCurrentPage(1);
            setSearchQuery(searchValue);
          }}
          className="px-4 md:px-8 p-2  bg-blue-400 text-white text-xl rounded-sm outline-none "
        >
          search
        </button>
      </div>{" "}
      <div className="flex flex-col w-full items-center justify-between ">
        {bikes.length > 0 ? (
          bikes.map((bike, index) => (
            <BikeCard key={index} bike={bike} index={bike.id} />
          ))
        ) : (
          <p className="flex w-full items-center justify-center text-2xl my-4 text-gray-400 font-bold">
            NO MORE BIKES FOUND . . .
          </p>
        )}
      </div>{" "}
      {
        <div className="flex flex-row justify-center items-center gap-2">
          <Pagination
            totalBikes={totalBikesForPagination}
            bikesPerPage={bikesPerPage}
            currentPage={currentPage}
            onPageChange={handlePageChange}
            searchValue={searchValue}
          />
        </div>
      }
    </div>
  );
};

export default BikesPage;
