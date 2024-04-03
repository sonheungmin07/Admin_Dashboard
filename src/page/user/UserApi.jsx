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

  // return [
  //   {
  //     id: 14,
  //     email: "nguyenvanA@gmail.com",
  //     photo:
  //       "https://res.cloudinary.com/dqnoopa0x/image/upload/v1711726818/zdejuew7iq5yzwxtaebb.jpg",
  //     enabled: true,
  //     roleName: "User",
  //     full_name: "Nguyễn Văn A",
  //     phone_number: "0987654321",
  //     created_time: "2024-03-30T10:20:45.000+00:00",
  //   },

  //   {
  //     id: 15,
  //     email: "tranthithu@gmail.com",
  //     photo: null,
  //     enabled: true,
  //     roleName: "User",
  //     full_name: "Trần Thị Thu",
  //     phone_number: "0912345678",
  //     created_time: "2024-03-30T11:45:12.000+00:00",
  //   },

  //   {
  //     id: 16,
  //     email: "hoanglong@gmail.com",
  //     photo: null,
  //     enabled: true,
  //     roleName: "User",
  //     full_name: "Hoàng Long",
  //     phone_number: "0367891234",
  //     created_time: "2024-03-30T14:55:30.000+00:00",
  //   },

  //   {
  //     id: 17,
  //     email: "nguyenphuong@gmail.com",
  //     photo: null,
  //     enabled: true,
  //     roleName: "User",
  //     full_name: "Nguyễn Phương",
  //     phone_number: "0398765432",
  //     created_time: "2024-03-30T16:10:18.000+00:00",
  //   },

  //   {
  //     id: 18,
  //     email: "tranvanson@gmail.com",
  //     photo: null,
  //     enabled: true,
  //     roleName: "User",
  //     full_name: "Trần Văn Sơn",
  //     phone_number: "0956781234",
  //     created_time: "2024-03-31T08:30:55.000+00:00",
  //   },

  //   {
  //     id: 19,
  //     email: "hoanghuyen@gmail.com",
  //     photo: null,
  //     enabled: true,
  //     roleName: "User",
  //     full_name: "Hoàng Huyền",
  //     phone_number: "0987123456",
  //     created_time: "2024-03-31T09:40:20.000+00:00",
  //   },

  //   {
  //     id: 20,
  //     email: "phamthanhhoa@gmail.com",
  //     photo: null,
  //     enabled: true,
  //     roleName: "User",
  //     full_name: "Phạm Thanh Hòa",
  //     phone_number: "0978654321",
  //     created_time: "2024-03-31T11:55:30.000+00:00",
  //   },

  //   {
  //     id: 21,
  //     email: "truongminhthu@gmail.com",
  //     photo: null,
  //     enabled: true,
  //     roleName: "User",
  //     full_name: "Trương Minh Thu",
  //     phone_number: "0943216789",
  //     created_time: "2024-03-31T13:20:45.000+00:00",
  //   },

  //   {
  //     id: 22,
  //     email: "vuthimai@gmail.com",
  //     photo: null,
  //     enabled: true,
  //     roleName: "User",
  //     full_name: "Vũ Thị Mai",
  //     phone_number: "0965432789",
  //     created_time: "2024-03-31T14:40:55.000+00:00",
  //   },

  //   {
  //     id: 23,
  //     email: "ledinhquan@gmail.com",
  //     photo: null,
  //     enabled: true,
  //     roleName: "User",
  //     full_name: "Lê Đình Quân",
  //     phone_number: "0987321567",
  //     created_time: "2024-03-31T16:00:10.000+00:00",
  //   },
  // ];
};
