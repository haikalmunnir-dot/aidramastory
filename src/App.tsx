import { useState, useCallback } from 'react';
import { AppSection, StoryConfig, Character, Scene, StoryBible, ValidationResult, Project } from './types';
import { isAIConfigured, generateStoryDesign, generateSceneOutline, generateCharacters, regenerateScene, getAIConfig } from './services/aiProvider';
import { saveProject, loadProject, getAllProjects, exportAsJSON, exportAsTXT, downloadFile } from './services/storage';
import { validateContinuity, getValidationSummary } from './services/validator';
import { v4 as uuidv4 } from 'uuid';
import { Film, Users, LayoutGrid, Download, Settings, Plus, Trash2, Copy, RefreshCw, CheckCircle, AlertTriangle, XCircle, Loader2, ChevronDown, ChevronUp, Lock, Unlock, Save, FolderOpen, Wand2, FileText, Play } from 'lucide-react';
import { generateDemoCharacters, generateDemoStoryBible, generateDemoScenes } from './services/demoData';

const DEFAULT_CONFIG: StoryConfig = {
  genre: 'Romansa CEO',
  custom_genre: '',
  title: '',
  story_idea: '',
  premise: '',
  main_conflict: '',
  desired_ending: '',
  scene_count: 10,
  custom_scene_count: 10,
  aspect_ratio: '9:16',
  visual_style: 'Sinematik realistis',
  custom_visual_style: '',
  dialogue_language: 'Bahasa Indonesia',
  custom_language: '',
  narration_mode: 'Tanpa narator',
  target_audience: 'Umum',
  romance_level: 'Sedang',
  conflict_intensity: 'Sedang',
  pacing: 'Normal',
  ending_type: 'Bahagia',
  realism_level: 'Tinggi',
  music_atmosphere: 'Sinematik',
  negative_prompt_global: 'visual glitches, flickering, frame distortion, temporal inconsistency, inconsistent character identity, changing facial features, face morphing, unnatural body proportions, deformed hands, extra fingers, missing fingers, extra limbs, duplicated characters, duplicated objects, floating objects, disappearing props, inconsistent clothing, unnatural body movement, robotic gestures, broken anatomy, unnatural eye movement, unnatural lip movement, unsynchronized dialogue, incorrect speaker mouth movement, unintended character appearance changes, sudden lighting changes, inconsistent shadows, background warping, object deformation, unwanted text, subtitles, captions, logos, watermarks, low-resolution facial details, excessive motion blur, abrupt camera jumps, random scene transitions, visual artifacts.',
  prompt_detail_level: 'Detail'
};

