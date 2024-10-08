"use client";

import { useState } from 'react';
import Header from '../../components/header';
import Sidebar from '../../components/sidebar';
import BackButton from './BackButton';
import UserForm from './UserForm';
import ActionButtons from './ActionButton';
import { useAuthRedirect } from '../../components/commonClientSideFunctions';
import PopUp from '../../popups/popup'
import { apiUrl } from '@/app/components/commonConstants';

export default function AddUserPage() {
  const [isPopUpOpen, setPopUpOpen] = useState(false)
  const [popupType, setPopupType] = useState<'confirmation' | 'success' | 'delete' | 'error'>('confirmation')

  const handleConfirm = () => window.location.href='/user-management';

  const handleOpenPopUp = (type: 'confirmation' | 'success' | 'delete' | 'error') => {
    setPopupType(type)
    setPopUpOpen(true)
  }

  const handleSave = async (user: string, email: string, balance: string, saving: string, goal: string, createdAt: string, password : string) => {
    try {
      const response = await fetch(`${apiUrl}Admin/CreatePlayerByAdmin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization' : `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({
          username: user,
          email: email,
          password: password,
          amountBalance:balance,
          amountGoldGame:goal,
          amountSaving: saving,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        handleOpenPopUp('success');
      } else {
        const errorData = await response.json();
        alert(`Failed to create task: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while creating the task');
    }
  };


  const isLoggedIn = useAuthRedirect(); // Use the reusable function

  if (!isLoggedIn) {
    return null; // Prevent rendering until authentication is verified
  }
  return (
    <div className="flex h-screen flex-col">
      <Header title="Notification" />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 pt-20 w-screen px-10 md:pl-72 md:pr-10 md:pt-20">
          <div className="bg-white rounded-lg shadow-md p-6 flex-grow flex flex-col mt-10">
            <BackButton />
            <h2 className="text-2xl font-semibold mb-6">Add New User</h2>
            <UserForm onSubmit={handleSave} />
            <PopUp
                        isOpen={isPopUpOpen}
                        type={popupType}
                        onClose={handleConfirm}
                        onConfirm={handleConfirm}
                        onCancel={handleConfirm}
                />
          </div>
        </main>
      </div>
    </div>
  );
}