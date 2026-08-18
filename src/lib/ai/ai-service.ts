import { ChatMetrics } from '../analytics/stats-engine';
import { AIAnalysisResult, SuperlativeCard, WrappedSlideData, AIProvider } from './types';
import { buildAnalysisPrompt } from './prompts';
import { generateSmartRuleBasedAnalysis } from './rules-engine';

interface AgentResponse {
  summary?: string;
  groupVibe?: string;
  superlatives?: SuperlativeCard[];
  wrappedSlides?: WrappedSlideData[];
}

function cleanAndParseJSON(raw: string): any {
  if (!raw) return null;
  let text = raw.trim();
  // Strip Markdown code blocks ```json ... ```
  if (text.startsWith('```')) {
    text = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
  }
  return JSON.parse(text);
}

/**
 * 1. Gemini Agent: Master of Turkish Humor, Wrapped Storytelling & AI Oracle
 * Uses header-based auth and strict timeout: 5500ms
 */
async function callGeminiAgent(
  chatTitle: string,
  metrics: ChatMetrics,
  chatType: 'group' | 'direct',
  apiKey: string
): Promise<AgentResponse | null> {
  const leanMetrics: ChatMetrics = {
    ...metrics,
    participants: metrics.participants.slice(0, 10),
  };

  const prompt = `${buildAnalysisPrompt(chatTitle, leanMetrics, chatType)}
ÖZELLİKLE: Spotify Wrapped 7 slaytlık hikaye anlatısına, eğlenceli Türkçe esprilere ve grup kehanetine odaklan.`;

  const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.6,
        },
      }),
      signal: AbortSignal.timeout(5500),
    });

    if (response.ok) {
      const data = await response.json();
      const rawContent = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (rawContent) {
        return cleanAndParseJSON(rawContent);
      }
    }
  } catch (err) {
    console.warn(`Gemini (${model}) notice:`, err);
  }
  return null;
}

/**
 * 2. DeepSeek / OpenRouter Agent: Deep Psychological & Relationship Superlative Archetypes
 * Strict timeout: 4500ms
 */
async function callOpenRouterAgent(
  chatTitle: string,
  metrics: ChatMetrics,
  chatType: 'group' | 'direct',
  apiKey: string
): Promise<AgentResponse | null> {
  const topParticipants = metrics.participants.slice(0, 8);
  const prompt = `Sen derin ilişki ve karakter analizi yapan bir psikolog ve sohbet dedektifisin.
GÖREV: Aşağıdaki WhatsApp verilerinden katılımcıların gruptaki rollerini, birbirleriyle dinamiklerini ve derin kişilik unvanlarını (superlatives) belirle.

SOHBET DETAYLARI:
- Başlık: ${chatTitle}
- Toplam Mesaj: ${metrics.totalMessages}
- Katılımcılar: ${topParticipants.map(p => `${p.name}: ${p.messageCount} mesaj (%${p.messagePercentage}), gece: ${p.nightMessages}, ort. yanıt: ${p.avgResponseTimeMinutes || '-'} dk`).join(', ')}

SADECE geçerli JSON döndür:
{
  "groupVibe": "Grubun psikolojik enerjisi",
  "superlatives": [
    {
      "id": "unvan_id",
      "title": "Unvan (örn. Gece Kuşu 🦉)",
      "winner": "Kişi Adı",
      "badge": "Emoji",
      "color": "bg-white text-[#0A0A0A]",
      "description": "Detaylı ve zekice esprili açıklama",
      "quote": "Temsili söz",
      "statLabel": "İstatistik Başlığı",
      "statValue": "Değer"
    }
  ]
}`;

  const model = process.env.OPENROUTER_MODEL || 'openai/gpt-oss-20b:free';
  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: 'Sadece geçerli JSON döndür.' },
          { role: 'user', content: prompt },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.6,
      }),
      signal: AbortSignal.timeout(4500),
    });

    if (response.ok) {
      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;
      if (content) {
        return cleanAndParseJSON(content);
      }
    }
  } catch (err) {
    console.warn(`OpenRouter (${model}) notice:`, err);
  }
  return null;
}

/**
 * 3. Groq Agent: Ultra Fast Group Vibe, Taglines & Punchline Summaries
 * Strict timeout: 4000ms
 */
