import React, { useState } from 'react';
import { FaPhone, FaInstagram, FaFacebook, FaTwitter, FaPinterest, FaYoutube, FaHeart, FaWhatsapp } from 'react-icons/fa';
import { MdEmail, MdAccessTime, MdLocationOn } from 'react-icons/md';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const phoneNumber = '+91 79064 82210';

  const handleCall = () => {
    window.location.href = 'tel:+917906482210';
  };

  const handleWhatsApp = () => {
    window.open('https://wa.me/917906482210', '_blank');
  };

  const handleInstagram = () => {
    window.open('https://instagram.com/creationempire', '_blank');
  };

  const handleFacebook = () => {
    window.open('https://facebook.com/creationempire', '_blank');
  };

  const handleTwitter = () => {
    window.open('https://twitter.com/creationempire', '_blank');
  };

  const handlePinterest = () => {
    window.open('https://pinterest.com/creationempire', '_blank');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      
      // Reset status after 3 seconds
      setTimeout(() => setSubmitStatus(null), 3000);
    }, 1500);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-[#faf9f8] py-12 md:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header - Editorial Style */}
        <div className="text-center mb-12 md:mb-16 lg:mb-20">
          <span className="text-xs tracking-[0.3em] text-rose-300 uppercase block mb-3">
            Get in touch
          </span>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-stone-800 mb-4">
            Let's Connect
          </h1>
          <div className="w-20 h-[1px] bg-rose-200 mx-auto"></div>
          <p className="text-sm md:text-base text-stone-400 max-w-2xl mx-auto mt-6">
            We'd love to hear from you. Whether you have a question about our collections, 
            need styling advice, or just want to say hello.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
          {/* Left Column - Contact Information */}
          <div className="lg:col-span-5 space-y-6 md:space-y-8">
            {/* Brand Introduction - Elegant */}
            <div className="bg-white p-6 md:p-8 shadow-sm border border-stone-100">
              <div className="flex items-center gap-3 mb-4">
                <FaHeart className="text-rose-400 text-xl" />
                <h2 className="text-lg md:text-xl font-light text-stone-800">
                  CREATION EMPIRE <span className="text-rose-400">BY PRIYA</span>
                </h2>
              </div>
              <p className="text-sm text-stone-500 leading-relaxed">
                Curating timeless elegance for the modern woman. Each piece is thoughtfully 
                designed to celebrate your unique style and confidence.
              </p>
            </div>

            {/* Single Phone Card - Consolidated */}
            <div className="bg-white p-6 md:p-8 shadow-sm border border-stone-100 hover:border-rose-200 hover:shadow-md transition-all duration-300">
              <div className="flex flex-col items-start gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-rose-50 rounded-full flex items-center justify-center">
                    <FaPhone className="text-rose-400 text-xl" />
                  </div>
                  <div>
                    <p className="text-xs text-stone-400 uppercase tracking-wider mb-1">
                      Call / WhatsApp
                    </p>
                    <p className="text-lg md:text-xl text-stone-700 font-light">
                      {phoneNumber}
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-2 sm:flex-col lg:flex-row">
                  <button
                    onClick={handleCall}
                    className="flex-1 px-4 py-3 text-xs tracking-wider text-stone-600 border border-stone-200 hover:border-rose-400 hover:text-rose-400 hover:bg-rose-50 transition-all duration-300"
                  >
                    CALL
                  </button>
                  <button
                    onClick={handleWhatsApp}
                    className="flex-1 px-4 py-3 text-xs tracking-wider text-stone-600 border border-stone-200 hover:border-rose-400 hover:text-rose-400 hover:bg-rose-50 transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <FaWhatsapp className="text-sm" />
                    CHAT
                  </button>
                </div>
              </div>
            </div>

            

  
          </div>

          {/* Right Column - Contact Form Only (No Map) */}
          <div className="lg:col-span-7">
            {/* Contact Form - Elegant Design */}
            <div className="bg-white p-6 md:p-8 lg:p-10 shadow-sm border border-stone-100">
              <h2 className="text-xl md:text-2xl font-light text-stone-800 mb-6">Send us a message</h2>
              
              {submitStatus === 'success' && (
                <div className="mb-6 p-4 bg-rose-50 border border-rose-200">
                  <p className="text-rose-600 text-sm">
                    Thank you for reaching out! We'll get back to you within 24 hours.
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-stone-400 mb-2">
                      Your Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-0 py-3 bg-transparent border-b border-stone-200 focus:border-rose-400 outline-none text-stone-700 transition-colors"
                      placeholder="Enter your name"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-stone-400 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-0 py-3 bg-transparent border-b border-stone-200 focus:border-rose-400 outline-none text-stone-700 transition-colors"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-stone-400 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-0 py-3 bg-transparent border-b border-stone-200 focus:border-rose-400 outline-none text-stone-700 transition-colors"
                    placeholder="What would you like to discuss?"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-stone-400 mb-2">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="4"
                    className="w-full px-0 py-3 bg-transparent border-b border-stone-200 focus:border-rose-400 outline-none text-stone-700 transition-colors resize-none"
                    placeholder="Your message..."
                  />
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`
                      w-full md:w-auto px-10 py-4 bg-stone-800 text-white text-sm tracking-wider
                      hover:bg-stone-900 transition-all duration-300
                      disabled:opacity-50 disabled:cursor-not-allowed
                      relative overflow-hidden group
                    `}
                  >
                    <span className="relative z-10">
                      {isSubmitting ? 'SENDING...' : 'SEND MESSAGE'}
                    </span>
                    <span className="absolute inset-0 bg-rose-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></span>
                  </button>
                </div>
              </form>

              {/* Response Time Note */}
              <p className="text-xs text-stone-400 mt-6 flex items-center gap-2">
                <MdAccessTime className="text-rose-400" />
                We typically respond within 24 hours
              </p>
            </div>
          </div>
        </div>

        {/* Footer Note - Minimal */}
        <div className="mt-16 md:mt-20 text-center">
          <p className="text-xs text-stone-400">
            © 2024 CREATION EMPIRE BY PRIYA. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Contact;