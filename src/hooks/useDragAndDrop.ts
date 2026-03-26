import { useRef, useCallback } from 'react';
import { useStore } from '../store/useStore';
import type { Status } from '../types';

export function useDragAndDrop() {
  const { setDragState, moveTask } = useStore();
  const originColumn = useRef<Status | null>(null);
  const dragEl = useRef<HTMLElement | null>(null);
  const ghostEl = useRef<HTMLDivElement | null>(null);

  const onDragStart = useCallback(
    (e: React.DragEvent, taskId: string, fromStatus: Status) => {
      originColumn.current = fromStatus;
      setDragState({ draggingId: taskId });

      // Create ghost element that follows cursor
      const ghost = document.createElement('div');
      ghost.style.cssText = `
        position: fixed; pointer-events: none; z-index: 9999;
        opacity: 0.7; transform: rotate(2deg);
        box-shadow: 0 8px 24px rgba(0,0,0,0.18);
        width: ${(e.currentTarget as HTMLElement).offsetWidth}px;
      `;
      ghost.innerHTML = (e.currentTarget as HTMLElement).outerHTML;
      document.body.appendChild(ghost);
      ghostEl.current = ghost;
      dragEl.current = e.currentTarget as HTMLElement;

      // Hide default drag image
      const blank = new Image();
      e.dataTransfer.setDragImage(blank, 0, 0);
      e.dataTransfer.setData('taskId', taskId);
    },
    [setDragState]
  );

  const onDrag = useCallback((e: React.DragEvent) => {
    if (!ghostEl.current || e.clientX === 0) return;
    ghostEl.current.style.left = `${e.clientX - 60}px`;
    ghostEl.current.style.top = `${e.clientY - 20}px`;
  }, []);

  const onDragEnd = useCallback(
    (_e: React.DragEvent, taskId: string) => {
      // Remove ghost
      ghostEl.current?.remove();
      ghostEl.current = null;

      const targetColumn = useStore.getState().dragState.overColumn;

      if (targetColumn && targetColumn !== originColumn.current) {
        moveTask(taskId, targetColumn);
      }
      // If dropped outside valid zone — snap back (no state change needed)
      setDragState({ draggingId: null, overColumn: null });
      originColumn.current = null;
    },
    [moveTask, setDragState]
  );

  const onDragOver = useCallback(
    (e: React.DragEvent, column: Status) => {
      e.preventDefault(); // required to allow drop
      setDragState({ overColumn: column });
    },
    [setDragState]
  );

  const onDrop = useCallback(
    (e: React.DragEvent, column: Status) => {
      e.preventDefault();
      const taskId = e.dataTransfer.getData('taskId');
      if (taskId) moveTask(taskId, column);
      setDragState({ draggingId: null, overColumn: null });
    },
    [moveTask, setDragState]
  );

  return { onDragStart, onDrag, onDragEnd, onDragOver, onDrop };
}