async function callGroqAgent(
  chatTitle: string,
  metrics: ChatMetrics,
  chatType: 'group' | 'direct',
  apiKey: string
): Promise<AgentResponse | null> {
  const prompt = `WhatsApp sohbet analizi için hızlı ve esprili bir grup özeti ve 3-4 kelimelik enerjik Vibe başlığı üret.
Başlık: ${chatTitle}
Toplam Mesaj: ${metrics.totalMessages}, En Çok Yazan: ${metrics.participants[0]?.name || 'Biri'}
SADECE JSON döndür:
{
  "summary": "1-2 samimi esprili cümle",
  "groupVibe": "Vurucu Vibe Başlığı"
}`;

  const model = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';
  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: 'Sen esprili bir Türk analistsin. Sadece JSON döndür.' },
          { role: 'user', content: prompt },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.6,
      }),
      signal: AbortSignal.timeout(4000),
    });

    if (response.ok) {
      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;
      if (content) {
        return cleanAndParseJSON(content);
      }
    }
  } catch (err) {
    console.warn(`Groq (${model}) notice:`, err);
  }
  return null;
}

/**
 * Multi-Agent Parallel Orchestrator (Gemini + Groq + DeepSeek/OpenRouter)
 */
export async function generateAIAnalysis(
  chatTitle: string,
  metrics: ChatMetrics,
  chatType: 'group' | 'direct'
): Promise<AIAnalysisResult> {
  const geminiKey = process.env.GEMINI_API_KEY;
  const groqKey = process.env.GROQ_API_KEY;
  const openRouterKey = process.env.OPENROUTER_API_KEY;

  // Baseline rule-based analysis ensures 100% reliability
  const baseline = generateSmartRuleBasedAnalysis(chatTitle, metrics, chatType);

  // If no API keys provided at all, immediately return high quality rule-based
  if (!geminiKey && !groqKey && !openRouterKey) {
    return baseline;
  }

  // Launch all available agents simultaneously in parallel with fast timeouts
  const agentPromises: Promise<any>[] = [];

  if (geminiKey) {
    agentPromises.push(
      callGeminiAgent(chatTitle, metrics, chatType, geminiKey).then(res => ({ agent: 'gemini', data: res }))
    );
  }

  if (openRouterKey) {
    agentPromises.push(
      callOpenRouterAgent(chatTitle, metrics, chatType, openRouterKey).then(res => ({ agent: 'openrouter', data: res }))
    );
  }

  if (groqKey) {
    agentPromises.push(
      callGroqAgent(chatTitle, metrics, chatType, groqKey).then(res => ({ agent: 'groq', data: res }))
    );
  }

  const results = await Promise.allSettled(agentPromises);
  const successfulAgents: string[] = [];

  let finalSummary = baseline.summary;
  let finalGroupVibe = baseline.groupVibe;
  let finalSuperlatives = baseline.superlatives;
  let finalWrappedSlides = baseline.wrappedSlides;

  for (const r of results) {
    if (r.status === 'fulfilled' && r.value?.data) {
      const { agent, data } = r.value;
      if (data) {
        successfulAgents.push(agent);

        // Groq provides snappy group vibe & punchy summary
        if (agent === 'groq') {
          if (data.groupVibe) finalGroupVibe = data.groupVibe;
          if (data.summary) finalSummary = data.summary;
        }

        // OpenRouter / DeepSeek provides deep psychological superlatives
        if (agent === 'openrouter') {
          if (data.superlatives && data.superlatives.length > 0) {
            finalSuperlatives = data.superlatives;
          }
          if (data.groupVibe && !finalGroupVibe) finalGroupVibe = data.groupVibe;
        }

        // Gemini provides flagship Wrapped story slides, rich summary & awards
        if (agent === 'gemini') {
          if (data.summary) finalSummary = data.summary;
          if (data.groupVibe) finalGroupVibe = data.groupVibe;
          if (data.wrappedSlides && data.wrappedSlides.length > 0) {
            finalWrappedSlides = data.wrappedSlides;
          }
          if (data.superlatives && data.superlatives.length > 0) {
            finalSuperlatives = data.superlatives;
          }
        }
      }
    }
  }

  const providerLabel: AIProvider =
    successfulAgents.length > 1
      ? `multi-agent (${successfulAgents.join(' + ')})`
      : successfulAgents.length === 1
      ? (successfulAgents[0] as AIProvider)
      : 'smart_engine';

  return {
    summary: finalSummary,
    groupVibe: finalGroupVibe,
    superlatives: finalSuperlatives,
    wrappedSlides: finalWrappedSlides,
    generatedAt: new Date().toISOString(),
    provider: providerLabel,
  };
}
