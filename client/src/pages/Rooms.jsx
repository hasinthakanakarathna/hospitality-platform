import { useState, useMemo } from 'react';
import {
  BedDouble,
  LayoutGrid,
  List,
  Plus,
  Search,
  Filter,
  Wifi,
  Sparkles,
  Users,
  CheckCircle2,
  AlertTriangle,
  DoorClosed,
  Trash2,
  Edit2,
  DollarSign,
} from 'lucide-react';
import {
  DndContext,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core';
import { useDroppable } from '@dnd-kit/core';
import { useDraggable } from '@dnd-kit/core';
import { useAuth } from '../contexts/AuthContext';
import { formatCurrency, ROOM_STATUS } from '../utils/formatters';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Modal from '../components/ui/Modal';
import StatusBadge from '../components/ui/StatusBadge';
import toast from 'react-hot-toast';

// Seed initial rooms for local development & testing
const INITIAL_ROOMS = [
  {
    id: 'room-101',
    roomNumber: '101',
    type: 'Single',
    floor: 1,
    status: 'available',
    pricePerNight: 85,
    amenities: ['wifi', 'tv', 'ac'],
    guestName: null,
  },
  {
    id: 'room-102',
    roomNumber: '102',
    type: 'Double',
    floor: 1,
    status: 'occupied',
    pricePerNight: 120,
    amenities: ['wifi', 'tv', 'ac', 'minibar'],
    guestName: 'Alex Rivera',
  },
  {
    id: 'room-103',
    roomNumber: '103',
    type: 'Double',
    floor: 1,
    status: 'dirty',
    pricePerNight: 120,
    amenities: ['wifi', 'tv', 'ac'],
    guestName: null,
  },
  {
    id: 'room-201',
    roomNumber: '201',
    type: 'Suite',
    floor: 2,
    status: 'occupied',
    pricePerNight: 240,
    amenities: ['wifi', 'tv', 'ac', 'minibar', 'balcony', 'jacuzzi'],
    guestName: 'Emily & Mark Watson',
  },
  {
    id: 'room-202',
    roomNumber: '202',
    type: 'Deluxe',
    floor: 2,
    status: 'reserved',
    pricePerNight: 180,
    amenities: ['wifi', 'tv', 'ac', 'balcony'],
    guestName: 'Dr. John Doe',
  },
  {
    id: 'room-203',
    roomNumber: '203',
    type: 'Single',
    floor: 2,
    status: 'available',
    pricePerNight: 95,
    amenities: ['wifi', 'tv', 'ac'],
    guestName: null,
  },
  {
    id: 'room-301',
    roomNumber: '301',
    type: 'Suite',
    floor: 3,
    status: 'dirty',
    pricePerNight: 260,
    amenities: ['wifi', 'tv', 'ac', 'minibar', 'balcony'],
    guestName: null,
  },
  {
    id: 'room-302',
    roomNumber: '302',
    type: 'Deluxe',
    floor: 3,
    status: 'maintenance',
    pricePerNight: 190,
    amenities: ['wifi', 'tv', 'ac'],
    guestName: null,
  },
];

const COLUMNS = [
  { id: 'available', title: 'Available', color: 'border-t-emerald-500', badgeBg: 'bg-emerald-50 text-emerald-700' },
  { id: 'occupied', title: 'Occupied', color: 'border-t-blue-500', badgeBg: 'bg-blue-50 text-blue-700' },
  { id: 'reserved', title: 'Reserved', color: 'border-t-amber-500', badgeBg: 'bg-amber-50 text-amber-700' },
  { id: 'dirty', title: 'Dirty / Cleaning', color: 'border-t-rose-500', badgeBg: 'bg-rose-50 text-rose-700' },
  { id: 'maintenance', title: 'Out of Service', color: 'border-t-gray-400', badgeBg: 'bg-gray-100 text-gray-700' },
];

export default function Rooms() {
  const { isAdmin, isReceptionist } = useAuth();
  const [rooms, setRooms] = useState(INITIAL_ROOMS);
  const [viewMode, setViewMode] = useState('kanban'); // 'kanban' | 'list'
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [activeDragRoom, setActiveDragRoom] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    roomNumber: '',
    type: 'Double',
    floor: 1,
    status: 'available',
    pricePerNight: 120,
    amenities: ['wifi', 'tv', 'ac'],
  });

  // dnd-kit sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // 5px movement required to trigger drag (prevents accidental drag on click)
      },
    })
  );

  const filteredRooms = useMemo(() => {
    return rooms.filter((r) => {
      const matchesSearch =
        r.roomNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (r.guestName && r.guestName.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesType = filterType === 'all' || r.type === filterType;
      return matchesSearch && matchesType;
    });
  }, [rooms, searchQuery, filterType]);

  const handleDragStart = (event) => {
    const { active } = event;
    const room = rooms.find((r) => r.id === active.id);
    setActiveDragRoom(room || null);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveDragRoom(null);

    if (!over) return;

    const roomId = active.id;
    // Over target can be a column ID directly, or another room item
    let targetStatus = over.id;
    if (!COLUMNS.some((col) => col.id === targetStatus)) {
      const overRoom = rooms.find((r) => r.id === over.id);
      if (overRoom) targetStatus = overRoom.status;
    }

    if (COLUMNS.some((col) => col.id === targetStatus)) {
      setRooms((prev) =>
        prev.map((r) => (r.id === roomId ? { ...r, status: targetStatus } : r))
      );
      toast.success(`Room status updated to ${ROOM_STATUS[targetStatus]?.label || targetStatus}`);
    }
  };

  const handleAddRoom = (e) => {
    e.preventDefault();
    if (!formData.roomNumber) {
      toast.error('Please enter a room number');
      return;
    }

    const newRoom = {
      id: `room-${Date.now()}`,
      roomNumber: formData.roomNumber,
      type: formData.type,
      floor: Number(formData.floor),
      status: formData.status,
      pricePerNight: Number(formData.pricePerNight),
      amenities: formData.amenities,
      guestName: null,
    };

    setRooms((prev) => [newRoom, ...prev]);
    toast.success(`Room ${formData.roomNumber} created successfully!`);
    setIsAddModalOpen(false);
    setFormData({
      roomNumber: '',
      type: 'Double',
      floor: 1,
      status: 'available',
      pricePerNight: 120,
      amenities: ['wifi', 'tv', 'ac'],
    });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-fade-in">
      {/* ── Header Controls ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-text-primary tracking-tight">
            Room Inventory & Status
          </h2>
          <p className="text-xs text-text-secondary mt-0.5">
            Manage room statuses, pricing, and guest assignments in real time
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* View Toggle (List vs Kanban) */}
          <div className="flex items-center bg-surface border border-border rounded-xl p-1 shadow-xs">
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
                viewMode === 'kanban'
                  ? 'bg-primary-500 text-white shadow-xs'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
              title="Kanban Board View"
            >
              <LayoutGrid className="w-4 h-4" />
              <span className="hidden md:inline">Board</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
                viewMode === 'list'
                  ? 'bg-primary-500 text-white shadow-xs'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
              title="Table List View"
            >
              <List className="w-4 h-4" />
              <span className="hidden md:inline">List</span>
            </button>
          </div>

          {(isAdmin || isReceptionist) && (
            <Button
              variant="primary"
              size="sm"
              icon={Plus}
              onClick={() => setIsAddModalOpen(true)}
            >
              Add Room
            </Button>
          )}
        </div>
      </div>

      {/* ── Search & Filter Toolbar ── */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-surface p-3 rounded-xl border border-border shadow-xs">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-text-tertiary absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search room, type, guest..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-background border border-border rounded-lg text-text-primary placeholder-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          <span className="text-xs text-text-tertiary whitespace-nowrap">Filter Type:</span>
          {['all', 'Single', 'Double', 'Suite', 'Deluxe'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-2.5 py-1 text-xs rounded-lg font-medium whitespace-nowrap transition-all ${
                filterType === type
                  ? 'bg-primary-100 text-primary-700 font-semibold'
                  : 'bg-background text-text-secondary hover:bg-gray-200'
              }`}
            >
              {type === 'all' ? 'All Types' : type}
            </button>
          ))}
        </div>
      </div>

      {/* ── Kanban Board View ── */}
      {viewMode === 'kanban' ? (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 items-start">
            {COLUMNS.map((col) => {
              const colRooms = filteredRooms.filter((r) => r.status === col.id);
              return (
                <KanbanColumn
                  key={col.id}
                  column={col}
                  rooms={colRooms}
                />
              );
            })}
          </div>

          <DragOverlay>
            {activeDragRoom ? (
              <div className="w-64 opacity-90 rotate-2 shadow-2xl">
                <RoomCard room={activeDragRoom} isDragging />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      ) : (
        /* ── Table List View ── */
        <Card className="overflow-hidden border border-border">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-background text-text-secondary border-b border-border uppercase text-[10px] tracking-wider font-semibold">
                <tr>
                  <th className="px-4 py-3">Room</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Floor</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Rate / Night</th>
                  <th className="px-4 py-3">Current Guest</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-light bg-surface">
                {filteredRooms.map((room) => (
                  <tr key={room.id} className="hover:bg-surface-hover transition-colors">
                    <td className="px-4 py-3 font-bold text-text-primary flex items-center gap-2">
                      <DoorClosed className="w-4 h-4 text-primary-500" />
                      Room {room.roomNumber}
                    </td>
                    <td className="px-4 py-3 text-text-secondary">{room.type}</td>
                    <td className="px-4 py-3 text-text-secondary">Floor {room.floor}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={room.status} config={ROOM_STATUS} />
                    </td>
                    <td className="px-4 py-3 font-semibold text-text-primary">
                      {formatCurrency(room.pricePerNight)}
                    </td>
                    <td className="px-4 py-3 text-text-secondary">
                      {room.guestName ? (
                        <span className="font-medium text-text-primary">{room.guestName}</span>
                      ) : (
                        <span className="text-text-tertiary italic">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right space-x-1">
                      <button
                        onClick={() => {
                          const nextStatus =
                            room.status === 'dirty'
                              ? 'available'
                              : room.status === 'available'
                              ? 'dirty'
                              : 'available';
                          setRooms((prev) =>
                            prev.map((r) =>
                              r.id === room.id ? { ...r, status: nextStatus } : r
                            )
                          );
                          toast.success(`Room ${room.roomNumber} marked ${nextStatus}`);
                        }}
                        className="px-2 py-1 text-[11px] font-medium bg-gray-100 hover:bg-gray-200 text-text-primary rounded-lg transition-colors"
                      >
                        Toggle Clean
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* ── Add Room Modal ── */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Room"
        size="md"
      >
        <form onSubmit={handleAddRoom} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-text-primary mb-1">Room Number</label>
              <input
                type="text"
                required
                placeholder="e.g. 305"
                value={formData.roomNumber}
                onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-text-primary focus:ring-2 focus:ring-primary-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-medium text-text-primary mb-1">Room Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-text-primary focus:ring-2 focus:ring-primary-500 focus:outline-none"
              >
                <option value="Single">Single</option>
                <option value="Double">Double</option>
                <option value="Suite">Suite</option>
                <option value="Deluxe">Deluxe</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-text-primary mb-1">Floor</label>
              <input
                type="number"
                min="1"
                max="50"
                value={formData.floor}
                onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-text-primary focus:ring-2 focus:ring-primary-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-medium text-text-primary mb-1">Price per Night ($)</label>
              <input
                type="number"
                min="1"
                value={formData.pricePerNight}
                onChange={(e) => setFormData({ ...formData, pricePerNight: e.target.value })}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-text-primary focus:ring-2 focus:ring-primary-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-text-primary mb-1">Initial Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-text-primary focus:ring-2 focus:ring-primary-500 focus:outline-none"
            >
              <option value="available">Available</option>
              <option value="occupied">Occupied</option>
              <option value="reserved">Reserved</option>
              <option value="dirty">Dirty</option>
              <option value="maintenance">Out of Service</option>
            </select>
          </div>

          <div className="pt-4 flex justify-end gap-2 border-t border-border">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setIsAddModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Save Room
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

// Kanban Column component with drop zone
function KanbanColumn({ column, rooms }) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  });

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col bg-[#f0f2f5] rounded-xl border border-border-light min-h-[520px] transition-colors ${
        isOver ? 'bg-primary-50/50 ring-2 ring-primary-400' : ''
      }`}
    >
      {/* Column Header (ClickUp style) */}
      <div
        className={`p-3 bg-surface rounded-t-xl border-b border-border border-t-4 ${column.color} flex items-center justify-between shadow-xs`}
      >
        <span className="text-xs font-bold text-text-primary uppercase tracking-wide">
          {column.title}
        </span>
        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${column.badgeBg}`}>
          {rooms.length}
        </span>
      </div>

      {/* Cards list */}
      <div className="p-2 space-y-2.5 flex-1 overflow-y-auto">
        {rooms.map((room) => (
          <DraggableRoomCard key={room.id} room={room} />
        ))}
        {rooms.length === 0 && (
          <div className="h-32 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg text-text-tertiary text-xs">
            Drop room here
          </div>
        )}
      </div>
    </div>
  );
}

// Draggable Room Card
function DraggableRoomCard({ room }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: room.id,
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`cursor-grab active:cursor-grabbing select-none ${
        isDragging ? 'opacity-30' : ''
      }`}
    >
      <RoomCard room={room} />
    </div>
  );
}

// Room Card UI component (ClickUp task card look)
function RoomCard({ room, isDragging }) {
  return (
    <div
      className={`bg-surface rounded-lg p-3.5 border border-border shadow-xs hover:shadow-card-hover transition-all space-y-2 ${
        isDragging ? 'ring-2 ring-primary-500 shadow-xl' : ''
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold text-text-primary flex items-center gap-1.5">
          <DoorClosed className="w-4 h-4 text-primary-500" />
          Room {room.roomNumber}
        </span>
        <span className="text-xs font-bold text-primary-600">
          {formatCurrency(room.pricePerNight)}
        </span>
      </div>

      <div className="flex items-center justify-between text-xs text-text-secondary">
        <span>{room.type}</span>
        <span className="text-[11px] text-text-tertiary">Fl. {room.floor}</span>
      </div>

      {room.guestName && (
        <div className="text-[11px] p-1.5 bg-blue-50 text-blue-700 rounded-md font-medium flex items-center gap-1">
          <Users className="w-3 h-3" />
          {room.guestName}
        </div>
      )}

      {/* Amenities tags */}
      <div className="flex items-center gap-1 pt-1 overflow-x-hidden">
        {room.amenities.map((am) => (
          <span
            key={am}
            className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-600 uppercase font-mono"
          >
            {am}
          </span>
        ))}
      </div>
    </div>
  );
}
