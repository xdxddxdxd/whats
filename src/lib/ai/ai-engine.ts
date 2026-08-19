import { ChatMetrics } from '../analytics/stats-engine';
import { AISentimentResult } from '@/types/chat';
import { SmartSamplingResult } from './smart-sampling';
import { generateRuleBasedSentiment } from './rules-engine';

function cleanAndParseJSON(raw: string): any {
  if (!raw) return null;
  let text = raw.trim();
  if (text.startsWith('```')) {
    text = text.replace(/^```(?:json)?\\s*/i, '').replace(/\\s*```$/, '');
  }
  return JSON.parse(text);
}

export async function analyzeSentimentAndRoles(
  chatTitle: string,
  metrics: ChatMetrics,
  sampling: SmartSamplingResult
): Promise<AISentimentResult> {
  const fallback = generateRuleBasedSentiment(metrics, sampling);

  const geminiKey = process.env.GEMINI_API_KEY;
  const groqKey = process.env.GROQ_API_KEY;
  const openRouterKey = process.env.OPENROUTER_API_KEY;

  if (!geminiKey && !groqKey && !openRouterKey) {
    return fallback;
  }

  const user1Name = metrics.participants[0]?.name || 'Kullanıcı 1';
  const user2Name = metrics.participants[1]?.name || 'Kullanıcı 2';

  const prompt = `Sen uzman bir sohbet analisti ve psikoloğusun. Aşağıda 30.000 mesajlık bir WhatsApp sohbetinden filtrelenmiş en yoğun ~200 mesajlık örneklem verilmiştir.
SOHBET BİLGİSİ:
- Başlık: ${chatTitle}
- Katılımcılar: ${user1Name}, ${user2Name}

ÖRNEKLEM MESAJLARI:
${sampling.compressedText.slice(0, 4000)}

GÖREV:
Aşağıdaki JSON şemasına BİREBİR uyan geçerli bir JSON çıktısı üret:
{
  \"overallTone\": \"Nötr\" | \"Pozitif\" | \"Negatif\" | \"Romantik\" | \"Dramatik\",
  \"dominantEmotion\": \"Memnuniyet\" | \"Mutluluk\" | \"Eğlence\" | \"Heyecan\",
  \"happiestDate\": \"Örn: 31 Mayıs 2026\",
  \"saddestDate\": \"Örn: 26 Ocak 2026\",
  \"categoryDistribution\": [
    { \"category\": \"Mutluluk\", \"count\": 482, \"color\": \"#38BDF8\" },
    { \"category\": \"Sevgi\", \"count\": 395, \"color\": \"#EC4899\" },
    { \"category\": \"Eğlence\", \"count\": 320, \"color\": \"#F59E0B\" },
    { \"category\": \"Minnettarlık\", \"count\": 215, \"color\": \"#10B981\" },
    { \"category\": \"Sorun\", \"count\": 140, \"color\": \"#EF4444\" },
    { \"category\": \"Üzüntü\", \"count\": 95, \"color\": \"#6366F1\" }
  ],
  \"emotionalTimeline\": [
    { \"week\": \"Haz 25\", \"score\": 65, \"label\": \"Pozitif\" },
    { \"week\": \"Eyl 25\", \"score\": 78, \"label\": \"Çok Pozitif\" },
    { \"week\": \"Ara 25\", \"score\": 50, \"label\": \"Nötr\" },
    { \"week\": \"Mar 26\", \"score\": 85, \"label\": \"Çok Pozitif\" },
    { \"week\": \"Haz 26\", \"score\": 60, \"label\": \"Pozitif\" },
    { \"week\": \"Ağu 26\", \"score\": 72, \"label\": \"Çok Pozitif\" }
  ],
  \"intenseMessages\": [
    { \"sender\": \"${user1Name}\", \"time\": \"15:50\", \"text\": \"Mesaj alıntısı\", \"intensity\": 100, \"emotion\": \"Korku\" }
  ],
  \"relationshipRoles\": {
    \"romanticScore\": { \"user1\": 116, \"user2\": 48 },
    \"funnyScore\": { \"user1\": 28, \"user2\": 35 },
    \"titles\": {
      \"${user1Name}\": [\"Gece Kuşu\", \"Romantik Lider\"],
      \"${user2Name}\": [\"Grup Neşesi\", \"Emoji Şampiyonu\"]
    }
  }
}`;

  if (geminiKey) {
    try {
      const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': geminiKey,
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: 'application/json',
            temperature: 0.6,
          },
        }),
        signal: AbortSignal.timeout(6000),
      });

      if (res.ok) {
        const data = await res.json();
        const rawContent = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (rawContent) {
          const parsed = cleanAndParseJSON(rawContent);
          if (parsed && parsed.overallTone) {
            return {
              ...fallback,
              ...parsed
            };
          }
        }
      }
    } catch (err) {
      console.warn('Gemini sentiment analysis fallback:', err);
    }
  }

  return fallback;
}
