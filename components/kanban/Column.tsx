'use client'

import React, { useState } from 'react'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { motion } from 'framer-motion'
import { Plus, Trash2 } from 'lucide-react'
import type { Column as ColumnType, Card } from '@/types/kanban'
import { columnColors } from '@/lib/utils'
import KanbanCard from './KanbanCard'
import AddCardModal from './AddCardModal'

interface ColumnProps {
  column: ColumnType
  cards: Card[]
  onAddCard: (columnId: string, title: string, description: string) => void
  onDeleteCard: (cardId: string) => void
  onUpdateCard: (cardId: string, updates: Partial<Card>) => void
  onDeleteColumn?: (columnId: string) => void
}

export default function Column({
  column,
  cards,
  onAddCard,
  onDeleteCard,
  onUpdateCard,
  onDeleteColumn,
}: ColumnProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const { setNodeRef, isOver } = useDroppable({ id: column.id })

  const colors = columnColors[column.color] || columnColors.purple
  const cardIds = cards.map(c => c.id)

  const handleAddCard = (title: string, description: string) => {
    onAddCard(column.id, title, description)
    setIsAddModalOpen(false)
  }

  return (
    <div className="flex flex-col h-full w-80 flex-shrink-0">
      {/* Column Header */}
      <div className={`${colors.header} rounded-t-lg p-4 shadow-md transition-colors duration-200`}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-bold text-lg">{column.title}</h2>
            <p className="text-sm text-gray-300 dark:text-gray-400 mt-1">{cards.length} card{cards.length !== 1 ? 's' : ''}</p>
          </div>
          {column.id !== 'todo' && column.id !== 'in-progress' && column.id !== 'completed' && onDeleteColumn && (
            <button
              onClick={() => onDeleteColumn(column.id)}
              className="p-2 text-white hover:bg-white/10 dark:hover:bg-white/20 rounded-lg transition-colors"
              title="Delete column"
            >
              <Trash2 size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Column Content */}
      <motion.div
        ref={setNodeRef}
        className={`
          flex-1 ${colors.bg} rounded-b-lg p-4 space-y-3 overflow-y-auto
          ${isOver ? 'ring-2 ring-offset-2 ring-purple-500 bg-opacity-50' : ''}
          transition-all duration-200
        `}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <SortableContext items={cardIds} strategy={verticalListSortingStrategy}>
          {cards.map((card, index) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <KanbanCard
                card={card}
                onDelete={onDeleteCard}
                onUpdate={onUpdateCard}
              />
            </motion.div>
          ))}
        </SortableContext>

        {/* Add Card Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsAddModalOpen(true)}
          className={`
            w-full py-3 rounded-lg border-2 border-dashed transition-colors
            ${colors.text} border-current opacity-40 hover:opacity-70
            flex items-center justify-center gap-2 font-medium
          `}
        >
          <Plus size={18} />
          Add Card
        </motion.button>
      </motion.div>

      <AddCardModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddCard={handleAddCard}
      />
    </div>
  )
}
