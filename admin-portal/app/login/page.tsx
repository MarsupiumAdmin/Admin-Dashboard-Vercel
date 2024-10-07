"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { apiUrl } from '../components/commonConstants';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [svgScale, setSvgScale] = useState(1);
  const router = useRouter();

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsSmallScreen(width < 480);
      if (width < 480) {
        setSvgScale(0.5 + (width / 480) * 0.5); // Scale from 0.5 to 1 between 0 and 480px
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

    try {
      const response = await fetch(`${apiUrl}Auth/LoginAdmin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: username, password }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.errorMessage.Email || errorData.errorMessage.Password  || 'Login failed');
        return;
      }

      const data = await response.json();
      // console.log(data.accessToken);
      // Cookies.set('accessToken', data.accessToken, { expires: 7 }); // Set cookie for 7 days
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('adminId', data.id );
      // Redirect to the dashboard
      if(localStorage.getItem('accessToken'))
      router.push('/dashboard');
      else
      router.push('/login');
    } catch (error) {
      console.error('An error occurred:', error);
      setError('An error occurred while logging in');
    }
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
            className={`${isMobile ? 'mt-[-150px]' : 'md:-mt-20'}`} // Move the logo up on mobile and large screens
          />
        </div>
      </div>

      {/* Right Side: Login Card */}
      <div className={`flex justify-center items-center ${isMobile ? 'mt-[-120px]' : 'w-1/2'} bg-[#1e2c2b] p-4`}>
        <div className="relative bg-white rounded-lg shadow-lg p-8 sm:p-16 w-full max-w-xl h-[700px]"> {/* Adjusted margin-top */}
          {/* Header */}
          <div className="flex items-center mb-6">
            <Image
              src="/login/marsupium-m.svg"
              alt="SVG A"
              width={50}
              height={50}
              className="mr-2"
            />
            <span className="text-lg font-open-sans text-[#5C5C5C]">Marsupium</span>
          </div>
          <h2 className="text-2xl font-bold mb-8">Sign in</h2>

          {/* Login Form */}
          <form className="flex flex-col" onSubmit={handleSubmit}>
            <label className="mb-2">
              Email
              <input
                type="email"
                placeholder="Email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md mb-4"
              />
            </label>
            <label className="mb-4">
              Password
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </label>
            <div className={`flex ${isSmallScreen ? 'flex-col' : 'justify-between'} items-start sm:items-center mb-8`}>
              <label className="flex items-center mb-2 sm:mb-0">
                <input type="checkbox" className="mr-2" />
                Remember me
              </label>
              <a href="/login/forgotPassword" className="text-[#4ECDC4]">Forgot password?</a>
            </div>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <button
              type="submit"
              className="w-full p-2 bg-[#4ECDC4] text-white rounded-md hover:text-gray-900 transition-colors duration-300 hover:bg-[#4ecdc4cc]"
            >
              Login
            </button>
          </form>

          {/* Footer SVGs */}
          <div className="absolute bottom-0 left-0 transform translate-y-[60%]" style={{ transform: `scale(${svgScale})`, transformOrigin: 'bottom left' }}>
            <Image
              src="/login/marsupium-login-bot-left.svg"
              alt="SVG B"
              width={200}
              height={200}
              className="rounded-bl-lg"
            />
          </div>
          <div className="absolute bottom-0 right-0 transform translate-y-[60%]" style={{ transform: `scale(${svgScale})`, transformOrigin: 'bottom right' }}>
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
