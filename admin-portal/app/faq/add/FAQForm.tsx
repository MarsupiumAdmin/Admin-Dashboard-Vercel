import React, { useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';

interface FAQFormProps {
  onSubmit: (faqTitle: string, textFAQ: string) => void;
}

export default function FAQForm({ onSubmit }: FAQFormProps) {
  const [faqTitle, setFAQTitle] = useState('');
  const [textFAQ, setTextFAQ] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  // Dynamically import ReactQuill with SSR disabled
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(faqTitle, textFAQ);
  };

    const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const toolbarOptions = [
    [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    ['bold', 'italic', 'underline'],
    [{ 'align': [] }],
    ['link'], // Only link option
    [{ 'script': 'sub'}, { 'script': 'super' }],
    [{ 'indent': '-1'}, { 'indent': '+1' }],
    [{ 'direction': 'rtl' }],
    [{ 'color': [] }, { 'background': [] }],
    [{ 'size': [] }],
    ['clean'] // remove formatting button
  ];

  return (
    <form onSubmit={handleSubmit} className="flex-grow flex flex-col">
      <div className="mb-4">
        <label htmlFor="faqTitle" className="block text-sm font-medium text-gray-700 mb-1">
          FAQ Title
        </label>
        <input
          type="text"
          id="faqTitle"
          value={faqTitle}
          onChange={(e) => setFAQTitle(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500"
          placeholder="Enter FAQ title"
          required
        />
      </div>

      <div className="mb-4">
      <label htmlFor="textFAQ" className="block text-sm font-medium text-gray-700 mb-1">
        FAQ Text
      </label>
      <ReactQuill
        value={textFAQ}
        onChange={setTextFAQ}
        className="w-full border border-gray-300 rounded-md"
        placeholder="Enter text"
        modules={{
          toolbar: {
            container: toolbarOptions
          }
        }}
      />
    </div>

    </form>
  );
}
