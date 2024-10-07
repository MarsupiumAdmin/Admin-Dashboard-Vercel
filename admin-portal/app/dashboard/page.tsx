"use client";

import { useState, useEffect } from 'react';
import { useAuthRedirect } from '../components/commonClientSideFunctions';
import Header from '../components/header';
import Sidebar from '../components/sidebar';
import WelcomeBanner from './welcomeBanner';
import StatCards from './statCards';
import UserDistribution from './userDistribution';
import PushNotifications from './pushNotifications';
import { apiUrl } from '../components/commonConstants';

export default function Page() {

  const [username, setUsername] = useState('');
  const isLoggedIn = useAuthRedirect(); // Use the reusable function
  const [statCardsData, setStatCardsData] = useState('');
  const [loader,setLoader] = useState(true);

  useEffect(() => {
    const adminID = localStorage.getItem('adminId');
    const accessToken = localStorage.getItem('accessToken');

    if (adminID) {
        // First API call to fetch admin details
        fetch(`${apiUrl}User/Admin/${adminID}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json(); // Parse the JSON response
        })
        .then((data) => {
            setUsername(data.data.username); // Set the username

            // After successfully fetching admin details, make the second API call
            return fetch(`${apiUrl}User/Dashboard`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                }
            });
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json(); // Parse the JSON response for the dashboard data
        })
        .then((dashboardData) => {
            setStatCardsData(dashboardData)
            setLoader(false);
        })
        .catch((error) => {
            console.error('Error:', error); // Catch any errors in the process
        });
    }
}, []);


  if (!isLoggedIn) {
    return null; // Prevent rendering until authentication is verified
  }

  return (
    loader? <div className="loader"></div>:
    <div className="flex h-screen flex-col">
      <Header title="Dashboard" />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 pt-20 w-screen md:pl-64 md:pt-20">
          <div className="p-6">
            <WelcomeBanner name={username} />
            <StatCards data = {statCardsData}/>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-6 lg:grid-cols-3">
            <div className="col-span-1 md:col-span-1 lg:col-span-2">
              <UserDistribution />
            </div>
            <div className="col-span-1 md:col-span-1 lg:col-span-1">
              <PushNotifications />
            </div>
          </div>
          </div>
        </main>
      </div>
    </div>
  );
}
