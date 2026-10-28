วิธีเพิ่มรูปภาพและวิดีโอ / HOW TO ADD MEDIA
==========================================
1) วางไฟล์ทั้งหมดไว้ในโฟลเดอร์นี้ (public/media/)
   รองรับ: .jpg .png .webp .svg  และ  .mp4
2) ตั้งชื่อไฟล์ให้สื่อความหมาย เช่น  hero-portrait.jpg, about-01.jpg, project-travel-cover.jpg
3) เปิด src/content.js แล้วเขียนพาธเป็น  "/media/ชื่อไฟล์"
   ตัวอย่าง:  src: "/media/hero-portrait.jpg"
4) เปลี่ยนภาพพื้นหลังของแต่ละส่วน: แก้ที่ sections.<ชื่อส่วน>.background.src ใน content.js
5) วิดีโอ YouTube ไม่ต้องใส่ไฟล์ — ใส่ลิงก์ในช่อง youtube: "https://youtu.be/xxxxxxxxxxx"

คำแนะนำขนาดไฟล์
- ภาพพื้นหลัง/พอร์เทรต: กว้าง 2400px ขึ้นไป, ไฟล์ละไม่เกิน ~500KB (แนะนำ .webp หรือ .jpg คุณภาพ 80%)
- ภาพแกลเลอรี: กว้าง 1600px
- วิดีโอ .mp4 (H.264): ไม่เกิน ~50MB ต่อไฟล์ หรือใช้ YouTube แทน
- ภาพมือถือแยก (ไม่บังคับ): ตั้งชื่อ เช่น hero-portrait-mobile.jpg แล้วใส่ใน mobileSrc

ถ้าไฟล์ไม่พบ เว็บจะแสดงภาพ placeholder แทน (ไม่พัง)
