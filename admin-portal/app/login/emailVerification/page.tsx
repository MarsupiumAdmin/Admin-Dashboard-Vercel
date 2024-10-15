"use client";

import { useState, useEffect, Suspense } from 'react'; // Import Suspense
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { apiUrl } from '../../components/commonConstants';

export default function EmailVerification() {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [timer, setTimer] = useState(120);
  const [timerExpired, setTimerExpired] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [svgScale, setSvgScale] = useState(1);
  const [flag, setFlag] = useState(true);
  const router = useRouter();
  const [email, setEmail] = useState('');
  // console.log(localStorage.getItem('email'));

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

    const interval = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 1) {
          clearInterval(interval);
          setTimerExpired(true);
        }
        return prevTimer > 0 ? prevTimer - 1 : 0;
      });
    }, 1000);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearInterval(interval);
    };
  }, []);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value !== '' && index < 3) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const enteredOtp = otp.join('');
    try {
      const response = await fetch(`${apiUrl}Auth/VerifyOtpAdmin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          otp: enteredOtp,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('Header',data.accessToken);
        router.push('/login/newPassword');
      } else {
        setFlag(false);
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      alert('An error occurred. Please try again.');
    }
  };

  const handleResendCode = () => {
    console.log('Backend work to be done');
    setTimer(120);
    setTimerExpired(false);
  };

  return (
    <Suspense fallback={<div>Loading...</div>}> {/* Add Suspense here */}
      <div className="flex flex-col md:flex-row h-screen w-full bg-[#1e2c2b]">
        {/* Left Side: Marsupium Logo */}
        <div className={`flex justify-center items-center ${isMobile ? 'h-1/3' : 'w-1/2'} bg-[#1e2c2b] p-4`}>
          <div className={`relative ${isMobile ? 'h-48' : 'h-full'} flex items-center ${isMobile ? 'justify-center' : 'justify-center md:justify-end'}`}>
            <Image
              src="/login/marsupium-logo-login.svg"
              alt="Marsupium Logo"
              width={isMobile ? 300 : 500}
              height={isMobile ? 300 : 500}
              className={`${isMobile ? 'mt-[-160px]' : 'md:-mt-20'}`}
            />
          </div>
        </div>

        {/* Right Side: Email Verification Card */}
        <div className={`flex justify-center items-center ${isMobile ? 'mt-[-180px]' : 'w-1/2'} bg-[#1e2c2b] p-4`}>
          <div className="relative bg-white rounded-lg shadow-lg p-8 sm:p-16 w-full max-w-xl h-[700px]">
            <button
              onClick={() => router.push('/login/forgotPassword')}
              className="absolute top-8 left-8 flex items-center text-[#4ECDC4] hover:text-[#4ecdc4cc]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Back
            </button>
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
            <h2 className="text-2xl font-bold mb-4">Email Verification</h2>
            <p className="text-[#5C5C5C] mb-8">A 4-digit code has been sent to {email}</p>
            <form className="flex flex-col" onSubmit={handleSubmit}>
              <div className="flex justify-between mb-8">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    className="w-16 h-16 text-center text-2xl border border-gray-300 rounded-md"
                  />
                ))}
              </div>
              {flag ? '' : <label className='mb-2 text-red-500'>Incorrect OTP</label>}
              <button
                type="submit"
                className="w-full p-2 bg-[#4ECDC4] text-white rounded-md hover:text-gray-900 transition-colors duration-300 hover:bg-[#4ecdc4cc] mt-4"
              >
                Verify Now
              </button>
            </form>
            <div className="mt-8 text-center">
              {timerExpired ? (
                <p className="text-[#5C5C5C] mb-2">Timer has run out. Click on Resend code</p>
              ) : (
                <p className="text-[#5C5C5C] mb-2">
                  Time remaining: {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}
                </p>
              )}
              <button
                onClick={handleResendCode}
                className="text-[#4ECDC4] hover:text-[#4ecdc4cc] p-2 border border-[#4ECDC4] rounded-md"
              >
                Resend code
              </button>
            </div>
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
                alt="SVG C"
                width={200}
                height={200}
                className="rounded-bl-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </Suspense>
  );
}
