import React from "react";

const BikeCard = ({ bike, index }) => {
  const timestamp = bike.date_stolen;
  const date = new Date(Number(timestamp) * 1000);
  const formattedTime = date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <>
      <div
        className={`flex flex-row w-full ${
          index % 2 === 0 ? "bg-[rgb(242,242,242)]" : "bg-white"
        } rounded-md justify-between gap-6 lg:gap-24 py-2 my-8 items-center  shadow-md hover:scale-[1.02] `}
      >
        <div className="flex md:flex-1 items-center justify-center w-[300px] p-2">
          <img
            alt="bike"
            src={bike.large_img || "/Bicycle.png"}
            width={100}
            height={100}
            className="bg-contain max-h-[250px] w-full  "
          />
        </div>
        <div className="flex w-full md:flex-[3] flex-col ">
          <p className="mb-6 text-blue-500 font-extrabold text-lg">
            {bike.title.split(" ").slice(0, 2).join(" ")}{" "}
            <span className="font-normal ">
              {bike.title.split(" ").slice(2).join(" ")}
            </span>
          </p>
          <div className="flex  md:w-auto flex-col md:flex-row gap-4  items-start justify-between ">
            <div className="flex w-full flex-col items-start justify-between gap-2">
              <p className="text-gray-500 font-bold">
                Serial:{" "}
                <span className="text-gray-400 font-normal">{bike.serial}</span>
              </p>
              <p className="text-gray-500 font-bold">
                Primary colors:{" "}
                {bike.frame_colors.map((color, i) => (
                  <span key={i} className="text-gray-400 font-normal">
                    {color}
                  </span>
                ))}
              </p>
              <p className="md:hidden text-red-500 font-bold">
                STOLEN:{" "}
                <span className="text-gray-400 font-normal">
                  {formattedTime}
                </span>
              </p>
              <p className="md:hidden text-gray-500 font-bold">
                Location:
                <span className="text-gray-400 font-normal">
                  {bike.stolen_location}
                </span>
              </p>
            </div>
            <div className="hidden md:flex  flex-col gap-2 w-full ">
              <p className="text-red-500 font-bold">
                STOLEN:{" "}
                <span className="text-gray-400 font-normal">
                  {formattedTime}
                </span>
              </p>
              <p className="text-gray-500 font-bold">
                Location:
                <span className="text-gray-400 font-normal">
                  {bike.stolen_location}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BikeCard;
