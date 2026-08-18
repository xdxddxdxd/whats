import { ChatMetrics } from '../analytics/stats-engine';
import { AIAnalysisResult } from './types';
import { buildAnalysisPrompt } from './prompts';
import { generateSmartRuleBasedAnalysis } from './rules-engine';

export async function generateAIAnalysis(
  chatTitle: string,
  metrics: ChatMetrics,
  chatType: 'group' | 'direct'
): Promise<AIAnalysisResult> {
  const geminiKey = process.env.GEMINI_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;

  // 1. If Gemini API key is available
  if (geminiKey) {
    try {
      const prompt = buildAnalysisPrompt(chatTitle, metrics, chatType);
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`;

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: 'application/json',
            temperature: 0.8
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        const rawContent = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (rawContent) {
          const parsed = JSON.parse(rawContent);
          return {
            summary: parsed.summary || 'Harika bir analiz!',
            groupVibe: parsed.groupVibe || 'Eğlenceli Ekip',
            superlatives: parsed.superlatives || [],
            wrappedSlides: parsed.wrappedSlides || [],
            generatedAt: new Date().toISOString(),
            provider: 'gemini'
          };
        }
      }
    } catch (err) {
      console.warn('Gemini API call failed, falling back to smart rules engine:', err);
    }
  }

  // 2. If OpenAI API key is available
  if (openaiKey) {
    try {
      const prompt = buildAnalysisPrompt(chatTitle, metrics, chatType);
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${openaiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: 'Sen samimi ve esprili bir WhatsApp sohbet analistisin. Sadece geçerli JSON döndür.' },
            { role: 'user', content: prompt }
          ],
          response_format: { type: 'json_object' },
          temperature: 0.8
        })
      });

      if (response.ok) {
        const data = await response.json();
        const content = data.choices?.[0]?.message?.content;
        if (content) {
          const parsed = JSON.parse(content);
          return {
            summary: parsed.summary || 'Harika bir analiz!',
            groupVibe: parsed.groupVibe || 'Eğlenceli Ekip',
            superlatives: parsed.superlatives || [],
            wrappedSlides: parsed.wrappedSlides || [],
            generatedAt: new Date().toISOString(),
            provider: 'openai'
          };
        }
      }
    } catch (err) {
      console.warn('OpenAI API call failed, falling back to smart rules engine:', err);
    }
  }

  // 3. Smart Rule-based analysis engine (Default & Fallback)
  return generateSmartRuleBasedAnalysis(chatTitle, metrics, chatType);
}
