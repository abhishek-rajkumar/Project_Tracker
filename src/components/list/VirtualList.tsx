import { useRef, useState, useCallback, useLayoutEffect } from 'react';

const ROW_HEIGHT = 52; // fixed height per row in px
const BUFFER = 5;  // rows above and below viewport

interface Props<T> {
  items: T[];
  renderRow: (item: T, index: number) => React.ReactNode;
}

export default function VirtualList<T>({ items, renderRow }: Props<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(600);

  // Measure viewport
  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    setViewportHeight(el.clientHeight);

    const ro = new ResizeObserver(() => setViewportHeight(el.clientHeight));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const onScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  // Calculate which rows to render
  const totalHeight = items.length * ROW_HEIGHT;
  const startIndex = Math.max(0, Math.floor(scrollTop / ROW_HEIGHT) - BUFFER);
  const visibleCount = Math.ceil(viewportHeight / ROW_HEIGHT) + BUFFER * 2;
  const endIndex = Math.min(items.length - 1, startIndex + visibleCount);

  const visibleItems = items.slice(startIndex, endIndex + 1);
  const paddingTop = startIndex * ROW_HEIGHT;
  // const paddingBottom = (items.length - 1 - endIndex) * ROW_HEIGHT;

  return (
    <div
      ref={containerRef}
      onScroll={onScroll}
      className="overflow-y-auto flex-1"
      style={{ height: '100%' }}
    >
      {/* Total height spacer */}
      <div style={{ height: totalHeight, position: 'relative' }}>
        {/* Offset rendered rows */}
        <div style={{ position: 'absolute', top: paddingTop, left: 0, right: 0 }}>
          {visibleItems.map((item, i) => (
            <div key={startIndex + i} style={{ height: ROW_HEIGHT }}>
              {renderRow(item, startIndex + i)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}