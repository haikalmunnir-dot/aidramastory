import { Character, Scene, StoryBible, StoryConfig } from '../types';

export function generateDemoCharacters(language: string): Character[] {
  return [
    {
      character_id: 'CHAR_001',
      name: 'Adrian Wijaya',
      role: 'Protagonis utama - CEO muda',
      gender: 'pria',
      age: '32',
      height: '183cm',
      body_type: 'Atletis',
      face_shape: 'Tegas dan angular',
      skin_color: 'Kuning langsat',
      hair_style: 'Pendek rapi, disisir ke belakang',
      hair_color: 'Hitam',
      eye_color: 'Cokelat gelap',
      physical_marks: 'Tahi lalat kecil di pipi kanan',
      default_outfit: 'Setelan jas hitam dengan dasi biru tua, kemeja putih',
      accessories: 'Jam tangan perak, cincin di jari manis',
      personality: 'Dingin, tegas, perfeksionis, tetapi memiliki sisi lembut yang tersembunyi',
      speaking_style: 'Singkat, tegas, jarang tersenyum, nada rendah',
      voice_characteristics: 'Bariton, tenang, berwibawa',
      relationships: 'Musuh menjadi cinta dengan Clara. Hubungan tegang dengan ayahnya.',
      goals: 'Membuktikan diri layak memimpin perusahaan keluarga',
      secrets: 'Ia mengetahui pengkhianatan ayahnya tetapi diam demi melindungi ibu',
      dialogue_language: language,
      locked: false,
      visual_identity: '32-year-old Asian man, 183cm tall, athletic build, angular face, short slicked-back black hair, dark brown eyes, small mole on right cheek, wearing black suit with dark blue tie and white shirt, silver watch'
    },
    {
      character_id: 'CHAR_002',
      name: 'Clara Santoso',
      role: 'Protagonis wanita - Desainer berbakat',
      gender: 'wanita',
      age: '27',
      height: '165cm',
      body_type: 'Ramping',
      face_shape: 'Oval dengan rahang lembut',
      skin_color: 'Kuning langsat',
      hair_style: 'Panjang bergelombang, setengah diikat',
      hair_color: 'Hitam kecokelatan',
      eye_color: 'Cokelat terang',
      physical_marks: 'Lesung pipi saat tersenyum',
      default_outfit: 'Blus putih dengan rok midi abu-abu, cardigan beige',
      accessories: 'Anting mutiara kecil, kalung tipis',
      personality: 'Cerdas, mandiri, lembut tetapi kuat menghadapi tekanan',
      speaking_style: 'Sopan, tenang, memilih kata dengan hati-hati',
      voice_characteristics: 'Alto, lembut, jelas',
      relationships: 'Tertarik pada Adrian tetapi ragu. Sahabat baik dengan Maya.',
      goals: 'Membangun karir desain sendiri tanpa bantuan siapa pun',
      secrets: 'Ia adalah putri biologis dari mantan partner bisnis ayah Adrian',
      dialogue_language: language,
      locked: false,
      visual_identity: '27-year-old Asian woman, 165cm tall, slim build, oval face with soft jawline, long wavy dark brown hair half-tied up, bright brown eyes, dimples when smiling, wearing white blouse with grey midi skirt and beige cardigan, small pearl earrings'
    },
    {
      character_id: 'CHAR_003',
      name: 'Maya Putri',
      role: 'Karakter pendukung - Sahabat Clara',
      gender: 'wanita',
      age: '28',
      height: '168cm',
      body_type: 'Normal',
      face_shape: 'Bulat dengan pipi chubby',
      skin_color: 'Sawo matang',
      hair_style: 'Bob sebahu, lurus',
      hair_color: 'Hitam',
      eye_color: 'Hitam',
      physical_marks: 'Glasses frame tipis',
      default_outfit: 'Kemeja oversized dan celana palazzo',
      accessories: 'Kacamata frame emas, tote bag kanvas',
      personality: 'Ceria, blak-blakan, protektif terhadap Clara',
      speaking_style: 'Cepat, ekspresif, sering menggunakan humor',
      voice_characteristics: 'Sopran, ceria, energik',
      relationships: 'Sahabat Clara sejak kuliah. Curiga terhadap Adrian.',
      goals: 'Melindungi Clara dari rasa sakit',
      secrets: 'Ia mengetahui rahasia Clara tetapi berjanji tidak memberitahu siapa pun',
      dialogue_language: language,
      locked: false,
      visual_identity: '28-year-old Asian woman, 168cm tall, normal build, round face with chubby cheeks, straight black bob hair at shoulder length, black eyes, thin glasses frame, wearing oversized shirt and palazzo pants, gold frame glasses'
    }
  ];
}

