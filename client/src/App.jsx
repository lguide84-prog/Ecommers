import React from 'react'
import Navbar from './components/Navbar'
import Navbar2 from './components/Navbar2'
import Home from './pages/Home'
import { Route, Routes, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast';
import Footer from './components/Footer';
import { useAppContext } from './context/AppContext';
import Login from './components/Login';
import AllProduct from './pages/AllProduct';
import Productcato from './pages/Productcato';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Addaddress from './components/Addaddress';
import Myorders from './pages/Myorders';
import SellerLogin from './components/seller/SellerLogin';
import SellerLayout from './pages/seller/SellerLayout';
import Addproduct from './pages/seller/Addproduct';
import ProductList from './pages/seller/ProductList';
import Order from './pages/seller/Order';
import Loading from './components/Loading';
import TermsAndConditions from './pages/Term';
import ReturnRefundPolicy from './pages/Return';
import PrivacyPolicy from './pages/Policy';
import Contact from './components/Contact';

function App() {
  const location = useLocation();
  const isSellerPath = location.pathname.includes("seller");
  const isHomePage = location.pathname === "/";
  const {showLogin, isSeller} = useAppContext();

  // Determine which navbar to show
  const renderNavbar = () => {
    if (isSellerPath) return null;
    if (isHomePage) return <Navbar />; // Transparent navbar for home
    return <Navbar2 />; // Regular white navbar for other pages
  };

  return (
    <>
      <div className='text-default min-h-screen text-gray-700 bg-white'>
        {renderNavbar()}
        {showLogin ? <Login/> : null}
        <Toaster />
        <div className={isSellerPath ? "" : "w-full"}>
          <Routes>
            <Route path='/' element={<Home/>}/>
            <Route path='/products' element={<AllProduct/>}/>
            
            {/* Most specific route first - subcategory route */}
            <Route path='/products/:category/:subcategory' element={<Productcato/>}/>
            
            {/* Then category route */}
            <Route path='/products/:category' element={<Productcato/>}/>
            
            {/* Product detail route */}
            <Route path='/product/:id' element={<ProductDetail/>}/>
            
            <Route path='/cart' element={<Cart/>}/>
            <Route path='/add-address' element={<Addaddress/>}/>
            <Route path='/myOrders' element={<Myorders/>}/>
            <Route path="/loader" element={<Loading/>}/>
            <Route path="/term" element={<TermsAndConditions/>}/>
            <Route path="/return" element={<ReturnRefundPolicy/>}/>
            <Route path='/policy' element={<PrivacyPolicy/>}/>
            <Route path='/contact' element={<Contact/>}/>
            <Route path='/seller' element={isSeller?<SellerLayout/> :<SellerLogin/>}>
              <Route index element={isSeller?<Addproduct/>:null} />
              <Route path='product-list' element={isSeller?<ProductList/>:null} />
              <Route path='orders' element={<Order/>}/>
            </Route>
          </Routes>
        </div>
        {!isSellerPath && <Footer />}
      </div>
    </>
  )
}

export default App