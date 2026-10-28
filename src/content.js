/* =====================================================================
   content.js — แก้ไขเนื้อหาทั้งหมดของเว็บไซต์ที่ไฟล์นี้ไฟล์เดียว
   รูป/วิดีโอทั้งหมดวางใน  public/media/  แล้วเขียนพาธเป็น "/media/ชื่อไฟล์"
   ข้อความหลายภาษา = { th: "...", en: "...", zh: "..." }  (ถ้าขาดภาษาใด จะใช้ en → th → zh แทน)

   ---------------------------------------------------------------------
   ระบบภาพพื้นหลัง (background) ของแต่ละ section — อยู่ใน sections.<ชื่อ>.background
   background: {
     src: "/media/hero-portrait.jpg",  // ไฟล์รูปใน public/media (ว่าง/ไม่พบไฟล์ = แสดง placeholder)
     mobileSrc: "",                    // (ไม่บังคับ) รูปสำหรับมือถือ (จอ ≤ 700px)
     mode: "cover",                    // โหมดการแสดงผล (ดูด้านล่าง)
     position: "center 25%",           // จุดโฟกัสของรูป: center | top | bottom | left | right | "50% 20%"
     mobilePosition: "center top",     // จุดโฟกัสบนมือถือ (ปรับให้เห็นใบหน้า)
     overlay: 0.2,                     // ความมืดทับรูป 0–1 (0 = ไม่ทับ)
     opacity: 0.3,                     // ความทึบของรูป 0–1 (ใช้กับ faded เป็นหลัก)
     zoom: true,                       // ซูมช้าๆ (Ken Burns)
     parallax: true,                   // รูปเลื่อนช้ากว่าเนื้อหาเมื่อสกรอลล์
     side: "right",                    // รูปอยู่ด้านไหน: left | right (faded / split / editorial)
     align: "left",                    // จัดข้อความ: left | center | right
     tone: "auto",                     // สีตัวอักษร: auto (ตามธีม) | light (ขาว) | dark (ดำ)
   }
   โหมด (mode):
     cover      รูปเต็มพื้นที่ section ตัวอักษรขาวทับ (มีเงาไล่ระดับด้านล่างเล็กน้อย)
     overlay    รูปเต็มพื้นที่ + ผ้าคลุมสีดำตามค่า overlay (ค่าเริ่มต้น 0.5) อ่านง่ายสุด
     faded      รูปใหญ่จางๆ อยู่ด้านหลังข้อความ ไล่จางเข้าหาข้อความ (ปรับด้วย opacity)
     split      แบ่งครึ่ง: รูปด้านหนึ่ง ข้อความอีกด้าน
     editorial  พอร์เทรตใหญ่ฝั่งหนึ่ง ข้อความอยู่อีกฝั่งอย่างพิถีพิถัน
     none       ไม่มีภาพพื้นหลัง (ใส่ src ไว้ได้ ยังไม่แสดง)
   อยากเปลี่ยนรูปของ section ไหน → แก้แค่ src ของ section นั้น
   ===================================================================== */

// ---------- ข้อมูลทั่วไปของเว็บไซต์ ----------
export const site = {
  title: {
    th: "TEERAPAT — ธีรภัทร ช่วงชาวนา | ผลงาน",
    en: "TEERAPAT — Teerapat Chuangchaona | Portfolio",
    zh: "TEERAPAT — 作品集",
  },
  description: {
    th: "ผลงานคอนเทนต์ภาพ: ตัดต่อวิดีโอ ตกแต่งภาพ และสื่อดิจิทัล",
    en: "Visual content portfolio: video editing, photo editing and digital media.",
    zh: "视觉内容作品集：视频剪辑、照片编辑与数字媒体。",
  },
  ogImage: "/media/og-image.jpg", // ภาพตัวอย่างเมื่อแชร์ลิงก์ (ไม่บังคับ)
  favicon: "/favicon.svg",
  // ค่าเริ่มต้นสำหรับผู้เข้าชมครั้งแรก: lang = th | en | zh, theme = light | dark | system, accent = blue | purple | green | gray
  defaults: { lang: "th", theme: "system", accent: "blue" },
  // ลำดับ section ในหน้าเว็บ (ลบหรือสลับตำแหน่งได้) — ซ่อนแต่ละส่วนด้วย visible: false ด้านล่าง
  order: ["hero", "about", "projects", "video", "photo", "youtube", "skills", "contact"],
};

