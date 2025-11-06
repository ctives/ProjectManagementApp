'use client'

import React, { useState } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { motion } from 'framer-motion'
import { Trash2, Edit2, Sparkles, Loader2 } from 'lucide-react'
import type { Card } from '@/types/kanban'
import CardDetailsModal from './CardDetailsModal'
import PromptModal from './PromptModal'
import { useGeneratePrompt } from '@/hooks/useGeneratePrompt'

interface KanbanCardProps {
  card: Card
  onDelete: (cardId: string) => void
  onUpdate: (cardId: string, updates: Partial<Card>) => void
}

export default function KanbanCard({ card, onDelete, onUpdate }: KanbanCardProps) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [isPromptModalOpen, setIsPromptModalOpen] = useState(false)
  const { isLoading, error, prompt, generatePrompt } = useGeneratePrompt()
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    onDelete(card.id)
  }

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsDetailsOpen(true)
  }

  const handleGeneratePrompt = async (e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      await generatePrompt(card.title)
      setIsPromptModalOpen(true)
    } catch (err) {
      console.error('Failed to generate prompt:', err)
    }
  }

  return (
    <>
      <motion.div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9 }}
        whileHover={{ y: -4 }}
        whileTap={{ scale: 0.98 }}
        className={`
          bg-white rounded-lg p-4 shadow-card border border-gray-200
          cursor-grab active:cursor-grabbing transition-all duration-200
          ${isDragging ? 'opacity-50 shadow-lg scale-105' : 'hover:shadow-card-hover'}
        `}
      >
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-gray-900 flex-1 line-clamp-2">
            {card.title}
          </h3>
          <div className="flex gap-1 flex-shrink-0">
            <button
              onClick={handleGeneratePrompt}
              disabled={isLoading}
              className="p-1 text-gray-400 hover:text-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Generate AI prompt"
            >
              {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
            </button>
            <button
              onClick={handleEdit}
              className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
              title="Edit card"
            >
              <Edit2 size={16} />
            </button>
            <button
              onClick={handleDelete}
              className="p-1 text-gray-400 hover:text-red-600 transition-colors"
              title="Delete card"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        {card.description && (
          <p className="text-sm text-gray-600 line-clamp-3">
            {card.description}
          </p>
        )}

        {error && (
          <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
            {error}
          </div>
        )}

        <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-400">
          {new Date(card.createdAt).toLocaleDateString()}
        </div>
      </motion.div>

      <CardDetailsModal
        card={card}
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        onUpdate={onUpdate}
      />

      <PromptModal
        isOpen={isPromptModalOpen}
        onClose={() => setIsPromptModalOpen(false)}
        prompt={prompt || ''}
        taskTitle={card.title}
      />
    </>
  )
}
