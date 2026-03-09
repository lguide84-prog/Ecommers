import { Link, NavLink, Outlet } from "react-router-dom";
import { useState } from "react";
import { assets } from "../../assets/assets";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import { 
  FiPackage, 
  FiShoppingBag, 
  FiShoppingCart, 
  FiLogOut, 
  FiMenu, 
  FiX,
  FiBell,
  FiChevronDown
} from "react-icons/fi";

const SellerLayout = () => {
  const { setIsSeler, axios, navigate, seller } = useAppContext();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const sidebarLinks = [
    { 
      name: "Add Products", 
      path: "/seller", 
      icon: FiPackage,
      description: "Create new listings"
    },
    { 
      name: "Product List", 
      path: "/seller/product-list", 
      icon: FiShoppingBag,
      description: "Manage inventory"
    },
    { 
      name: "Orders", 
      path: "/seller/orders", 
      icon: FiShoppingCart,
      description: "View & process orders"
    },
  ];

  const logout = async () => {
    try {
      const { data } = await axios.get("/api/seller/logout");
      if (data.success) {
        toast.success(data.message, {
          style: {
            background: '#10b981',
            color: '#fff',
            borderRadius: '8px',
          },
          icon: '👋',
        });
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <div className="min-h-screen bg-[#faf9f8]">
      {/* Top Navigation - Elegant & Minimal */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#f0e9e2] shadow-sm">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo & Mobile Menu */}
            <div className="flex items-center gap-4 lg:gap-8">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 -ml-2 text-gray-600 hover:text-[#b76e79] transition-colors"
              >
                {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
              </button>
              
              <Link to="/" className="flex items-center gap-3">
                
                <span className="hidden sm:block text-sm tracking-[0.3em] text-gray-400 uppercase">
                  Creation Empire By Priya
                </span>
              </Link>
            </div>

            {/* Right Section - Premium Elements */}
            <div className="flex items-center gap-6">
              {/* Notification Bell */}
              <button className="relative p-2 text-gray-600 hover:text-[#b76e79] transition-colors">
                <FiBell size={20} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-[#b76e79] rounded-full"></span>
              </button>

              {/* Seller Profile */}
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-3 group"
                >
                  <div className="flex flex-col items-end">
                    <span className="text-sm font-light text-gray-500">
                      {getGreeting()},
                    </span>
                    <span className="text-sm font-medium text-gray-800 group-hover:text-[#b76e79] transition-colors">
                      {seller?.name || "Seller"}
                    </span>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-[#f8f1e8] flex items-center justify-center border-2 border-white shadow-sm">
                    <span className="text-[#b76e79] font-medium text-sm">
                      {seller?.name?.charAt(0) || "S"}
                    </span>
                  </div>
                  
                </button>

                
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar - Elegant Navigation */}
        <aside
          className={`
            fixed lg:static inset-y-0 left-0 z-40
            w-72 bg-white border-r border-[#f0e9e2] 
            transform transition-transform duration-300 ease-in-out
            lg:transform-none lg:translate-x-0
            ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          `}
        >
          <div className="h-full flex flex-col pt-8">
            

            {/* Navigation Links */}
            <nav className="flex-1 px-4 py-6 space-y-1">
              {sidebarLinks.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === "/seller"}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) => `
                    group flex items-center gap-4 px-4 py-3 rounded-xl
                    transition-all duration-300 relative
                    ${isActive 
                      ? "bg-[#f8f1e8] text-[#b76e79]" 
                      : "text-gray-600 hover:bg-[#faf9f8] hover:text-gray-900"
                    }
                  `}
                >
                  {({ isActive }) => (
                    <>
                      <item.icon 
                        size={20} 
                        className={`
                          transition-all duration-300
                          ${isActive ? "text-[#b76e79]" : "text-gray-400 group-hover:text-gray-600"}
                        `}
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{item.name}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{item.description}</p>
                      </div>
                      
                      {/* Active Indicator */}
                      {isActive && (
                        <span className="absolute right-4 w-1.5 h-8 bg-[#b76e79] rounded-full"></span>
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </nav>

            {/* Bottom Section */}
            <div className="p-6 border-t border-[#f0e9e2]">
              <div className="bg-[#faf9f8] rounded-xl p-4">
                <h4 className="text-xs uppercase tracking-wider text-gray-400 mb-2">
                  Quick Tips
                </h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  High-quality product images increase sales by up to 30%
                </p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 bg-[#faf9f8]">
          <div className="p-4 sm:p-6 lg:p-8 animate-in fade-in">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};

export default SellerLayout;