// ---------- ชื่อ ----------
export const person = {
  brand: "TEERAPAT", // ตัวอักษรใหญ่ใน Hero
  nameTh: "นาย ธีรภัทร ช่วงชาวนา",
  nameEn: "Teerapat Chuangchaona",
};

// ---------- ลิงก์ติดต่อ (เว้นว่าง "" = ซ่อนอัตโนมัติ) ----------
export const links = {
  youtube: "https://www.youtube.com/@RTDCrestMann",
  youtubeMusic: "https://www.youtube.com/@RTDcover",
  facebook: "https://www.facebook.com/TERAPAT.RTD/", // เช่น "https://www.facebook.com/ชื่อของคุณ"
  instagram: "https://www.instagram.com/christ_terapat/", // เช่น "https://www.instagram.com/ชื่อของคุณ"
  email: "kidszaza4@gmail.com", // เช่น "name@example.com"  (จะมีปุ่มคัดลอกอีเมลให้อัตโนมัติ)
  resume: "/media/resume.pdf", // เช่น "/media/resume.pdf"  (จะมีปุ่มดาวน์โหลดให้อัตโนมัติ)
};

// ---------- สีเน้น (แก้สี/ชื่อได้) ----------
export const accents = [
  { id: "blue", color: "#0071e3", label: { th: "น้ำเงิน", en: "Blue", zh: "蓝色" } },
  { id: "purple", color: "#7c4dff", label: { th: "ม่วง", en: "Purple", zh: "紫色" } },
  { id: "green", color: "#1e8e3e", label: { th: "เขียว", en: "Green", zh: "绿色" } },
  { id: "gray", color: "#6e6e73", label: { th: "เทา", en: "Gray", zh: "灰色" } },
];

