import axios from "axios";

const CategoryApi = async () => {
  const res = await axios
    .get("http://localhost:8080/api/categories/list-all")
    .then((response) => {
      return response;
    })
    .catch((error) => {
      console.log(error);
      return null;
    });

  return res;
};

export default CategoryApi;
