"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

// Reusable function to check if the user is logged in
export function useAuthRedirect() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.push('/login'); // Redirect to login if token doesn't exist
    } else {
      setIsLoggedIn(true); // Set logged-in state if token exists
    }
  }, [router]);

  return isLoggedIn; // Return the login state
}

export function modifyDate(date:string){
  let tempDate = date.split("/"); //In DD/MM/YYYY format
  if(tempDate[1].length == 1){
    tempDate[1] = "0"+tempDate[1]
  }
  if(tempDate[0].length == 1){
    tempDate[0] = "0"+tempDate[0]
  }
  let newDate =tempDate[2]+"-"+tempDate[1]+"-"+tempDate[0];
  return newDate;
}
