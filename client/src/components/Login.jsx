import React, { useState, useEffect } from 'react'
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';
import { FaEye, FaEyeSlash, FaHeart, FaLock } from 'react-icons/fa';
import { MdEmail, MdLock, MdPerson } from 'react-icons/md';

function Login() {
  const { setShowLogin, setUser, axios, navigate } = useAppContext()
  const [state, setState] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  // Clear errors when switching state
  useEffect(() => {
    setFormErrors({});
  }, [state]);

  const validateForm = () => {
    const errors = {};
    
    if (!email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Email is invalid";
    }
    
    if (!password) {
      errors.password = "Password is required";
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }
    
    if (state === "register" && !name) {
      errors.name = "Name is required";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const onSubmitHandle = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);

    try {
      let payload = {};

      if (state === "register") {
        payload = { name, email, password };
      } else {
        payload = { email, password };
      }

      const { data } = await axios.post(`/api/user/${state}`, payload);

      if (data.success) {
        // Immediately fetch user data again to get cart
        const { data: userData } = await axios.get('/api/user/isauth');
        if (userData.success) {
          setUser(userData.user);
          // Cart will be loaded automatically by the useEffect in AppContext
        }
        
        navigate('/');
        setShowLogin(false);
        toast.success(
          state === "login" 
            ? "Welcome back! You've successfully logged in." 
            : "Welcome to CREATION EMPIRE! Your account has been created.",
          {
            style: {
              background: '#fb7185',
              color: '#fff',
              borderRadius: '4px',
            },
            icon: '👋',
          }
        );
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setShowLogin(false);
    // Reset form
    setName("");
    setEmail("");
    setPassword("");
    setFormErrors({});
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      {/* Backdrop with blur effect - click to close */}
      <div 
        onClick={handleClose} 
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300"
      >
        {/* Modal Container - prevent click from closing */}
        <div 
          onClick={(e) => e.stopPropagation()} 
          className="relative w-full max-w-md bg-white shadow-2xl animate-in slide-in-from-bottom-4 duration-500"
        >
          {/* Decorative Header Line */}
          <div className="absolute top-0 left-0 w-24 h-[2px] bg-rose-200"></div>
          
          <div className="p-8 md:p-10">
            {/* Logo/Brand */}
            <div className="text-center mb-8">
              <div className="flex justify-center mb-3">
                <div className="w-12 h-12 bg-rose-50 rounded-full flex items-center justify-center">
                  <FaHeart className="text-rose-400 text-xl" />
                </div>
              </div>
              <h2 className="text-xl font-light text-stone-800">
                CREATION EMPIRE <span className="text-rose-400">BY PRIYA</span>
              </h2>
              <p className="text-xs text-stone-400 mt-2 tracking-wider">
                {state === "login" ? "WELCOME BACK" : "JOIN THE FAMILY"}
              </p>
            </div>

            {/* Form Title */}
            <div className="text-center mb-6">
              <h3 className="text-2xl md:text-3xl font-light text-stone-700">
                {state === "login" ? "Sign In" : "Create Account"}
              </h3>
              <div className="w-12 h-[1px] bg-rose-200 mx-auto mt-2"></div>
            </div>

            <form onSubmit={onSubmitHandle} className="space-y-5">
              {/* Name Field - Only for Register */}
              {state === "register" && (
                <div className="space-y-1.5">
                  <label className="block text-xs uppercase tracking-wider text-stone-400">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-300">
                      <MdPerson className="text-lg" />
                    </div>
                    <input
                      onChange={(e) => setName(e.target.value)}
                      value={name}
                      placeholder="Enter your full name"
                      className={`
                        w-full pl-10 pr-4 py-3 text-sm border bg-stone-50 
                        focus:bg-white transition-all duration-300 outline-none
                        ${formErrors.name 
                          ? 'border-rose-400 focus:border-rose-400' 
                          : 'border-stone-200 focus:border-rose-400'
                        }
                      `}
                      type="text"
                    />
                  </div>
                  {formErrors.name && (
                    <p className="text-xs text-rose-400 mt-1">{formErrors.name}</p>
                  )}
                </div>
              )}

              {/* Email Field */}
              <div className="space-y-1.5">
                <label className="block text-xs uppercase tracking-wider text-stone-400">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-300">
                    <MdEmail className="text-lg" />
                  </div>
                  <input
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    placeholder="Enter your email"
                    className={`
                      w-full pl-10 pr-4 py-3 text-sm border bg-stone-50 
                      focus:bg-white transition-all duration-300 outline-none
                      ${formErrors.email 
                        ? 'border-rose-400 focus:border-rose-400' 
                        : 'border-stone-200 focus:border-rose-400'
                      }
                    `}
                    type="email"
                  />
                </div>
                {formErrors.email && (
                  <p className="text-xs text-rose-400 mt-1">{formErrors.email}</p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-1.5">
                <label className="block text-xs uppercase tracking-wider text-stone-400">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-300">
                    <MdLock className="text-lg" />
                  </div>
                  <input
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    placeholder={state === "login" ? "Enter your password" : "Create a password"}
                    className={`
                      w-full pl-10 pr-12 py-3 text-sm border bg-stone-50 
                      focus:bg-white transition-all duration-300 outline-none
                      ${formErrors.password 
                        ? 'border-rose-400 focus:border-rose-400' 
                        : 'border-stone-200 focus:border-rose-400'
                      }
                    `}
                    type={showPassword ? "text" : "password"}
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-rose-400 transition-colors"
                  >
                    {showPassword ? <FaEyeSlash className="text-sm" /> : <FaEye className="text-sm" />}
                  </button>
                </div>
                {formErrors.password && (
                  <p className="text-xs text-rose-400 mt-1">{formErrors.password}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`
                  w-full py-4 text-sm tracking-wider transition-all duration-300
                  ${isLoading 
                    ? 'bg-stone-200 text-stone-400 cursor-not-allowed' 
                    : 'bg-stone-800 text-white hover:bg-rose-400'
                  }
                  relative overflow-hidden group
                `}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-stone-400 border-t-transparent rounded-full animate-spin"></div>
                    <span>PROCESSING...</span>
                  </div>
                ) : (
                  <span className="relative z-10">
                    {state === "login" ? "SIGN IN" : "CREATE ACCOUNT"}
                  </span>
                )}
                {!isLoading && (
                  <span className="absolute inset-0 bg-rose-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></span>
                )}
              </button>

              {/* Toggle between Login/Register */}
              <div className="text-center text-sm text-stone-500">
                {state === "login" ? (
                  <p>
                    New to CREATION EMPIRE?{' '}
                    <button
                      type="button"
                      onClick={() => setState("register")}
                      className="text-rose-400 hover:text-rose-500 font-medium hover:underline transition-all"
                    >
                      Create an account
                    </button>
                  </p>
                ) : (
                  <p>
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => setState("login")}
                      className="text-rose-400 hover:text-rose-500 font-medium hover:underline transition-all"
                    >
                      Sign in
                    </button>
                  </p>
                )}
              </div>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-stone-200"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-3 bg-white text-stone-400">SECURE LOGIN</span>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="flex items-center justify-center gap-4 text-xs text-stone-400">
                <div className="flex items-center gap-1">
                  <FaLock className="text-rose-400 text-[10px]" />
                  <span>256-bit SSL</span>
                </div>
                <div className="w-1 h-1 bg-stone-300 rounded-full"></div>
                <div className="flex items-center gap-1">
                  <span>🔒</span>
                  <span>Secure Payment</span>
                </div>
              </div>
            </form>

            {/* Footer Note */}
            <p className="text-center text-[10px] text-stone-300 mt-6 tracking-wider">
              BY CONTINUING, YOU AGREE TO OUR{' '}
              <button className="text-stone-400 hover:text-rose-400 transition-colors">TERMS</button> AND{' '}
              <button className="text-stone-400 hover:text-rose-400 transition-colors">PRIVACY POLICY</button>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

export default Login;