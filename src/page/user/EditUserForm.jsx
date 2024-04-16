import React, { useEffect, useState } from "react";
import axios from "axios";
import { Form, useForm } from "react-hook-form";
import { Button } from "primereact/button";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast from "react-hot-toast";
// import setValue from "react-hook-form";

const EditUserForm = ({ userId, onClose, setRerender }) => {
  const [userData, setUserData] = useState();
  const schema = yup.object().shape({
    full_name: yup.string().required("FullName is required"),
    password: yup
      .string()
      .notRequired()
      .min(8, "Password must be at least 8 characters"),
    username: yup
      .string()
      .nullable()
      .required("UserName is required")
      .min(4, "Tối thiểu là 4 ký tự")
      .max(64, "Tối đa là 64 ký tự"),
    photo: yup.mixed().test("fileSize", "The file is too large", (value) => {
      if (!value || !value.length) return true; // Allow if no file is uploaded
      return value[0].size <= 5242880; // 5MB
    }),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
    resolver: yupResolver(schema),
  });

  const [photo, setPhoto] = useState(null);

  useEffect(() => {
    // Fetch dữ liệu người dùng cần chỉnh sửa
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/users/get/${userId}`
        );
        setUserData(response.data);
        reset({ ...response.data, password: null, photo: undefined });
      } catch (error) {
        console.error(error);
      }
    };

    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();

      if (!data.password) {
        data.password = "Unknown password";
      }

      console.log({ user: data });
      //Đoạn này để xử lý upload ảnh lên mà kh bị lỗi 2 key (user và img)
      formData.append(
        "user",
        new Blob(
          [
            JSON.stringify({
              username: data.username,
              full_name: data.full_name,
              email: data.email,
              phone_number: data.phone_number,
              password: data.password,
              enabled: data.enabled,
            }),
          ],
          { type: "application/json" }
        )
      );
      if (photo) {
        formData.append("img", photo[0]);
        console.log(photo[0]);
      }

      toast.promise(
        axios
          .put(`http://localhost:8080/api/users/update/${userId}`, formData)
          .then((res) => {
            if (res.status === 200) {
              setRerender(Math.random() * 1000);
              onClose(); // Đóng modal
            }
          })
          .catch((errors) => {
            console.log(errors);
          }),
        {
          loading: "Đang cập nhật ...",
          success: "Cập nhật thành công",
          error: "Cập nhật thất bại",
        }
      );
    } catch (error) {
      console.error(error);
      toast.success(error);
    }
  };

  // if (!userData) {
  //   return <div>Loading...</div>;
  // }

  const handleAvatarChange = (e) => {
    setPhoto(e.target.files);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-sm mx-auto">
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Email
        </label>
        <input
          disabled
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
          disabled
          type="text"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          {...register("phone_number")}
        />
        {errors.phone_number && (
          <p className="text-red-500 text-xs italic">
            {errors.phone_number.message}
          </p>
        )}
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          UserName
        </label>
        <input
          disabled
          type="text"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          {...register("username")}
        />
        {errors.username && (
          <p className="text-red-500 text-xs italic">
            {errors.username.message}
          </p>
        )}
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          FullName
        </label>
        <input
          type="text"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          {...register("full_name")}
        />
        {errors.full_name && (
          <p className="text-red-500 text-xs italic">
            {errors.full_name.message}
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
          Photo
        </label>
        <input type="file" onChange={handleAvatarChange} />
        {errors.photo && (
          <p className="text-red-500 text-xs italic">{errors.photo.message}</p>
        )}
        <img src={userData?.photo} alt="" width={70} />
      </div>
      <Button
        type="submit"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        {userId ? "Update" : "Submit"}
      </Button>
    </form>
  );
};

export default EditUserForm;
