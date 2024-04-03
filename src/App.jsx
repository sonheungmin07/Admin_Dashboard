// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import "./App.css";
import Sidebar from "./components/Layout/Sidebar";
import Dashboardview from "./components/Layout/Dashboardview";
import { Outlet } from "react-router-dom";

import UserManagement from "./page/user/UserManagement";

function App() {
  return (
    <div className="flex items-stretch">
      <div className="basis-[12%] h-full  ">
        <Sidebar />
      </div>
      <div className="basis-[88%] ">
        <Dashboardview />
        <div>
          <Outlet></Outlet>
        </div>
      </div>
    </div>
  );
}

export default App;
