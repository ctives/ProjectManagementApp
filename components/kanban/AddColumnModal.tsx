'use client'

import React, { useState } from 'react'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import type { Column } from '@/types/kanban'

interface AddColumnModalProps {
  isOpen: boolean
  onClose: () => void
  onAddColumn: (column: Omit<Column, 'id' | 'order'>) => void
}

const colorOptions: Array<Column['color']> = [
  'purple',
  'blue',
  'emerald',
  'amber',
  'rose',
  'cyan',
]

const colorLabels: Record<Column['color'], string> = {
  purple: 'Purple',
  blue: 'Blue',
  emerald: 'Emerald',
  amber: 'Amber',
  rose: 'Rose',
  cyan: 'Cyan',
}

export default function AddColumnModal({
  isOpen,
  onClose,
  onAddColumn,
}: AddColumnModalProps) {
  const [title, setTitle] = useState('')
  const [color, setColor] = useState<Column['color']>('purple')

  const handleSubmit = () => {
    if (title.trim()) {
      onAddColumn({
        title: title.trim(),
        color,
      })
      setTitle('')
      setColor('purple')
      onClose()
    }
  }

  const handleClose = () => {
    setTitle('')
    setColor('purple')
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Add New Column">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Column Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && title.trim() && handleSubmit()}
            autoFocus
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="e.g., Backlog, Review, etc."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Color
          </label>
          <div className="grid grid-cols-3 gap-2">
            {colorOptions.map((option) => (
              <button
                key={option}
                onClick={() => setColor(option)}
                className={`
                  p-3 rounded-lg font-medium text-sm transition-all
                  ${
                    color === option
                      ? 'ring-2 ring-offset-2 ring-gray-400 opacity-100'
                      : 'opacity-60 hover:opacity-80'
                  }
                  ${getColorBg(option)}
                `}
              >
                {colorLabels[option]}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={!title.trim()}
            className="flex-1"
          >
            Create Column
          </Button>
          <Button variant="ghost" onClick={handleClose} className="flex-1">
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  )
}

function getColorBg(color: Column['color']): string {
  const colors: Record<Column['color'], string> = {
    purple: 'bg-purple-200 text-purple-900',
    blue: 'bg-blue-200 text-blue-900',
    emerald: 'bg-emerald-200 text-emerald-900',
    amber: 'bg-amber-200 text-amber-900',
    rose: 'bg-rose-200 text-rose-900',
    cyan: 'bg-cyan-200 text-cyan-900',
  }
  return colors[color]
}
