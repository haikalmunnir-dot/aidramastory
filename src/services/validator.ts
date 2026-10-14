import { Scene, Character, StoryBible, ValidationResult } from '../types';

export function validateContinuity(
  scenes: Scene[],
  characters: Character[],
  storyBible: StoryBible | null
): ValidationResult[] {
  const results: ValidationResult[] = [];

  if (!scenes.length) return results;

  // Check 1: Duration consistency
  scenes.forEach(scene => {
    if (scene.duration_seconds !== 10) {
      results.push({
        scene_number: scene.scene_number,
        check: 'Durasi Scene',
        status: 'fail',
        message: `Scene ${scene.scene_number} berdurasi ${scene.duration_seconds} detik, seharusnya 10 detik.`
      });
    } else {
      results.push({
        scene_number: scene.scene_number,
        check: 'Durasi Scene',
        status: 'pass',
        message: `Scene ${scene.scene_number} berdurasi tepat 10 detik.`
      });
    }
  });

  // Check 2: Character identity consistency
  scenes.forEach((scene, idx) => {
    scene.characters_present.forEach(charId => {
      const character = characters.find(c => c.character_id === charId);
      if (!character) {
        results.push({
          scene_number: scene.scene_number,
          check: 'Identitas Karakter',
          status: 'fail',
          message: `Karakter "${charId}" ada di scene ${scene.scene_number} tapi tidak ditemukan di daftar karakter.`
        });
      }
    });
  });

  // Check 3: Dialogue presence
  scenes.forEach(scene => {
    if (!scene.dialogue || scene.dialogue.length === 0) {
      results.push({
        scene_number: scene.scene_number,
        check: 'Dialog',
        status: 'warning',
        message: `Scene ${scene.scene_number} tidak memiliki dialog. Setiap scene sebaiknya memiliki dialog.`
      });
    } else {
      results.push({
        scene_number: scene.scene_number,
        check: 'Dialog',
        status: 'pass',
        message: `Scene ${scene.scene_number} memiliki ${scene.dialogue.length} dialog.`
      });
    }
  });

  // Check 4: Video prompt completeness
  scenes.forEach(scene => {
    const prompt = scene.video_prompt || '';
    const hasDuration = prompt.includes('10 second') || prompt.includes('10-second') || prompt.includes('10s');
    const hasCamera = prompt.includes('camera') || prompt.includes('shot') || prompt.includes('frame');
    const hasLighting = prompt.includes('light') || prompt.includes('lighting');
    const hasCharacter = prompt.includes('character') || scene.characters_present.some(id => prompt.includes(id));

    if (!hasDuration) {
      results.push({
        scene_number: scene.scene_number,
        check: 'Prompt Video - Durasi',
        status: 'warning',
        message: `Prompt scene ${scene.scene_number} tidak menyebutkan durasi 10 detik secara eksplisit.`
      });
    }
    if (!hasCamera) {
      results.push({
        scene_number: scene.scene_number,
        check: 'Prompt Video - Kamera',
        status: 'warning',
        message: `Prompt scene ${scene.scene_number} tidak menyebutkan arahan kamera.`
      });
    }
    if (!hasLighting) {
      results.push({
        scene_number: scene.scene_number,
        check: 'Prompt Video - Pencahayaan',
        status: 'warning',
        message: `Prompt scene ${scene.scene_number} tidak menyebutkan pencahayaan.`
      });
    }
    if (hasDuration && hasCamera && hasLighting) {
      results.push({
        scene_number: scene.scene_number,
        check: 'Kelengkapan Prompt',
        status: 'pass',
        message: `Prompt scene ${scene.scene_number} mencakup durasi, kamera, dan pencahayaan.`
      });
    }
  });

  // Check 5: Continuity between scenes
  for (let i = 0; i < scenes.length - 1; i++) {
    const current = scenes[i];
    const next = scenes[i + 1];

    if (!current.ending_state || current.ending_state.trim() === '') {
      results.push({
        scene_number: current.scene_number,
        check: 'Ending State',
        status: 'warning',
        message: `Scene ${current.scene_number} tidak memiliki ending state. Scene berikutnya mungkin tidak berkesinambungan.`
      });
    }

    if (!current.continuity_link || current.continuity_link.trim() === '') {
      results.push({
        scene_number: current.scene_number,
        check: 'Continuity Link',
        status: 'warning',
        message: `Scene ${current.scene_number} tidak memiliki continuity link ke scene berikutnya.`
      });
    }

    // Check if characters transition logically
    const currentChars = new Set(current.characters_present);
    const nextChars = new Set(next.characters_present);
    
    // Characters leaving should be noted
    const leaving = [...currentChars].filter(c => !nextChars.has(c));
    const arriving = [...nextChars].filter(c => !currentChars.has(c));
    
    if (arriving.length > 0 && !next.initial_condition?.includes('masuk') && !next.initial_condition?.includes('tiba') && !next.narration?.includes('masuk') && !next.narration?.includes('tiba')) {
      results.push({
        scene_number: next.scene_number,
        check: 'Transisi Karakter',
        status: 'warning',
        message: `Karakter ${arriving.join(', ')} muncul di scene ${next.scene_number} tanpa transisi yang jelas dari scene sebelumnya.`
      });
    }
  }

  // Check 6: Story Bible alignment
  if (storyBible) {
    const allLocations = new Set(storyBible.locations.map(l => l.toLowerCase()));
    scenes.forEach(scene => {
      const sceneLocation = scene.location.toLowerCase();
      const locationFound = [...allLocations].some(l => sceneLocation.includes(l) || l.includes(sceneLocation));
      if (!locationFound && scene.location.trim()) {
        results.push({
          scene_number: scene.scene_number,
          check: 'Lokasi vs Story Bible',
          status: 'warning',
          message: `Lokasi "${scene.location}" di scene ${scene.scene_number} tidak ditemukan di daftar lokasi Story Bible.`
        });
      }
    });
  }

  // Check 7: Negative prompt presence
  scenes.forEach(scene => {
    if (!scene.negative_prompt || scene.negative_prompt.trim() === '') {
      results.push({
        scene_number: scene.scene_number,
        check: 'Negative Prompt',
        status: 'warning',
        message: `Scene ${scene.scene_number} tidak memiliki negative prompt.`
      });
    }
  });

  return results;
}

export function getValidationSummary(results: ValidationResult[]): {
  total: number;
  passed: number;
  warnings: number;
  failures: number;
  overallStatus: 'consistent' | 'needs_review' | 'conflict';
} {
  const passed = results.filter(r => r.status === 'pass').length;
  const warnings = results.filter(r => r.status === 'warning').length;
  const failures = results.filter(r => r.status === 'fail').length;

  let overallStatus: 'consistent' | 'needs_review' | 'conflict' = 'consistent';
  if (failures > 0) overallStatus = 'conflict';
  else if (warnings > 2) overallStatus = 'needs_review';

  return {
    total: results.length,
    passed,
    warnings,
    failures,
    overallStatus
  };
}
