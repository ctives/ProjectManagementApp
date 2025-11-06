'use client'

import React, { useState } from 'react'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import type { Card } from '@/types/kanban'

interface CardDetailsModalProps {
  card: Card
  isOpen: boolean
  onClose: () => void
  onUpdate: (cardId: string, updates: Partial<Card>) => void
}

export default function CardDetailsModal({
  card,
  isOpen,
  onClose,
  onUpdate,
}: CardDetailsModalProps) {
  const [title, setTitle] = useState(card.title)
  const [description, setDescription] = useState(card.description)

  const handleSave = () => {
    onUpdate(card.id, {
      title: title.trim() || card.title,
      description: description.trim(),
    })
    onClose()
  }

  const handleReset = () => {
    setTitle(card.title)
    setDescription(card.description)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Card">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400"
            placeholder="Card title"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
            Notes
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={6}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 resize-none"
            placeholder="Add notes or details..."
          />
        </div>

        <div className="text-xs text-gray-500 dark:text-gray-400">
          Created: {new Date(card.createdAt).toLocaleString()}
        </div>

        <div className="flex gap-2 pt-2">
          <Button variant="primary" onClick={handleSave} className="flex-1">
            Save Changes
          </Button>
          <Button variant="ghost" onClick={handleReset} className="flex-1">
            Reset
          </Button>
        </div>
      </div>
    </Modal>
  )
}
