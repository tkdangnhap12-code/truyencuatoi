import React, { useState } from 'react';
import { Character, CharacterRelationship, Story } from '../types';
import { 
  Users, 
  Plus, 
  Edit3, 
  Trash2, 
  UserCheck, 
  UserX, 
  GitCommit, 
  ShieldAlert,
  Heart,
  Swords,
  GraduationCap
} from 'lucide-react';

interface CharacterManagerViewProps {
  story: Story | null;
  characters: Character[];
  relationships: CharacterRelationship[];
  onSaveCharacter: (c: Character) => void;
  onDeleteCharacter: (id: string) => void;
  onSaveRelationship: (r: CharacterRelationship) => void;
  onDeleteRelationship: (id: string) => void;
}

export const CharacterManagerView: React.FC<CharacterManagerViewProps> = ({
  story,
  characters,
  relationships,
  onSaveCharacter,
  onDeleteCharacter,
  onSaveRelationship,
  onDeleteRelationship
}) => {
  const [activeTab, setActiveTab] = useState<'cards' | 'map'>('cards');
  const [showCharModal, setShowCharModal] = useState(false);
  const [editingChar, setEditingChar] = useState<Character | null>(null);

  const [showRelModal, setShowRelModal] = useState(false);
  const [editingRel, setEditingRel] = useState<CharacterRelationship | null>(null);

  // Character Form
  const [charForm, setCharForm] = useState<Character>({
    id: '',
    storyId: story?.id || '',
    name: '',
    aliases: '',
    age: '18',
    gender: 'Nam',
    appearance: '',
    personality: '',
    backstory: '',
    goals: '',
    motivations: '',
    strengths: '',
    weaknesses: '',
    fears: '',
    secrets: '',
    arc: '',
    status: 'active',
    notes: ''
  });

  // Relationship Form
  const [relForm, setRelForm] = useState<CharacterRelationship>({
    id: '',
    storyId: story?.id || '',
    char1Id: '',
    char2Id: '',
    relationType: 'Đồng minh',
    description: ''
  });

  const handleOpenCharModal = (c?: Character) => {
    if (c) {
      setEditingChar(c);
      setCharForm(c);
    } else {
      setEditingChar(null);
      setCharForm({
        id: 'char-' + Date.now(),
        storyId: story?.id || '',
        name: '',
        aliases: '',
        age: '18',
        gender: 'Nam',
        appearance: '',
        personality: '',
        backstory: '',
        goals: '',
        motivations: '',
        strengths: '',
        weaknesses: '',
        fears: '',
        secrets: '',
        arc: '',
        status: 'active',
        notes: ''
      });
    }
    setShowCharModal(true);
  };

  const handleSaveChar = () => {
    if (!charForm.name.trim()) return;
    onSaveCharacter(charForm);
    setShowCharModal(false);
  };

  const handleOpenRelModal = (r?: CharacterRelationship) => {
    if (r) {
      setEditingRel(r);
      setRelForm(r);
    } else {
      setEditingRel(null);
      setRelForm({
        id: 'rel-' + Date.now(),
        storyId: story?.id || '',
        char1Id: characters[0]?.id || '',
        char2Id: characters[1]?.id || '',
        relationType: 'Đồng minh',
        description: ''
      });
    }
    setShowRelModal(true);
  };

  const handleSaveRel = () => {
    if (!relForm.char1Id || !relForm.char2Id) return;
    onSaveRelationship(relForm);
    setShowRelModal(false);
  };

  if (!story) {
    return (
      <div className="p-8 text-center text-slate-400 text-sm">
        Vui lòng chọn hoặc tạo bộ truyện trước khi quản lý nhân vật.
      </div>
    );
  }

  const storyCharacters = characters.filter((c) => c.storyId === story.id);
  const storyRelationships = relationships.filter((r) => r.storyId === story.id);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-indigo-400" />
            Quản Lý Nhân Vật & Sơ Đồ Quan Hệ
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Bộ truyện: <strong className="text-amber-300">{story.title}</strong>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-slate-900 border border-slate-800 rounded-xl p-1">
            <button
              onClick={() => setActiveTab('cards')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'cards' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Hồ Sơ Nhân Vật
            </button>
            <button
              onClick={() => setActiveTab('map')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'map' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Sơ Đồ Quan Hệ
            </button>
          </div>

          <button
            onClick={() => handleOpenCharModal()}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            + Nhân Vật Mới
          </button>
        </div>
      </div>

      {activeTab === 'cards' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {storyCharacters.length === 0 ? (
            <div className="col-span-3 text-center py-12 text-slate-500 text-xs italic">
              Chưa có nhân vật nào trong bộ truyện này. Bấm "+ Nhân Vật Mới" để tạo.
            </div>
          ) : (
            storyCharacters.map((char) => (
              <div
                key={char.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-lg hover:border-slate-700 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h3 className="font-bold text-base text-white flex items-center gap-2">
                      {char.name}
                      <span className="text-xs font-normal text-slate-400">({char.age} tuổi)</span>
                    </h3>
                    {char.aliases && (
                      <p className="text-xs text-amber-400 font-medium">Bút danh/Tên gọi: {char.aliases}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenCharModal(char)}
                      className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded-lg transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteCharacter(char.id)}
                      className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-red-400 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-slate-300">
                  <p><strong className="text-slate-400">Giới tính:</strong> {char.gender}</p>
                  <p className="line-clamp-2"><strong className="text-slate-400">Ngoại hình:</strong> {char.appearance || 'Chưa mô tả'}</p>
                  <p className="line-clamp-2"><strong className="text-slate-400">Tính cách:</strong> {char.personality || 'Chưa mô tả'}</p>
                  <p className="line-clamp-2"><strong className="text-slate-400">Mục tiêu:</strong> {char.goals || 'Chưa mô tả'}</p>
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px]">
                  <span className="px-2 py-0.5 rounded text-emerald-400 bg-emerald-950/40 border border-emerald-800/40">
                    {char.status === 'active' ? 'Còn sống / Hoạt động' : 'Đã qua đời / Ẩn tích'}
                  </span>
                  <span className="text-slate-500">{char.notes || 'Thành viên'}</span>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        /* RELATIONSHIP MAP */
        <div className="space-y-6">
          <div className="flex items-center justify-between bg-slate-900 p-4 rounded-2xl border border-slate-800">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <GitCommit className="w-4 h-4 text-indigo-400" />
                Ma Trận & Sơ Đồ Mối Quan Hệ
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Xác định mối quan hệ giữa các nhân vật (Cha/Mẹ, Tình yêu, Đồng minh, Kẻ thù, Sư phụ/Đệ tử).
              </p>
            </div>
            <button
              onClick={() => handleOpenRelModal()}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              + Thêm Quan Hệ
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {storyRelationships.length === 0 ? (
              <div className="col-span-3 text-center py-8 text-slate-500 text-xs italic">
                Chưa có quan hệ nào được thiết lập.
              </div>
            ) : (
              storyRelationships.map((rel) => {
                const c1 = characters.find((c) => c.id === rel.char1Id);
                const c2 = characters.find((c) => c.id === rel.char2Id);
                return (
                  <div key={rel.id} className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-white">
                      <span className="text-indigo-400">{c1?.name || 'Nhân vật 1'}</span>
                      <span className="px-2 py-0.5 bg-amber-500/10 text-amber-300 border border-amber-500/20 rounded text-[10px]">
                        {rel.relationType}
                      </span>
                      <span className="text-indigo-400">{c2?.name || 'Nhân vật 2'}</span>
                    </div>
                    <p className="text-xs text-slate-400">{rel.description || 'Chưa có mô tả chi tiết'}</p>
                    <div className="flex justify-end pt-2 border-t border-slate-800">
                      <button
                        onClick={() => onDeleteRelationship(rel.id)}
                        className="text-[10px] text-red-400 hover:underline"
                      >
                        Xóa quan hệ
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* CHARACTER MODAL */}
      {showCharModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-2xl w-full space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-white">
              {editingChar ? 'Chỉnh Sửa Nhân Vật' : 'Tạo Nhân Vật Mới'}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Tên Nhân Vật *</label>
                <input
                  type="text"
                  value={charForm.name}
                  onChange={(e) => setCharForm({ ...charForm, name: e.target.value })}
                  placeholder="Ví dụ: Lâm Tiếu"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Tuổi & Giới Tính</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={charForm.age}
                    onChange={(e) => setCharForm({ ...charForm, age: e.target.value })}
                    placeholder="Tuổi"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                  />
                  <select
                    value={charForm.gender}
                    onChange={(e) => setCharForm({ ...charForm, gender: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                  >
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                    <option value="Khác">Khác</option>
                  </select>
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 mb-1">Ngoại Hình & Trang Phục</label>
                <textarea
                  value={charForm.appearance}
                  onChange={(e) => setCharForm({ ...charForm, appearance: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white resize-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 mb-1">Tính Cách & Hành Vi</label>
                <textarea
                  value={charForm.personality}
                  onChange={(e) => setCharForm({ ...charForm, personality: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Mục Tiêu Chính</label>
                <input
                  type="text"
                  value={charForm.goals}
                  onChange={(e) => setCharForm({ ...charForm, goals: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Bí Mật / Nỗi Sợ</label>
                <input
                  type="text"
                  value={charForm.secrets}
                  onChange={(e) => setCharForm({ ...charForm, secrets: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setShowCharModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium"
              >
                Hủy
              </button>
              <button
                onClick={handleSaveChar}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold"
              >
                Lưu Nhân Vật
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RELATIONSHIP MODAL */}
      {showRelModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-white">Thêm Mối Quan Hệ</h3>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Nhân Vật 1</label>
                <select
                  value={relForm.char1Id}
                  onChange={(e) => setRelForm({ ...relForm, char1Id: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                >
                  {storyCharacters.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Loại Quan Hệ</label>
                <select
                  value={relForm.relationType}
                  onChange={(e) => setRelForm({ ...relForm, relationType: e.target.value as any })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                >
                  <option value="Đồng minh">Đồng minh</option>
                  <option value="Kẻ thù">Kẻ thù</option>
                  <option value="Tình yêu">Tình yêu</option>
                  <option value="Sư phụ">Sư phụ</option>
                  <option value="Đệ tử">Đệ tử</option>
                  <option value="Cha/Mẹ">Cha/Mẹ</option>
                  <option value="Con">Con</option>
                  <option value="Anh/Em">Anh/Em</option>
                  <option value="Bạn">Bạn</option>
                  <option value="Đối thủ">Đối thủ</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Nhân Vật 2</label>
                <select
                  value={relForm.char2Id}
                  onChange={(e) => setRelForm({ ...relForm, char2Id: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                >
                  {storyCharacters.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Mô Tả Quan Hệ</label>
                <textarea
                  value={relForm.description}
                  onChange={(e) => setRelForm({ ...relForm, description: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white resize-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setShowRelModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium"
              >
                Hủy
              </button>
              <button
                onClick={handleSaveRel}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold"
              >
                Lưu Quan Hệ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
