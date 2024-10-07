import React from 'react';
import { AlertCircle, CheckCircle, Trash2, X } from 'lucide-react';

interface PopUpProps {
  isOpen: boolean;
  type: 'confirmation' | 'success' | 'delete' | 'error';
  onClose: () => void;
  onConfirm: () => void;
  onCancel?: () => void;
}

const cardConfig = {
  confirmation: {
    icon: AlertCircle,
    header: 'Confirmation',
    message: 'Are you sure you want to process this ? This action cannot be undone.',
    showCancel: true,
    iconColor: 'text-yellow-500',
    iconBgColor: 'bg-yellow-100',
  },
  success: {
    icon: CheckCircle,
    header: 'Success',
    message: 'The information has been updated',
    showCancel: false,
    iconColor: 'text-green-500',
    iconBgColor: 'bg-green-100',
  },
  delete: {
    icon: Trash2,
    header: 'Delete Row',
    message: 'Are you sure you want to delete this row ? This action cannot be undone.',
    showCancel: true,
    iconColor: 'text-red-500',
    iconBgColor: 'bg-red-100',
  },
  error: {
    icon: X,
    header: 'Failed',
    message: 'Something went wrong. Please try again!',
    showCancel: false,
    iconColor: 'text-red-500',
    iconBgColor: 'bg-red-100',
  },
};

export default function PopUp({ isOpen, type, onClose, onConfirm, onCancel }: PopUpProps) {
  if (!isOpen) return null;

  const { icon: Icon, header, message, showCancel, iconColor, iconBgColor } = cardConfig[type];

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50 z-50 px-4 md:px-0">
      <div className="w-full max-w-sm md:max-w-2xl bg-white rounded-xl shadow-xl overflow-hidden">
        <div className="flex justify-between items-center p-4 md:p-6 border-b">
          <div className="flex items-center">
            <div className={`p-2 md:p-3 rounded-full ${iconBgColor}`}>
              <Icon className={`w-6 h-6 md:w-10 md:h-10 ${iconColor}`} />
            </div>
            <h2 className="ml-3 md:ml-4 text-xl md:text-2xl font-semibold text-gray-900">{header}</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6 md:w-8 md:h-8" />
          </button>
        </div>
        <div className="p-4 md:p-6">
          <p className="text-gray-600 text-base md:text-lg">{message}</p>
        </div>
        <div className="flex p-4 md:p-6 border-t">
          {showCancel && (
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2 md:px-6 md:py-3 mr-2 md:mr-3 bg-red-500 text-white text-base md:text-lg font-medium rounded-lg hover:bg-red-600 transition-colors"
            >
              Cancel
            </button>
          )}
          <button
            onClick={onConfirm}
            className={`flex-1 px-4 py-2 md:px-6 md:py-3 ${
              showCancel ? 'ml-2 md:ml-3' : ''
            } bg-teal-500 text-white text-base md:text-lg font-medium rounded-lg hover:bg-teal-600 transition-colors`}
          >
            Ok
          </button>
        </div>
      </div>
    </div>
  );
}