// === TIPE DATA UTAMA ===

export interface Character {
  character_id: string;
  name: string;
  role: string;
  gender: 'pria' | 'wanita' | 'lainnya';
  age: string;
  height: string;
  body_type: string;
  face_shape: string;
  skin_color: string;
  hair_style: string;
  hair_color: string;
  eye_color: string;
  physical_marks: string;
  default_outfit: string;
  accessories: string;
  personality: string;
  speaking_style: string;
  voice_characteristics: string;
  relationships: string;
  goals: string;
  secrets: string;
  dialogue_language: string;
  locked: boolean;
  visual_identity: string;
}

export interface StoryBible {
  title: string;
  premise: string;
  synopsis: string;
  genre: string;
  theme: string;
  world_setting: string;
  main_conflict: string;
  secondary_conflicts: string[];
  character_goals: Record<string, string>;
  character_secrets: Record<string, string>;
  timeline: string[];
  locations: string[];
  climax: string;
  ending: string;
  continuity_rules: string[];
}

export interface TimelineEvent {
  time: string;
  description: string;
  type: 'action' | 'dialogue' | 'reaction';
  character?: string;
  dialogue_text?: string;
}

export interface Scene {
  scene_number: number;
  title: string;
  story_function: string;
  duration_seconds: number;
  aspect_ratio: string;
  visual_style: string;
  dialogue_language: string;
  location: string;
  time_of_day: string;
  weather: string;
  characters_present: string[];
  initial_condition: string;
  narration: string;
  timeline: TimelineEvent[];
  dialogue: { character: string; text: string; emotion: string }[];
  expressions_acting: string;
  camera_direction: string;
  lighting_color: string;
  audio_music: string;
  video_prompt: string;
  negative_prompt: string;
  ending_state: string;
  continuity_link: string;
  validation_status: 'consistent' | 'needs_review' | 'conflict';
  locked: boolean;
}

export interface StoryConfig {
  genre: string;
  custom_genre: string;
  title: string;
  story_idea: string;
  premise: string;
  main_conflict: string;
  desired_ending: string;
  scene_count: number;
  custom_scene_count: number;
  aspect_ratio: '9:16' | '16:9' | '1:1';
  visual_style: string;
  custom_visual_style: string;
  dialogue_language: string;
  custom_language: string;
  narration_mode: string;
  target_audience: string;
  romance_level: string;
  conflict_intensity: string;
  pacing: string;
  ending_type: string;
  realism_level: string;
  music_atmosphere: string;
  negative_prompt_global: string;
  prompt_detail_level: string;
}

export interface Project {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
  config: StoryConfig;
  characters: Character[];
  story_bible: StoryBible | null;
  scenes: Scene[];
  validation_results: ValidationResult[];
}

export interface ValidationResult {
  scene_number: number;
  check: string;
  status: 'pass' | 'warning' | 'fail';
  message: string;
}

export interface AIConfig {
  api_key: string;
  base_url: string;
  model: string;
  provider: 'openai' | 'custom';
}

export type AppSection = 'story' | 'characters' | 'scenes' | 'export' | 'settings';
