import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'
import logo from '/logofinal.png'

// Icons
const CartIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
  </svg>
)

const UserIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
)

const MenuIcon = ({ open }) => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    {open ? (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
    ) : (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
    )}
  </svg>
)

function Navbar() {
  const [open, setOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileUserMenuOpen, setMobileUserMenuOpen] = useState(false)

  const {
    user,
    setShowLogin,
    navigate,
    getCartCount,
    logout: contextLogout
  } = useAppContext()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : 'unset'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [open])

  const handleLogout = async () => {
    try {
      await contextLogout()
      toast.success("Logged out successfully")
      setMobileUserMenuOpen(false)
    } catch {
      toast.error("Error logging out")
    }
  }

  const cartCount = getCartCount ? getCartCount() : 0

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/products', label: 'Shop' },
    { to: '/contact', label: 'Contact' },
  ]

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500
        ${isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg py-2' : 'bg-white py-3'}
      `}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">

            {/* DESKTOP LEFT */}
            <div className="hidden md:flex items-center gap-45 lg:gap-60">
              <NavLink to="/" className="h-20 w-20 lg:h-16 lg:w-16 flex-shrink-0">
                <img src={logo} alt="Brand Logo" className="w-full h-full object-contain" />
              </NavLink>
              <span className="text-2xl lg:text-4xl xl:text-5xl font-semibold tracking-wide whitespace-nowrap" style={{ fontFamily: "'Roboto Slab', serif" }}>
                Creation Empire
              </span>
            </div>

            {/* MOBILE HEADER */}
            <div className="flex md:hidden items-center justify-between w-full">
              <div className="flex items-center gap-8 max-w-[65%]">
                <NavLink to="/" className="h-10 w-10 flex-shrink-0">
                  <img src={logo} alt="Brand Logo" className="w-full h-full object-contain" />
                </NavLink>
                <span className="text-lg font-semibold truncate" style={{ fontFamily: "'Roboto Slab', serif" }}>
                  Creation Empire
                </span>
              </div>

              <div className="flex items-center gap-1">
                {/* Cart */}
                <button onClick={() => navigate("/cart")} className="relative p-2 text-gray-600 hover:text-black hover:bg-gray-100 rounded-full transition">
                  <CartIcon />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[16px] h-4 bg-black text-white text-[10px] rounded-full flex items-center justify-center px-1">
                      {cartCount}
                    </span>
                  )}
                </button>

                {/* User */}
                {!user ? (
                  <button onClick={() => setShowLogin(true)} className="p-2 text-gray-600 hover:text-black hover:bg-gray-100 rounded-full transition">
                    <UserIcon />
                  </button>
                ) : (
                  <div className="relative">
                    <button onClick={() => setMobileUserMenuOpen(!mobileUserMenuOpen)} className="p-2 text-gray-600 hover:text-black hover:bg-gray-100 rounded-full transition relative">
                      <UserIcon />
                      <span className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full border-2 border-white" />
                    </button>

                    {mobileUserMenuOpen && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setMobileUserMenuOpen(false)} />
                        <div className="absolute right-0 top-10 w-56 bg-white rounded-xl shadow-xl border py-2 z-50">
                          <div className="px-4 py-3 border-b">
                            <p className="text-sm font-semibold truncate">{user.name}</p>
                            <p className="text-xs text-gray-500 truncate">{user.email}</p>
                          </div>
                          <button onClick={() => { setMobileUserMenuOpen(false); navigate('/myOrders'); }} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50">
                            My Orders
                          </button>
                          <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                            Sign Out
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* Menu Button */}
                <button onClick={() => setOpen(!open)} className="p-2 text-gray-600 hover:text-black hover:bg-gray-100 rounded-full transition z-50">
                  <MenuIcon open={open} />
                </button>
              </div>
            </div>

            {/* DESKTOP RIGHT */}
            <div className="hidden md:flex items-center gap-2 lg:gap-4">
              <div className="flex items-center">
                {navLinks.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      `relative px-4 py-2 text-md font-medium transition ${isActive ? 'text-black' : 'text-gray-600 hover:text-black'}`
                    }
                  >
                    {item.label}
                  </NavLink>
                ))}
              </div>

              {/* Cart */}
              <button onClick={() => navigate("/cart")} className="relative p-2 text-gray-600 hover:text-black hover:bg-gray-100 rounded-full transition">
                <CartIcon />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[20px] h-5 bg-black text-white text-xs rounded-full flex items-center justify-center px-1">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* User Toggle */}
              <button
                onClick={user ? () => setMobileUserMenuOpen(!mobileUserMenuOpen) : () => setShowLogin(true)}
                className="p-2 text-gray-600 hover:text-black hover:bg-gray-100 rounded-full transition"
              >
                <UserIcon />
              </button>
            </div>
          </div>
        </div>

        {/* MOBILE SLIDE-OUT MENU */}
        <div className={`fixed inset-0 z-40 md:hidden transition-all duration-300 ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
          {/* Backdrop Overlay */}
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setOpen(false)} />
          
          {/* Menu Panel */}
          <div className={`absolute right-0 top-0 bottom-0 w-72 bg-white shadow-2xl transition-transform duration-300 transform ${open ? 'translate-x-0' : 'translate-x-full'} flex flex-col`}>
            <div className="p-6 pt-20">
              <div className="flex flex-col gap-2">
                {navLinks.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      `text-xl font-medium py-3 px-4 rounded-lg transition-colors
                      ${isActive ? 'bg-gray-100 text-black' : 'text-gray-600 hover:bg-gray-50'}`
                    }
                  >
                    {item.label}
                  </NavLink>
                ))}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="h-16" />
    </>
  )
}

export default Navbar