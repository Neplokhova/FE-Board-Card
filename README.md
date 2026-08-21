# Task Board — Frontend

A responsive Kanban-style task board application built with React and TypeScript.

The application allows users to create and manage boards and cards, organize cards by status, edit and delete items, and move cards between columns using drag and drop.

## Live Demo

- Frontend: https://fe-board-card.vercel.app
- Backend API: https://task-board-be-llgu.onrender.com

## Features

### Boards

- Create a board
- Edit a board
- Delete a board
- Open a board using its public ID

### Cards

- Create cards
- Edit cards
- Delete cards
- Add card descriptions
- Organize cards by status

### Drag and Drop

Cards can be reordered within a column and moved between:

- To Do
- In Progress
- Done

Card positions are persisted through the backend API.

### UI

- Responsive layout
- Modal dialogs for creating and editing boards/cards
- Form validation
- Loading states
- Error handling
- Confirmation dialogs for destructive actions

## Tech Stack

### Core

- React 19
- TypeScript
- Vite

### State Management & API

- Redux Toolkit
- RTK Query

### Routing

- React Router

### Drag and Drop

- dnd-kit

### Code Quality

- ESLint
- Prettier
- TypeScript

### Testing

- Vitest
- React Testing Library
- Testing Library User Event

### CI

- GitHub Actions

### Deployment

- Vercel

## Project Structure

```text
src/
├── app/
│   ├── router/
│   └── store/
│
├── components/
│   └── common/
│
├── features/
│   ├── boards/
│   │   ├── api/
│   │   ├── components/
│   │   └── types/
│   │
│   └── cards/
│       └── components/
│
├── pages/
│   └── BoardPage/
│
├── test/
│
├── App.tsx
├── index.css
└── main.tsx
```
