import React, { useState } from "react";
import { Form, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { Button } from "primereact/button";
import toast from "react-hot-toast";
import { signUpCheckExistsAPI } from "../../page/user/UserApi";

const AddUsersForm = ({ onClose, setRerender }) => {
  //Qui định validate
  const schema = yup.object().shape({
    full_name: yup
      .string()
      .required("Họ và tên không được để trống")
      .min(4, "Họ và tên phải có ít nhất 4 ký tự")
      .max(64, "Họ và tên chỉ được tối đa 64 ký tự")
      .transform((value) => value.trim()), // Xóa khoảng trắng ở đầu và cuối
    username: yup
      .string()
      .required("Tên đăng nhập không được để trống")
      .min(4, "Tên đăng nhập phải có ít nhất 4 ký tự")
      .max(64, "Tên đăng nhập chỉ được tối đa 64 ký tự")
      .transform((value) => value.trim())
      .test(
        "check-exists-username",
        "Tên đăng nhập đã tồn tại",
        async function (value) {
          const typeToCheck = "USERNAME";
          const data = { username: value };
          return await checkExists(data, typeToCheck);
        }
      ),
    email: yup
      .string()
      .email("Email không hợp lệ")
      .required("Email không được để trống")
      .min(15, "Email đã tồn tại")
      .max(64, "Email đã tồn tại")
      .transform((value) => value.trim())
      .test("check-exists-email", "Email đã tồn tại", async function (value) {
        const typeToCheck = "EMAIL";
        const data = { email: value };
        return await checkExists(data, typeToCheck);
      }),

    phone_number: yup
      .string()
      .required("Số điện thoại không được để trống")
      .min(10, "Số điện thoại không hợp lệ")
      .max(11, "Số điện thoại không hợp lệ")
      .matches(/^(01|03|05|08|09)\d{8}$/, "Số điện thoại không hợp lệ")
      .transform((value) => value.trim())
      .test(
        "check-exists-phoneNumber",
        "Số điện thoại đã tồn tại",
        async function (value) {
          const typeToCheck = "PHONE_NUMBER";
          const data = { phoneNumber: value };
          return await checkExists(data, typeToCheck);
        }
      ),
    password: yup
      .string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters"),
    repeat_password: yup
      .string()
      .oneOf([yup.ref("password"), null], "Passwords must match")
      .required("Confirm password is required"),
    photo: yup.mixed().test("fileSize", "The file is too large", (value) => {
      if (!value || !value.length) return true; // Allow if no file is uploaded
      return value[0].size <= 5242880; // 5MB
    }),
  });

  // Hàm kiểm tra xem các trường username, email, phone number tồn tại chưa
  async function checkExists(data, type) {
    try {
      const response = await signUpCheckExistsAPI(data).then((response) => {
        return response;
      });
      if (response) {
        return !response?.find((res) => res.type === type); // Trả về true nếu trường đó chưa tồn tại
      }
      return true;
    } catch (error) {
      console.error(error);
      return true; // Nếu có lỗi, cho phép để không bị lỗi validation
    }
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
    resolver: yupResolver(schema),
  });

  //Set photo (quản lý ảnh của người dùng)
  const [photo, setPhoto] = useState(null);

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
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
            }),
          ],
          { type: "application/json" }
        )
      );
      if (photo) {
        formData.append("img", photo[0]);
        console.log(photo[0]);
      }

      //Post dữ liệu lên api
      toast.promise(
        axios
          .post("http://localhost:8080/api/users/create", formData)
          .then((res) => {
            if (res.status === 201) {
              setRerender(Math.random() * 1000);
              onClose();
            }
          })
          .catch((err) => {
            console.log(err);
            return err;
          }),
        {
          loading: "Đang xử lý ...",
          success: "Thêm thành công",
          error: "Thêm thất bại",
        }
      );
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
      className="w-full max-w-xl  grid grid-cols-2 gap-4 ml-[24px] mr-[24px]"
    >
      <div className="mb-4  ">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          FullName
        </label>
        <input
          type="text"
          className=" shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          {...register("full_name")}
        />
        {errors.full_name && (
          <p className="text-red-500 text-xs italic">
            {errors.full_name.message}
          </p>
        )}
      </div>
      <div className="mb-4 ">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Email
        </label>
        <input
          type="email"
          className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
          className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
          type="text"
          className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
          Password
        </label>
        <input
          type="password"
          className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
          className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
      <div className=" ml-[100px] mt-[24px] mb-2">
        <Button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-[48px]"
        >
          Submit
        </Button>
      </div>
    </form>
  );
};

export default AddUsersForm;