function App() {
  const [activeSection, setActiveSection] = useState<AppSection>('story');
  const [config, setConfig] = useState<StoryConfig>(DEFAULT_CONFIG);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [storyBible, setStoryBible] = useState<StoryBible | null>(null);
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [validationResults, setValidationResults] = useState<ValidationResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [projectId, setProjectId] = useState(uuidv4());
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [expandedScene, setExpandedScene] = useState<number | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [aiConfig, setAiConfig] = useState(getAIConfig());

  const showMessage = (msg: string, type: 'error' | 'success') => {
    if (type === 'error') { setError(msg); setTimeout(() => setError(''), 5000); }
    else { setSuccess(msg); setTimeout(() => setSuccess(''), 3000); }
  };

  const updateConfig = (key: keyof StoryConfig, value: any) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  // CHARACTER MANAGEMENT
  const addCharacter = () => {
    const newChar: Character = {
      character_id: `CHAR_${String(characters.length + 1).padStart(3, '0')}`,
      name: '', role: '', gender: 'pria', age: '25-35',
      height: '170cm', body_type: 'Normal', face_shape: 'Oval',
      skin_color: 'Sawo matang', hair_style: 'Pendek rapi',
      hair_color: 'Hitam', eye_color: 'Cokelat',
      physical_marks: '', default_outfit: 'Kasual rapi',
      accessories: '', personality: '', speaking_style: '',
      voice_characteristics: '', relationships: '',
      goals: '', secrets: '', dialogue_language: config.dialogue_language,
      locked: false, visual_identity: ''
    };
    setCharacters([...characters, newChar]);
  };

  const updateCharacter = (index: number, key: keyof Character, value: any) => {
    setCharacters(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [key]: value };
      return updated;
    });
  };

  const removeCharacter = (index: number) => {
    setCharacters(characters.filter((_, i) => i !== index));
  };

  const toggleCharacterLock = (index: number) => {
    setCharacters(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], locked: !updated[index].locked };
      return updated;
    });
  };

  // AI GENERATION
  const handleGenerateStory = async () => {
    if (!isAIConfigured()) {
      showMessage('API Key belum dikonfigurasi. Buka menu Pengaturan.', 'error');
      return;
    }
    setLoading(true);
    setLoadingMessage('Membuat desain cerita...');
    setError('');
    try {
      const result = await generateStoryDesign(config, characters);
      const parsed = JSON.parse(result);
      setStoryBible(parsed);
      if (!config.title && parsed.title) {
        updateConfig('title', parsed.title);
      }
      showMessage('Story Bible berhasil dibuat!', 'success');
    } catch (e: any) {
      showMessage(e.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateCharacters = async () => {
    if (!isAIConfigured()) {
      showMessage('API Key belum dikonfigurasi. Buka menu Pengaturan.', 'error');
      return;
    }
    setLoading(true);
    setLoadingMessage('Membuat karakter otomatis...');
    setError('');
    try {
      const result = await generateCharacters(config, config.story_idea);
      const parsed = JSON.parse(result);
      const newChars: Character[] = parsed.map((c: any, i: number) => ({
        character_id: c.character_id || `CHAR_${String(i + 1).padStart(3, '0')}`,
        name: c.name || '', role: c.role || '',
        gender: c.gender || 'pria', age: c.age || '25-35',
        height: c.height || '170cm', body_type: c.body_type || 'Normal',
        face_shape: c.face_shape || 'Oval', skin_color: c.skin_color || 'Sawo matang',
        hair_style: c.hair_style || 'Pendek', hair_color: c.hair_color || 'Hitam',
        eye_color: c.eye_color || 'Cokelat', physical_marks: c.physical_marks || '',
        default_outfit: c.default_outfit || '', accessories: c.accessories || '',
        personality: c.personality || '', speaking_style: c.speaking_style || '',
        voice_characteristics: c.voice_characteristics || '',
        relationships: c.relationships || '', goals: c.goals || '',
        secrets: c.secrets || '', dialogue_language: c.dialogue_language || config.dialogue_language,
        locked: false, visual_identity: c.visual_identity || ''
      }));
      setCharacters(newChars);
      showMessage(`${newChars.length} karakter berhasil dibuat!`, 'success');
    } catch (e: any) {
      showMessage(e.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateScenes = async () => {
    if (!isAIConfigured()) {
      showMessage('API Key belum dikonfigurasi. Buka menu Pengaturan.', 'error');
      return;
    }
    if (!storyBible) {
      showMessage('Buat Story Bible terlebih dahulu.', 'error');
      return;
    }
    setLoading(true);
    setLoadingMessage(`Membuat ${config.scene_count} scene...`);
    setError('');
    try {
      const result = await generateSceneOutline(storyBible, config, characters);
      const parsed = JSON.parse(result);
      const newScenes: Scene[] = parsed.map((s: any, i: number) => ({
        scene_number: s.scene_number || i + 1,
        title: s.title || `Scene ${i + 1}`,
        story_function: s.story_function || '',
        duration_seconds: 10,
        aspect_ratio: config.aspect_ratio,
        visual_style: config.visual_style,
        dialogue_language: config.dialogue_language,
        location: s.location || '',
        time_of_day: s.time_of_day || '',
        weather: s.weather || '',
        characters_present: s.characters_present || [],
        initial_condition: s.initial_condition || '',
        narration: s.narration || '',
        timeline: s.timeline || [],
        dialogue: s.dialogue || [],
        expressions_acting: s.expressions_acting || '',
        camera_direction: s.camera_direction || '',
        lighting_color: s.lighting_color || '',
        audio_music: s.audio_music || '',
        video_prompt: s.video_prompt || '',
        negative_prompt: s.negative_prompt || config.negative_prompt_global,
        ending_state: s.ending_state || '',
        continuity_link: s.continuity_link || '',
        validation_status: 'consistent' as const,
        locked: false
      }));
      setScenes(newScenes);
      showMessage(`${newScenes.length} scene berhasil dibuat!`, 'success');
    } catch (e: any) {
      showMessage(e.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerateScene = async (sceneIndex: number) => {
    if (!isAIConfigured() || !storyBible) return;
    setLoading(true);
    setLoadingMessage(`Membuat ulang scene ${sceneIndex + 1}...`);
    try {
      const prevScene = sceneIndex > 0 ? scenes[sceneIndex - 1] : undefined;
      const result = await regenerateScene(storyBible, scenes[sceneIndex], characters, config, prevScene);
      const parsed = JSON.parse(result);
      setScenes(prev => {
        const updated = [...prev];
        updated[sceneIndex] = {
          ...updated[sceneIndex],
          ...parsed,
          duration_seconds: 10,
          aspect_ratio: config.aspect_ratio,
          dialogue_language: config.dialogue_language,
          validation_status: 'consistent'
        };
        return updated;
      });
      showMessage(`Scene ${sceneIndex + 1} berhasil dibuat ulang!`, 'success');
    } catch (e: any) {
      showMessage(e.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  // DEMO MODE
  const handleLoadDemo = () => {
    const demoChars = generateDemoCharacters(config.dialogue_language);
    const demoBible = generateDemoStoryBible();
    const demoScenes = generateDemoScenes(config);
    setCharacters(demoChars);
    setStoryBible(demoBible);
    setScenes(demoScenes);
    updateConfig('title', demoBible.title);
    showMessage('Data demo berhasil dimuat! Ini adalah contoh untuk melihat cara kerja aplikasi.', 'success');
  };

  const handleValidate = () => {
    const results = validateContinuity(scenes, characters, storyBible);
    setValidationResults(results);
    const summary = getValidationSummary(results);
    if (summary.failures > 0) {
      showMessage(`Ditemukan ${summary.failures} konflik. Periksa hasil validasi.`, 'error');
    } else if (summary.warnings > 0) {
      showMessage(`Validasi selesai. ${summary.warnings} peringatan perlu diperiksa.`, 'success');
    } else {
      showMessage('Semua scene konsisten!', 'success');
    }
    setActiveSection('scenes');
  };

  // PROJECT MANAGEMENT
  const handleSaveProject = () => {
    const project: Project = {
      id: projectId,
      name: config.title || 'Proyek Tanpa Judul',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      config, characters, story_bible: storyBible, scenes, validation_results: validationResults
    };
    saveProject(project);
    showMessage('Proyek berhasil disimpan!', 'success');
  };

  const handleLoadProject = () => {
    const projects = getAllProjects();
    if (projects.length === 0) {
      showMessage('Belum ada proyek tersimpan.', 'error');
      return;
    }
    const latest = projects[projects.length - 1];
    setConfig(latest.config);
    setCharacters(latest.characters);
    setStoryBible(latest.story_bible);
    setScenes(latest.scenes);
    setValidationResults(latest.validation_results);
    setProjectId(latest.id);
    showMessage(`Proyek "${latest.name}" berhasil dimuat!`, 'success');
  };

  const handleReset = () => {
    if (confirm('Reset semua data? Data yang belum disimpan akan hilang.')) {
      setConfig(DEFAULT_CONFIG);
      setCharacters([]);
      setStoryBible(null);
      setScenes([]);
      setValidationResults([]);
      setProjectId(uuidv4());
      showMessage('Form berhasil direset.', 'success');
    }
  };

  // EXPORT
  const handleExportJSON = () => {
    const project: Project = {
      id: projectId, name: config.title || 'Drama', created_at: '',
      updated_at: '', config, characters, story_bible: storyBible,
      scenes, validation_results: validationResults
    };
    downloadFile(exportAsJSON(project), `${config.title || 'drama'}.json`, 'application/json');
    showMessage('File JSON berhasil diunduh!', 'success');
  };

  const handleExportTXT = () => {
    const project: Project = {
      id: projectId, name: config.title || 'Drama', created_at: '',
      updated_at: '', config, characters, story_bible: storyBible,
      scenes, validation_results: validationResults
    };
    downloadFile(exportAsTXT(project), `${config.title || 'drama'}.txt`, 'text/plain');
    showMessage('File TXT berhasil diunduh!', 'success');
  };

  const handleCopyPrompt = (prompt: string) => {
    navigator.clipboard.writeText(prompt);
    showMessage('Prompt berhasil disalin!', 'success');
  };

  const handleCopyAllPrompts = () => {
    const allPrompts = scenes.map(s =>
      `═══════ SCENE ${s.scene_number}: ${s.title} ═══════\n\n${s.video_prompt}\n\nNegative: ${s.negative_prompt}\n`
    ).join('\n\n');
    navigator.clipboard.writeText(allPrompts);
    showMessage('Semua prompt berhasil disalin!', 'success');
  };

  const toggleSceneLock = (index: number) => {
    setScenes(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], locked: !updated[index].locked };
      return updated;
    });
  };

  const validationSummary = validationResults.length > 0 ? getValidationSummary(validationResults) : null;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Film className="w-6 h-6 text-indigo-600" />
            <h1 className="text-lg font-bold text-gray-900">AI DRAMA STUDIO</h1>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setShowSettings(!showSettings)} className="p-2 rounded-lg hover:bg-gray-100" title="Pengaturan">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
        <p className="max-w-7xl mx-auto px-4 pb-2 text-xs text-gray-500">
          Buat cerita drama AI dan ubah menjadi prompt video yang konsisten dari scene pertama sampai terakhir.
        </p>
      </header>

      {/* Settings Panel */}
      {showSettings && (
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="bg-white rounded-xl border p-4">
            <h3 className="font-semibold mb-3">Pengaturan AI</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="text-xs text-gray-600">Provider</label>
                <select value={aiConfig.provider} onChange={e => setAiConfig({...aiConfig, provider: e.target.value as any})} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm">
                  <option value="openai">OpenAI</option>
                  <option value="custom">Custom (OpenAI Compatible)</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-600">Base URL</label>
                <input value={aiConfig.base_url} onChange={e => setAiConfig({...aiConfig, base_url: e.target.value})} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm" placeholder="https://api.openai.com/v1" />
              </div>
              <div>
                <label className="text-xs text-gray-600">Model</label>
                <input value={aiConfig.model} onChange={e => setAiConfig({...aiConfig, model: e.target.value})} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm" placeholder="gpt-4o" />
              </div>
              <div className="md:col-span-3">
                <label className="text-xs text-gray-600">API Key</label>
                <input type="password" value={aiConfig.api_key} onChange={e => setAiConfig({...aiConfig, api_key: e.target.value})} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm" placeholder="sk-..." />
              </div>
            </div>
            <button onClick={() => { localStorage.setItem('ai_config', JSON.stringify(aiConfig)); showMessage('Pengaturan disimpan!', 'success'); }} className="mt-3 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700">
              Simpan Pengaturan
            </button>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex gap-1 overflow-x-auto">
          {([
            { id: 'story', label: 'Buat Cerita', icon: Wand2 },
            { id: 'characters', label: 'Karakter', icon: Users },
            { id: 'scenes', label: 'Hasil Scene', icon: LayoutGrid },
            { id: 'export', label: 'Ekspor Prompt', icon: Download }
          ] as { id: AppSection; label: string; icon: any }[]).map(item => (
            <button key={item.id} onClick={() => setActiveSection(item.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${activeSection === item.id ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100 border'}`}>
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
            <p className="text-sm font-medium">{loadingMessage}</p>
            <p className="text-xs text-gray-500">Mohon tunggu, AI sedang bekerja...</p>
          </div>
        </div>
      )}

      {/* Error/Success Messages */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 py-2">
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2">
            <XCircle className="w-4 h-4 text-red-600 shrink-0" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}
      {success && (
        <div className="max-w-7xl mx-auto px-4 py-2">
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-600 shrink-0" />
            <p className="text-sm text-green-700">{success}</p>
          </div>
        </div>
      )}

      {/* AI Config Notice */}
      {!isAIConfigured() && (
        <div className="max-w-7xl mx-auto px-4 pt-2">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-amber-800">Mode Demo — AI Belum Dikonfigurasi</p>
              <p className="text-amber-700 text-xs mt-0.5">
                Klik tombol <strong>"Muat Demo"</strong> untuk melihat contoh hasil, atau buka <button onClick={() => setShowSettings(true)} className="underline font-medium">Pengaturan</button> untuk memasukkan API Key.
                Aplikasi mendukung semua API kompatibel OpenAI (OpenAI, Groq, Together AI, dll).
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-4 pb-20">
        {/* STORY SECTION */}
        {activeSection === 'story' && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl border p-5">
              <h2 className="text-lg font-semibold mb-4">Pengaturan Cerita</h2>
              
              {/* Genre */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Genre Drama</label>
                <select value={config.genre} onChange={e => updateConfig('genre', e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm">
                  {['C-Drama China', 'K-Drama Korea', 'Drama Indonesia', 'Romansa CEO', 'Romansa kerajaan', 'Drama keluarga', 'Pengkhianatan', 'Balas dendam', 'Misteri', 'Thriller', 'Fantasi', 'Aksi', 'Horor', 'Komedi romantis', 'Genre campuran', 'Genre khusus'].map(g => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
                {config.genre === 'Genre khusus' && (
                  <input value={config.custom_genre} onChange={e => updateConfig('custom_genre', e.target.value)} className="w-full mt-2 px-3 py-2 border rounded-lg text-sm" placeholder="Tulis genre khusus..." />
                )}
              </div>

              {/* Title & Idea */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Judul Cerita (opsional)</label>
                  <input value={config.title} onChange={e => updateConfig('title', e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="Biarkan kosong untuk AI membuat judul" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Jumlah Scene</label>
                  <select value={config.scene_count} onChange={e => updateConfig('scene_count', parseInt(e.target.value))} className="w-full px-3 py-2 border rounded-lg text-sm">
                    <option value={5}>5 scene (50 detik)</option>
                    <option value={10}>10 scene (100 detik)</option>
                    <option value={15}>15 scene (150 detik)</option>
                    <option value={20}>20 scene (200 detik)</option>
                    <option value={30}>30 scene (300 detik)</option>
                  </select>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Ide Cerita (opsional)</label>
                <textarea value={config.story_idea} onChange={e => updateConfig('story_idea', e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm h-20 resize-none" placeholder="Tulis ide cerita atau biarkan AI menciptakan ide orisinal..." />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Premis (opsional)</label>
                  <input value={config.premise} onChange={e => updateConfig('premise', e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="Premis cerita" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Konflik Utama (opsional)</label>
                  <input value={config.main_conflict} onChange={e => updateConfig('main_conflict', e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="Konflik utama" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ending (opsional)</label>
                  <input value={config.desired_ending} onChange={e => updateConfig('desired_ending', e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="Ending yang diinginkan" />
                </div>
              </div>

              {/* Format & Style */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Format Video</label>
                  <select value={config.aspect_ratio} onChange={e => updateConfig('aspect_ratio', e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm">
                    <option value="9:16">Vertikal 9:16 (Reels/TikTok)</option>
                    <option value="16:9">Horizontal 16:9</option>
                    <option value="1:1">Persegi 1:1</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gaya Visual</label>
                  <select value={config.visual_style} onChange={e => updateConfig('visual_style', e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm">
                    {['Sinematik realistis', 'C-Drama modern', 'K-Drama modern', 'Drama kerajaan', 'Horor realistis', 'Fantasi realistis', 'Anime', 'Gaya khusus'].map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bahasa Dialog</label>
                  <select value={config.dialogue_language} onChange={e => updateConfig('dialogue_language', e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm">
                    <option value="Bahasa Indonesia">Bahasa Indonesia</option>
                    <option value="English">Bahasa Inggris</option>
                    <option value="Mandarin">Bahasa Mandarin</option>
                    <option value="Korean">Bahasa Korea</option>
                  </select>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Mode Narasi</label>
                <select value={config.narration_mode} onChange={e => updateConfig('narration_mode', e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm">
                  <option value="Tanpa narator">Tanpa narator (aksi & dialog saja)</option>
                  <option value="Narasi orang ketiga">Narasi orang ketiga</option>
                  <option value="Narasi orang pertama">Narasi orang pertama</option>
                  <option value="Narasi pembuka dan penutup">Narasi pembuka dan penutup saja</option>
                </select>
              </div>

              {/* Advanced Settings */}
              <button onClick={() => setShowAdvanced(!showAdvanced)} className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-800 mb-3">
                {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                Pengaturan Lanjutan
              </button>

              {showAdvanced && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Target Penonton</label>
                    <select value={config.target_audience} onChange={e => updateConfig('target_audience', e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm">
                      <option>Umum</option><option>Remaja</option><option>Dewasa</option><option>Anak-anak</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Tingkat Romantis</label>
                    <select value={config.romance_level} onChange={e => updateConfig('romance_level', e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm">
                      <option>Tidak ada</option><option>Rendah</option><option>Sedang</option><option>Tinggi</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Intensitas Konflik</label>
                    <select value={config.conflict_intensity} onChange={e => updateConfig('conflict_intensity', e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm">
                      <option>Rendah</option><option>Sedang</option><option>Tinggi</option><option>Sangat Tinggi</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Tempo Cerita</label>
                    <select value={config.pacing} onChange={e => updateConfig('pacing', e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm">
                      <option>Lambat</option><option>Normal</option><option>Cepat</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Jenis Ending</label>
                    <select value={config.ending_type} onChange={e => updateConfig('ending_type', e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm">
                      <option>Bahagia</option><option>Sedih</option><option>Plot Twist</option><option>Terbuka</option><option>Bersambung</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Musik & Atmosfer</label>
                    <select value={config.music_atmosphere} onChange={e => updateConfig('music_atmosphere', e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm">
                      <option>Sinematik</option><option>Romantis</option><option>Tegang</option><option>Misterius</option><option>Ceria</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2 pt-3 border-t">
                <button onClick={handleGenerateStory} disabled={loading} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50">
                  <Wand2 className="w-4 h-4" /> Buat Story Bible
                </button>
                <button onClick={handleLoadDemo} className="flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-700 border border-amber-200 rounded-lg text-sm font-medium hover:bg-amber-100">
                  <Play className="w-4 h-4" /> Muat Demo
                </button>
                <button onClick={handleSaveProject} className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200">
                  <Save className="w-4 h-4" /> Simpan Proyek
                </button>
                <button onClick={handleLoadProject} className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200">
                  <FolderOpen className="w-4 h-4" /> Muat Proyek
                </button>
                <button onClick={handleReset} className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-lg text-sm font-medium hover:bg-red-100">
                  <RefreshCw className="w-4 h-4" /> Reset Form
                </button>
              </div>
            </div>

            {/* Story Bible Display */}
            {storyBible && (
              <div className="bg-white rounded-xl border p-5">
                <h3 className="font-semibold text-lg mb-3">📖 Story Bible</h3>
                <div className="space-y-3 text-sm">
                  <div><span className="font-medium text-gray-700">Judul:</span> {storyBible.title}</div>
                  <div><span className="font-medium text-gray-700">Premis:</span> {storyBible.premise}</div>
                  <div><span className="font-medium text-gray-700">Sinopsis:</span><p className="mt-1 text-gray-600">{storyBible.synopsis}</p></div>
                  <div><span className="font-medium text-gray-700">Konflik Utama:</span> {storyBible.main_conflict}</div>
                  <div><span className="font-medium text-gray-700">Klimaks:</span> {storyBible.climax}</div>
                  <div><span className="font-medium text-gray-700">Ending:</span> {storyBible.ending}</div>
                  <div><span className="font-medium text-gray-700">Lokasi:</span> {storyBible.locations?.join(', ')}</div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* CHARACTERS SECTION */}
        {activeSection === 'characters' && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl border p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Karakter</h2>
                <div className="flex gap-2">
                  <button onClick={handleGenerateCharacters} disabled={loading} className="flex items-center gap-2 px-3 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 disabled:opacity-50">
                    <Wand2 className="w-4 h-4" /> Buat Otomatis
                  </button>
                  <button onClick={addCharacter} className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200">
                    <Plus className="w-4 h-4" /> Tambah
                  </button>
                </div>
              </div>

              {characters.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p className="text-sm mb-3">Belum ada karakter. Tambahkan karakter manual atau buat otomatis dengan AI.</p>
                  <button onClick={handleLoadDemo} className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-700 border border-amber-200 rounded-lg text-sm hover:bg-amber-100">
                    <Play className="w-4 h-4" /> Muat Demo Lengkap
                  </button>
                </div>
              )}

              <div className="space-y-3">
                {characters.map((char, idx) => (
                  <div key={char.character_id} className={`border rounded-lg p-4 ${char.locked ? 'border-indigo-200 bg-indigo-50/30' : 'border-gray-200'}`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">{char.character_id}</span>
                        <span className="font-medium text-sm">{char.name || 'Karakter Baru'}</span>
                        {char.locked && <Lock className="w-3 h-3 text-indigo-600" />}
                      </div>
                      <div className="flex gap-1">
                        <button onClick={() => toggleCharacterLock(idx)} className="p-1.5 rounded hover:bg-gray-100" title={char.locked ? 'Buka kunci' : 'Kunci karakter'}>
                          {char.locked ? <Lock className="w-3.5 h-3.5 text-indigo-600" /> : <Unlock className="w-3.5 h-3.5 text-gray-400" />}
                        </button>
                        <button onClick={() => removeCharacter(idx)} className="p-1.5 rounded hover:bg-red-50 text-red-500" title="Hapus karakter">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      <input value={char.name} onChange={e => updateCharacter(idx, 'name', e.target.value)} className="px-2 py-1.5 border rounded text-xs" placeholder="Nama" />
                      <input value={char.role} onChange={e => updateCharacter(idx, 'role', e.target.value)} className="px-2 py-1.5 border rounded text-xs" placeholder="Peran" />
                      <select value={char.gender} onChange={e => updateCharacter(idx, 'gender', e.target.value)} className="px-2 py-1.5 border rounded text-xs">
                        <option value="pria">Pria</option><option value="wanita">Wanita</option><option value="lainnya">Lainnya</option>
                      </select>
                      <input value={char.age} onChange={e => updateCharacter(idx, 'age', e.target.value)} className="px-2 py-1.5 border rounded text-xs" placeholder="Usia" />
                      <input value={char.hair_style} onChange={e => updateCharacter(idx, 'hair_style', e.target.value)} className="px-2 py-1.5 border rounded text-xs" placeholder="Gaya rambut" />
                      <input value={char.hair_color} onChange={e => updateCharacter(idx, 'hair_color', e.target.value)} className="px-2 py-1.5 border rounded text-xs" placeholder="Warna rambut" />
                      <input value={char.default_outfit} onChange={e => updateCharacter(idx, 'default_outfit', e.target.value)} className="px-2 py-1.5 border rounded text-xs" placeholder="Pakaian utama" />
                      <input value={char.personality} onChange={e => updateCharacter(idx, 'personality', e.target.value)} className="px-2 py-1.5 border rounded text-xs" placeholder="Kepribadian" />
                    </div>
                    <div className="mt-2">
                      <input value={char.visual_identity} onChange={e => updateCharacter(idx, 'visual_identity', e.target.value)} className="w-full px-2 py-1.5 border rounded text-xs" placeholder="Deskripsi visual lengkap untuk konsistensi (digunakan di setiap prompt)" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SCENES SECTION */}
        {activeSection === 'scenes' && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl border p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-semibold">Hasil Scene</h2>
                  <p className="text-xs text-gray-500">{scenes.length} scene × 10 detik = {scenes.length * 10} detik total</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={handleGenerateScenes} disabled={loading || !storyBible} className="flex items-center gap-2 px-3 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 disabled:opacity-50">
                    <Wand2 className="w-4 h-4" /> Generate Semua Scene
                  </button>
                  <button onClick={handleValidate} disabled={scenes.length === 0} className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 disabled:opacity-50">
                    <CheckCircle className="w-4 h-4" /> Periksa Konsistensi
                  </button>
                </div>
              </div>

              {/* Validation Summary */}
              {validationSummary && (
                <div className={`mb-4 p-3 rounded-lg border ${validationSummary.overallStatus === 'consistent' ? 'bg-green-50 border-green-200' : validationSummary.overallStatus === 'needs_review' ? 'bg-yellow-50 border-yellow-200' : 'bg-red-50 border-red-200'}`}>
                  <div className="flex items-center gap-2 mb-2">
                    {validationSummary.overallStatus === 'consistent' && <CheckCircle className="w-4 h-4 text-green-600" />}
                    {validationSummary.overallStatus === 'needs_review' && <AlertTriangle className="w-4 h-4 text-yellow-600" />}
                    {validationSummary.overallStatus === 'conflict' && <XCircle className="w-4 h-4 text-red-600" />}
                    <span className="text-sm font-medium">
                      {validationSummary.overallStatus === 'consistent' ? 'Konsisten' : validationSummary.overallStatus === 'needs_review' ? 'Perlu Diperiksa' : 'Konflik Ditemukan'}
                    </span>
                    <span className="text-xs text-gray-500">({validationSummary.passed} lulus, {validationSummary.warnings} peringatan, {validationSummary.failures} gagal)</span>
                  </div>
                  {validationResults.filter(r => r.status !== 'pass').slice(0, 5).map((r, i) => (
                    <p key={i} className="text-xs text-gray-600 ml-6">• {r.message}</p>
                  ))}
                </div>
              )}

              {scenes.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <LayoutGrid className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p className="text-sm mb-3">Belum ada scene. Buat Story Bible terlebih dahulu, lalu generate scene.</p>
                  <div className="flex justify-center gap-2">
                    <button onClick={handleLoadDemo} className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-700 border border-amber-200 rounded-lg text-sm hover:bg-amber-100">
                      <Play className="w-4 h-4" /> Muat Demo
                    </button>
                    <button onClick={() => setActiveSection('story')} className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200">
                      <Wand2 className="w-4 h-4" /> Buat Cerita
                    </button>
                  </div>
                </div>
              )}

              {/* Scene Cards */}
              <div className="space-y-3">
                {scenes.map((scene, idx) => (
                  <div key={idx} className={`border rounded-lg overflow-hidden ${scene.locked ? 'border-indigo-200' : 'border-gray-200'}`}>
                    <div className="flex items-center justify-between p-3 bg-gray-50 cursor-pointer" onClick={() => setExpandedScene(expandedScene === idx ? null : idx)}>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded">S{scene.scene_number}</span>
                        <span className="text-sm font-medium">{scene.title}</span>
                        <span className="text-xs text-gray-400">10 detik</span>
                        {scene.locked && <Lock className="w-3 h-3 text-indigo-600" />}
                      </div>
                      <div className="flex items-center gap-1">
                        {scene.validation_status === 'consistent' && <CheckCircle className="w-3.5 h-3.5 text-green-500" />}
                        {scene.validation_status === 'needs_review' && <AlertTriangle className="w-3.5 h-3.5 text-yellow-500" />}
                        {scene.validation_status === 'conflict' && <XCircle className="w-3.5 h-3.5 text-red-500" />}
                        {expandedScene === idx ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </div>

                    {expandedScene === idx && (
                      <div className="p-4 space-y-3 text-sm">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                          <div><span className="text-gray-500">Lokasi:</span> {scene.location}</div>
                          <div><span className="text-gray-500">Waktu:</span> {scene.time_of_day}</div>
                          <div><span className="text-gray-500">Karakter:</span> {scene.characters_present.join(', ')}</div>
                        </div>

                        <div>
                          <p className="text-xs font-medium text-gray-500 mb-1">Fungsi Cerita</p>
                          <p className="text-xs">{scene.story_function}</p>
                        </div>

                        <div>
                          <p className="text-xs font-medium text-gray-500 mb-1">Narasi</p>
                          <p className="text-xs text-gray-700">{scene.narration}</p>
                        </div>

                        {scene.dialogue.length > 0 && (
                          <div>
                            <p className="text-xs font-medium text-gray-500 mb-1">Dialog</p>
                            {scene.dialogue.map((d, di) => (
                              <p key={di} className="text-xs"><span className="font-medium">{d.character}:</span> "{d.text}" <span className="text-gray-400">({d.emotion})</span></p>
                            ))}
                          </div>
                        )}

                        <div>
                          <p className="text-xs font-medium text-gray-500 mb-1">Timeline</p>
                          {scene.timeline.map((t, ti) => (
                            <p key={ti} className="text-xs font-mono">{t.time} — {t.description}</p>
                          ))}
                        </div>

                        <div>
                          <p className="text-xs font-medium text-gray-500 mb-1">Kamera</p>
                          <p className="text-xs">{scene.camera_direction}</p>
                        </div>

                        <div>
                          <p className="text-xs font-medium text-gray-500 mb-1">Pencahayaan</p>
                          <p className="text-xs">{scene.lighting_color}</p>
                        </div>

                        <div className="bg-blue-50 rounded-lg p-3">
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-xs font-medium text-blue-700">Prompt Text-to-Video</p>
                            <button onClick={() => handleCopyPrompt(scene.video_prompt)} className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800">
                              <Copy className="w-3 h-3" /> Salin
                            </button>
                          </div>
                          <p className="text-xs text-blue-900 whitespace-pre-wrap">{scene.video_prompt}</p>
                        </div>

                        <div className="bg-red-50 rounded-lg p-3">
                          <p className="text-xs font-medium text-red-700 mb-1">Negative Prompt</p>
                          <p className="text-xs text-red-800 whitespace-pre-wrap">{scene.negative_prompt}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="bg-gray-50 rounded p-2">
                            <p className="font-medium text-gray-500">Ending State</p>
                            <p>{scene.ending_state}</p>
                          </div>
                          <div className="bg-gray-50 rounded p-2">
                            <p className="font-medium text-gray-500">Continuity Link</p>
                            <p>{scene.continuity_link}</p>
                          </div>
                        </div>

                        <div className="flex gap-2 pt-2 border-t">
                          <button onClick={() => handleRegenerateScene(idx)} disabled={loading || scene.locked} className="flex items-center gap-1 px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded text-xs hover:bg-indigo-200 disabled:opacity-50">
                            <RefreshCw className="w-3 h-3" /> Regenerate
                          </button>
                          <button onClick={() => handleCopyPrompt(scene.video_prompt)} className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-700 rounded text-xs hover:bg-gray-200">
                            <Copy className="w-3 h-3" /> Salin Prompt
                          </button>
                          <button onClick={() => toggleSceneLock(idx)} className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-700 rounded text-xs hover:bg-gray-200">
                            {scene.locked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                            {scene.locked ? 'Terkunci' : 'Kunci'}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* EXPORT SECTION */}
        {activeSection === 'export' && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl border p-5">
              <h2 className="text-lg font-semibold mb-4">Ekspor Prompt</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <button onClick={handleExportJSON} disabled={scenes.length === 0} className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-indigo-400 hover:bg-indigo-50 disabled:opacity-50 transition-colors">
                  <FileText className="w-6 h-6 text-indigo-600" />
                  <div className="text-left">
                    <p className="font-medium text-sm">Ekspor JSON</p>
                    <p className="text-xs text-gray-500">Format terstruktur untuk diproses lebih lanjut</p>
                  </div>
                </button>
                <button onClick={handleExportTXT} disabled={scenes.length === 0} className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-indigo-400 hover:bg-indigo-50 disabled:opacity-50 transition-colors">
                  <FileText className="w-6 h-6 text-indigo-600" />
                  <div className="text-left">
                    <p className="font-medium text-sm">Ekspor TXT</p>
                    <p className="text-xs text-gray-500">Dokumen lengkap dengan semua detail</p>
                  </div>
                </button>
              </div>

              <div className="mb-4">
                <button onClick={handleCopyAllPrompts} disabled={scenes.length === 0} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 disabled:opacity-50">
                  <Copy className="w-4 h-4" /> Salin Semua Prompt Video
                </button>
              </div>

              {/* All prompts preview */}
              {scenes.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-medium text-sm">Semua Prompt Video</h3>
                  {scenes.map((scene, idx) => (
                    <div key={idx} className="border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded">Scene {scene.scene_number}: {scene.title}</span>
                        <button onClick={() => handleCopyPrompt(scene.video_prompt)} className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800">
                          <Copy className="w-3 h-3" /> Salin
                        </button>
                      </div>
                      <p className="text-xs text-gray-700 whitespace-pre-wrap line-clamp-4">{scene.video_prompt}</p>
                    </div>
                  ))}
                </div>
              )}

              {scenes.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Download className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p className="text-sm mb-3">Belum ada scene untuk diekspor. Generate scene terlebih dahulu.</p>
                  <button onClick={handleLoadDemo} className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-700 border border-amber-200 rounded-lg text-sm hover:bg-amber-100">
                    <Play className="w-4 h-4" /> Muat Demo
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t py-2 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs text-gray-500">
          <span>AI Drama Studio • {scenes.length} scene • {characters.length} karakter</span>
          <span>{isAIConfigured() ? '🟢 AI Terhubung' : '🔴 AI Belum Dikonfigurasi'}</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
