import Header from "../components/common/Header";
import { Outlet } from "react-router-dom";

function MainLayout() {
  return (
    <>
      <Header />
      <div className="main">
        <Outlet />
      </div>
    </>
  );
}

export default MainLayout;
