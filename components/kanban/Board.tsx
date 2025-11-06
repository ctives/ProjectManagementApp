'use client'

import React, { useState } from 'react'
import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { useKanbanData } from '@/hooks/useKanbanData'
import Column from './Column'
import AddColumnModal from './AddColumnModal'
import Button from '@/components/ui/Button'

export default function Board() {
  const [isAddColumnOpen, setIsAddColumnOpen] = useState(false)
  const {
    columns,
    cards,
    addCard,
    updateCard,
    deleteCard,
    moveCard,
    addColumn,
    deleteColumn,
    getCardsByColumn,
  } = useKanbanData()

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor)
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (!over) return

    // Find the card being dragged
    const draggedCard = cards.find(c => c.id === active.id)
    if (!draggedCard) return

    // Check if dropped on a column
    const targetColumn = columns.find(col => col.id === over.id)
    if (targetColumn) {
      // Dropped directly on column header/area
      const cardsInColumn = getCardsByColumn(targetColumn.id)
      moveCard(draggedCard.id, targetColumn.id, cardsInColumn.length)
    } else {
      // Dropped on another card - reorder within column
      const overCard = cards.find(c => c.id === over.id)
      if (overCard && overCard.columnId === draggedCard.columnId) {
        // Reordering within same column
        const cardsInColumn = getCardsByColumn(draggedCard.columnId)
        const oldIndex = cardsInColumn.findIndex(c => c.id === draggedCard.id)
        const newIndex = cardsInColumn.findIndex(c => c.id === overCard.id)

        if (oldIndex !== newIndex) {
          const reorderedCards = arrayMove(cardsInColumn, oldIndex, newIndex)
          reorderedCards.forEach((card, idx) => {
            moveCard(card.id, card.columnId, idx)
          })
        }
      } else if (overCard) {
        // Dropped in different column
        const cardsInNewColumn = getCardsByColumn(overCard.columnId)
        const newIndex = cardsInNewColumn.findIndex(c => c.id === overCard.id)
        moveCard(draggedCard.id, overCard.columnId, newIndex)
      }
    }
  }

  const handleAddCard = (columnId: string, title: string, description: string) => {
    addCard({
      title,
      description,
      columnId,
    })
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragEnd={handleDragEnd}
    >
      <div className="w-full h-full bg-gradient-to-br from-slate-50 to-slate-100 p-6 overflow-x-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Project Board</h1>
              <p className="text-gray-600 mt-2">Organize and track your tasks with ease</p>
            </div>
            <Button
              variant="primary"
              onClick={() => setIsAddColumnOpen(true)}
              className="flex items-center gap-2"
            >
              <Plus size={18} />
              Add Column
            </Button>
          </div>
        </div>

        {/* Columns Container */}
        <motion.div
          className="flex gap-6 pb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
        >
          {columns.map((column, index) => (
            <motion.div
              key={column.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Column
                column={column}
                cards={getCardsByColumn(column.id)}
                onAddCard={handleAddCard}
                onDeleteCard={deleteCard}
                onUpdateCard={updateCard}
                onDeleteColumn={deleteColumn}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>

      <AddColumnModal
        isOpen={isAddColumnOpen}
        onClose={() => setIsAddColumnOpen(false)}
        onAddColumn={addColumn}
      />
    </DndContext>
  )
}