export function generateDemoStoryBible(): StoryBible {
  return {
    title: 'Di Balik Pintu Kaca',
    premise: 'Seorang CEO muda yang dingin dan seorang desainer berbakat dipertemukan oleh takdir, tetapi rahasia masa lalu keluarga mereka mengancam hubungan yang baru tumbuh.',
    synopsis: 'Adrian Wijaya, CEO muda perusahaan Wijaya Group, dikenal dingin dan tidak kenal kompromi. Hidupnya berubah ketika ia secara tidak sengaja bertemu Clara Santoso, seorang desainer interior berbakat yang ditugaskan merenovasi kantornya. Di balik ketertarikan yang tumbuh, Clara menyimpan rahasia besar: ia adalah putri biologis dari mantan partner bisnis ayah Adrian yang dihancurkan oleh pengkhianatan bertahun-tahun lalu. Ketika kebenaran terungkap, Adrian harus memilih antara loyalitas keluarga dan cintanya pada Clara.',
    theme: 'Cinta, pengkhianatan, dan penebusan',
    genre: 'Romansa CEO',
    world_setting: 'Jakarta modern, dunia korporat elit dan komunitas seni kreatif',
    main_conflict: 'Rahasia masa lalu keluarga yang mengancam hubungan Adrian dan Clara',
    secondary_conflicts: [
      'Tekanan dari ayah Adrian untuk menjodohkannya dengan putri konglomerat lain',
      'Clara berjuang antara kariernya dan perasaannya pada Adrian',
      'Maya, sahabat Clara, menentang hubungannya dengan Adrian'
    ],
    character_goals: {
      'CHAR_001': 'Membuktikan diri layak memimpin dan menemukan cinta sejati',
      'CHAR_002': 'Membangun karir mandiri dan menemukan kebenaran tentang masa lalunya',
      'CHAR_003': 'Melindungi Clara dari rasa sakit'
    },
    character_secrets: {
      'CHAR_001': 'Mengetahui pengkhianatan ayahnya tetapi diam',
      'CHAR_002': 'Putri biologis dari mantan partner bisnis ayah Adrian',
      'CHAR_003': 'Mengetahui rahasia Clara tetapi berjanji menjaga'
    },
    timeline: [
      'Pertemuan pertama di lobi kantor',
      'Clara mulai bekerja di proyek renovasi',
      'Momen kedekatan di acara gala',
      'Maya memperingatkan Clara',
      'Rahasia mulai terungkap',
      'Konfrontasi antara Adrian dan Clara',
      'Adrian menghadapi ayahnya',
      'Resolusi dan rekonsiliasi'
    ],
    locations: [
      'Lobi kantor Wijaya Group',
      'Ruang kerja Clara (studio desain)',
      'Ruang rapat eksekutif',
      'Ballroom hotel untuk gala',
      'Kafe dekat kantor',
      'Rumah Adrian (penthouse)',
      'Taman kota'
    ],
    climax: 'Clara mengetahui bahwa Adrian sudah tahu rahasia identitasnya sejak awal tetapi memilih untuk tidak memberitahu. Ia merasa dikhianati dan memutuskan hubungan.',
    ending: 'Adrian membuktikan keseriusannya dengan mengundurkan diri dari perusahaan dan membangun bisnis baru bersama Clara. Mereka memulai lembaran baru tanpa bayang-bayang masa lalu.',
    continuity_rules: [
      'Adrian selalu memakai setelan hitam kecuali di scene santai',
      'Clara selalu memakai anting mutiara',
      'Maya selalu memakai kacamata',
      'Dokumen rahasia muncul di scene 5 dan tetap relevan sampai scene 7',
      'Lokasi berpindah secara logis dengan alasan yang jelas'
    ]
  };
}

