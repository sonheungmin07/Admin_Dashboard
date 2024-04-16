import { useState, useEffect, useRef } from "react";
// import EditUserForm from "./EditUserForm";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import CategoryApi from "./CategoryApi";
import axios from "axios";
import { InputSwitch } from "primereact/inputswitch";
import { Dialog } from "primereact/dialog";
import AddCategoryForm from "../../components/features/AddCategoryForm";

import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import toast from "react-hot-toast";
import EditCategoryForm from "./EditCategoryForm";

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [visible, setVisible] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  const toast = useRef(null);
  //Để cập nhật lại mỗi khi cần render lại trạng thái
  const [rerender, setRerender] = useState(0);

  const [modalState, setModalState] = useState({
    isVisible: false,
    type: null,
    userId: null,
  });

  //Mở modal thêm user
  const openAddCategoryModal = () =>
    setModalState({ isVisible: true, type: "add", categoryId: null });

  //Mở modal edit user
  const openEditCategoryModal = (categoryId) => {
    setModalState({ isVisible: true, type: "edit", categoryId: categoryId });
  };

  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    name: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categories = await CategoryApi(); //Lấy dữu liệu api câtegories
        console.log(categories);
        setCategories(categories.data.content);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCategories();
  }, [rerender]);

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
          <h4 className="m-0">Categories</h4>
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

  // Hàm gọi API DELETE để xóa Categories(xóa kh cần async await)
  const deleteCategory = (categoryId) => {
    setSelectedCategoryId(null);
    try {
      toast.promise(
        axios
          .delete(`http://localhost:8080/api/categories/delete/${categoryId}`)
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
    } catch (error) {
      console.error("Lỗi xóa category: ", error);
    }
  };

  //Hành động kích hoạt xóa category
  const actionDeleteTemplate = (rowData) => {
    return (
      <Button
        type="button"
        icon="pi pi-trash"
        onClick={() => setSelectedCategoryId(rowData.id)} // Truyền mảng gồm một category để xóa
        className="p-button-danger"
      />
    );
  };

  const actionUpdateTemplate = (rowData) => {
    return (
      <Button
        label="Edit"
        onClick={() => {
          openEditCategoryModal(rowData.id);
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
          <Button label="+ Add Category" onClick={openAddCategoryModal} />
        </div>
        {visible && (
          <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50"></div>
        )}
      </div>
      <DataTable
        value={categories}
        paginator
        header={header}
        rows={5}
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        rowsPerPageOptions={[10, 25, 50]}
        dataKey="id"
        selectionMode="checkbox"
        selection={selectedCategories}
        onSelectionChange={(e) => setSelectedCategories(e.value)}
        filters={filters}
        filterDisplay="menu"
        globalFilterFields={["id", "name", "slug"]}
        emptyMessage="No categories found."
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
      >
        <Column field="id" header="Id" sortable />
        <Column field="name" header="Name" sortable />
        <Column field="slug" header="Slug" sortable />

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
      {/* Xác nhận xóa category có muốn xóa hay không */}
      {selectedCategoryId && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50 flex justify-center items-center">
          <div className="bg-white p-4 rounded shadow-md">
            <p>Are you sure you want to delete this category?</p>
            <div className="flex justify-end mt-4">
              <Button
                label="Confirm Delete"
                onClick={() => deleteCategory(selectedCategoryId)}
                className="p-button-danger bg-[red] mr-2"
              />
              <Button
                label="Cancel"
                onClick={() => setSelectedCategoryId(null)}
                className="p-button-secondary bg-[gray]"
              />
            </div>
          </div>
        </div>
      )}

      {modalState.isVisible && (
        <Dialog
          style={{ width: "50vw", height: "100vw" }}
          header={
            modalState.type === "add" ? "Create New Category" : "Edit Category"
          }
          visible={modalState.isVisible}
          onHide={() =>
            setModalState({ isVisible: false, type: null, categoryId: null })
          }
        >
          {modalState.type === "add" ? (
            <AddCategoryForm
              setRerender={setRerender}
              onClose={() =>
                setModalState({
                  isVisible: false,
                  type: null,
                  categoryId: null,
                })
              }
            />
          ) : (
            <EditCategoryForm
              setRerender={setRerender}
              categoryId={modalState.categoryId}
              onClose={() =>
                setModalState({
                  isVisible: false,
                  type: null,
                  categoryId: null,
                })
              }
            />
          )}
        </Dialog>
      )}
    </div>
  );
};

export default CategoryManagement;
