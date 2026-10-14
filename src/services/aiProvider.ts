import { AIConfig } from '../types';

const DEFAULT_CONFIG: AIConfig = {
  api_key: '',
  base_url: 'https://api.openai.com/v1',
  model: 'gpt-4o',
  provider: 'openai'
};

export function getAIConfig(): AIConfig {
  const stored = localStorage.getItem('ai_config');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return DEFAULT_CONFIG;
    }
  }
  return DEFAULT_CONFIG;
}

export function saveAIConfig(config: AIConfig): void {
  localStorage.setItem('ai_config', JSON.stringify(config));
}

export function isAIConfigured(): boolean {
  const config = getAIConfig();
  return !!config.api_key && config.api_key.length > 10;
}

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export async function callAI(messages: ChatMessage[], temperature: number = 0.7): Promise<string> {
  const config = getAIConfig();
  
  if (!isAIConfigured()) {
    throw new Error('API Key belum dikonfigurasi. Buka menu Pengaturan untuk memasukkan API Key.');
  }

  const response = await fetch(`${config.base_url}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.api_key}`
    },
    body: JSON.stringify({
      model: config.model,
      messages,
      temperature,
      max_tokens: 4000
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Error API (${response.status}): ${error}`);
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || '';
}

export async function generateStoryDesign(config: any, characters: any[]): Promise<string> {
  const systemPrompt = `Kamu adalah penulis drama profesional. Buat cerita drama yang menarik dan berkesinambungan. 
Respons dalam format JSON yang valid dengan struktur:
{
  "title": "Judul cerita",
  "premise": "Premis cerita dalam 1-2 kalimat",
  "synopsis": "Sinopsis lengkap cerita",
  "theme": "Tema utama",
  "world_setting": "Latar dunia cerita",
  "main_conflict": "Konflik utama",
  "secondary_conflicts": ["konflik 1", "konflik 2"],
  "character_goals": {"CHAR_001": "tujuan karakter"},
  "character_secrets": {"CHAR_001": "rahasia karakter"},
  "timeline": ["kejadian 1", "kejadian 2"],
  "locations": ["lokasi 1", "lokasi 2"],
  "climax": "Deskripsi klimaks",
  "ending": "Deskripsi ending",
  "continuity_rules": ["aturan 1", "aturan 2"]
}`;

  const userPrompt = `Buat cerita drama dengan spesifikasi:
- Genre: ${config.genre}${config.custom_genre ? ` (${config.custom_genre})` : ''}
- Jumlah scene: ${config.scene_count} (setiap scene 10 detik)
- Format video: ${config.aspect_ratio}
- Gaya visual: ${config.visual_style}
- Bahasa dialog: ${config.dialogue_language}
- Mode narasi: ${config.narration_mode}
${config.title ? `- Judul yang diinginkan: ${config.title}` : ''}
${config.story_idea ? `- Ide cerita: ${config.story_idea}` : '- Buat ide cerita orisinal'}
${config.premise ? `- Premis: ${config.premise}` : ''}
${config.main_conflict ? `- Konflik utama: ${config.main_conflict}` : ''}
${config.desired_ending ? `- Ending yang diinginkan: ${config.desired_ending}` : ''}
${config.ending_type ? `- Jenis ending: ${config.ending_type}` : ''}
${config.romance_level ? `- Tingkat romantis: ${config.romance_level}` : ''}
${config.conflict_intensity ? `- Intensitas konflik: ${config.conflict_intensity}` : ''}
${config.pacing ? `- Tempo cerita: ${config.pacing}` : ''}

Karakter yang sudah ditentukan:
${characters.map((c: any) => `- ${c.name} (${c.role}): ${c.personality || 'belum ditentukan'}`).join('\n')}

Buat cerita yang koheren, menarik, dan bisa dibagi menjadi ${config.scene_count} scene masing-masing 10 detik.`;

  return callAI([
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt }
  ], 0.8);
}

export async function generateSceneOutline(storyBible: any, config: any, characters: any[]): Promise<string> {
  const systemPrompt = `Kamu adalah sutradara drama profesional. Buat outline scene yang detail untuk drama.
Respons dalam format JSON array:
[{
  "scene_number": 1,
  "title": "Judul scene",
  "story_function": "Fungsi naratif scene ini",
  "location": "Lokasi spesifik",
  "time_of_day": "Waktu kejadian",
  "weather": "Cuaca",
  "characters_present": ["CHAR_001"],
  "initial_condition": "Kondisi awal scene",
  "narration": "Narasi adegan dalam bahasa Indonesia",
  "timeline": [{"time": "00.0-02.0", "description": "aksi", "type": "action"}],
  "dialogue": [{"character": "CHAR_001", "text": "dialog", "emotion": "emosi"}],
  "expressions_acting": "Deskripsi ekspresi dan akting",
  "camera_direction": "Arahan kamera detail",
  "lighting_color": "Pencahayaan dan warna",
  "audio_music": "Audio dan musik",
  "video_prompt": "Complete English text-to-video prompt",
  "negative_prompt": "Negative prompt",
  "ending_state": "Keadaan akhir scene",
  "continuity_link": "Hubungan ke scene berikutnya"
}]

Setiap scene WAJIB berdurasi tepat 10 detik. Dialog harus bisa diucapkan dalam 10 detik.`;

  const userPrompt = `Buat outline untuk ${config.scene_count} scene drama "${storyBible.title}".

Story Bible:
${JSON.stringify(storyBible, null, 2)}

Karakter:
${characters.map((c: any) => `ID: ${c.character_id}, Nama: ${c.name}, Visual: ${c.visual_identity || c.default_outfit}`).join('\n')}

Spesifikasi:
- Format: ${config.aspect_ratio}
- Gaya visual: ${config.visual_style}
- Bahasa dialog: ${config.dialogue_language}

Buat ${config.scene_count} scene yang berkesinambungan. Setiap scene tepat 10 detik.
Prompt video dalam Bahasa Inggris, dialog dalam ${config.dialogue_language}.
Pastikan kesinambungan: pakaian, lokasi, emosi, dan properti konsisten antar scene.`;

  return callAI([
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt }
  ], 0.7);
}

export async function generateCharacters(config: any, storyIdea: string): Promise<string> {
  const systemPrompt = `Kamu adalah casting director profesional. Buat karakter drama yang detail dan menarik.
Respons dalam format JSON array:
[{
  "character_id": "CHAR_001",
  "name": "Nama lengkap",
  "role": "Peran dalam cerita",
  "gender": "pria/wanita",
  "age": "usia",
  "height": "tinggi badan",
  "body_type": "tipe tubuh",
  "face_shape": "bentuk wajah",
  "skin_color": "warna kulit",
  "hair_style": "gaya rambut",
  "hair_color": "warna rambut",
  "eye_color": "warna mata",
  "physical_marks": "ciri fisik khusus",
  "default_outfit": "pakaian utama",
  "accessories": "aksesori",
  "personality": "kepribadian",
  "speaking_style": "cara berbicara",
  "voice_characteristics": "karakteristik suara",
  "relationships": "hubungan dengan karakter lain",
  "goals": "tujuan dan motivasi",
  "secrets": "rahasia atau konflik pribadi",
  "dialogue_language": "bahasa dialog",
  "visual_identity": "deskripsi visual lengkap untuk konsistensi"
}]`;

  const userPrompt = `Buat karakter untuk drama:
- Genre: ${config.genre}
- Bahasa dialog: ${config.dialogue_language}
${storyIdea ? `- Ide cerita: ${storyIdea}` : '- Buat karakter yang sesuai genre'}
- Jumlah karakter: 2-4 karakter utama

Buat karakter yang realistis, memiliki konflik internal, dan hubungan yang menarik satu sama lain.`;

  return callAI([
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt }
  ], 0.8);
}

export async function regenerateScene(
  storyBible: any,
  scene: any,
  characters: any[],
  config: any,
  prevScene?: any
): Promise<string> {
  const systemPrompt = `Kamu adalah sutradara drama. Buat ulang satu scene dengan detail lengkap.
Respons dalam format JSON object (bukan array):
{
  "scene_number": ${scene.scene_number},
  "title": "Judul scene",
  "story_function": "Fungsi naratif",
  "location": "Lokasi",
  "time_of_day": "Waktu",
  "weather": "Cuaca",
  "characters_present": ["CHAR_001"],
  "initial_condition": "Kondisi awal",
  "narration": "Narasi",
  "timeline": [{"time": "00.0-02.0", "description": "aksi", "type": "action"}],
  "dialogue": [{"character": "CHAR_001", "text": "dialog", "emotion": "emosi"}],
  "expressions_acting": "Ekspresi dan akting",
  "camera_direction": "Arahan kamera",
  "lighting_color": "Pencahayaan",
  "audio_music": "Audio",
  "video_prompt": "English text-to-video prompt",
  "negative_prompt": "Negative prompt",
  "ending_state": "Keadaan akhir",
  "continuity_link": "Link ke scene berikutnya"
}`;

  const userPrompt = `Buat ulang scene ${scene.scene_number} untuk drama "${storyBible.title}".

Story Bible: ${JSON.stringify(storyBible).substring(0, 1000)}
${prevScene ? `\nScene sebelumnya (ending state): ${prevScene.ending_state}` : ''}
Scene saat ini yang perlu dibuat ulang: ${JSON.stringify(scene).substring(0, 500)}

Karakter:
${characters.map((c: any) => `${c.character_id}: ${c.name} - ${c.visual_identity}`).join('\n')}

Spesifikasi: ${config.aspect_ratio}, ${config.visual_style}, dialog ${config.dialogue_language}
Durasi: tepat 10 detik. Jaga kesinambungan dengan scene sebelumnya.`;

  return callAI([
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt }
  ], 0.7);
}