export function generateDemoScenes(config: StoryConfig): Scene[] {
  const lang = config.dialogue_language;
  const ratio = config.aspect_ratio;
  
  const dialogueExamples: Record<string, { text: string; emotion: string }[]> = {
    'Bahasa Indonesia': [
      { text: 'Anda terlambat. Saya tidak menunggu siapa pun.', emotion: 'dingin' },
      { text: 'Maaf, Pak. Saya tidak sengaja.', emotion: 'malu' },
      { text: 'Kamu harus berhati-hati dengannya, Clara.', emotion: 'khawatir' },
      { text: 'Aku tidak butuh peringatan. Aku bisa menjaga diri.', emotion: 'tegas' },
      { text: 'Kenapa kamu tidak memberitahuku dari awal?', emotion: 'marah' },
      { text: 'Karena aku takut kehilangan kamu.', emotion: 'sedih' },
      { text: 'Aku memilih kamu. Bukan perusahaan, bukan keluarga. Kamu.', emotion: 'sungguh-sungguh' },
      { text: 'Kita mulai dari awal. Bersama.', emotion: 'harapan' },
      { text: 'Ini bukan tentang bisnis. Ini tentang kita.', emotion: 'lembut' },
      { text: 'Aku percaya padamu. Mulai sekarang.', emotion: 'percaya' }
    ],
    'English': [
      { text: "You're late. I don't wait for anyone.", emotion: 'cold' },
      { text: "I'm sorry, sir. It wasn't intentional.", emotion: 'embarrassed' },
      { text: "You need to be careful with him, Clara.", emotion: 'worried' },
      { text: "I don't need warnings. I can take care of myself.", emotion: 'firm' },
      { text: "Why didn't you tell me from the beginning?", emotion: 'angry' },
      { text: "Because I was afraid of losing you.", emotion: 'sad' },
      { text: "I choose you. Not the company, not family. You.", emotion: 'sincere' },
      { text: "We start over. Together.", emotion: 'hopeful' },
      { text: "This isn't about business. It's about us.", emotion: 'gentle' },
      { text: "I trust you. From now on.", emotion: 'trusting' }
    ]
  };

  const dialogues = dialogueExamples[lang] || dialogueExamples['Bahasa Indonesia'];

  const sceneTemplates = [
    {
      title: 'Pertemuan di Lobi',
      location: 'Lobi kantor Wijaya Group - marmer putih, dinding kaca',
      time: 'Pagi hari, 08:30',
      weather: 'Cerah',
      chars: ['CHAR_001', 'CHAR_002'],
      function: 'Memperkenalkan dua karakter utama dan membangun ketegangan awal',
      narration: 'Pagi yang sibuk di lobi kantor Wijaya Group. Adrian berjalan cepat menuju lift ketika seorang wanita dengan tumpukan sketsa menabraknya.',
      camera: 'Medium shot, tracking Adrian berjalan. Cut ke close-up saat tabrakan. Dua shot terpisah menunjukkan reaksi masing-masing karakter.',
      lighting: 'Cahaya natural dari jendela kaca besar, warm tone',
      ending: 'Adrian melanjutkan langkahnya tanpa menoleh. Clara memunguti kertasnya dengan wajah kesal.',
      link: 'Clara tiba di ruang desain untuk memulai proyek renovasi kantor Adrian.'
    },
    {
      title: 'Proyek Renovasi',
      location: 'Studio desain Clara - penuh sketsa dan material',
      time: 'Siang hari, 12:00',
      weather: 'Cerah',
      chars: ['CHAR_002', 'CHAR_003'],
      function: 'Memperkenalkan hubungan Clara dan Maya, serta proyek yang menghubungkan mereka',
      narration: 'Di studio kecilnya, Clara menerima telepon tentang proyek renovasi terbesar dalam kariernya - kantor CEO Wijaya Group.',
      camera: 'Wide shot studio, push in ke Clara yang menerima telepon. Maya masuk frame dari kanan.',
      lighting: 'Cahaya natural dari jendela besar, soft diffused light',
      ending: 'Clara tersenyum melihat sketsanya. Maya tampak khawatir di latar belakang.',
      link: 'Clara datang ke kantor Wijaya Group untuk presentasi desain.'
    },
    {
      title: 'Presentasi Desain',
      location: 'Ruang rapat eksekutif - meja panjang, dinding kaca',
      time: 'Sore hari, 15:00',
      weather: 'Berawan',
      chars: ['CHAR_001', 'CHAR_002'],
      function: 'Membangun ketertarikan Adrian pada Clara secara profesional',
      narration: 'Clara mempresentasikan desainnya dengan percaya diri. Adrian yang biasanya tidak tertarik, kali ini memperhatikan setiap detail.',
      camera: 'Over-the-shoulder shot dari belakang Adrian, fokus ke Clara presentasi. Cut ke close-up mata Adrian yang memperhatikan.',
      lighting: 'Fluorescent cool tone dari lampu ruang rapat, kontras dengan cahaya sore dari jendela',
      ending: 'Adrian menyetujui desain Clara. Tatapan mereka bertemu sesaat.',
      link: 'Adrian meminta Clara datang ke kantor lebih sering untuk konsultasi.'
    },
    {
      title: 'Gala Malam',
      location: 'Ballroom hotel mewah - dekorasi emas, lampu kristal',
      time: 'Malam hari, 19:00',
      weather: 'Malam cerah',
      chars: ['CHAR_001', 'CHAR_002'],
      function: 'Momen romantis pertama di luar konteks profesional',
      narration: 'Di acara gala perusahaan, Clara hadir sebagai vendor. Adrian menghampirinya, mengabaikan tamu-tamu penting lainnya.',
      camera: 'Wide shot ballroom, slow dolly in ke pasangan di tengah kerumunan. Close-up saat mereka berbicara.',
      lighting: 'Warm golden chandelier light, bokeh background, romantic atmosphere',
      ending: 'Mereka berdansa. Untuk pertama kalinya, Adrian tersenyum tulus.',
      link: 'Maya melihat mereka dari jauh dengan ekspresi khawatir.'
    },
    {
      title: 'Peringatan Maya',
      location: 'Kafe dekat kantor - sudut tenang, sore',
      time: 'Sore hari, 17:00',
      weather: 'Mendung',
      chars: ['CHAR_002', 'CHAR_003'],
      function: 'Konflik batin Clara dimulai - peringatan dari sahabat',
      narration: 'Maya mengajak Clara ke kafe. Dengan tegas ia memperingatkan tentang bahaya mendekatkan diri pada keluarga Wijaya.',
      camera: 'Two-shot di meja kafe. Close-up bergantian saat dialog intens.',
      lighting: 'Warm ambient cafe lighting, soft shadows',
      ending: 'Clara terdiam, menatap cangkir kopinya. Ada keraguan di matanya.',
      link: 'Clara menemukan dokumen lama yang mengungkap koneksi keluarganya dengan Wijaya Group.'
    },
    {
      title: 'Dokumen Rahasia',
      location: 'Arsip kantor Wijaya Group - ruang sempit, rak-rak tua',
      time: 'Malam hari, 20:00',
      weather: 'Hujan di luar',
      chars: ['CHAR_002'],
      function: 'Klimaks dimulai - Clara menemukan kebenaran',
      narration: 'Malam itu, Clara bekerja lembur dan secara tidak sengaja menemukan folder lama di ruang arsip. Nama ayahnya tertera di dokumen pengkhianatan bisnis.',
      camera: 'POV Clara menemukan dokumen. Extreme close-up pada nama di dokumen. Pull back ke wajah Clara yang terkejut.',
      lighting: 'Dim overhead light, dramatic shadows, rain light through window',
      ending: 'Clara memegang dokumen dengan tangan gemetar. Air matanya jatuh.',
      link: 'Clara mengkonfrontasi Adrian dengan dokumen tersebut.'
    },
    {
      title: 'Konfrontasi',
      location: 'Kantor Adrian - penthouse office, malam',
      time: 'Malam hari, 21:00',
      weather: 'Hujan deras',
      chars: ['CHAR_001', 'CHAR_002'],
      function: 'Konflik utama mencapai klimaks',
      narration: 'Clara datang dengan dokumen di tangannya. Adrian langsung tahu apa yang terjadi. Keheningan yang menyakitkan mengisi ruangan.',
      camera: 'Medium shot dua karakter berhadapan. Push in perlahan ke wajah masing-masing. Handheld slight shake untuk intensitas.',
      lighting: 'Low warm desk lamp, rain streaks on window, moody atmosphere',
      ending: 'Clara meletakkan dokumen di meja dan pergi tanpa kata-kata. Adrian tidak menghalanginya.',
      link: 'Adrian mengambil keputusan untuk menghadapi ayahnya.'
    },
    {
      title: 'Menghadapi Ayah',
      location: 'Ruang kerja ayah Adrian - rumah besar klasik',
      time: 'Pagi hari, 09:00',
      weather: 'Cerah',
      chars: ['CHAR_001'],
      function: 'Adrian memilih sisi yang benar',
      narration: 'Adrian duduk di hadapan ayahnya. Untuk pertama kalinya, ia berbicara dengan suara tegas tentang kebenaran yang selama ini disembunyikan.',
      camera: 'Low angle shot Adrian duduk. Close-up ekspresi tegasnya. Wide shot menunjukkan jarak antara ayah dan anak.',
      lighting: 'Morning light through curtains, warm but serious atmosphere',
      ending: 'Adrian berdiri dan meninggalkan ruangan. Ia sudah membuat pilihannya.',
      link: 'Adrian mencari Clara untuk menjelaskan segalanya.'
    },
    {
      title: 'Penjelasan',
      location: 'Taman kota - bangku di bawah pohon, sore',
      time: 'Sore hari, 16:00',
      weather: 'Cerah berangin',
      chars: ['CHAR_001', 'CHAR_002'],
      function: 'Resolusi konflik - kejujuran dan penebusan',
      narration: 'Adrian menemukan Clara di taman favoritnya. Ia menceritakan segalanya - bahwa ia sudah tahu, bahwa ia memilih untuk melindungi Clara, dan bahwa ia memilih Clara di atas segalanya.',
      camera: 'Wide shot taman, slow push in ke bangku. Two-shot intim. Close-up reaksi Clara.',
      lighting: 'Golden hour, warm backlight through trees, lens flare subtle',
      ending: 'Clara menatap Adrian lama. Perlahan, ia mengulurkan tangannya.',
      link: 'Mereka memulai lembaran baru bersama.'
    },
    {
      title: 'Lembaran Baru',
      location: 'Studio desain baru - ruang terang dengan logo bersama',
      time: 'Pagi hari, 10:00',
      weather: 'Cerah',
      chars: ['CHAR_001', 'CHAR_002'],
      function: 'Ending bahagia - resolusi visual',
      narration: 'Enam bulan kemudian. Adrian dan Clara membuka studio desain bersama. Di dinding, terpasang sketsa pertama yang pernah ditabrakkan di lobi kantor.',
      camera: 'Wide shot studio baru. Slow pan ke dinding dengan sketsa lama. Two-shot Adrian dan Clara tersenyum.',
      lighting: 'Bright natural light, warm and hopeful, clean white space',
      ending: 'Mereka berdiri berdampingan, menatap masa depan bersama. Fade out.',
      link: 'Tamat. Cerita selesai.'
    }
  ];

  const sceneCount = Math.min(config.scene_count, sceneTemplates.length);
  
  return Array.from({ length: sceneCount }, (_, i) => {
    const template = sceneTemplates[i];
    const dialogue = dialogues[i] || dialogues[0];
    
    return {
      scene_number: i + 1,
      title: template.title,
      story_function: template.function,
      duration_seconds: 10,
      aspect_ratio: ratio,
      visual_style: config.visual_style,
      dialogue_language: lang,
      location: template.location,
      time_of_day: template.time,
      weather: template.weather,
      characters_present: template.chars,
      initial_condition: i === 0 ? 'Scene pembuka. Karakter belum saling mengenal.' : `Melanjutkan dari scene ${i}: ${sceneTemplates[i-1]?.ending || ''}`,
      narration: template.narration,
      timeline: [
        { time: '00.0-02.0', description: 'Opening visual - establishing shot lokasi, karakter masuk atau sudah berada di lokasi', type: 'action' as const },
        { time: '02.0-05.0', description: `Aksi utama - ${template.chars[0]} melakukan aksi atau berbicara`, type: 'action' as const },
        { time: '05.0-08.0', description: `Dialog: ${template.chars.map(c => c).join(' dan ')} bertukar dialog`, type: 'dialogue' as const },
        { time: '08.0-10.0', description: 'Reaksi akhir dan transisi ke scene berikutnya', type: 'reaction' as const }
      ],
      dialogue: [
        { character: template.chars[0], text: dialogue.text, emotion: dialogue.emotion },
        ...(template.chars[1] && dialogues[i + 5] ? [{ character: template.chars[1], text: dialogues[i + 5].text, emotion: dialogues[i + 5].emotion }] : [])
      ],
      expressions_acting: `Natural facial expressions reflecting the emotional tone. Characters maintain realistic eye contact. Body language matches the dialogue emotion. Subtle micro-expressions convey inner feelings.`,
      camera_direction: template.camera,
      lighting_color: template.lighting,
      audio_music: `Ambient sound matching location. Dialogue is primary audio. ${config.music_atmosphere === 'Sinematik' ? 'Soft cinematic score underneath.' : 'Background music matching mood.'} No overlapping dialogue.`,
      video_prompt: `Cinematic 10-second ${ratio} vertical video scene. ${config.visual_style} style. Location: ${template.location}. Time: ${template.time}. Weather: ${template.weather}.\n\nCharacters present:\n- CHAR_001 (Adrian): 32-year-old Asian man, 183cm tall, athletic build, angular face, short slicked-back black hair, dark brown eyes, wearing black suit with dark blue tie and white shirt, silver watch.\n${template.chars.includes('CHAR_002') ? '- CHAR_002 (Clara): 27-year-old Asian woman, 165cm tall, slim build, oval face, long wavy dark brown hair half-tied up, bright brown eyes, dimples, wearing white blouse with grey midi skirt and beige cardigan, small pearl earrings.\n' : ''}${template.chars.includes('CHAR_003') ? '- CHAR_003 (Maya): 28-year-old Asian woman, 168cm, round face, straight black bob hair, thin gold glasses frame, wearing oversized shirt and palazzo pants.\n' : ''}\nTimeline:\n00.0-02.0: Opening shot establishing the location. Character(s) positioned naturally in the scene.\n02.0-05.0: Main action - character performs key gesture or begins speaking.\n05.0-08.0: Dialogue delivery - "${dialogue.text}" spoken naturally with ${dialogue.emotion} emotion. Natural lip sync, only active speaker's mouth moves.\n08.0-10.0: Reaction shot, emotional beat, transition preparation.\n\nCamera: ${template.camera}\nLighting: ${template.lighting}\nAudio: Natural ambient sound, clear dialogue audio, ${config.music_atmosphere.toLowerCase()} background score.\n\nContinuity: Maintain character appearance exactly as described. No clothing changes, no feature morphing. Natural skin tones, realistic proportions. Ending state: ${template.ending}`,
      negative_prompt: `visual glitches, flickering, frame distortion, temporal inconsistency, inconsistent character identity, changing facial features, face morphing, unnatural body proportions, deformed hands, extra fingers, missing fingers, extra limbs, duplicated characters, duplicated objects, floating objects, disappearing props, inconsistent clothing, unnatural body movement, robotic gestures, broken anatomy, unnatural eye movement, unnatural lip movement, unsynchronized dialogue, incorrect speaker mouth movement, unintended character appearance changes, sudden lighting changes, inconsistent shadows, background warping, object deformation, unwanted text, subtitles, captions, logos, watermarks, low-resolution facial details, excessive motion blur, abrupt camera jumps, random scene transitions, visual artifacts, cartoon style, anime style, painting style`,
      ending_state: template.ending,
      continuity_link: template.link,
      validation_status: 'consistent' as const,
      locked: false
    };
  });
}
