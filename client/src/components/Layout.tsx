import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import { Suspense } from "react";
import Loading from "./Loading";

const Layout = () => {
    return (
        <Suspense fallback={<Loading />}>
            <Navbar />
            <Outlet />
        </Suspense>
    );
};

export default Layout;
