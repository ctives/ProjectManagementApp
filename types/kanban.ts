export interface Card {
  id: string;
  title: string;
  description: string;
  columnId: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface Column {
  id: string;
  title: string;
  order: number;
  color: 'purple' | 'blue' | 'emerald' | 'amber' | 'rose' | 'cyan';
}

export interface BoardState {
  columns: Column[];
  cards: Card[];
}
