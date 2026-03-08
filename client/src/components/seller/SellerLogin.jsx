import React, { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import { FaEye, FaEyeSlash, FaStore, FaShieldAlt, FaLock } from 'react-icons/fa';
import { MdEmail, MdLock, MdAdminPanelSettings } from 'react-icons/md';

function SellerLogin() {
  const { isSeller, setIsSeller, navigate, axios } = useAppContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const validateForm = () => {
    const errors = {};
    
    if (!email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Please enter a valid email address";
    }
    
    if (!password) {
      errors.password = "Password is required";
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);

    try {
      const { data } = await axios.post("/api/seller/login", {
        email,
        password
      });

      if (data.success) {
        setIsSeller(true);
        toast.success("Welcome back to your seller dashboard!", {
          style: {
            background: '#10b981',
            color: '#fff',
            borderRadius: '4px',
          },
          icon: '👋',
        });
        navigate("/seller");
      } else {
        toast.error(data.message || "Login failed");
        setIsLoading(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isSeller) {
      navigate("/seller");
    }
  }, [isSeller]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Don't render if already logged in
  if (isSeller) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-stone-100 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-rose-100 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-rose-100 rounded-full opacity-20 blur-3xl"></div>
      </div>

      {/* Main Container */}
      <div className="relative w-full max-w-md">
        {/* Decorative Elements */}
        <div className="absolute -top-4 -left-4 w-24 h-24 border-l-2 border-t-2 border-rose-200"></div>
        <div className="absolute -bottom-4 -right-4 w-24 h-24 border-r-2 border-b-2 border-rose-200"></div>

        {/* Login Card */}
        <div className="bg-white/90 backdrop-blur-sm shadow-2xl border border-stone-100 p-8 md:p-10 relative">
          {/* Header with Icon */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-rose-50 to-stone-50 rounded-full flex items-center justify-center border-2 border-rose-200">
                  <FaStore className="text-rose-400 text-3xl" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-400 rounded-full border-2 border-white"></div>
              </div>
            </div>
            
            <h2 className="text-2xl font-light text-stone-800">
              Seller Portal
            </h2>
            <div className="flex items-center justify-center gap-2 mt-2">
              <MdAdminPanelSettings className="text-rose-300 text-sm" />
              <p className="text-xs text-stone-400 uppercase tracking-wider">
                CREATION EMPIRE BY PRIYA
              </p>
            </div>
          </div>

          {/* Welcome Message */}
          <div className="text-center mb-6">
            <h3 className="text-xl md:text-2xl font-light text-stone-700">
              Welcome Back
            </h3>
            <p className="text-xs text-stone-400 mt-1">
              Sign in to manage your store
            </p>
            <div className="w-12 h-[1px] bg-rose-200 mx-auto mt-3"></div>
          </div>

          <form onSubmit={onSubmit} className="space-y-5">
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
                  type="email"
                  placeholder="seller@creationempire.com"
                  className={`
                    w-full pl-10 pr-4 py-3.5 text-sm border bg-stone-50 
                    focus:bg-white transition-all duration-300 outline-none
                    ${formErrors.email 
                      ? 'border-rose-400 focus:border-rose-400' 
                      : 'border-stone-200 focus:border-rose-400'
                    }
                  `}
                />
              </div>
              {formErrors.email && (
                <p className="text-xs text-rose-400 mt-1 flex items-center gap-1">
                  <span className="w-1 h-1 bg-rose-400 rounded-full"></span>
                  {formErrors.email}
                </p>
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
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className={`
                    w-full pl-10 pr-12 py-3.5 text-sm border bg-stone-50 
                    focus:bg-white transition-all duration-300 outline-none
                    ${formErrors.password 
                      ? 'border-rose-400 focus:border-rose-400' 
                      : 'border-stone-200 focus:border-rose-400'
                    }
                  `}
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
                <p className="text-xs text-rose-400 mt-1 flex items-center gap-1">
                  <span className="w-1 h-1 bg-rose-400 rounded-full"></span>
                  {formErrors.password}
                </p>
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
                relative overflow-hidden group mt-2
              `}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-stone-400 border-t-transparent rounded-full animate-spin"></div>
                  <span>AUTHENTICATING...</span>
                </div>
              ) : (
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <FaLock className="text-sm" />
                  ACCESS SELLER DASHBOARD
                </span>
              )}
              {!isLoading && (
                <span className="absolute inset-0 bg-rose-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></span>
              )}
            </button>

            {/* Security Notice */}
            <div className="flex items-center justify-center gap-2 mt-4 text-xs text-stone-400">
              <FaShieldAlt className="text-rose-300" />
              <span>Secure 256-bit SSL Encrypted Connection</span>
            </div>
          </form>

          {/* Footer */}
          <div className="mt-6 pt-6 border-t border-stone-100">
            <p className="text-center text-[10px] text-stone-300 tracking-wider">
              © 2024 CREATION EMPIRE BY PRIYA. ALL RIGHTS RESERVED.
            </p>
            <p className="text-center text-[8px] text-stone-200 mt-2">
              SELLER PORTAL v2.0
            </p>
          </div>
        </div>

        {/* Help Link */}
        <div className="text-center mt-4">
          <button className="text-xs text-stone-400 hover:text-rose-400 transition-colors">
            Need help accessing your account?
          </button>
        </div>
      </div>
    </div>
  );
}

export default SellerLogin;