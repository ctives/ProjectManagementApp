'use client'

import { useLocalStorage } from './useLocalStorage'
import type { BoardState, Card, Column } from '@/types/kanban'
import { generateId } from '@/lib/utils'

const INITIAL_STATE: BoardState = {
  columns: [
    { id: 'todo', title: 'TODO', order: 0, color: 'purple' },
    { id: 'in-progress', title: 'In Progress', order: 1, color: 'blue' },
    { id: 'completed', title: 'Completed', order: 2, color: 'emerald' },
  ],
  cards: [],
}

export function useKanbanData() {
  const [boardState, setBoardState] = useLocalStorage<BoardState>(
    'kanban-board-state',
    INITIAL_STATE
  )

  const addCard = (card: Omit<Card, 'id' | 'createdAt' | 'updatedAt' | 'order'>) => {
    const newCard: Card = {
      ...card,
      id: generateId(),
      order: boardState.cards.filter(c => c.columnId === card.columnId).length,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    setBoardState({
      ...boardState,
      cards: [...boardState.cards, newCard],
    })

    return newCard
  }

  const updateCard = (cardId: string, updates: Partial<Omit<Card, 'id' | 'createdAt'>>) => {
    setBoardState({
      ...boardState,
      cards: boardState.cards.map(card =>
        card.id === cardId
          ? { ...card, ...updates, updatedAt: new Date().toISOString() }
          : card
      ),
    })
  }

  const deleteCard = (cardId: string) => {
    setBoardState({
      ...boardState,
      cards: boardState.cards.filter(card => card.id !== cardId),
    })
  }

  const moveCard = (cardId: string, newColumnId: string, newOrder: number) => {
    const cardsInNewColumn = boardState.cards
      .filter(c => c.columnId === newColumnId)
      .sort((a, b) => a.order - b.order)

    const updatedCards = boardState.cards.map((card, idx) => {
      if (card.id === cardId) {
        return { ...card, columnId: newColumnId, order: newOrder, updatedAt: new Date().toISOString() }
      }

      // Re-order other cards in the new column
      const cardIndex = cardsInNewColumn.findIndex(c => c.id === card.id)
      if (card.columnId === newColumnId && cardIndex !== -1) {
        const adjustedOrder = cardIndex >= newOrder ? cardIndex + 1 : cardIndex
        return { ...card, order: adjustedOrder }
      }

      return card
    })

    setBoardState({
      ...boardState,
      cards: updatedCards,
    })
  }

  const addColumn = (column: Omit<Column, 'id' | 'order'>) => {
    const newColumn: Column = {
      ...column,
      id: generateId(),
      order: boardState.columns.length,
    }

    setBoardState({
      ...boardState,
      columns: [...boardState.columns, newColumn],
    })

    return newColumn
  }

  const deleteColumn = (columnId: string) => {
    setBoardState({
      ...boardState,
      columns: boardState.columns.filter(c => c.id !== columnId),
      cards: boardState.cards.filter(c => c.columnId !== columnId),
    })
  }

  const getCardsByColumn = (columnId: string) => {
    return boardState.cards
      .filter(card => card.columnId === columnId)
      .sort((a, b) => a.order - b.order)
  }

  return {
    columns: boardState.columns.sort((a, b) => a.order - b.order),
    cards: boardState.cards,
    addCard,
    updateCard,
    deleteCard,
    moveCard,
    addColumn,
    deleteColumn,
    getCardsByColumn,
  }
}
