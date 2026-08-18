const fs = require('fs');
const JSZip = require('jszip');
const path = require('path');

async function createZips() {
  const chatZip = new JSZip();
  const sampleChatText = `[14.01.2026, 09:12:30] Zeynep: Günaydın herkese! Bugün buluşuyor muyuz Kadıköy'de?
[14.01.2026, 09:14:10] Ahmet: Günaydın! Ben öğleden sonra anca müsait olurum, finaller bitmedi daha 💀
[14.01.2026, 09:15:02] Burak: Ben gelirim aga, saat 3 gibi Moda Sahil yapalım mı? 🔥
[14.01.2026, 09:20:45] Elif: Ben de geliyorum! Zeynep kahveleri sen mi alıyorsun bu sefer 😂
[14.01.2026, 09:22:12] Zeynep: Sıra bendeyse kaçış yok, filtre kahveler benden ☕
[14.01.2026, 12:40:00] Mehmet: Selamlar ben yeni uyandım ne kaçırdım?
[14.01.2026, 12:41:20] Burak: Günaydın uykucu bey, saat 15:00 Moda dedik! 👻
[14.01.2026, 15:10:05] Zeynep: Biz geldik nerdersiniz? Masa kaptık köşede.
[14.01.2026, 15:12:30] Ahmet: 5 dakikaya oradayım vapurdan indim şimdi 🏃‍♂️
[14.01.2026, 18:30:15] Elif: Çok iyi gündü ya, haftaya tekrar yapalım bunu mutlaka ❤️
[15.01.2026, 02:15:00] Ahmet: Beyler uyumayan var mı, bu algoritma ödevi kafayı yedirtti 🦉
[15.01.2026, 02:17:30] Burak: Ben ayaktayım kanka gönder baksana koda
[15.01.2026, 02:40:12] Ahmet: Çözdüm valla kralsın eyvallah!
[16.01.2026, 14:00:22] Zeynep: Haftasonu için plan yapan var mı? Gıybet kazanı kaynıyor bu arada anlatacaklarım var 👀
[16.01.2026, 14:01:05] Elif: Hemen anlat dinliyoruz dökül! 🍿
[16.01.2026, 14:05:00] Zeynep: Ses kaydı atıyorum 3 dakikalık hazır olun haha
[17.01.2026, 23:45:10] Mehmet: Arkadaşlar haftaya doğum günüm unutmadınız dimi 🎂
[17.01.2026, 23:46:00] Burak: Unutur muyuz reis, mekan hazır bile! 🎉`;

  chatZip.file('_chat.txt', sampleChatText);
  const chatBuffer = await chatZip.generateAsync({ type: 'nodebuffer' });
  const chatZipPath = path.join(process.cwd(), 'WhatsApp_Sohbeti_Kadikoy_Ekibi.zip');
  fs.writeFileSync(chatZipPath, chatBuffer);
}

createZips();
