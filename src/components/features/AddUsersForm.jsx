import React, { useState } from "react";
import { Form, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { Button } from "primereact/button";

const AddUsersForm = () => {
  const schema = yup.object().shape({
    fullname: yup.string().required("FullName is required"),
    email: yup.string().email("Invalid email").required("Email is required"),
    phoneNumber: yup
      .string()
      .matches(/^\d{10}$/, "Invalid phone number")
      .required("Phone number is required"),
    password: yup
      .string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters"),
    repeat_password: yup
      .string()
      .oneOf([yup.ref("password"), null], "Passwords must match")
      .required("Confirm password is required"),
    photo: yup.mixed().test("fileSize", "The file is too large", (value) => {
      if (!value || !value.length) return true; // Allow if no file is uploaded
      return value[0].size <= 5242880; // 5MB
    }),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const [photo, setPhoto] = useState(null);

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("fullname", data.fullname);
      formData.append("email", data.email);
      formData.append("phoneNumber", data.phoneNumber);
      formData.append("password", data.password);
      formData.append("repeat_password", data.repeat_password);
      if (photo) {
        formData.append("photo", photo[0]);
      }
      console.log({ ...data, photo: photo[0] });
      // const response = await axios.post("/api/register", formData);
      // console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const onError = (errors, e) => console.log(errors, e);

  const handleAvatarChange = (e) => {
    setPhoto(e.target.files);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit, onError)}
      className="w-full max-w-sm mx-auto"
    >
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          FullName
        </label>
        <input
          type="text"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          {...register("fullname")}
        />
        {errors.fullname && (
          <p className="text-red-500 text-xs italic">
            {errors.fullname.message}
          </p>
        )}
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Email
        </label>
        <input
          type="text"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          {...register("email")}
        />
        {errors.email && (
          <p className="text-red-500 text-xs italic">{errors.email.message}</p>
        )}
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          PhoneNumber
        </label>
        <input
          type="text"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          {...register("phoneNumber")}
        />
        {errors.phoneNumber && (
          <p className="text-red-500 text-xs italic">
            {errors.phoneNumber.message}
          </p>
        )}
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Password
        </label>
        <input
          type="password"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          {...register("password")}
        />
        {errors.password && (
          <p className="text-red-500 text-xs italic">
            {errors.password.message}
          </p>
        )}
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Confirm Password
        </label>
        <input
          type="password"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          {...register("repeat_password")}
        />
        {errors.repeat_password && (
          <p className="text-red-500 text-xs italic">
            {errors.repeat_password.message}
          </p>
        )}
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Photo
        </label>
        <input type="file" onChange={handleAvatarChange} />
        {errors.photo && (
          <p className="text-red-500 text-xs italic">{errors.photo.message}</p>
        )}
      </div>
      <Button
        type="submit"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Submit
      </Button>
    </form>
  );
};

export default AddUsersForm;