// ---------- ข้อความส่วนต่างๆ ของ UI ----------
export const ui = {
  role: { th: "ผู้สร้างคอนเทนต์ภาพ · เทคโนโลยีสารสนเทศ", en: "Visual content creator · Information Technology", zh: "视觉内容创作者 · 信息技术" },
  explore: { th: "ดูผลงานของผม", en: "Explore My Work", zh: "浏览我的作品" },
  scroll: { th: "เลื่อนลง", en: "Scroll", zh: "向下滚动" },
  menu: { th: "เมนู", en: "Menu", zh: "菜单" },
  close: { th: "ปิด", en: "Close", zh: "关闭" },
  prev: { th: "ก่อนหน้า", en: "Previous", zh: "上一个" },
  next: { th: "ถัดไป", en: "Next", zh: "下一个" },
  sample: { th: "ตัวอย่าง", en: "Example", zh: "示例" },
  all: { th: "ทั้งหมด", en: "All", zh: "全部" },
  viewProject: { th: "ดูรายละเอียด", en: "View project", zh: "查看作品" },
  tools: { th: "เครื่องมือ", en: "Tools", zh: "使用工具" },
  play: { th: "เล่นวิดีโอ", en: "Play video", zh: "播放视频" },
  fullscreen: { th: "ดูภาพขยาย", en: "View full size", zh: "查看大图" },
  openChannel: { th: "เปิดช่อง", en: "Open channel", zh: "打开频道" },
  copyEmail: { th: "คัดลอกอีเมล", en: "Copy email", zh: "复制邮箱" },
  copied: { th: "คัดลอกแล้ว", en: "Copied", zh: "已复制" },
  downloadResume: { th: "ดาวน์โหลดเรซูเม่", en: "Download résumé", zh: "下载简历" },
  backToTop: { th: "กลับขึ้นด้านบน", en: "Back to top", zh: "回到顶部" },
  language: { th: "ภาษา", en: "Language", zh: "语言" },
  theme: { th: "ธีม", en: "Theme", zh: "主题" },
  themeLight: { th: "สว่าง", en: "Light", zh: "浅色" },
  themeDark: { th: "มืด", en: "Dark", zh: "深色" },
  themeSystem: { th: "ตามระบบ", en: "System", zh: "跟随系统" },
  accent: { th: "สีเน้น", en: "Accent colour", zh: "强调色" },
  reset: { th: "รีเซ็ตเป็นค่าเริ่มต้น", en: "Reset to default", zh: "恢复默认" },
  missingMedia: { th: "ไม่พบไฟล์สื่อ — ตรวจสอบพาธใน content.js", en: "Media file not found — check the path in content.js", zh: "找不到媒体文件——请检查 content.js 中的路径" },
  placeholder: { th: "ใส่รูปของคุณที่นี่", en: "Your photo goes here", zh: "在此放置你的照片" },
  before: { th: "ก่อน", en: "Before", zh: "之前" },
  after: { th: "หลัง", en: "After", zh: "之后" },
  compareTitle: { th: "ก่อน / หลัง", en: "Before / After", zh: "前 / 后" },
  compareHint: { th: "ลากเพื่อเปรียบเทียบ", en: "Drag to compare", zh: "拖动对比" },
  skillsPrimary: { th: "ความถนัดหลัก", en: "Core strengths", zh: "核心优势" },
  skillsMore: { th: "ทักษะเสริม", en: "Additional skills", zh: "其他技能" },
  toolsTitle: { th: "ซอฟต์แวร์ที่ใช้", en: "Software", zh: "常用软件" },
  educationTitle: { th: "การศึกษา", en: "Education", zh: "教育背景" },
  levelBeginner: { th: "ระดับเริ่มต้น", en: "Beginner", zh: "入门" },
  school: { th: "สถานศึกษา", en: "School", zh: "学校" },
  department: { th: "สาขา", en: "Department", zh: "专业" },
  year: { th: "ชั้นปี", en: "Year", zh: "年级" },
  youtube: { th: "YouTube", en: "YouTube", zh: "YouTube" },
  youtubeMusic: { th: "YouTube เพลง / คัฟเวอร์", en: "YouTube Music / Covers", zh: "YouTube 音乐 / 翻唱" },
  footer: { th: "สร้างด้วย React + Vite", en: "Built with React + Vite", zh: "使用 React + Vite 构建" },
};

