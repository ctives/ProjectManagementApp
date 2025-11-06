# Kanban Board App

A beautiful, modern project management kanban board built with Next.js, Tailwind CSS, and Framer Motion.

## Features

- 📋 **Kanban Columns**: Organize tasks into customizable columns (TODO, In Progress, Completed, etc.)
- 🎴 **Draggable Cards**: Smooth drag-and-drop functionality between columns with beautiful animations
- 📝 **Card Details**: Add titles and detailed notes to each card
- 🎨 **Beautiful Design**: Purple/blue color scheme with smooth animations and hover effects
- 💾 **Local Storage**: All data automatically persists to browser's local storage
- ⚡ **Fast & Responsive**: Built with Next.js 15 and optimized for performance
- 🎭 **Smooth Animations**: GPU-accelerated animations with Framer Motion

## Tech Stack

- **Framework**: Next.js 15
- **Styling**: Tailwind CSS v3
- **Drag & Drop**: @dnd-kit (modern, maintained, flexible)
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Language**: TypeScript

## Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation

1. Navigate to the project directory:
```bash
cd kanban-app
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## How to Use

### Creating Cards
1. Click the "Add Card" button in any column
2. Enter a title (required) and optional notes
3. Click "Create Card" or press Enter

### Editing Cards
1. Click the edit icon (pencil) on any card
2. Update the title and notes
3. Click "Save Changes"

### Deleting Cards
1. Click the delete icon (trash) on any card
2. The card will be removed immediately

### Dragging Cards
1. Click and drag any card
2. Drag it to another column or reorder within the same column
3. Release to drop
4. Changes are automatically saved

### Adding Columns
1. Click the "Add Column" button in the header
2. Enter a column title
3. Choose a color for the column
4. Click "Create Column"

### Deleting Columns
1. Custom columns have a delete button in their header
2. Default columns (TODO, In Progress, Completed) cannot be deleted

## File Structure

```
kanban-app/
├── app/                      # Next.js app directory
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Home page
│   └── globals.css          # Global styles
├── components/
│   ├── kanban/              # Feature components
│   │   ├── Board.tsx        # Main board container
│   │   ├── Column.tsx       # Column component
│   │   ├── KanbanCard.tsx   # Card component
│   │   ├── AddCardModal.tsx # Add card form
│   │   └── AddColumnModal.tsx
│   └── ui/                  # Reusable UI components
│       ├── Button.tsx
│       └── Modal.tsx
├── hooks/
│   ├── useLocalStorage.ts   # Local storage hook
│   └── useKanbanData.ts     # Kanban state management
├── types/
│   └── kanban.ts            # TypeScript types
├── lib/
│   └── utils.ts             # Utility functions
├── public/                  # Static assets
└── package.json
```

## Key Components

### `useKanbanData` Hook
Manages all kanban state including:
- Adding/deleting/updating cards
- Moving cards between columns
- Adding/deleting columns
- Auto-persists to localStorage

### `Board` Component
Main container that:
- Sets up drag-and-drop context with dnd-kit
- Manages column rendering
- Handles drag end logic

### `Column` Component
Renders a single column with:
- Droppable area for cards
- Card list with animations
- Add card button

### `KanbanCard` Component
Individual card with:
- Draggable functionality
- Edit and delete buttons
- Smooth animations

## Customization

### Colors
Edit the `columnColors` object in `lib/utils.ts` to customize column colors.

### Animations
Modify Framer Motion properties in components or update keyframes in `tailwind.config.ts`.

### Storage Key
Change the storage key in `hooks/useKanbanData.ts`:
```typescript
const INITIAL_STATE = ...
const [boardState, setBoardState] = useLocalStorage<BoardState>(
  'your-custom-key', // Change this
  INITIAL_STATE
)
```

## Browser Support

Works on all modern browsers that support:
- ES2020
- CSS Grid/Flexbox
- Local Storage
- Drag and Drop API

## Performance

- Uses Next.js App Router for optimal code splitting
- Framer Motion animations run on GPU
- Efficient re-renders with React hooks
- Local storage prevents server requests

## License

MIT

## Contributing

Feel free to submit issues and pull requests!
