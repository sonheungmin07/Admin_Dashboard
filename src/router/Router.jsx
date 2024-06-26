// import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "../App";
import Main from "../components/Layout/Main";
import UserManagement from "../page/user/UserManagement";
import CategoryManagement from "../page/category/CategoryManagement";

const Router = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />}>
            <Route index element={<Main />} />
            {/* <Route path="/profile" element={</>}></Route> */}
            <Route path="user" element={<UserManagement />} />
            <Route path="category" element={<CategoryManagement />}></Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default Router;