// ---------- แต่ละ section: เปิด/ปิด, หัวข้อ, ข้อความ, ภาพพื้นหลัง ----------
// visible: false = ซ่อนทั้ง section | nav: ป้ายในเมนู (ไม่ใส่ = ไม่แสดงในเมนู) | alt: true = พื้นหลังเทาอ่อนสลับ
export const sections = {
  hero: {
    visible: true,
    ctaTarget: "projects", // ปุ่ม Explore เลื่อนไปที่ section นี้
    headline: { th: "แนะนำตัว และผลงานส่วนตัว", en: "Introduction & Personal Works.", zh: "个人介绍与作品集" },
    intro: {
      th: "ผมมีความสามารถในการตัดต่อวีดีโอ ตกแต่งภาพเล็กนัอย และสามารถสร้างเว็บไซด์ได้นิดหน่อย แต่พร้อมที่จะเรียนรู้เพิ่มเติ่มหาประสบการณ์และพร้อมพัฒนาตัวเอง",
      en: "I have skills in video editing, basic photo editing, and some website development. I am eager to learn new skills, gain more experience, and continuously improve myself.",
      zh: "我具备视频剪辑、基础图片编辑和简单的网站开发技能。我乐于学习新知识、积累更多经验，并不断提升自己的能力。",
    },
    // Hero: พอร์เทรตเต็มจอแบบภาพยนตร์
    background: { src: "/media/hero-portrait.jpg", mobileSrc: "", mode: "cover", position: "center 25%", mobilePosition: "center top", overlay: 0.12, zoom: true, parallax: true, align: "left", tone: "light" },
  },
  about: {
    visible: true,
    nav: { th: "เกี่ยวกับ", en: "About", zh: "关于" },
    eyebrow: { th: "เกี่ยวกับผม", en: "About me", zh: "关于我" },
    title: { th: "แนะนำตัวเอง", en: "About Me", zh: "关于我" },
    // About: พอร์เทรตใหญ่แบบ editorial อยู่ด้านขวา ข้อความอยู่ซ้าย
    background: { src: "/media/about-portrait.jpg", mode: "editorial", side: "right", position: "center top", mobilePosition: "center top", overlay: 0, parallax: false },
  },
  projects: {
    visible: true,
    nav: { th: "ผลงาน", en: "Projects", zh: "作品" },
    eyebrow: { th: "ผลงานเด่น", en: "Featured projects", zh: "精选作品" },
    title: { th: "ผลงานที่คัดสรร", en: "Selected work", zh: "精选项目" },
    text: { th: "วิดีโอ ภาพถ่าย และงานกราฟิก คัดมาจากงานที่ผมภูมิใจ", en: "Video, photo and graphic work, gathered in one place.", zh: "视频、摄影与平面设计作品集。" },
    // ตัวอย่าง: ไม่ใช้ภาพพื้นหลัง (ถ้าอยากใช้ ให้ตั้ง mode: "faded" แล้วใส่ src)
    background: { src: "/media/projects-bg.jpg", mode: "none" },
  },
  video: {
    visible: true,
    nav: { th: "วิดีโอ", en: "Video", zh: "视频" },
    eyebrow: { th: "ตัดต่อวิดีโอ", en: "Video editing", zh: "视频剪辑" },
    title: { th: "ภาพเคลื่อนไหวที่เล่าเรื่อง", en: "Stories in motion", zh: "流动的影像叙事" },
    text: { th: "ผลงานตัดต่อวิดีโอที่ผมสร้างขึ้น", en: "Video edits and motion work.", zh: "我的视频剪辑作品。" },
    // Video: ภาพถ่ายบรรยากาศมืดแบบโรงภาพยนตร์ + ผ้าคลุมเข้ม
    background: { src: "/media/video-bg.jpg", mode: "overlay", position: "center", overlay: 0.62, zoom: true, tone: "light" },
  },
  photo: {
    visible: true,
    nav: { th: "ภาพ", en: "Photo", zh: "摄影" },
    eyebrow: { th: "ตัดต่อวิดีโอ & คอนเทนต์ภาพ", en: "Video editing & visual content", zh: "视频剪辑与视觉内容" },
    title: { th: "ภาพที่ผ่านมุมมอง", en: "Images, refined", zh: "精修影像" },
    text: { th: "วิดีโอและภาพถ่าย แตะที่ภาพเพื่อดูแบบเต็มจอ", en: "Video edits and photos. Select an image to view it full screen.", zh: "视频与摄影作品，点击图片可全屏查看。" },
    // Photo: พอร์เทรตจางๆ ฝั่งซ้ายด้านหลังแกลเลอรี
    background: { src: "/media/photo-bg.jpg", mode: "faded", side: "left", position: "center", opacity: 0.22 },
  },
  youtube: {
    visible: true,
    alt: true,
    nav: null,
    eyebrow: { th: "ช่อง YouTube", en: "YouTube", zh: "YouTube" },
    title: { th: "ติดตามผมได้ที่ YouTube", en: "Find me on YouTube", zh: "在 YouTube 关注我" },
    background: { src: "", mode: "none" },
  },
  skills: {
    visible: true,
    nav: { th: "ทักษะ", en: "Skills", zh: "技能" },
    eyebrow: { th: "ทักษะและการศึกษา", en: "Skills & education", zh: "技能与教育" },
    title: { th: "สิ่งที่ผมถนัด", en: "What I do", zh: "我的专长" },
    // Skills: แบ่งครึ่ง รูปด้านซ้าย ข้อความด้านขวา
    background: { src: "/media/skills-portrait.jpg", mode: "split", side: "left", position: "center 20%", mobilePosition: "center top" },
  },
  contact: {
    visible: true,
    nav: { th: "ติดต่อ", en: "Contact", zh: "联系" },
    eyebrow: { th: "ติดต่อ", en: "Contact", zh: "联系" },
    title: { th: "ไปหาผมได้ที่นี่", en: "Let's connect", zh: "保持联系" },
    text: { th: "ติดตามผลงานและติดต่อผมได้ผ่านช่องทางเหล่านี้", en: "Follow my work or reach out through any of these.", zh: "通过以下渠道关注我的作品或联系我。" },
    // Contact: พอร์เทรตปิดท้ายแบบภาพยนตร์ จัดกึ่งกลาง
    background: { src: "/media/contact-portrait.jpg", mode: "cover", position: "center 30%", mobilePosition: "center top", overlay: 0.35, zoom: true, align: "center", tone: "light" },
  },
};

