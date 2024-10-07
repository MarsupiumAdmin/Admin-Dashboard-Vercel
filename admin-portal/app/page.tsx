"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');

    if (!token) {
      router.push('/login'); // Redirect to login if token is not present
    } else {
      router.push('/dashboard'); // Set logged in state to true if token exists
    }
  }, [router]);
}
