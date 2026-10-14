import { Project } from '../types';

const STORAGE_KEY = 'drama_studio_projects';

export function getAllProjects(): Project[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return [];
    }
  }
  return [];
}

export function saveProject(project: Project): void {
  const projects = getAllProjects();
  const index = projects.findIndex(p => p.id === project.id);
  project.updated_at = new Date().toISOString();
  if (index >= 0) {
    projects[index] = project;
  } else {
    projects.push(project);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

export function loadProject(id: string): Project | null {
  const projects = getAllProjects();
  return projects.find(p => p.id === id) || null;
}

export function deleteProject(id: string): void {
  const projects = getAllProjects().filter(p => p.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

export function exportAsJSON(project: Project): string {
  const exportData = {
    project: {
      title: project.config.title || 'Untitled Drama',
      genre: project.config.genre,
      visual_style: project.config.visual_style,
      aspect_ratio: project.config.aspect_ratio,
      scene_duration_seconds: 10,
      total_scenes: project.scenes.length,
      total_duration_seconds: project.scenes.length * 10,
      dialogue_language: project.config.dialogue_language
    },
    characters: project.characters.map(c => ({
      character_id: c.character_id,
      name: c.name,
      role: c.role,
      visual_identity: c.visual_identity,
      default_outfit: c.default_outfit,
      voice_profile: c.voice_characteristics,
      personality: c.personality,
      relationships: c.relationships,
      goals: c.goals
    })),
    story_bible: project.story_bible,
    scenes: project.scenes.map(s => ({
      scene_number: s.scene_number,
      title: s.title,
      duration_seconds: s.duration_seconds,
      location: s.location,
      characters_present: s.characters_present,
      narration: s.narration,
      timeline: s.timeline,
      dialogue: s.dialogue,
      video_prompt: s.video_prompt,
      negative_prompt: s.negative_prompt,
      ending_state: s.ending_state,
      continuity_link: s.continuity_link,
      validation_status: s.validation_status
    }))
  };
  return JSON.stringify(exportData, null, 2);
}

export function exportAsTXT(project: Project): string {
  let txt = `═══════════════════════════════════════\n`;
  txt += `  ${project.config.title || 'DRAMA STUDIO - PROJEK'}\n`;
  txt += `═══════════════════════════════════════\n\n`;
  
  txt += `GENRE: ${project.config.genre}\n`;
  txt += `FORMAT: ${project.config.aspect_ratio}\n`;
  txt += `GAYA VISUAL: ${project.config.visual_style}\n`;
  txt += `BAHASA DIALOG: ${project.config.dialogue_language}\n`;
  txt += `JUMLAH SCENE: ${project.scenes.length}\n`;
  txt += `TOTAL DURASI: ${project.scenes.length * 10} detik\n\n`;

  if (project.story_bible) {
    txt += `───────────────────────────────────────\n`;
    txt += `  STORY BIBLE\n`;
    txt += `───────────────────────────────────────\n\n`;
    txt += `Premis: ${project.story_bible.premise}\n\n`;
    txt += `Sinopsis:\n${project.story_bible.synopsis}\n\n`;
    txt += `Konflik Utama: ${project.story_bible.main_conflict}\n\n`;
    txt += `Klimaks: ${project.story_bible.climax}\n\n`;
    txt += `Ending: ${project.story_bible.ending}\n\n`;
    txt += `Latar Dunia: ${project.story_bible.world_setting}\n\n`;
    txt += `Lokasi: ${project.story_bible.locations.join(', ')}\n\n`;
  }

  txt += `───────────────────────────────────────\n`;
  txt += `  KARAKTER\n`;
  txt += `───────────────────────────────────────\n\n`;
  
  project.characters.forEach(c => {
    txt += `[${c.character_id}] ${c.name}\n`;
    txt += `  Peran: ${c.role}\n`;
    txt += `  Usia: ${c.age} | Gender: ${c.gender}\n`;
    txt += `  Fisik: ${c.height}, ${c.body_type}, ${c.skin_color}\n`;
    txt += `  Wajah: ${c.face_shape}\n`;
    txt += `  Rambut: ${c.hair_style} (${c.hair_color})\n`;
    txt += `  Mata: ${c.eye_color}\n`;
    txt += `  Pakaian: ${c.default_outfit}\n`;
    txt += `  Kepribadian: ${c.personality}\n`;
    txt += `  Cara Bicara: ${c.speaking_style}\n`;
    txt += `  Hubungan: ${c.relationships}\n`;
    txt += `  Tujuan: ${c.goals}\n`;
    txt += `  Visual Identity: ${c.visual_identity}\n\n`;
  });

  txt += `───────────────────────────────────────\n`;
  txt += `  SCENE-SCENE\n`;
  txt += `───────────────────────────────────────\n\n`;

  project.scenes.forEach(s => {
    txt += `╔═══════════════════════════════════════╗\n`;
    txt += `  SCENE ${s.scene_number} — ${s.title}\n`;
    txt += `╚═══════════════════════════════════════╝\n\n`;
    txt += `Fungsi Cerita: ${s.story_function}\n`;
    txt += `Durasi: ${s.duration_seconds} detik | Format: ${s.aspect_ratio}\n`;
    txt += `Lokasi: ${s.location} | Waktu: ${s.time_of_day}\n`;
    txt += `Karakter: ${s.characters_present.join(', ')}\n\n`;
    
    txt += `Kondisi Awal: ${s.initial_condition}\n\n`;
    txt += `Narasi:\n${s.narration}\n\n`;
    
    txt += `Timeline:\n`;
    s.timeline.forEach(t => {
      txt += `  ${t.time} - [${t.type}] ${t.description}\n`;
    });
    txt += `\n`;
    
    txt += `Dialog:\n`;
    s.dialogue.forEach(d => {
      txt += `  ${d.character}: "${d.text}" (${d.emotion})\n`;
    });
    txt += `\n`;
    
    txt += `Ekspresi & Akting: ${s.expressions_acting}\n`;
    txt += `Kamera: ${s.camera_direction}\n`;
    txt += `Pencahayaan: ${s.lighting_color}\n`;
    txt += `Audio: ${s.audio_music}\n\n`;
    
    txt += `── PROMPT VIDEO ──\n${s.video_prompt}\n\n`;
    txt += `── NEGATIVE PROMPT ──\n${s.negative_prompt}\n\n`;
    txt += `Ending State: ${s.ending_state}\n`;
    txt += `Continuity Link: ${s.continuity_link}\n`;
    txt += `Status: ${s.validation_status}\n\n`;
    txt += `───────────────────────────────────────\n\n`;
  });

  return txt;
}

export function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