// ---------- เกี่ยวกับผม ----------
export const about = {
  body: {
    th: "ผมเป็นนักศึกษาสาขาเทคโนโลยีสารสนเทศ ชั้นปีที่ 5 ที่วิทยาลัยเทคนิคสัตหีบ ความถนัดหลักคือการตัดต่อวิดีโอ การตกแต่งภาพ และการสร้างคอนเทนต์ภาพ นอกจากนี้ผมมีพื้นฐานด้านการเขียนโปรแกรมและเทคโนโลยีสารสนเทศ ซึ่งกำลังพัฒนาต่อไปอย่างต่อเนื่อง",
    en: "I'm a fifth-year Information Technology student at Sattahip Technical College. My main strengths are video editing, photo editing and visual content creation, backed by a basic foundation in programming and IT that I keep building on.",
    zh: "我是萨塔希普技术学院信息技术专业的五年级学生，主要擅长视频剪辑、照片编辑和视觉内容创作，同时具备编程与信息技术的基础知识，并在持续学习中不断提升。",
  },
  // รูปส่วนตัวหลายรูป (เพิ่ม/ลดได้) — แตะแล้วดูเต็มจอ
  photos: [
    { src: "/media/about-01.jpg", alt: { th: "ภาพส่วนตัวของธีรภัทร 1", en: "Portrait of Teerapat 1", zh: "Teerapat 的照片 1" } },
    { src: "/media/about-02.jpg", alt: { th: "ภาพส่วนตัวของธีรภัทร 2", en: "Portrait of Teerapat 2", zh: "Teerapat 的照片 2" } },
    { src: "/media/about-03.jpg", alt: { th: "ภาพส่วนตัวของธีรภัทร 3", en: "Portrait of Teerapat 3", zh: "Teerapat 的照片 3" } },
  ],
};

// ---------- หมวดหมู่ผลงาน (ใช้กรองใน Featured Projects) ----------
export const categories = [
  { id: "video", label: { th: "ตัดต่อวิดีโอ", en: "Video", zh: "视频" } },
  { id: "photo", label: { th: "ตกแต่งภาพ", en: "Photo", zh: "摄影" } },
  { id: "video-content", label: { th: "คอนเทนต์วิดีโอ", en: "Video Content", zh: "视频内容" } },
];

const sampleDesc = {
  th: "นี่คือรายการตัวอย่างเพื่อสาธิตการแสดงผล แก้ไขหรือลบได้ใน content.js",
  en: "This is a sample entry that demonstrates the layout. Edit or delete it in content.js.",
  zh: "这是用于演示版式的示例条目，可在 content.js 中修改或删除。",
};

