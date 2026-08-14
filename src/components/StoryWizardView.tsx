import React, { useState } from 'react';
import { Story, StoryBible, ViewMode } from '../types';
import { generateContentAI } from '../gemini';
import { 
  Wand2, 
  Sparkles, 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  Loader2,
  CheckCircle2,
  ListOrdered
} from 'lucide-react';

interface StoryWizardViewProps {
  projectId: string;
  onCompleteWizard: (story: Story, bible: StoryBible, outlineChapters: any[]) => void;
  onNavigate: (v: ViewMode) => void;
}

const GENRE_LIST = [
  'Hài hước', 'Hài nhảm', 'Hài bựa', 'Hài chợ búa', 'Hài đen', 'Châm biếm', 'Mỉa mai',
  'Kinh dị', 'Trinh thám', 'Thriller', 'Tâm lý', 'Tình cảm', 'Lãng mạn', 'Bi kịch',
  'Hành động', 'Phiêu lưu', 'Quân sự', 'Chiến tranh', 'Lịch sử', 'Cổ trang', 'Kiếm hiệp',
  'Tiên hiệp', 'Tu tiên', 'Huyền huyễn', 'Trùng sinh', 'Xuyên không', 'Xuyên nhanh', 'Isekai',
  'Fantasy', 'Urban Fantasy', 'Sci-Fi', 'Cyberpunk', 'Dystopia', 'Hậu tận thế', 'Du hành thời gian',
  'Đời thường', 'Học đường', 'Giang hồ', 'Chính trị', 'Tội phạm'
];

const STYLE_LIST = [
  'Văn học', 'Điện ảnh', 'Đời thường', 'Nhanh', 'Chậm', 'Cảm xúc', 'Trữ tình', 'Lãng mạn',
  'Bi kịch', 'Hài hước', 'Hài nhảm', 'Hài bựa', 'Châm biếm', 'Hài đen', 'Kinh dị', 'U tối',
  'Căng thẳng', 'Lạnh lùng', 'Sắc bén', 'Giang hồ', 'Cổ trang', 'Kiếm hiệp', 'Tiên hiệp', 'Hiện đại', 'Quân sự'
];

