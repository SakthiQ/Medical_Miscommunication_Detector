import { supabase } from './supabase';
import { generateFallbackExplanation } from '@/data/jargonDictionary';
import type { ExplanationResult, Explanation, Feedback } from '@/types';

const EDGE_FUNCTION_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/medical-explain`;

export async function explainMedicalText(text: string, language: string = 'en'): Promise<ExplanationResult> {
  try {
    const response = await fetch(EDGE_FUNCTION_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({ text, language }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      if (errorData.fallback) {
        return generateFallbackExplanation(text);
      }
      throw new Error(errorData.error || 'Failed to get explanation');
    }

    const data = await response.json();

    if (data.fallback) {
      return generateFallbackExplanation(text);
    }

    const result: ExplanationResult = {
      plain_summary: data.plain_summary,
      jargon_terms: Array.isArray(data.jargon_terms) ? data.jargon_terms : [],
      confidence_level: data.confidence_level || 'medium',
      confidence_note: data.confidence_note || 'Please discuss these results with your doctor.',
      source: 'ai',
    };

    if (data.translated_summary) {
      (result as unknown as Record<string, unknown>).translated_summary = data.translated_summary;
    }

    return result;
  } catch {
    return generateFallbackExplanation(text);
  }
}

export async function saveExplanation(
  originalText: string,
  result: ExplanationResult,
  language: string,
  imagePath?: string | null
): Promise<Explanation | null> {
  try {
    const { data, error } = await supabase
      .from('explanations')
      .insert({
        original_text: originalText,
        plain_summary: result.plain_summary,
        jargon_terms: result.jargon_terms,
        confidence_level: result.confidence_level,
        confidence_note: result.confidence_note,
        source: result.source,
        language,
        image_path: imagePath || null,
      })
      .select()
      .single();

    if (error) throw error;
    return data as Explanation;
  } catch (err) {
    console.error('Failed to save explanation:', err);
    return null;
  }
}

export async function fetchHistory(limit: number = 50): Promise<Explanation[]> {
  try {
    const { data, error } = await supabase
      .from('explanations')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return (data || []) as Explanation[];
  } catch (err) {
    console.error('Failed to fetch history:', err);
    return [];
  }
}

export async function deleteExplanation(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('explanations')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (err) {
    console.error('Failed to delete explanation:', err);
    return false;
  }
}

export async function submitFeedback(
  explanationId: string,
  wasClear: boolean,
  comment?: string
): Promise<Feedback | null> {
  try {
    const { data, error } = await supabase
      .from('feedback')
      .insert({
        explanation_id: explanationId,
        was_clear: wasClear,
        comment: comment || null,
      })
      .select()
      .single();

    if (error) throw error;
    return data as Feedback;
  } catch (err) {
    console.error('Failed to submit feedback:', err);
    return null;
  }
}

export async function uploadReportImage(file: File, userId: string): Promise<string | null> {
  try {
    const ext = file.name.split('.').pop() || 'png';
    const path = `${userId}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

    const { error } = await supabase.storage
      .from('reports')
      .upload(path, file, { contentType: file.type });

    if (error) throw error;
    return path;
  } catch (err) {
    console.error('Failed to upload image:', err);
    return null;
  }
}
