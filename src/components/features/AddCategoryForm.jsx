import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { Button } from "primereact/button";
import toast from "react-hot-toast";

const AddCategoryForm = ({ onClose, setRerender }) => {
  const schema = yup.object().shape({
    name: yup
      .string()
      .required("Tên không được để trống")
      .min(10, "Tên phải có ít nhất 10 ký tự")
      .max(45, "Tên chỉ được tối đa 45 ký tự")
      .transform((value) => value.trim()), // Xóa khoảng trắng ở đầu và cuối

    slug: yup
      .string()
      // .required("Slug không được để trống")
      // .min(4, "Slug có ít nhất 4 ký tự")
      .max(50, "Slug chỉ được tối đa 50 ký tự")
      .matches(
        /^[a-z0-9-]+$/,
        "Slug must contain only lowercase letters, numbers, and dashes"
      )
      .transform((value) => value.trim()), // Xóa khoảng trắng ở đầu và cuối
    // .test("check-exists-slug", "Slug đã tồn tại", async function (value) {
    //   const typeToCheck = "SLUG";
    //   const data = { slug: value };
    //   return await checkExists(data, typeToCheck);
    // }),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      // Kiểm tra sự tồn tại của tên category trước khi thêm mới
      const isNameExists = await checkNameExistsLocally(data.name);
      if (isNameExists) {
        toast.error("Tên category đã tồn tại!");
        return;
      }
      //Post dữ liệu lên api
      toast.promise(
        axios
          .post("http://localhost:8080/api/categories/create", {
            name: data.name,
          })
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

  // Hàm kiểm tra sự tồn tại của tên category (tính năng chỉ frontend)
  const checkNameExistsLocally = async (name) => {
    // Lấy danh sách các category hiện có từ state hoặc từ API nếu cần
    const existingCategories = []; // Thay bằng danh sách category hiện có

    // Kiểm tra xem tên category có tồn tại trong danh sách hiện có không
    return existingCategories.some((category) => category.name === name);
  };

  const onError = (errors, e) => console.log(errors, e);

  return (
    <form
      onSubmit={handleSubmit(onSubmit, onError)}
      className="w-full max-w-sm  grid  gap-4 ml-[48px] mr-[48px]"
    >
      <div className="mb-4  ">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Name
        </label>
        <input
          type="text"
          className=" shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          {...register("name")}
        />
        {errors.name && (
          <p className="text-red-500 text-xs italic">{errors.name.message}</p>
        )}
      </div>

      <div className="  mb-4">
        <Button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-[48px]"
        >
          Tạo Category
        </Button>
      </div>
    </form>
  );
};

export default AddCategoryForm;