export const StoryWizardView: React.FC<StoryWizardViewProps> = ({
  projectId,
  onCompleteWizard,
  onNavigate
}) => {
  const [step, setStep] = useState(1);
  const [loadingAI, setLoadingAI] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Wizard state
  const [idea, setIdea] = useState('');
  const [scriptMode, setScriptMode] = useState<'auto' | 'manual'>('auto');
  const [script, setScript] = useState('');
  const [selectedGenres, setSelectedGenres] = useState<string[]>(['Tu tiên', 'Hài hước']);
  const [selectedStyles, setSelectedStyles] = useState<string[]>(['Cổ trang', 'Sắc bén']);
  const [setting, setSetting] = useState('');
  const [characters, setCharacters] = useState('');
  const [conflict, setConflict] = useState('');
  
  // Story Bible Draft
  const [logline, setLogline] = useState('');
  const [premise, setPremise] = useState('');
  const [worldRules, setWorldRules] = useState('');

  const [targetChapters, setTargetChapters] = useState(30);
  const [targetWordCount, setTargetWordCount] = useState(2500);

  const [generatedOutline, setGeneratedOutline] = useState<any[]>([]);

  const toggleGenre = (g: string) => {
    if (selectedGenres.includes(g)) {
      setSelectedGenres(selectedGenres.filter((item) => item !== g));
    } else {
      setSelectedGenres([...selectedGenres, g]);
    }
  };

  const toggleStyle = (s: string) => {
    if (selectedStyles.includes(s)) {
      setSelectedStyles(selectedStyles.filter((item) => item !== s));
    } else {
      setSelectedStyles([...selectedStyles, s]);
    }
  };

  // AI Helper Functions
  const handleGenerateScriptWithAI = async () => {
    if (!idea) {
      setErrorMsg('Vui lòng nhập ý tưởng ban đầu!');
      return;
    }
    setLoadingAI(true);
    setErrorMsg('');
    try {
      const prompt = `Bạn là biên kịch tiểu thuyết chuyên nghiệp. Dựa vào ý tưởng: "${idea}", thể loại: ${selectedGenres.join(', ')}, hãy xây dựng kịch bản tổng thể vắn tắt gồm: Premise, Logline, Hook, Act 1, Act 2, Act 3, Midpoint, Climax, Ending bằng tiếng Việt tự nhiên.`;
      const res = await generateContentAI(prompt);
      setScript(res);
    } catch (err: any) {
      setErrorMsg(err.message || 'Lỗi tạo kịch bản.');
    } finally {
      setLoadingAI(false);
    }
  };

  const handleGenerateBibleWithAI = async () => {
    setLoadingAI(true);
    setErrorMsg('');
    try {
      const prompt = `Dựa vào kịch bản: "${script || idea}", thể loại: ${selectedGenres.join(', ')}, phong cách: ${selectedStyles.join(', ')}, hãy xuất thông tin Story Bible dạng JSON với các field: logline, premise, worldRules, socialRules, magicTechnologyRules, forbiddenContradictions. Chỉ trả về duy nhất JSON hợp lệ.`;
      const res = await generateContentAI(prompt, { jsonMode: true });
      const parsed = JSON.parse(res);
      setLogline(parsed.logline || '');
      setPremise(parsed.premise || '');
      setWorldRules(parsed.worldRules || '');
    } catch (err: any) {
      // Fallback text parsing if JSON fails
      setLogline(idea.slice(0, 100));
      setPremise(script.slice(0, 200) || idea);
      setWorldRules('Quy tắc thế giới cơ bản theo thể loại ' + selectedGenres.join(', '));
    } finally {
      setLoadingAI(false);
    }
  };

  const handleGenerateOutlineWithAI = async () => {
    setLoadingAI(true);
    setErrorMsg('');
    try {
      const prompt = `Hãy tạo Outline cho ${targetChapters} chương tiểu thuyết theo kịch bản: "${script || idea}".
Mỗi chương trả về một object trong mảng JSON:
[
  { "order": 1, "title": "Tên chương 1", "summary": "Tóm tắt cốt truyện chương 1", "goal": "Mục tiêu chương", "conflict": "Xung đột chính" }
]
Chỉ xuất đúng JSON array gồm ${Math.min(targetChapters, 15)} chương đầu tiên đại diện.`;

      const res = await generateContentAI(prompt, { jsonMode: true });
      const parsed = JSON.parse(res);
      if (Array.isArray(parsed)) {
        setGeneratedOutline(parsed);
      } else {
        throw new Error('Dữ liệu Outline không đúng định dạng mảng.');
      }
    } catch (err: any) {
      // Fallback manual outline list
      const fallbackList = Array.from({ length: Math.min(targetChapters, 10) }).map((_, i) => ({
        order: i + 1,
        title: `Chương ${i + 1}: Mở Đầu Hành Trình`,
        summary: `Chương ${i + 1} giới thiệu diễn biến tiếp theo dựa trên ý tưởng "${idea.slice(0, 30)}..."`,
        goal: 'Mục tiêu chính của chương',
        conflict: 'Sự cố và trở ngại'
      }));
      setGeneratedOutline(fallbackList);
    } finally {
      setLoadingAI(false);
    }
  };

  const handleFinishWizard = () => {
    const storyId = 'story-' + Date.now();
    const newStory: Story = {
      id: storyId,
      projectId: projectId || 'proj-demo-1',
      title: logline ? logline.slice(0, 30) : 'Bộ Truyện Mới ' + new Date().toLocaleDateString('vi-VN'),
      author: 'Tác giả',
      synopsis: premise || idea || 'Mô tả vắn tắt bộ truyện.',
      genres: selectedGenres,
      writingStyle: selectedStyles,
      status: 'writing',
      targetChapters: targetChapters,
      targetWordCountPerChapter: targetWordCount,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    const newBible: StoryBible = {
      id: 'bible-' + Date.now(),
      storyId: storyId,
      logline: logline || idea,
      hook: idea,
      premise: premise || idea,
      synopsis: script || idea,
      theme: selectedGenres.join(', '),
      tone: selectedStyles.join(', '),
      worldRules: worldRules || 'Chưa thiết lập',
      socialRules: 'Quy tắc xã hội theo bối cảnh',
      politicalRules: 'Chính trị phe phái',
      magicTechnologyRules: 'Công nghệ hoặc ma pháp',
      importantEvents: 'Cập nhật từ Outline',
      forbiddenContradictions: 'Không mâu thuẫn với bối cảnh ban đầu'
    };

    onCompleteWizard(newStory, newBible, generatedOutline);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Wizard Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <Wand2 className="w-6 h-6 text-amber-400" />
            Story Wizard - Qúa Trình 11 Bước Sáng Tạo Truyện
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Bước {step} / 11: {
              step === 1 ? 'Ý Tưởng Ban Đầu' :
              step === 2 ? 'Kịch Bản Tổng Thể' :
              step === 3 ? 'Chọn Thể Loại (Multi-Genre)' :
              step === 4 ? 'Chọn Phong Cách (Writing Style)' :
              step === 5 ? 'Thiết Lập Bối Cảnh' :
              step === 6 ? 'Nhân Vật Chính' :
              step === 7 ? 'Xung Đột & Động Cơ' :
              step === 8 ? 'Story Bible (Thánh Kinh Truyện)' :
              step === 9 ? 'Mục Tiêu Số Chương' :
              step === 10 ? 'Độ Dài Chương' : 'Tạo Outline Hoàn Chỉnh'
            }
          </p>
        </div>

        <button
          onClick={() => onNavigate('stories')}
          className="text-xs text-slate-400 hover:text-slate-200 underline"
        >
          Thoát Wizard
        </button>
      </div>

      {/* Progress Stepper Bar */}
      <div className="grid grid-cols-11 gap-1 bg-slate-900 p-2 rounded-xl border border-slate-800">
        {Array.from({ length: 11 }).map((_, idx) => {
          const stepNum = idx + 1;
          const isDone = stepNum < step;
          const isCurrent = stepNum === step;
          return (
            <div
              key={idx}
              onClick={() => stepNum <= step && setStep(stepNum)}
              className={`h-2 rounded-full cursor-pointer transition-all ${
                isDone
                  ? 'bg-emerald-500'
                  : isCurrent
                  ? 'bg-amber-400 shadow-lg shadow-amber-400/50'
                  : 'bg-slate-800'
              }`}
              title={`Bước ${stepNum}`}
            />
          );
        })}
      </div>

      {errorMsg && (
        <div className="p-3 bg-red-950/60 border border-red-800 rounded-xl text-xs text-red-300">
          {errorMsg}
        </div>
      )}

      {/* STEP CONTENT CONTAINER */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
        {/* Step 1: Ý tưởng */}
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-white">Bước 1: Ý Tưởng Sáng Tác Ban Đầu</h2>
            <p className="text-xs text-slate-400">
              Nhập ý tưởng cốt lõi, nguồn cảm hứng hoặc câu chuyện bạn muốn viết. AI sẽ mở rộng và hoàn thiện ở các bước tiếp theo.
            </p>
            <textarea
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              placeholder="Ví dụ: Một thiếu niên nhặt được thanh kiếm gỉ sét có linh hồn Kiếm Đế thích tán gẫu hài hước..."
              rows={5}
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-indigo-500 leading-relaxed"
            />
          </div>
        )}

        {/* Step 2: Kịch bản */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white">Bước 2: Xây Dựng Kịch Bản Tổng Thể</h2>
              <button
                onClick={handleGenerateScriptWithAI}
                disabled={loadingAI}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-md disabled:opacity-50"
              >
                {loadingAI ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                Tạo Kịch Bản Tự Động Với AI
              </button>
            </div>
            <p className="text-xs text-slate-400">
              Nhập kịch bản chi tiết hoặc bấm nút tạo kịch bản tự động để AI viết dàn ý kịch bản cho bạn.
            </p>
            <textarea
              value={script}
              onChange={(e) => setScript(e.target.value)}
              placeholder="Dàn ý kịch bản tổng thể: Premise, Mở đầu, Thách thức, Cao trào và Kết thúc..."
              rows={7}
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-indigo-500 leading-relaxed"
            />
          </div>
        )}

        {/* Step 3: Multi-Genre */}
        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-white">Bước 3: Thể Loại (Chọn Nhiều Thể Loại)</h2>
            <p className="text-xs text-slate-400">
              AI Novel Studio cho phép kết hợp tự do nhiều thể loại (VD: Hài hước + Tu Tiên + Xuyên Không).
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-2 max-h-64 overflow-y-auto p-2 bg-slate-950 border border-slate-800 rounded-xl">
              {GENRE_LIST.map((g) => {
                const active = selectedGenres.includes(g);
                return (
                  <button
                    key={g}
                    onClick={() => toggleGenre(g)}
                    className={`px-2.5 py-2 rounded-lg text-xs font-medium border text-left flex items-center justify-between transition-all ${
                      active
                        ? 'bg-indigo-600 border-indigo-500 text-white shadow'
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <span className="truncate">{g}</span>
                    {active && <Check className="w-3 h-3 text-white" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 4: Writing Style */}
        {step === 4 && (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-white">Bước 4: Phong Cách Hành Văn (Writing Style)</h2>
            <p className="text-xs text-slate-400">
              Chọn văn phong định hình nhịp điệu, lời thoại và cách miêu tả cho AI.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-2 max-h-64 overflow-y-auto p-2 bg-slate-950 border border-slate-800 rounded-xl">
              {STYLE_LIST.map((s) => {
                const active = selectedStyles.includes(s);
                return (
                  <button
                    key={s}
                    onClick={() => toggleStyle(s)}
                    className={`px-2.5 py-2 rounded-lg text-xs font-medium border text-left flex items-center justify-between transition-all ${
                      active
                        ? 'bg-amber-600 border-amber-500 text-white shadow'
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <span className="truncate">{s}</span>
                    {active && <Check className="w-3 h-3 text-white" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 5: Bối cảnh */}
        {step === 5 && (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-white">Bước 5: Bối Cảnh & Thế Giới</h2>
            <p className="text-xs text-slate-400">
              Mô tả không gian, thời gian, thế giới quan và quy tắc vận hành.
            </p>
            <textarea
              value={setting}
              onChange={(e) => setSetting(e.target.value)}
              placeholder="Ví dụ: Ninh Xuyên Châu với 3 đại Tông môn cai trị, hệ thống tu tiên chia làm 9 cảnh giới..."
              rows={5}
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
            />
          </div>
        )}

        {/* Step 6: Nhân vật */}
        {step === 6 && (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-white">Bước 6: Tuyến Nhân Vật Chính</h2>
            <p className="text-xs text-slate-400">Phác thảo tên, tính cách và hình dáng các nhân vật chính.</p>
            <textarea
              value={characters}
              onChange={(e) => setCharacters(e.target.value)}
              placeholder="Nam chính: Lâm Tiếu (18 tuổi, lém lỉnh)... Nữ chính: Mục Tuyết Dao (19 tuổi, lạnh lùng)..."
              rows={5}
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
            />
          </div>
        )}

        {/* Step 7: Xung đột */}
        {step === 7 && (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-white">Bước 7: Xung Đột & Mâu Thuẫn Chính</h2>
            <p className="text-xs text-slate-400">Động cơ thúc đẩy nhân vật hành động và các thế lực đối đầu.</p>
            <textarea
              value={conflict}
              onChange={(e) => setConflict(e.target.value)}
              placeholder="Âm mưu lật đổ Chưởng Môn của Trưởng Lão Hội, bí mật Kiếm Cổ..."
              rows={5}
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
            />
          </div>
        )}

        {/* Step 8: Story Bible */}
        {step === 8 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white">Bước 8: Tổng Hợp Story Bible</h2>
              <button
                onClick={handleGenerateBibleWithAI}
                disabled={loadingAI}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-md disabled:opacity-50"
              >
                {loadingAI ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                Tổng Hợp Bible Với AI
              </button>
            </div>
            <p className="text-xs text-slate-400">
              Story Bible là nguồn sự thật tối cao mà AI sẽ bám sát tuyệt đối khi viết văn bản.
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Logline (Câu tóm tắt 1 dòng)</label>
                <input
                  type="text"
                  value={logline}
                  onChange={(e) => setLogline(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Premise (Tiền đề truyện)</label>
                <textarea
                  value={premise}
                  onChange={(e) => setPremise(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">World Rules (Quy tắc thế giới)</label>
                <textarea
                  value={worldRules}
                  onChange={(e) => setWorldRules(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 9: Số chương */}
        {step === 9 && (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-white">Bước 9: Mục Tiêu Số Chương</h2>
            <p className="text-xs text-slate-400">Chọn số chương mẫu hoặc nhập thủ công (không giới hạn).</p>
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
              {[10, 20, 30, 50, 100, 200, 500].map((num) => (
                <button
                  key={num}
                  onClick={() => setTargetChapters(num)}
                  className={`p-3 rounded-xl text-xs font-bold border transition-all ${
                    targetChapters === num
                      ? 'bg-amber-600 border-amber-500 text-white shadow-lg'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  {num} chương
                </button>
              ))}
            </div>

            <div className="pt-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1">Hoặc Nhập Số Chương Thủ Công</label>
              <input
                type="number"
                value={targetChapters}
                onChange={(e) => setTargetChapters(parseInt(e.target.value) || 10)}
                className="w-full sm:w-48 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
              />
            </div>
          </div>
        )}

        {/* Step 10: Độ dài chương */}
        {step === 10 && (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-white">Bước 10: Mục Tiêu Độ Dài Chương (Từ)</h2>
            <p className="text-xs text-slate-400">Độ dài dự kiến trung bình cho mỗi chương.</p>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {[500, 1000, 1500, 2000, 2500, 3000, 5000, 8000, 10000].map((words) => (
                <button
                  key={words}
                  onClick={() => setTargetWordCount(words)}
                  className={`p-3 rounded-xl text-xs font-bold border transition-all ${
                    targetWordCount === words
                      ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  {words.toLocaleString()} từ
                </button>
              ))}
            </div>

            <div className="pt-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1">Hoặc Nhập Độ Dài Thủ Công</label>
              <input
                type="number"
                value={targetWordCount}
                onChange={(e) => setTargetWordCount(parseInt(e.target.value) || 2000)}
                className="w-full sm:w-48 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
              />
            </div>
          </div>
        )}

        {/* Step 11: Outline */}
        {step === 11 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white">Bước 11: Tạo Outline Hoàn Chỉnh</h2>
              <button
                onClick={handleGenerateOutlineWithAI}
                disabled={loadingAI}
                className="px-3 py-1.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-md disabled:opacity-50"
              >
                {loadingAI ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                Tạo Outline Với AI
              </button>
            </div>

            <div className="space-y-2 max-h-72 overflow-y-auto p-3 bg-slate-950 border border-slate-800 rounded-xl">
              {generatedOutline.length === 0 ? (
                <div className="text-xs text-slate-500 italic p-4 text-center">
                  Bấm "Tạo Outline Với AI" hoặc bấm "Hoàn Tất Wizard" để tự động khởi tạo danh sách chương.
                </div>
              ) : (
                generatedOutline.map((item, idx) => (
                  <div key={idx} className="p-3 bg-slate-900 border border-slate-800 rounded-lg text-xs space-y-1">
                    <div className="font-bold text-amber-400">
                      Chương {item.order || idx + 1}: {item.title || `Chương ${idx + 1}`}
                    </div>
                    <p className="text-slate-300">{item.summary}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Navigation buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <button
            onClick={() => setStep(Math.max(1, step - 1))}
            disabled={step === 1}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-300 rounded-xl text-xs font-medium flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Quay Lại
          </button>

          {step < 11 ? (
            <button
              onClick={() => setStep(Math.min(11, step + 1))}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-md"
            >
              Tiếp Theo
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={handleFinishWizard}
              className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xl"
            >
              <CheckCircle2 className="w-4 h-4" />
              HOÀN TẤT & TẠO TRUYỆN
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
