"use client";

import { useState, useRef, useEffect } from 'react';
import Header from '../components/header';
import Sidebar from '../components/sidebar';
import { User, Mail, Lock, UserCheck, Eye, EyeOff, Upload } from 'lucide-react';
import Image from 'next/image'
import { apiUrl } from '../components/commonConstants';

export default function ProfilePage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [role, setRole] = useState('');
  const [loader,setLoader] = useState(true);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log('File selected:', file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    const adminID = localStorage.getItem('adminId');
    const accessToken = localStorage.getItem('accessToken');

    if (adminID) {
        // First API call to fetch admin details
        fetch(`${apiUrl}Admin/Admin/${adminID}`, {
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
            console.log("Data: ", data)
            setName(data.data.username)
            setEmail(data.data.email)
            setRole(data.data.role);
            setLoader(false);
        })
        .catch((error) => {
            console.error('Error:', error); // Catch any errors in the process
        });
    }
}, []);

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSaveChanges = async () => {
    const adminID = localStorage.getItem('adminId');
    try {
      if (adminID) {
        const response = await fetch(`${apiUrl}Admin/UpdateAdmin/${adminID}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem("accessToken")}`
            },
            body: JSON.stringify({
              // name: editedData.name,
              // email: editedData.email,
              // role: editedData.role
            }),
          });
        if (response.ok) {
          // setPopUpOpen(false)
          window.location.reload();
        }
        else {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to update task');
        }
      }
    }
    catch (error: any) {
      console.error('Failed to update task:', error);
      // handleOpenPopUp('error');
      alert(error);
    }
    setIsEditing(false);
  };

  return (
    loader? <div className="loader"></div>:
    <div className="flex h-screen flex-col">
      <Header title="Profile" />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 pt-20 w-screen md:pl-64 md:pt-20 p-6 ml-3">
          <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg overflow-hidden mt-6">
            <div className="md:flex">
              <div className="md:flex-shrink-0">
                <div className="h-48 w-full md:w-48 bg-gray-300 flex flex-col items-center justify-center relative">
                  <Image 
                  src={profileImage} 
                  alt="Profile" 
                  className="h-full w-full object-cover" 
                  width={100}
                  height={100}
                  />
                  <button
                    hidden={!isEditing}
                    onClick={triggerFileInput}
                    className="absolute bottom-2 left-2 px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
                  >
                  <Upload className="w-4 h-4 inline mr-1" />
                    Upload
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    className="hidden"
                    accept="image/*"
                  />
                </div>
              </div>
              <div className="p-8 w-full">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Admin Profile</h2>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition duration-300"
                  >
                    {isEditing ? 'Cancel' : 'Edit Profile'}
                  </button>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <User className="mr-2 h-5 w-5 text-gray-500" />
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 w-24">Name</label>
                    <input
                      type="text"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={!isEditing}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                  </div>
                  <div className="flex items-center">
                    <Mail className="mr-2 h-5 w-5 text-gray-500" />
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 w-24">Email</label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={!isEditing}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                  </div>
                  <div className="flex items-center">
                    <Lock className="mr-2 h-5 w-5 text-gray-500" />
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 w-24">Password</label>
                    <div className="relative w-full">
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={!isEditing}
                        placeholder={!isEditing? '' : 'Change Password'}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 pr-10"
                      />
                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5 text-gray-500" /> : <Eye className="h-5 w-5 text-gray-500" />}
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <UserCheck className="mr-2 h-5 w-5 text-gray-500" />
                    <label htmlFor="role" className="block text-sm font-medium text-gray-700 w-24">Role</label>
                    <input
                      type="text"
                      id="role"
                      value={role}
                      readOnly
                      className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm"
                    />
                  </div>
                </div>
                {isEditing && (
                  <div className="mt-6">
                    <button
                      onClick={handleSaveChanges}
                      className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
                    >
                      Save Changes
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}