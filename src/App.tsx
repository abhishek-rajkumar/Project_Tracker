// src/App.tsx
import { BrowserRouter } from 'react-router-dom';
import { useStore } from './store/useStore';
import FilterBar from './components/FilterBar';
import ViewSwitcher from './components/ViewSwitcher';
import CollabBar from './components/CollabBar';
import KanbanView from './components/kanban/KanbanView';
import ListView from './components/list/ListView';
import TimelineView from './components/timeline/TimelineView';
import { useUrlFilters } from './hooks/useUrlFilters';
import { useCollabSim } from './hooks/useCollabSim';

function Inner() {
  useUrlFilters();   // syncs URL ↔ filters
  useCollabSim();    // starts fake user simulation

  const view = useStore((s) => s.view);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <CollabBar />
      <FilterBar />
      <ViewSwitcher />
      <main className="flex-1 overflow-hidden">
        {view === 'kanban' && <KanbanView />}
        {view === 'list' && <ListView />}
        {view === 'timeline' && <TimelineView />}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Inner />
    </BrowserRouter>
  );
}