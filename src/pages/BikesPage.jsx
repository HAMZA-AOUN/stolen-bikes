import React, { useState, useEffect, useCallback } from "react";
import { fetchData, fetchDataTotalLength } from "../lib/data";
import Pagination from "../components/Pagination";
import BikeCard from "../components/BikeCard";
import { BikesPageSkeleton } from "../components/Skeleton";
import axios from "axios";

const BikesPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [totalBikes, setTotalBikes] = useState(0);
  const [totalBikesForPagination, setTotalBikesForPagination] =
    useState(totalBikes);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [stolenness, setStolenness] = useState("");
  const [proximityLength, setProximityLength] = useState("");
  const [stolenLength, setStolenLength] = useState("");
  const [nonLength, setNonLength] = useState("");
  const [activeButton, setActiveButton] = useState(null);
  const bikesPerPage = 10;

  // for filter bikes by date range ______________________________________________

  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [filteredBikes, setFilteredBikes] = useState([]);
  const [showAllBikes, setShowAllBikes] = useState(false);
  const [isFiltered, setIsFiltered] = useState(false);
  const fetchBikes = useCallback(async (page) => {
    try {
      const response = await axios.get("https://bikeindex.org/api/v3/search", {
        params: {
          per_page: 100,
          page: page,
        },
      });
      return response.data.bikes;
    } catch (error) {
      throw error;
    }
  }, []);

  const loadBikes = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      let newBikes = [];
      const requests = [];

      for (let i = 1; i <= 110; i++) {
        requests.push(fetchBikes(i));
      }

      const results = await Promise.all(requests);

      results.forEach((result) => {
        newBikes = [...newBikes, ...result];
      });
      return newBikes;
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [fetchBikes]);

  const handleFilter = async () => {
    if (!dateRange.start || !dateRange.end) {
      alert("Please select both start and end dates.");
      return;
    }

    const startDate = new Date(dateRange.start).getTime();
    const endDate = new Date(dateRange.end).getTime();
    let date = new Date().toLocaleDateString();
    let curerentDate = new Date(date).getTime();

    if (startDate > curerentDate) {
      alert("Start date should be bigger than current date.");
      return;
    }
    if (startDate > endDate) {
      alert("Start date should be less than or equal to end date.");
      return;
    }

    setLoading(true);

    try {
      setShowAllBikes(false);
      setActiveButton(null);
      setIsFiltered(true);

      const allBikes = await loadBikes();
      const filtered = allBikes.filter((bike) => {
        const bikeDate = new Date(bike.date_stolen * 1000).getTime();
        return bikeDate >= startDate && bikeDate <= endDate;
      });
      setFilteredBikes(filtered);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  //___________________________________________________________________________________________________

  const handlePageChange = (number) => {
    setCurrentPage(number);
  };

  useEffect(() => {
    const fetchDataAsync = async () => {
      setLoading(true);
      try {
        const bikes = await fetchData(currentPage, searchQuery, stolenness);
        setFilteredBikes(bikes);
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
  }, [currentPage, searchQuery, refresh, totalBikes, stolenness]);

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

  useEffect(() => {
    const fetchProximity = async () => {
      try {
        const proximityLength = await fetch(
          "https://bikeindex.org/api/v3/search/count?location=Munich&distance=100&stolenness=proximity"
        ).then((res) => res.json());
        setProximityLength(proximityLength.proximity);
        setStolenLength(proximityLength.stolen);
        setNonLength(proximityLength.non);
      } catch (error) {
        throw error;
      }
    };
    setShowAllBikes(false);
    fetchProximity();
  }, []);

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
      {isFiltered && (
        <h1 className="flex  w-full text-xl md:text-2xl font-bold text-blue-400">
          Number of filtered bikes:{" "}
          <span className="text-blue-600">&nbsp; {filteredBikes.length} </span>
        </h1>
      )}
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
            if (searchValue !== "") {
              setActiveButton(null);
              setIsFiltered(false);
              setDateRange({ start: "", end: "" });
              setShowAllBikes(false);
            }
            setCurrentPage(1);
            setSearchQuery(searchValue);
          }}
          className="px-4 md:px-8 p-2  bg-blue-400 text-white text-xl rounded-sm outline-none "
        >
          search
        </button>
      </div>{" "}
      <div className="flex flex-col md:flex-row items-center justify-between w-full">
        <button
          className={`${
            activeButton === 1 ? "bg-gray-700 text-white " : "hover:bg-gray-200"
          } text-sm  outline-none border-gray-600 border-[1px] border-b-0 md:border-r-0 md:border-b-[1px]  w-full h-12`}
          onClick={() => {
            setCurrentPage(1);
            setIsFiltered(false);
            setActiveButton(1);
            setDateRange({ start: "", end: "" });
            setStolenness("proximity");
          }}
        >
          Stolen within 100 miles of Munich ({proximityLength})
        </button>
        <button
          className={` ${
            activeButton === 2 ? "bg-gray-700 text-white " : "hover:bg-gray-200"
          } text-sm outline-none border-gray-600 border-[1px] border-b-0 md:border-r-0 md:border-b-[1px] w-full h-12`}
          onClick={() => {
            setCurrentPage(1);
            setIsFiltered(false);
            setActiveButton(2);
            setDateRange({ start: "", end: "" });
            setStolenness("stolen");
          }}
        >
          Stolen anywhere {stolenLength > 10000 ? "(10k+)" : stolenLength}
        </button>
        <button
          className={` ${
            activeButton === 3 ? "bg-gray-700 text-white " : "hover:bg-gray-200"
          } text-sm  outline-none border-gray-600 border-[1px] border-b-0 md:border-r-0 md:border-b-[1px] w-full h-12 `}
          onClick={() => {
            setCurrentPage(1);
            setIsFiltered(false);
            setActiveButton(3);
            setDateRange({ start: "", end: "" });
            setStolenness("non");
          }}
        >
          Not marked stolen {nonLength > 10000 ? "(10k+)" : nonLength}
        </button>
        <button
          className={` ${
            activeButton === 4
              ? "bg-gray-700 text-white  "
              : "hover:bg-gray-200 "
          } text-sm outline-none border-gray-600 border-[1px] h-12 w-full p-2`}
          onClick={() => {
            setCurrentPage(1);
            setActiveButton(4);
            setIsFiltered(false);
            setDateRange({ start: "", end: "" });
            setStolenness("all");
          }}
        >
          All
        </button>
      </div>
      <div className="flex flex-col w-full gap-4 md:gap-0 md:flex-row justify-between items-start md:items-center">
        <label className="text-lg font-semibold text-gray-500 ">
          Start Date:
          <input
            className="outline-none py-1 px-4 bg-gray-200 rounded-md m-2 "
            type="date"
            value={dateRange.start}
            onChange={(e) =>
              setDateRange({ ...dateRange, start: e.target.value })
            }
          />
        </label>
        <label className="text-lg font-semibold text-gray-500">
          End Date:
          <input
            className="outline-none py-1 px-4 bg-gray-200 rounded-md m-2 "
            type="date"
            value={dateRange.end}
            onChange={(e) =>
              setDateRange({ ...dateRange, end: e.target.value })
            }
          />
        </label>
        <button
          className="py-1 text-white text-lg px-6 bg-blue-400 outline-none rounded-sm font-semibold cursor-pointer"
          onClick={handleFilter}
        >
          Filter
        </button>
      </div>
      <div className="flex flex-col w-full items-center justify-between ">
        {filteredBikes?.length > 0 ? (
          (showAllBikes ? filteredBikes : filteredBikes.slice(0, 10)).map(
            (bike, index) => (
              <BikeCard key={index} bike={bike} index={bike.id} />
            )
          )
        ) : (
          <p className="flex w-full items-center justify-center text-2xl my-4 text-gray-400 font-bold">
            NO BIKES FOUND . . .
          </p>
        )}
        {!showAllBikes && filteredBikes.length > 10 && (
          <button
            className=" p-4 mt-2 mb-10 px-8 bg-gray-200 outline-none border-gray-500 rounded-lg shadow-md text-xl font-bold text-gray-500"
            onClick={() => setShowAllBikes(true)}
          >
            See All
          </button>
        )}
      </div>{" "}
      {!isFiltered && (
        <div className="flex flex-row justify-center items-center gap-2">
          <Pagination
            totalBikes={totalBikesForPagination}
            bikesPerPage={bikesPerPage}
            currentPage={currentPage}
            onPageChange={handlePageChange}
            searchValue={searchValue}
            stolenness={stolenness}
          />
        </div>
      )}
    </div>
  );
};

export default BikesPage;