// ---------- ผลงาน (Featured Projects) ----------
// เพิ่มผลงาน = วางไฟล์ใน public/media แล้วคัดลอก object ด้านล่างไปต่อท้ายรายการ
// media: type "image" | "video" (ไฟล์ .mp4) | "youtube" (ลิงก์ YouTube)
//   { type: "youtube", src: "https://youtu.be/xxxxxxxxxxx", caption: {...} }
// sample: true = แสดงป้าย "ตัวอย่าง" (ลบบรรทัดนี้เมื่อเป็นผลงานจริง)
export const projects = [
  {
    id: "project-001", sample: true, category: "video", year: "2026",
    cover: "/media/sample-cover-01.jpg",
    tools: ["Software name"],
    title: { th: "ตัวอย่างผลงาน — งานตัดต่อวิดีโอ", en: "Sample project — Video edit", zh: "示例作品——视频剪辑" },
    description: sampleDesc,
    media: [
      { type: "video", src: "/media/sample-video-01.mp4", poster: "/media/sample-cover-01.jpg", caption: { th: "ตัวอย่างวิดีโอ", en: "Video preview", zh: "视频预览" } },
      { type: "video", src: "/media/sample-video-02.mp4", poster: "/media/sample-cover-01.jpg", caption: { th: "ตัวอย่างวิดีโอ 2", en: "Video preview 2", zh: "视频预览 2" } },
      { type: "video", src: "/media/sample-video-03.mp4", poster: "/media/sample-cover-01.jpg", caption: { th: "ตัวอย่างวิดีโอ 3", en: "Video preview 3", zh: "视频预览 3" } },
    ],
  },
  {
    id: "project-002", sample: true, category: "photo", year: "2026",
    cover: "/media/sample-cover-02.jpg",
    tools: ["Software name"],
    title: { th: "ตัวอย่างผลงาน — งานตกแต่งภาพ", en: "Sample project — Photo edit", zh: "示例作品——照片编辑" },
    description: sampleDesc,
    media: [
      { type: "video", src: "/media/sample-video-01.mp4", poster: "/media/sample-cover-01.jpg", caption: { th: "ตัวอย่างวิดีโอ", en: "Video preview", zh: "视频预览" } },
      { type: "video", src: "/media/sample-video-02.mp4", poster: "/media/sample-cover-02.jpg", caption: { th: "ตัวอย่างวิดีโอ 2", en: "Video preview 2", zh: "视频预览 2" } },
      { type: "video", src: "/media/sample-video-03.mp4", poster: "/media/sample-cover-03.jpg", caption: { th: "ตัวอย่างวิดีโอ 3", en: "Video preview 3", zh: "视频预览 3" } },
    ],
  },
  {
    id: "project-003", sample: true, category: "video-content", year: "2026",
    cover: "/media/sample-cover-03.jpg",
    tools: [],
    title: { th: "ตัวอย่างผลงาน — งานคอนเทนต์วิดีโอ", en: "Sample project — Video content", zh: "示例作品——视频内容" },
    description: sampleDesc,
    media: [
      { type: "video", src: "/media/sample-video-01.mp4", poster: "/media/sample-cover-03.jpg", caption: { th: "ตัวอย่างวิดีโอ", en: "Video preview", zh: "视频预览" } },
      { type: "video", src: "/media/sample-video-02.mp4", poster: "/media/sample-cover-03.jpg", caption: { th: "ตัวอย่างวิดีโอ 2", en: "Video preview 2", zh: "视频预览 2" } },
    ],
  },
];

// ---------- วิดีโอ (ส่วน Video Editing) ----------
// ใช้ไฟล์ในเครื่อง: src: "/media/ชื่อ.mp4", thumb: "/media/ชื่อ-thumb.jpg"
// ใช้ YouTube:      youtube: "https://youtu.be/xxxxxxxxxxx"  (ไม่ใส่ thumb = ใช้ภาพปกจาก YouTube)
export const videos = [
  { id: "video-001", sample: true, src: "/media/sample-video-01.mp4", thumb: "/media/sample-video-thumb-01.jpg",
    title: { th: "ตัวอย่างวิดีโอ 1", en: "Sample video 1", zh: "示例视频 1" }, description: sampleDesc },
  { id: "video-002", sample: true, src: "/media/sample-video-02.mp4", thumb: "/media/sample-video-thumb-02.jpg",
    title: { th: "ตัวอย่างวิดีโอ 2", en: "Sample video 2", zh: "示例视频 2" }, description: sampleDesc },
  { id: "video-003", sample: true, src: "/media/sample-video-03.mp4", thumb: "/media/sample-video-thumb-03.jpg",
    title: { th: "ตัวอย่างวิดีโอ 3", en: "Sample video 3", zh: "示例视频 3" }, description: sampleDesc },
];

