export const fetchData = async (page, title, stolenness) => {
  try {
    const data = await fetch(
      `https://bikeindex.org/api/v3/search?page=${page}&per_page=10&query=${title}&location=Munich&distance=100&stolenness=${stolenness}`
    ).then((res) => res.json());
    return data["bikes"];
  } catch (error) {
    console.log("Faild to fetch data! ... pleasse try again");
    throw new Error(error);
  }
};

export const fetchDataTotalLength = async () => {
  try {
    const dataLength = await fetch(
      "https://bikeindex.org/api/v3/search/count?stolenness=stolen"
    ).then((res) => res.json());
    return dataLength.stolen;
  } catch (error) {
    console.log("Faild to fetch data length! ...");
    throw new Error(error);
  }
};
