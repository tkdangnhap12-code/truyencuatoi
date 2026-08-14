import React, { useState } from 'react';
import { WorldItem, Story } from '../types';
import { Globe2, Plus, Edit3, Trash2, MapPin, Shield, Coins, Scroll, Zap } from 'lucide-react';

interface WorldBuilderViewProps {
  story: Story | null;
  worldItems: WorldItem[];
  onSaveWorldItem: (item: WorldItem) => void;
  onDeleteWorldItem: (id: string) => void;
}

const WORLD_CATEGORIES: WorldItem['category'][] = [
  'Địa điểm',
  'Quốc gia',
  'Bang phái',
  'Tổ chức',
  'Gia tộc',
  'Tôn giáo',
  'Quân đội',
  'Chính trị',
  'Tiền tệ',
  'Văn hóa',
  'Luật lệ',
  'Ma pháp/Công nghệ',
  'Vũ khí/Bảo vật'
];

export const WorldBuilderView: React.FC<WorldBuilderViewProps> = ({
  story,
  worldItems,
  onSaveWorldItem,
  onDeleteWorldItem
}) => {
  const [activeCategory, setActiveCategory] = useState<WorldItem['category']>('Địa điểm');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<WorldItem | null>(null);

  const [form, setForm] = useState<WorldItem>({
    id: '',
    storyId: story?.id || '',
    category: 'Địa điểm',
    name: '',
    description: '',
    rules: '',
    location: ''
  });

  const handleOpenModal = (item?: WorldItem) => {
    if (item) {
      setEditingItem(item);
      setForm(item);
    } else {
      setEditingItem(null);
      setForm({
        id: 'world-' + Date.now(),
        storyId: story?.id || '',
        category: activeCategory,
        name: '',
        description: '',
        rules: '',
        location: ''
      });
    }
    setShowModal(true);
  };

  const handleSave = () => {
    if (!form.name.trim()) return;
    onSaveWorldItem(form);
    setShowModal(false);
  };

  if (!story) {
    return (
      <div className="p-8 text-center text-slate-400 text-sm">
        Vui lòng chọn bộ truyện trước khi xây dựng thế giới.
      </div>
    );
  }

  const filteredItems = worldItems.filter(
    (w) => w.storyId === story.id && w.category === activeCategory
  );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <Globe2 className="w-6 h-6 text-emerald-400" />
            Thiết Lập Thế Giới (World Builder)
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Xây dựng các yếu tố thế giới quan cho truyện <strong className="text-amber-300">"{story.title}"</strong>.
          </p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-lg shadow-emerald-600/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          + Thêm {activeCategory}
        </button>
      </div>

      {/* Categories Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800">
        {WORLD_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeCategory === cat
                ? 'bg-emerald-600 text-white shadow'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Item List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredItems.length === 0 ? (
          <div className="col-span-3 text-center py-12 text-slate-500 text-xs italic">
            Chưa có mục nào thuộc danh mục "{activeCategory}". Bấm "+ Thêm {activeCategory}" để khởi tạo.
          </div>
        ) : (
          filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-lg hover:border-slate-700 transition-all"
            >
              <div className="flex items-start justify-between">
                <h3 className="font-bold text-base text-white">{item.name}</h3>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenModal(item)}
                    className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded-lg transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onDeleteWorldItem(item.id)}
                    className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-red-400 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">{item.description || 'Chưa có mô tả'}</p>

              {item.rules && (
                <div className="p-2.5 bg-slate-950 border border-slate-800/80 rounded-xl text-xs text-amber-300 space-y-1">
                  <strong className="block text-[10px] uppercase font-bold text-slate-500">Quy tắc & Đặc điểm:</strong>
                  {item.rules}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-lg w-full space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-white">Thêm / Sửa {form.category}</h3>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Tên {form.category} *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Mô Tả Chi Tiết</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Quy Tắc / Đặc Điểm Bắt Buộc</label>
                <textarea
                  value={form.rules}
                  onChange={(e) => setForm({ ...form, rules: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white resize-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium"
              >
                Hủy
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold"
              >
                Lưu Mục Thế Giới
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