// ---------- ภาพ (ส่วน Photo Editing & Graphic Design) ----------
// layout: "wide" (กว้าง) | "tall" (สูง) | "square" | "std" (ปกติ)
export const photoGroups = [
  { id: "photo", label: { th: "ตกแต่งภาพ", en: "Photo editing", zh: "照片编辑" } },
  { id: "video-content", label: { th: "วิดีโอคอนเทนต์", en: "Video Content", zh: "视频内容" } },
];
const pAlt = { th: "ภาพตัวอย่าง", en: "Sample image", zh: "示例图片" };
export const photos = [
  { src: "/media/sample-photo-01.jpg", group: "photo", layout: "wide", alt: pAlt, caption: pAlt },
  { src: "/media/sample-photo-02.jpg", group: "photo", layout: "tall", alt: pAlt, caption: pAlt },
  { src: "/media/sample-photo-03.jpg", group: "video-content", layout: "square", alt: pAlt, caption: pAlt },
  { src: "/media/sample-photo-04.jpg", group: "video-content", layout: "square", alt: pAlt, caption: pAlt },
  { src: "/media/sample-photo-05.jpg", group: "photo", layout: "wide", alt: pAlt, caption: pAlt },
  { src: "/media/sample-photo-06.jpg", group: "video-content", layout: "std", alt: pAlt, caption: pAlt },
];
// ภาพก่อน/หลัง (ปล่อย before หรือ after ว่าง = ซ่อนส่วนนี้)
export const beforeAfter = { before: "/media/sample-before.jpg", after: "/media/sample-after.jpg" };

// ---------- ช่อง YouTube ----------
export const channels = [
  { id: "crest", name: "RTD Crest Mann", url: links.youtube, thumb: "/media/channel-rtd-crest-mann.jpg",
    description: { th: "ช่อง นี้เป็นช่องที่สร้างมาเพื่อสร้างเป็นผลงานไว้ฝึกฝีมือในการตัดต่อวีดีโอ และก็ทำโปรเจค", en: "This channel was created as a personal portfolio to practice and improve my video editing skills, as well as to showcase my creative projects.", zh: "这个频道旨在积累个人作品，练习并提升视频剪辑技能，同时展示我的创意项目。" } },
  { id: "cover", name: "RTD Music / Covers", url: links.youtubeMusic, thumb: "/media/channel-rtd-cover.jpg",
    description: { th: "เป็นช่อง YouTube สำหรับร้องเพลงและเป็นงานอดิเรกส่วนตัว", en: "A YouTube channel for singing and personal hobbies.", zh: "这是一个用于分享唱歌作品和个人兴趣爱好的 YouTube 频道。" } },
];

// ---------- ทักษะ ----------
// group: "primary" = ความถนัดหลัก | "additional" = ทักษะเสริม | level: "beginner" แสดงป้ายระดับเริ่มต้น
export const skills = [
  { group: "primary", name: { th: "การตัดต่อวิดีโอ", en: "Video Editing", zh: "视频剪辑" } },
  { group: "primary", name: { th: "การตกแต่งภาพ", en: "Photo Editing", zh: "照片编辑" } },
  { group: "primary", name: { th: "การสร้างคอนเทนต์ภาพ", en: "Visual Content Creation", zh: "视觉内容创作" } },
  { group: "additional", level: "beginner", name: { th: "พื้นฐานการเขียนโปรแกรม", en: "Basic Programming", zh: "编程基础" } },
  { group: "additional", name: { th: "พื้นฐานเทคโนโลยีสารสนเทศ", en: "Information Technology Fundamentals", zh: "信息技术基础" } },
];
// ซอฟต์แวร์ที่ใช้ — เพิ่มชื่อได้เลย เช่น ["Premiere Pro", "Photoshop"] (ว่าง = ซ่อน)
export const tools = [];

// ---------- การศึกษา ----------
export const education = [
  {
    school: { th: "วิทยาลัยเทคนิคสัตหีบ", en: "Sattahip Technical College", zh: "萨塔希ป技术学院" },
    department: { th: "สาขาเทคโนโลยีสารสนเทศ", en: "Information Technology", zh: "信息技术专业" },
    level: { th: "ปีที่ 5", en: "Year 5", zh: "第五年" },
  },
];
