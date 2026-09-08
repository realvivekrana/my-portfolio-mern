import { useMemo } from 'react';

import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';

import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  sortableKeyboardCoordinates,
  arrayMove,
} from '@dnd-kit/sortable';

import { CSS } from '@dnd-kit/utilities';

import { FaGripVertical } from 'react-icons/fa';

/*
|--------------------------------------------------------------------------
| DragHandle
|--------------------------------------------------------------------------
|
| Chhota grip icon jo sirf yehi hissa "draggable" banata hai — baaki
| card ke andar ke inputs/buttons normally kaam karte rehte hain.
|
| Usage: <DragHandle attributes={attributes} listeners={listeners} />
| (attributes/listeners SortableItem render-prop se milte hain)
|
*/

export function DragHandle({ attributes, listeners, className = '' }) {
  return (
    <button
      type="button"
      {...attributes}
      {...listeners}
      title="Drag to reorder"
      aria-label="Drag to reorder"
      className={`flex h-8 w-8 shrink-0 cursor-grab items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 active:cursor-grabbing dark:hover:bg-gray-800 dark:hover:text-gray-200 ${className}`}
    >
      <FaGripVertical className="text-sm" />
    </button>
  );
}

/*
|--------------------------------------------------------------------------
| SortableItem
|--------------------------------------------------------------------------
|
| Internal wrapper — har list item ko dnd-kit ka sortable context deta
| hai aur render-prop se drag handle attributes/listeners + dragging
| state pass karta hai upar tak.
|
*/

function SortableItem({ id, disabled, children }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : 'auto',
    position: 'relative',
  };

  return (
    <div ref={setNodeRef} style={style}>
      {children({ attributes, listeners, isDragging })}
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| SortableList
|--------------------------------------------------------------------------
|
| Generic drag-and-drop reorder wrapper. Koi bhi list (skill categories,
| skills, projects, certificates...) isse wrap karo.
|
| Props:
|   items        — array of objects, HAR object me ek unique `id` string
|                   field hona chahiye (dnd-kit isi se track karta hai)
|   onReorder    — (newItemsArray) => void — jab drag khatam ho aur order
|                   badal gaya ho
|   renderItem   — (item, index, { attributes, listeners, isDragging }) => node
|   disabled     — true karne par drag off ho jata hai (e.g. search/filter active)
|   className    — outer wrapper ke liye extra classes (default: space-y-3)
|
| NOTE: `items[i].id` sirf dnd-kit tracking ke liye hai — yeh backend
| ObjectId nahi hona chahiye agar item ke paas ID nahi hai (e.g. naye
| unsaved skills). Aise cases me stable synthetic `_uid` use karo
| (parent component banata hai, e.g. `cat-0`, `skill-0-3`, crypto.randomUUID()).
|
*/

function SortableList({
  items,
  onReorder,
  renderItem,
  disabled = false,
  className = 'space-y-3',
}) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const ids = useMemo(() => items.map((item) => item.id), [items]);

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = ids.indexOf(active.id);
    const newIndex = ids.indexOf(over.id);

    if (oldIndex === -1 || newIndex === -1) {
      return;
    }

    onReorder(arrayMove(items, oldIndex, newIndex));
  };

  if (disabled) {
    return (
      <div className={className}>
        {items.map((item, index) =>
          renderItem(item, index, {
            attributes: {},
            listeners: {},
            isDragging: false,
          })
        )}
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={ids} strategy={verticalListSortingStrategy}>
        <div className={className}>
          {items.map((item, index) => (
            <SortableItem key={item.id} id={item.id}>
              {(dragProps) => renderItem(item, index, dragProps)}
            </SortableItem>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}

export default SortableList;