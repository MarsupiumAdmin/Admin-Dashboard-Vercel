"use client";

import { useState } from 'react';
import Header from '../../components/header';
import Sidebar from '../../components/sidebar';
import BackButton from './BackButton';
import FAQForm from './FAQForm';
import ActionButtons from './ActionButton';
import { useAuthRedirect } from '../../components/commonClientSideFunctions';

export default function AddFAQPage() {
  const handleSave = (notificationTitle: string, textFAQ: string) => {
    console.log({ notificationTitle, textFAQ });
  };

  const isLoggedIn = useAuthRedirect(); // Use the reusable function

  if (!isLoggedIn) {
    return null; // Prevent rendering until authentication is verified
  }
  return (
    <div className="flex h-screen flex-col">
      <Header title="FAQ" />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 pt-20 w-screen px-10 md:pl-72 md:pr-10 md:pt-20">
          <div className="bg-white rounded-lg shadow-md p-6 flex-grow flex flex-col mt-10">
            <BackButton />
            <h2 className="text-2xl font-semibold mb-6">Add New FAQ</h2>
            <FAQForm onSubmit={handleSave} />
            <ActionButtons onSave={() => console.log('Save clicked')} />
          </div>
        </main>
      </div>
    </div>
  );
}

