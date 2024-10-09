import { useState, useEffect } from 'react';
import Image from 'next/image';
import { apiUrl } from './commonConstants';

export default function Header({ title }: { title: string }) {
  const [isMobile, setIsMobile] = useState(false);
  const [currentDate, setCurrentDate] = useState('');
  const [adminDetails, setAdminDetails] = useState({ username: '', role: '', imageUrl: '' });

  useEffect(() => { 
    const updateDate = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      };
      setCurrentDate(now.toLocaleDateString('en-AU', options));
    };

    updateDate();
    const timer = setInterval(updateDate, 1000 * 60); // Update every minute

    return () => clearInterval(timer);
  }, []);




  useEffect(() => {
    // Detect if screen is smaller than 768px
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize(); // Check initial size

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  //Populate Header with Admin Details
  useEffect(() => {
    const adminID = localStorage.getItem('adminId');
    if (adminID) {
      fetch(`${apiUrl}Admin/Admin/${adminID}`,
        {
          method: 'GET',
          headers:{
            'Content-Type':'application/json',
            'Authorization':`Bearer ${localStorage.getItem("accessToken")}`
          }
        }
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then((data) => {
          setAdminDetails({
            username: data.data.username,
            role: data.data.role,
            imageUrl: data.data.image
          });
        })
        .catch((error) => {
          console.error('Error fetching admin details:', error);
        });
    }
  }, []);

  // Function to highlight the first part of the date in #4ECDC4
  const formatDate = (date: string) => {
    const dateArray = date.split(' ');
    const [day, ...rest] = dateArray;
    return (
      <>
        <span className="text-[#4ECDC4]">{day}</span> {rest.join(' ')}
      </>
    );
  };

  return isMobile ? (
    <header className="bg-[#234E4B] h-16 fixed top-0 w-full z-10 flex items-center justify-between px-4">
      {/* Mobile Header */}
      <div className='flex-col'>
        <div className="text-white text-xs font-bold ml-10">{title}</div>
        <div className="text-white text-xs font-bold ml-10">{formatDate(currentDate)}</div>
      </div>
      <a 
       href='/profile'
       className='flex items-center space-x-4 p-2 hover:bg-[#315c59] hover:shadow-lg transition-all duration-300 ease-in-out rounded'>
        <Image
          src={adminDetails.imageUrl || "/login/marsupium-m.svg"} // Use the dynamic image URL
          alt="User Profile"
          width={24}
          height={24}
          className="rounded-full"
        />
        <div className="flex flex-col text-white">
          <span className="text-xs font-semibold">{adminDetails.username}</span>
          <span className="text-xs">{adminDetails.role ? adminDetails.role : "Admin"}</span>
        </div>
      </a>
    </header>
  ) : (
    <header className="bg-[#234E4B] h-20 fixed top-0 left-64 right-0 z-10 flex items-center justify-between px-6">
      {/* Desktop Header */}
      <div className="text-white">
        <div className="text-3xl font-bold">{title}</div>
        <div className="text-medium">{formatDate(currentDate)}</div>
      </div>
      <a
        href='/profile'
        className='flex items-center space-x-4 p-2 hover:bg-[#315c59] hover:shadow-lg transition-all duration-300 ease-in-out rounded'
      >
        <div className="flex items-center cursor-pointer transform hover:scale-105 transition-transform duration-300">
          <Image
            src={adminDetails.imageUrl || "/login/marsupium-m.svg"} // Use the dynamic image URL
            alt="User Profile"
            width={32}
            height={32}
            className="rounded-full"
          />
        </div>
        <div className="flex flex-col text-white">
          <span className="font-semibold">{adminDetails.username}</span>
          <span className="text-sm">{adminDetails.role? adminDetails.role : "Admin"}</span>
        </div>
      </a>
    </header>
  );
}
