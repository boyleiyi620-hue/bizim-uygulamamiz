// Emoji tahmin oyunu — emoji ipucu + doğru cevap + 3 yanlış şık
export interface EmojiPuzzle {
  emojis: string;
  answer: string;
  wrong: string[];
}
export const EMOJI_PUZZLES: EmojiPuzzle[] = [
  { emojis: "🍕🏙️", answer: "New York", wrong: ["Paris", "Londra", "Tokyo"] },
  { emojis: "🐭🧀", answer: "Fare", wrong: ["Kedi", "Sincap", "Hamster"] },
  { emojis: "☕🌙", answer: "Gece kahvesi", wrong: ["Sabah kahvesi", "Çay", "Sıcak çikolata"] },
  { emojis: "🌊🏄", answer: "Sörf", wrong: ["Yüzme", "Kano", "Dalış"] },
  { emojis: "🎄🎁", answer: "Yılbaşı", wrong: ["Doğum günü", "Bayram", "Cadılar Bayramı"] },
  { emojis: "✈️🌴", answer: "Tatil", wrong: ["İş gezisi", "Göç", "Eğitim"] },
  { emojis: "🦁🌍", answer: "Aslan Kral", wrong: ["Madagaskar", "Buz Devri", "Jungle Book"] },
  { emojis: "🎤💔", answer: "Aşk şarkısı", wrong: ["Pop şarkısı", "Rap", "Ninni"] },
  { emojis: "🌙⭐", answer: "Ramazan", wrong: ["Kandil", "Yılbaşı", "Bayram"] },
  { emojis: "🍷🌹", answer: "Romantik akşam yemeği", wrong: ["Kutlama", "Parti", "Kahvaltı"] },
  { emojis: "🐱💻", answer: "Programcı", wrong: ["Yazar", "Öğretmen", "Doktor"] },
  { emojis: "🚗💨", answer: "Yarış", wrong: ["Kaza", "Trafik", "Gezinti"] },
  { emojis: "🌧️☂️", answer: "Yağmurlu gün", wrong: ["Kar", "Fırtına", "Sis"] },
  { emojis: "🎂🕯️", answer: "Doğum günü", wrong: ["Yıldönümü", "Mezuniyet", "Nişan"] },
  { emojis: "🏊‍♂️🏅", answer: "Yüzme yarışı", wrong: ["Koşu", "Bisiklet", "Jimnastik"] },
  { emojis: "🍕📺", answer: "Film gecesi", wrong: ["Oyun gecesi", "Kahvaltı", "Parti"] },
  { emojis: "🐝🍯", answer: "Bal", wrong: ["Reçel", "Şeker", "Muz"] },
  { emojis: "❄️⛄", answer: "Kış", wrong: ["Sonbahar", "İlkbahar", "Yaz"] },
  { emojis: "📚💡", answer: "Bilgi", wrong: ["Kütüphane", "Sınav", "Ödev"] },
  { emojis: "🐶❤️", answer: "Sadık dost", wrong: ["Kedi", "Kuş", "Balık"] },
  { emojis: "🌙💤", answer: "Uyku", wrong: ["Rüya", "Gece", "Dinlenme"] },
  { emojis: "🏖️😎", answer: "Yaz tatili", wrong: ["Kış tatili", "Hafta sonu", "Bayram"] },
  { emojis: "🍳☕", answer: "Kahvaltı", wrong: ["Öğle yemeği", "Akşam yemeği", "Atıştırmalık"] },
  { emojis: "🎢🤩", answer: "Luna Park", wrong: ["Sirk", "Hayvanat bahçesi", "Müze"] },
  { emojis: "🎁😲", answer: "Sürpriz hediye", wrong: ["Bayram harçlığı", "Zarf", "Ödül"] },
  { emojis: "🎬🍿", answer: "Sinema", wrong: ["Tiyatro", "Konser", "Maç"] },
  { emojis: "🌸🌞", answer: "İlkbahar", wrong: ["Yaz", "Sonbahar", "Kış"] },
  { emojis: "🍦😋", answer: "Dondurma", wrong: ["Şeker", "Pasta", "Kek"] },
  { emojis: "💪🔥", answer: "Motivasyon", wrong: ["Hastalık", "Kavga", "Üzüntü"] },
  { emojis: "🌍❤️", answer: "Barış", wrong: ["Savaş", "Seyahat", "Doğa"] },
];
