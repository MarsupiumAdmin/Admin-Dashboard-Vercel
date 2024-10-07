"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const [svgScale, setSvgScale] = useState(1);
  const router = useRouter();

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      if (width < 480) {
        setSvgScale(0.5 + (width / 480) * 0.5);
      } else {
        setSvgScale(1);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Password reset requested for:', email);
    router.push(`/login/emailVerification?email=${encodeURIComponent(email)}`);
  };

  return (
    <div className="flex flex-col md:flex-row h-screen w-full bg-[#1e2c2b]">
      {/* Left Side: Marsupium Logo */}
      <div className={`flex justify-center items-center ${isMobile ? 'h-1/3' : 'w-1/2'} bg-[#1e2c2b] p-4`}>
        <div className={`relative ${isMobile ? 'h-48' : 'h-full'} flex items-center ${isMobile ? 'justify-center' : 'justify-center md:justify-end'}`}>
          <Image
            src="/login/marsupium-logo-login.svg"
            alt="Marsupium Logo"
            width={isMobile ? 300 : 500}
            height={isMobile ? 300 : 500}
            className={`${isMobile ? 'mt-[-150px]' : 'md:-mt-20'}`}
          />
        </div>
      </div>

      {/* Right Side: Forgot Password Card */}
      <div className={`flex justify-center items-center ${isMobile ? 'mt-[-180px]' : 'w-1/2'} bg-[#1e2c2b] p-4`}>
        <div className="relative bg-white rounded-lg shadow-lg p-8 sm:p-16 w-full max-w-xl h-[700px]">
          {/* Back Button */}
          <button
            onClick={() => router.push('/login')}
            className="absolute top-8 left-8 flex items-center text-[#4ECDC4] hover:text-[#4ecdc4cc]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back
          </button>

          {/* Header */}
          <div className="flex items-center mb-6 mt-12">
            <Image
              src="/login/marsupium-m.svg"
              alt="SVG A"
              width={50}
              height={50}
              className="mr-2"
            />
            <span className="text-lg font-open-sans text-[#5C5C5C]">Marsupium</span>
          </div>
          <h2 className="text-2xl font-bold mb-4">Forgot Password</h2>
          <p className="text-[#5C5C5C] mb-8">Please enter the address associated with your account</p>

          {/* Forgot Password Form */}
          <form className="flex flex-col" onSubmit={handleSubmit}>
            <label className="mb-2">
              Email
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md mb-4"
                required
              />
            </label>
            <button
              type="submit"
              className="w-full p-2 bg-[#4ECDC4] text-white rounded-md hover:text-gray-900 transition-colors duration-300 hover:bg-[#4ecdc4cc] mt-4"
            >
              Send Request
            </button>
          </form>

          {/* Footer SVGs */}
          <div className="absolute bottom-0 left-0 transform translate-x-[] translate-y-[60%]" style={{ transform: `scale(${svgScale})`, transformOrigin: 'bottom left' }}>
            <Image
              src="/login/marsupium-login-bot-left.svg"
              alt="SVG B"
              width={200}
              height={200}
              className="rounded-bl-lg"
            />
          </div>
          <div className="absolute bottom-0 right-0 transform translate-x-[] translate-y-[60%]" style={{ transform: `scale(${svgScale})`, transformOrigin: 'bottom right' }}>
            <Image
              src="/login/marsupium-login-bot-right.svg"
              alt="SVG A"
              width={125}
              height={125}
              className="rounded-br-lg"
            />
          </div>
        </div>
      </div>
    </div>
  );
}