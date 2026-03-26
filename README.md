The most challenging part of this project was implementing a fully custom drag-and-drop system without using any external libraries. Handling smooth movement, accurate drop detection, and maintaining layout stability required careful control over DOM measurements and pointer events.

One key problem was preventing layout shift while dragging a card. This was solved by introducing a placeholder element with the same height as the dragged card, ensuring the layout remained stable during the drag operation.

Another challenge was supporting both mouse and touch interactions consistently, which required handling multiple event types and edge cases.

If given more time, I would refactor the drag-and-drop logic into a more modular and reusable hook, improving maintainability and scalability for larger applications.

Multi-View Interface

Kanban Board

Four columns: To Do, In Progress, In Review, Done
Task cards with title, assignee, priority, due date

List View

Sortable table (Title, Priority, Due Date)
Inline status update

Timeline View

Tasks displayed on a horizontal time axis
Current date indicator

Custom Drag-and-Drop

Built from scratch (no external libraries)
Drag between columns
Placeholder handling
Smooth animations
Snap-back behavior


Virtual Scrolling
Efficient rendering for 500+ tasks
Only visible rows are rendered
Smooth scrolling experience without lag


Live Collaboration Indicators
Simulated real-time users
Avatar indicators on active tasks
Dynamic movement across tasks

Filters & URL State
Filter by:
Status
Priority
Assignee
Due date range
URL-synced filters (shareable & bookmarkable)


Edge Case Handling
Empty states for columns and lists
"Due Today" label
Overdue task highlighting


Tech Stack
React + TypeScript
Zustand (State Management)
Tailwind CSS
No external UI or drag-and-drop libraries used