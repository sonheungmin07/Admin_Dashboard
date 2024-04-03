import React from "react";
import { Link, NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
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

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [photo, setPhoto] = useState(null);
  const [visible, setVisible] = useState(false);
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    email: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },
  });

  useEffect(() => {
    //
    // const response = getAllUsers();
    // console.log(response);
    // setCustomers(response);
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
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const photoTemplate = (rowData) => {
    return rowData.photo ? (
      <img
        src={rowData.photo}
        alt={rowData.full_name}
        style={{ width: "50px", height: "50px", borderRadius: "50%" }}
      />
    ) : (
      <div>No Image</div> // Hoặc có thể hiển thị một ảnh placeholder nếu muốn
    );
  };

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };

    _filters["global"].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

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

  const actionBodyTemplate = () => {
    return <Button type="button" icon="pi pi-cog" rounded></Button>;
  };

  //Hàm check enable
  const handleCheckedEnabled = (users) => {
    console.log(users.id);
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

  //Hàm xóa user
  const deleteUsers = (selectedUsers) => {
    const remainingUsers = users.filter(
      (user) => !selectedUsers.includes(user)
    );
    setUsers(remainingUsers);
    setSelectedUsers([]); // Đặt lại danh sách người dùng được chọn về rỗng sau khi xóa
  };

  //Hành động kích hoạt xóa user
  const actionDeleteTemplate = (rowData) => {
    return (
      <Button
        type="button"
        icon="pi pi-trash"
        onClick={() => deleteUsers([rowData])} // Truyền mảng gồm một người dùng để xóa
        className="p-button-danger"
      />
    );
  };

  const header = renderHeader();

  return (
    <div className="card test-sm">
      <div className="mb-[16px]   cursor-pointer ">
        <Button
          label="+ Add User"
          icon="PrimeIcons.PLUS "
          onClick={() => setVisible(true)}
        />
        <Dialog
          header="Create New User"
          visible={visible}
          modal={false}
          style={{ width: "50vw", height: "100vw" }}
          onHide={() => setVisible(false)}
        >
          {/* <p className="m-0">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </p> */}
          <AddUsersForm />
        </Dialog>
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
        <Column selectionMode="single" headerStyle={{ width: "3rem" }}></Column>
        <Column
          field="id"
          header="Id"
          sortable
          // filter
          // filterPlaceholder="Search by name"
          // style={{ minWidth: "14rem" }}
        />
        <Column
          field="email"
          header="Email"
          sortable
          // filter
          // filterPlaceholder="Search by name"
          // style={{ minWidth: "14rem", maxWidth: "8rem" }}
        />
        <Column
          // className="rounded-full"
          field="photo"
          body={photoTemplate}
          header="Photo"
          sortable
          // filter
          // filterPlaceholder="Search by name"
        />
        <Column
          field="enabled"
          body={actionEnabled}
          header="Enabled"
          sortable
          // filter
          // filterPlaceholder="Search by name"
        />
        {/* <Column
          field="roleName"
          header="RoleName"
          sortable
          filter
          filterPlaceholder="Search by name"
          style={{ minWidth: "14rem" }}
        /> */}
        <Column
          field="full_name"
          header="Full_name"
          sortable
          // filter
          // filterPlaceholder="Search by name"
          // style={{ minWidth: "14rem" }}
        />
        {/* <Column
          field="phone_number"
          header="Phone_number"
          sortable
          filter
          filterPlaceholder="Search by name"
          style={{ minWidth: "14rem" }}
        /> */}
        {/* <Column
          field="created_time"
          header="Created_time"
          sortable
          filter
          filterPlaceholder="Search by name"
          style={{ minWidth: "14rem" }}
        /> */}
        {/* <Column
          headerStyle={{ width: "5rem", textAlign: "center" }}
          bodyStyle={{ textAlign: "center", overflow: "visible" }}
          body={actionBodyTemplate}
        /> */}
        <Column
          headerStyle={{ width: "5rem", textAlign: "center" }}
          bodyStyle={{ textAlign: "center", overflow: "visible" }}
          body={actionDeleteTemplate}
        />
      </DataTable>
    </div>
  );
}
