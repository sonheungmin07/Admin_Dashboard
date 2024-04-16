import { useState, useEffect } from "react";
import EditUserForm from "./EditUserForm";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { getAllUsers } from "./UserApi";
import axios from "axios";
import { InputSwitch } from "primereact/inputswitch";
import { Dialog } from "primereact/dialog";
import AddUsersForm from "../../components/features/AddUsersForm";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import toast from "react-hot-toast";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  //Update form
  const [editUserId, setEditUserId] = useState(null);
  const [visible, setVisible] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const [modalState, setModalState] = useState({
    isVisible: false,
    type: null,
    userId: null,
  });

  const [rerender, setRerender] = useState(0);

  //Mở modal thêm user
  const openAddUserModal = () =>
    setModalState({ isVisible: true, type: "add", userId: null });

  //Mở modal edit user
  const openEditUserModal = (userId) =>
    setModalState({ isVisible: true, type: "edit", userId: userId });

  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    email: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },
  });

  // Để lấy api về cũng như trả về dạng dữ liệu của api đó
  //Fetch danh sách người dùng khi component được mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const users = await getAllUsers(); // Giả định getAllUsers là async và trả về data từ axios.get
        console.log(users);
        setUsers(users.data.content); // Giả sử response trả về có dạng { data: [...] }
      } catch (error) {
        console.error(error);
      }
    };

    fetchUsers();
  }, [rerender]); // eslint-disable-line react-hooks/exhaustive-deps

  const photoTemplate = (rowData) => {
    return (
      <img
        src={rowData.photo}
        alt={rowData.full_name}
        style={{ width: "50px", height: "50px", borderRadius: "50%" }}
      />
    );
  };

  const handleEditUserSuccess = (message) => {
    setEditUserSuccessMessage(message);
    //Đóng modal khi update thành công
    setVisible(false);
  };

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };

    _filters["global"].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  // Hàm xử lý thêm người dùng thành công, được truyền xuống form con
  // const handleAddUserSuccess = (message) => {
  //   setAddUserSuccessMessage(message);
  //   // Đóng modal khi thêm thành công
  //   setVisible(false);
  // };

  const renderHeader = () => {
    return (
      <div className="flex flex-wrap gap-2 justify-content-between align-items-center ">
        <div className="flex ">
          <h4 className="m-0">Users</h4>
        </div>
        <div className="flex justify-end ml-[16px]">
          <span className="p-input-icon-right">
            <i className="pi pi-search" />
            <InputText
              value={globalFilterValue}
              onChange={onGlobalFilterChange}
              placeholder="Keyword Search"
            />
          </span>
        </div>
      </div>
    );
  };

  //Hàm check enable
  const handleCheckedEnabled = async (users) => {
    const userFetch = await axios
      .get(`http://localhost:8080/api/users/get/${users.id}`)
      .then((res) => {
        if (res.status === 200) {
          return res.data;
        } else {
          toast.error("Lỗi khi lấy dữ liệu user");
        }
      })
      .catch((error) => {
        toast.error(error.getMessage());
      });

    const formData = new FormData();
    formData.append(
      "user",
      new Blob(
        [
          JSON.stringify({
            username: userFetch.username,
            full_name: userFetch.full_name,
            email: userFetch.email,
            phone_number: userFetch.phone_number,
            password: "Unknown password",
            enabled: !userFetch.enabled,
          }),
        ],
        { type: "application/json" }
      )
    );

    axios
      .put(`http://localhost:8080/api/users/update/${users.id}`, formData)
      .then((res) => {
        if (res.status === 200) {
          setRerender(Math.random() * 1000);
        } else {
          toast.success("Cập nhật người dùng thất bại");
        }
      });
  };

  //Hàm xử lý enable
  const actionEnabled = (rowData) => {
    return (
      <div className="flex justify-content-center">
        <InputSwitch
          checked={rowData.enabled}
          onChange={() => {
            handleCheckedEnabled(rowData);
          }}
        />
      </div>
    );
  };

  // Hàm gọi API DELETE để xóa người dùng
  const deleteUser = (userId) => {
    setSelectedUserId(null);
    try {
      toast.promise(
        axios
          .delete(`http://localhost:8080/api/users/delete/${userId}`)
          .then((res) => {
            if (res.status === 200) {
              setRerender(Math.random() * 1000);
            }
          }),
        {
          loading: "Đang xử lý ...",
          success: "Xóa thành công",
          error: "Xóa thất bại",
        }
      );
      // Sau khi xóa thành công, cập nhật lại danh sách người dùng
    } catch (error) {
      console.error("Lỗi xóa user: ", error);
    }
  };

  //Hành động kích hoạt xóa user
  const actionDeleteTemplate = (rowData) => {
    return (
      <Button
        type="button"
        icon="pi pi-trash"
        onClick={() => setSelectedUserId(rowData.id)} // Truyền mảng gồm một người dùng để xóa
        className="p-button-danger"
      />
    );
  };

  const actionUpdateTemplate = (rowData) => {
    return (
      <Button
        label="Edit"
        onClick={() => {
          openEditUserModal(rowData.id);
        }}
        className="p-button-info"
      />
    );
  };

  const header = renderHeader();

  return (
    <div className=" card test-sm">
      {/* Đoạn này để render ra cái modal thêm user */}
      <div className="relative">
        <div className="mb-[16px]   cursor-pointer ">
          <Button
            label="+ Add User"
            icon="PrimeIcons.PLUS"
            onClick={openAddUserModal}
          />
        </div>
        {visible && (
          <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50"></div>
        )}
      </div>
      <DataTable
        value={users}
        paginator
        header={header}
        rows={5}
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        rowsPerPageOptions={[10, 25, 50]}
        dataKey="id"
        selectionMode="checkbox"
        selection={selectedUsers}
        onSelectionChange={(e) => setSelectedUsers(e.value)}
        filters={filters}
        filterDisplay="menu"
        globalFilterFields={[
          "id",
          "username",
          "email",
          "photo",
          "enabled",
          "roleName",
          "full_name",
          "phone_number",
        ]}
        emptyMessage="No users found."
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
      >
        <Column field="id" header="Id" sortable />
        <Column field="email" header="Email" sortable />
        <Column field="photo" body={photoTemplate} header="Photo" sortable />
        <Column
          field="enabled"
          body={actionEnabled}
          header="Enabled"
          sortable
        />
        <Column field="full_name" header="Full_name" sortable />

        <Column
          headerStyle={{ width: "5rem", textAlign: "center" }}
          bodyStyle={{ textAlign: "center", overflow: "visible" }}
          body={actionUpdateTemplate}
        />
        <Column
          headerStyle={{ width: "5rem", textAlign: "center" }}
          bodyStyle={{ textAlign: "center", overflow: "visible" }}
          body={actionDeleteTemplate}
        />
      </DataTable>
      {/* Xác nhận xóa người dùng có muốn xóa hay không */}
      {selectedUserId && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50 flex justify-center items-center">
          <div className="bg-white p-4 rounded shadow-md">
            <p>Are you sure you want to delete this user?</p>
            <div className="flex justify-end mt-4">
              <Button
                label="Confirm Delete"
                onClick={() => deleteUser(selectedUserId)}
                className="p-button-danger bg-[red] mr-2"
              />
              <Button
                label="Cancel"
                onClick={() => setSelectedUserId(null)}
                className="p-button-secondary bg-[gray]"
              />
            </div>
          </div>
        </div>
      )}

      {modalState.isVisible && (
        <Dialog
          style={{ width: "55vw", height: "100vw" }}
          header={modalState.type === "add" ? "Create New User" : "Edit User"}
          visible={modalState.isVisible}
          onHide={() =>
            setModalState({ isVisible: false, type: null, userId: null })
          }
        >
          {modalState.type === "add" ? (
            <AddUsersForm
              setRerender={setRerender}
              onClose={() =>
                setModalState({ isVisible: false, type: null, userId: null })
              }
            />
          ) : (
            <EditUserForm
              setRerender={setRerender}
              userId={modalState.userId}
              onClose={() =>
                setModalState({
                  isVisible: false,
                  type: null,
                  userId: null,
                })
              }
            />
          )}
        </Dialog>
      )}
    </div>
  );
}
