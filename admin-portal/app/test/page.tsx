"use client"

import { useState } from 'react'
import { AlertCircle, CheckCircle, Trash2, X } from 'lucide-react'
import PopUp from '../popups/popup'

export default function Page() {
  const [isPopUpOpen, setPopUpOpen] = useState(false)
  const [popupType, setPopupType] = useState<'confirmation' | 'success' | 'delete' | 'error'>('confirmation')

  const handleOpenPopUp = (type: 'confirmation' | 'success' | 'delete' | 'error') => {
    setPopupType(type)
    setPopUpOpen(true)
  }

  const handleClose = () => setPopUpOpen(false)
  const handleConfirm = () => {
    alert(`Action confirmed for ${popupType} popup!`)
    setPopUpOpen(false)
  }

  return (
    <div className="p-8 space-y-4">
      <h1 className="text-2xl font-bold mb-4">PopUp Demo</h1>
      
      <button
        onClick={() => handleOpenPopUp('confirmation')}
        className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
      >
        Open Confirmation PopUp
      </button>

      <button
        onClick={() => handleOpenPopUp('success')}
        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors ml-4"
      >
        Open Success PopUp
      </button>

      <button
        onClick={() => handleOpenPopUp('delete')}
        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors ml-4"
      >
        Open Delete PopUp
      </button>

      <button
        onClick={() => handleOpenPopUp('error')}
        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors ml-4"
      >
        Open Error PopUp
      </button>

      <PopUp
        isOpen={isPopUpOpen}
        type={popupType}
        onClose={handleClose}
        onConfirm={handleConfirm}
        onCancel={handleClose}
      />
    </div>
  )
}