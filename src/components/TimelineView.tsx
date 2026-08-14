import React, { useState } from 'react';
import { TimelineEvent, Story, Character } from '../types';
import { Clock, Plus, Trash2, Edit3, AlertCircle, MapPin, Calendar } from 'lucide-react';

interface TimelineViewProps {
  story: Story | null;
  timelineEvents: TimelineEvent[];
  characters: Character[];
  onSaveTimelineEvent: (e: TimelineEvent) => void;
  onDeleteTimelineEvent: (id: string) => void;
}

export const TimelineView: React.FC<TimelineViewProps> = ({
  story,
  timelineEvents,
  characters,
  onSaveTimelineEvent,
  onDeleteTimelineEvent
}) => {
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<TimelineEvent | null>(null);

  const [form, setForm] = useState<TimelineEvent>({
    id: '',
    storyId: story?.id || '',
    dateOrYear: '',
    characterAges: {},
    location: '',
    title: '',
    description: ''
  });

  const handleOpenModal = (evt?: TimelineEvent) => {
    if (evt) {
      setEditingEvent(evt);
      setForm(evt);
    } else {
      setEditingEvent(null);
      setForm({
        id: 'time-' + Date.now(),
        storyId: story?.id || '',
        dateOrYear: 'Năm thứ 1',
        characterAges: {},
        location: '',
        title: '',
        description: ''
      });
    }
    setShowModal(true);
  };

  const handleSave = () => {
    if (!form.title.trim()) return;
    onSaveTimelineEvent(form);
    setShowModal(false);
  };

  if (!story) {
    return <div className="p-8 text-center text-slate-400 text-sm">Vui lòng chọn bộ truyện trước.</div>;
  }

  const storyEvents = timelineEvents.filter((e) => e.storyId === story.id);

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <Clock className="w-6 h-6 text-amber-400" />
            Dòng Thời Gian & Theo Dõi Sự Kiện (Timeline)
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Bộ truyện: <strong className="text-amber-300">{story.title}</strong>
          </p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-lg"
        >
          <Plus className="w-4 h-4" />
          + Sự Kiện Mới
        </button>
      </div>

      <div className="space-y-4">
        {storyEvents.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs italic bg-slate-900 border border-slate-800 rounded-2xl">
            Chưa có sự kiện timeline nào. Bấm "+ Sự Kiện Mới" để bắt đầu theo dõi.
          </div>
        ) : (
          storyEvents.map((evt, idx) => (
            <div key={evt.id} className="flex gap-4 items-start">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-md">
                  {idx + 1}
                </div>
                {idx < storyEvents.length - 1 && <div className="w-0.5 h-16 bg-slate-800 my-1" />}
              </div>

              <div className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2 shadow-md">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="px-2.5 py-0.5 bg-amber-500/10 text-amber-300 border border-amber-500/20 rounded-md text-[10px] font-bold">
                      {evt.dateOrYear}
                    </span>
                    <h3 className="font-bold text-base text-white mt-1">{evt.title}</h3>
                  </div>

                  <div className="flex items-center gap-1">
                    <button onClick={() => handleOpenModal(evt)} className="p-1.5 hover:bg-slate-800 text-slate-400 rounded-lg">
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => onDeleteTimelineEvent(evt.id)} className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-red-400 rounded-lg">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-300">{evt.description}</p>

                {evt.location && (
                  <div className="text-[11px] text-slate-400 flex items-center gap-1 pt-1">
                    <MapPin className="w-3 h-3 text-indigo-400" />
                    Địa điểm: {evt.location}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-white">Thêm / Sửa Sự Kiện</h3>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Mốc Thời Gian (Ngày/Tháng/Năm/Kỷ Nguyên) *</label>
                <input
                  type="text"
                  value={form.dateOrYear}
                  onChange={(e) => setForm({ ...form, dateOrYear: e.target.value })}
                  placeholder="Ví dụ: Năm Ninh Xuyên thứ 302..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Tên Sự Kiện *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Mô Tả Diễn Biến</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Địa Điểm Diễn Ra</label>
                <input
                  type="text"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-medium">
                Hủy
              </button>
              <button onClick={handleSave} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold">
                Lưu Sự Kiện
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
