import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
    return (
        
       <>
       <div>
        <div >
          <Header />
        </div>
        <div >
          <Outlet />
        </div>
        <div >
          <Footer />
        </div>
      </div>
      </>
    )
}
export default MainLayout;
