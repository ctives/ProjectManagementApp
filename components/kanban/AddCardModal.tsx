'use client'

import React, { useState } from 'react'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'

interface AddCardModalProps {
  isOpen: boolean
  onClose: () => void
  onAddCard: (title: string, description: string) => void
}

export default function AddCardModal({
  isOpen,
  onClose,
  onAddCard,
}: AddCardModalProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const handleSubmit = () => {
    if (title.trim()) {
      onAddCard(title.trim(), description.trim())
      setTitle('')
      setDescription('')
    }
  }

  const handleClose = () => {
    setTitle('')
    setDescription('')
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Add New Card">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && title.trim() && handleSubmit()}
            autoFocus
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="What needs to be done?"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Notes
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            placeholder="Add any additional notes or details..."
          />
        </div>

        <div className="flex gap-2 pt-2">
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={!title.trim()}
            className="flex-1"
          >
            Create Card
          </Button>
          <Button variant="ghost" onClick={handleClose} className="flex-1">
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  )
}
