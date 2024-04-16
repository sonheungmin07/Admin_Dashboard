import axios from "axios";

export const getAllUsers = async () => {
  const res = axios
    .get("http://localhost:8080/api/users/list-all")
    .then((response) => response)

    .catch((error) => {
      console.log(error);
      return null;
    });

  return res;
};

export const signUpCheckExistsAPI = async (dataCheck) => {
  const res = await axios
    .post("http://localhost:8080/api/auth/validate", dataCheck)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.log(error);
      return null;
    });
  return res;
};
