import React, { useEffect, useState } from 'react';
import { assets } from '../assets/assets';
import { useAppContext } from '../context/AppContext';
import { toast } from 'react-hot-toast';

const InputField = ({ type, placeholder, name, handleChange, address, icon }) => (
  <div className="relative">
    {icon && (
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
        {icon}
      </div>
    )}
    <input
      className={`w-full px-2 py-4 ${icon ? 'pl-12' : 'pl-6'} pr-6 bg-white border border-gray-200 rounded-2xl outline-none text-gray-700 text-base transition-all duration-300 focus:border-[#D4A5A5] focus:ring-2 focus:ring-[#D4A5A5]/20 placeholder:text-gray-400 hover:border-gray-300`}
      type={type}
      placeholder={placeholder}
      onChange={handleChange}
      name={name}
      value={address[name] || ''}
      required
    />
  </div>
);

function Addaddress() {
  const { axios, user, navigate } = useAppContext();

  const [address, setAddress] = useState({
    firstname: '',
    lastname: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zipcode: '',
    country: '',
    phone: '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const requiredFields = ['firstname', 'lastname', 'email', 'street', 'city', 'state', 'zipcode', 'country', 'phone'];

    for (let field of requiredFields) {
      if (!address[field]?.trim()) {
        toast.error(`Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        return false;
      }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(address.email)) {
      toast.error('Please enter a valid email address');
      return false;
    }

    if (address.phone.length < 10) {
      toast.error('Please enter a valid phone number (minimum 10 digits)');
      return false;
    }

    return true;
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error('Please login to add address');
      navigate('/login');
      return;
    }

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      console.log('=== SUBMITTING ADDRESS ===');
      console.log('User:', user);
      console.log('Address Data:', address);

      const requestData = {
        address: {
          ...address,
          email: address.email || user.email,
        },
      };

      console.log('Request Payload:', requestData);

      const { data } = await axios.post('/api/address/add', requestData);

      console.log('API Response:', data);

      if (data.success) {
        toast.success('Address added successfully!');
        navigate('/cart');
      } else {
        toast.error(data.message || 'Failed to add address');
      }
    } catch (error) {
      console.error('=== API ERROR ===');
      console.error('Error:', error);
      console.error('Response:', error.response?.data);

      let errorMessage = 'Failed to add address';

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      } else if (error.response?.status === 401) {
        errorMessage = 'Please login again';
        navigate('/login');
      }

      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.email && !address.email) {
      setAddress((prev) => ({
        ...prev,
        email: user.email,
      }));
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      toast.error('Please login to continue');
      navigate('/login');
    }
  }, [user, navigate]);

  // Icons for form fields
  const UserIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );

  const EmailIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );

  const LocationIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );

  const PhoneIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FDF8F5] to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-light text-gray-900 mb-4 tracking-tight">
            Shipping <span className="font-medium text-[#D4A5A5]">Address</span>
          </h1>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto font-light">
            Enter your delivery details for a seamless shopping experience
          </p>
        </div>

        {/* User Status */}
        {user ? (
          <div className="max-w-2xl mx-auto mb-8">
            <div className="bg-[#F5E6E6]/30 backdrop-blur-sm rounded-2xl p-5 border border-[#D4A5A5]/20">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-[#D4A5A5] rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-[#D4A5A5] font-medium">Welcome back</p>
                  <p className="text-gray-700 font-medium">{user.email || user.name}</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto mb-8">
            <div className="bg-red-50/80 backdrop-blur-sm rounded-2xl p-5 border border-red-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-red-400 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-red-600 font-medium">Authentication required</p>
                  <p className="text-gray-600">Please login to continue</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row items-center lg:items-start justify-center gap-12 lg:gap-20">
          {/* Form Section */}
          <div className="w-full max-w-xl">
            <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-8 md:p-10 border border-gray-100">
              <form onSubmit={onSubmitHandler} className="space-y-6">
                {/* Name Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField
                    handleChange={handleChange}
                    address={address}
                    name="firstname"
                    type="text"
                    placeholder="First Name"
                    icon={<UserIcon />}
                  />
                  <InputField
                    handleChange={handleChange}
                    address={address}
                    name="lastname"
                    type="text"
                    placeholder="Last Name"
                    icon={<UserIcon />}
                  />
                </div>

                {/* Email */}
                <InputField
                  handleChange={handleChange}
                  address={address}
                  name="email"
                  type="email"
                  placeholder="Email Address"
                  icon={<EmailIcon />}
                />

                {/* Street Address */}
                <InputField
                  handleChange={handleChange}
                  address={address}
                  name="street"
                  type="text"
                  placeholder="Street Address"
                  icon={<LocationIcon />}
                />

                {/* City & State */}
                <div className="grid grid-cols-2 gap-4">
                  <InputField
                    handleChange={handleChange}
                    address={address}
                    name="city"
                    type="text"
                    placeholder="City"
                  />
                  <InputField
                    handleChange={handleChange}
                    address={address}
                    name="state"
                    type="text"
                    placeholder="State"
                  />
                </div>

                {/* Zip & Country */}
                <div className="grid grid-cols-2 gap-4">
                  <InputField
                    handleChange={handleChange}
                    address={address}
                    name="zipcode"
                    type="text"
                    placeholder="ZIP Code"
                  />
                  <InputField
                    handleChange={handleChange}
                    address={address}
                    name="country"
                    type="text"
                    placeholder="Country"
                  />
                </div>

                {/* Phone */}
                <InputField
                  handleChange={handleChange}
                  address={address}
                  name="phone"
                  type="tel"
                  placeholder="Phone Number"
                  icon={<PhoneIcon />}
                />

                {/* Action Buttons */}
                <div className="space-y-4 pt-4">
                  <button
                    type="submit"
                    disabled={loading || !user}
                    className={`w-full py-4 rounded-2xl font-medium text-base transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] ${
                      loading || !user
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : 'bg-[#D4A5A5] text-white hover:bg-[#C48F8F] shadow-lg shadow-[#D4A5A5]/30 hover:shadow-xl hover:shadow-[#D4A5A5]/40'
                    }`}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center space-x-2">
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Adding Address...</span>
                      </span>
                    ) : (
                      'Save Address'
                    )}
                  </button>

                  {!user && (
                    <button
                      type="button"
                      onClick={() => navigate('/login')}
                      className="w-full py-4 bg-white text-gray-700 rounded-2xl font-medium border-2 border-gray-200 hover:border-[#D4A5A5] hover:text-[#D4A5A5] transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
                    >
                      Login to Continue
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* Image Section */}
          <div className="hidden lg:block w-full max-w-md">
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-[#D4A5A5]/10 rounded-full blur-2xl"></div>
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-[#F5E6E6] rounded-full blur-2xl"></div>
              <img
                className="relative z-10 w-full h-auto object-contain transform hover:scale-105 transition-transform duration-700"
                src={assets.add_address_iamge}
                alt="Add Address Illustration"
              />
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm rounded-2xl px-6 py-3 shadow-xl">
                <p className="text-sm text-gray-600 font-light">
                  Secure & <span className="font-medium text-[#D4A5A5]">encrypted</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-16 flex flex-wrap justify-center gap-8">
          {['Free Shipping', 'Secure Payment', 'Easy Returns', '24/7 Support'].map((badge, index) => (
            <div key={index} className="flex items-center space-x-2 text-gray-500">
              <svg className="w-5 h-5 text-[#D4A5A5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-sm font-light">{badge}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Addaddress;