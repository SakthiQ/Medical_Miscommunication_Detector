import type { JargonTerm, ExplanationResult } from '@/types';

interface JargonEntry {
  plain: string;
  context?: string;
}

const JARGON_DICTIONARY: Record<string, JargonEntry> = {
  'hepatic steatosis': { plain: 'a buildup of fat in the liver', context: 'This is often related to diet and can improve with lifestyle changes.' },
  'fatty liver': { plain: 'a buildup of fat in the liver' },
  'elevated alt': { plain: 'a liver enzyme that is slightly higher than normal', context: 'This can mean the liver is under some stress but is often not serious.' },
  'alt': { plain: 'a liver enzyme (alanine aminotransferase)', context: 'High levels can mean the liver is irritated.' },
  'ast': { plain: 'a liver enzyme (aspartate aminotransferase)', context: 'High levels can indicate liver stress.' },
  'hypertension': { plain: 'high blood pressure', context: 'This means the force of blood against your artery walls is consistently too high.' },
  'hypotension': { plain: 'low blood pressure' },
  'hyperlipidemia': { plain: 'high levels of fat (cholesterol) in the blood' },
  'hyperglycemia': { plain: 'high blood sugar' },
  'hypoglycemia': { plain: 'low blood sugar' },
  'dyspnea': { plain: 'shortness of breath or difficulty breathing' },
  'tachycardia': { plain: 'a faster-than-normal heartbeat' },
  'bradycardia': { plain: 'a slower-than-normal heartbeat' },
  'arrhythmia': { plain: 'an irregular heartbeat' },
  'edema': { plain: 'swelling caused by extra fluid in the body' },
  'erythema': { plain: 'redness of the skin' },
  'pruritus': { plain: 'itching' },
  'lesion': { plain: 'an area of damaged or abnormal tissue' },
  'nodule': { plain: 'a small lump or growth' },
  'polyp': { plain: 'a small growth on the inner lining of an organ' },
  'benign': { plain: 'not cancer', context: 'This means the growth is not dangerous or spreading.' },
  'malignant': { plain: 'cancerous', context: 'This means the growth can spread and needs medical attention.' },
  'metastasis': { plain: 'the spread of cancer to a new part of the body' },
  'remission': { plain: 'a decrease or disappearance of disease signs', context: 'This is good news — it means the disease is under control or gone.' },
  'exacerbation': { plain: 'a flare-up or worsening of a condition' },
  'chronic': { plain: 'long-lasting or ongoing (does not mean severe)' },
  'acute': { plain: 'sudden or short-term' },
  'idiopathic': { plain: 'of unknown cause', context: 'Doctors use this when they cannot find the exact reason for a condition.' },
  'nosocomial': { plain: 'an infection caught in the hospital' },
  'prn': { plain: 'as needed', context: 'This means take the medicine only when you need it, not on a schedule.' },
  'bid': { plain: 'twice a day' },
  'tid': { plain: 'three times a day' },
  'qid': { plain: 'four times a day' },
  'qd': { plain: 'once a day' },
  'po': { plain: 'by mouth', context: 'This means take the medicine orally (swallow it).' },
  'iv': { plain: 'through a vein (intravenous)', context: 'This means medicine or fluid is given directly into your vein.' },
  'im': { plain: 'into a muscle (injection)' },
  'stat': { plain: 'immediately', context: 'This means the medicine or test is urgent.' },
  'npo': { plain: 'nothing by mouth', context: 'This means do not eat or drink anything for a certain time, usually before a test or procedure.' },
  'myalgia': { plain: 'muscle pain' },
  'arthralgia': { plain: 'joint pain' },
  'neuralgia': { plain: 'nerve pain' },
  'paresthesia': { plain: 'a tingling or pins-and-needles feeling' },
  'syncope': { plain: 'fainting or passing out' },
  'vertigo': { plain: 'a spinning sensation or dizziness' },
  'insomnia': { plain: 'difficulty falling or staying asleep' },
  'anemia': { plain: 'a condition where your blood has fewer red blood cells than normal', context: 'This can make you feel tired or weak.' },
  'leukocytosis': { plain: 'a higher-than-normal white blood cell count', context: 'This often means your body is fighting an infection.' },
  'leukopenia': { plain: 'a lower-than-normal white blood cell count', context: 'This can make it harder for your body to fight infections.' },
  'thrombocytopenia': { plain: 'low platelets in the blood', context: 'Platelets help with clotting, so low levels can cause easy bruising or bleeding.' },
  'hematuria': { plain: 'blood in the urine' },
  'proteinuria': { plain: 'protein in the urine', context: 'This can be a sign that the kidneys are not filtering properly.' },
  'nocturia': { plain: 'waking up at night to urinate' },
  'dysuria': { plain: 'painful or burning urination' },
  'diaphoresis': { plain: 'heavy sweating' },
  'pyrexia': { plain: 'fever' },
  'febrile': { plain: 'having a fever' },
  'afebrile': { plain: 'without a fever' },
  'cyanosis': { plain: 'a bluish color of the skin or lips', context: 'This can mean the body is not getting enough oxygen.' },
  'jaundice': { plain: 'yellowing of the skin or eyes', context: 'This can be a sign of liver problems.' },
  'pallor': { plain: 'unusual paleness of the skin' },
  'induration': { plain: 'hardening or thickening of tissue' },
  'ecchymosis': { plain: 'a bruise' },
  'petechiae': { plain: 'tiny red or purple spots on the skin caused by minor bleeding' },
  'purulent': { plain: 'containing pus', context: 'This usually means there is an infection.' },
  'necrosis': { plain: 'death of tissue' },
  'ischemia': { plain: 'reduced blood flow to a part of the body', context: 'This can cause pain and damage if not treated.' },
  'infarction': { plain: 'tissue death caused by lack of blood flow', context: 'A heart attack is a type of infarction (myocardial infarction).' },
  'stenosis': { plain: 'a narrowing of a passage in the body' },
  'dilation': { plain: 'a widening of a passage or opening' },
  'hypertrophy': { plain: 'an increase in the size of an organ or tissue' },
  'atrophy': { plain: 'a decrease in size or wasting away of tissue' },
  'metaplasia': { plain: 'a change in the type of cells in a tissue' },
  'dysplasia': { plain: 'abnormal cell growth', context: 'This can sometimes be a early warning sign that needs monitoring.' },
  'hyperplasia': { plain: 'an increase in the number of cells' },
  'neoplasm': { plain: 'a new, abnormal growth (can be benign or malignant)' },
  'carcinoma': { plain: 'a type of cancer that starts in skin or tissue lining organs' },
  'sarcoma': { plain: 'a type of cancer that starts in bone, muscle, or connective tissue' },
  'adenoma': { plain: 'a non-cancerous tumor that starts in a gland' },
  'lipoma': { plain: 'a non-cancerous fatty lump under the skin' },
  'osteoporosis': { plain: 'a condition where bones become weak and brittle' },
  'osteopenia': { plain: 'lower-than-normal bone density', context: 'This is a milder form of bone loss, before osteoporosis.' },
  'arthropathy': { plain: 'a disease or problem with a joint' },
  'neuropathy': { plain: 'damage or problems with the nerves', context: 'This can cause numbness, tingling, or pain, often in the hands or feet.' },
  'nephropathy': { plain: 'damage to or disease of the kidneys' },
  'retinopathy': { plain: 'damage to the retina (the back of the eye)' },
  'cardiomyopathy': { plain: 'a disease of the heart muscle' },
  'hepatopathy': { plain: 'a disease of the liver' },
  'enteritis': { plain: 'inflammation of the intestines' },
  'gastritis': { plain: 'inflammation of the stomach lining' },
  'colitis': { plain: 'inflammation of the colon (large intestine)' },
  'pancreatitis': { plain: 'inflammation of the pancreas' },
  'hepatitis': { plain: 'inflammation of the liver' },
  'nephritis': { plain: 'inflammation of the kidneys' },
  'dermatitis': { plain: 'inflammation of the skin' },
  'bronchitis': { plain: 'inflammation of the airways in the lungs' },
  'sinusitis': { plain: 'inflammation of the sinuses' },
  'pharyngitis': { plain: 'inflammation of the throat (sore throat)' },
  'conjunctivitis': { plain: 'inflammation of the eye surface (pink eye)' },
  'appendicitis': { plain: 'inflammation of the appendix' },
  'tonsillitis': { plain: 'inflammation of the tonsils' },
  'myocardial infarction': { plain: 'a heart attack', context: 'This happens when blood flow to the heart is blocked.' },
  'cerebrovascular accident': { plain: 'a stroke', context: 'This happens when blood flow to part of the brain is blocked or bleeding occurs.' },
  'tia': { plain: 'a mini-stroke (transient ischemic attack)', context: 'This is a temporary blockage that resolves but can be a warning sign.' },
  'copd': { plain: 'a lung disease that makes it hard to breathe (chronic obstructive pulmonary disease)' },
  'chf': { plain: 'heart failure (the heart is not pumping as well as it should)' },
  'cad': { plain: 'heart disease caused by narrowed arteries (coronary artery disease)' },
  'gerd': { plain: 'acid reflux (stomach acid coming back up into the esophagus)' },
  'ibd': { plain: 'ongoing inflammation of the digestive tract (inflammatory bowel disease)' },
  'ibs': { plain: 'a condition causing stomach cramps, bloating, and bowel changes (irritable bowel syndrome)' },
  'uti': { plain: 'a urinary tract infection' },
  'ckd': { plain: 'long-term kidney damage (chronic kidney disease)' },
  'pud': { plain: 'stomach or intestinal ulcers (peptic ulcer disease)' },
  'dm': { plain: 'diabetes' },
  't2dm': { plain: 'type 2 diabetes' },
  't1dm': { plain: 'type 1 diabetes' },
  'htn': { plain: 'high blood pressure' },
  'cva': { plain: 'a stroke' },
  'mi': { plain: 'a heart attack' },
  'bx': { plain: 'a biopsy (taking a small tissue sample for testing)' },
  'cxr': { plain: 'a chest X-ray' },
  'ecg': { plain: 'a heart tracing (electrocardiogram)', context: 'This records the electrical activity of your heart.' },
  'ekg': { plain: 'a heart tracing (electrocardiogram)' },
  'mri': { plain: 'a detailed scan using magnets (magnetic resonance imaging)' },
  'ct scan': { plain: 'a detailed X-ray scan (computed tomography)' },
  'ultrasound': { plain: 'a scan using sound waves to see inside the body' },
  'biopsy': { plain: 'taking a small tissue sample for testing' },
  'endoscopy': { plain: 'a procedure using a small camera to look inside the body' },
  'colonoscopy': { plain: 'a procedure to look inside the colon (large intestine)' },
  'cystoscopy': { plain: 'a procedure to look inside the bladder' },
  'laparoscopy': { plain: 'a minimally invasive surgery using small cuts and a camera' },
  'anastomosis': { plain: 'a surgical connection between two parts of the body' },
  'resection': { plain: 'surgical removal of tissue or an organ' },
  'excision': { plain: 'cutting out tissue' },
  'incision': { plain: 'a surgical cut' },
  'suture': { plain: 'stitches' },
  'debridement': { plain: 'cleaning out dead or infected tissue from a wound' },
  'asymptomatic': { plain: 'having no symptoms', context: 'This means you do not feel any signs of the condition.' },
  'symptomatic': { plain: 'having symptoms' },
  'bilateral': { plain: 'on both sides of the body' },
  'unilateral': { plain: 'on one side of the body' },
  'proximal': { plain: 'closer to the center of the body' },
  'distal': { plain: 'farther from the center of the body' },
  'anterior': { plain: 'toward the front of the body' },
  'posterior': { plain: 'toward the back of the body' },
  'superior': { plain: 'above or higher' },
  'inferior': { plain: 'below or lower' },
  'lateral': { plain: 'toward the side' },
  'medial': { plain: 'toward the middle' },
  'dorsal': { plain: 'toward the back or top' },
  'ventral': { plain: 'toward the front or belly side' },
  'prone': { plain: 'lying face down' },
  'supine': { plain: 'lying face up' },
  'ambulatory': { plain: 'able to walk' },
  'non-ambulatory': { plain: 'not able to walk' },
  'prophylaxis': { plain: 'treatment given to prevent a disease' },
  'contraindication': { plain: 'a reason not to use a certain treatment or medicine', context: 'This means the treatment could be harmful in your case.' },
  'adjuvant': { plain: 'an additional treatment given to support the main treatment' },
  'palliative': { plain: 'treatment focused on comfort and relieving symptoms', context: 'This is about improving quality of life, not curing the disease.' },
  'curative': { plain: 'treatment aimed at curing the disease' },
  'monotherapy': { plain: 'treatment using a single medicine' },
  'combination therapy': { plain: 'treatment using two or more medicines together' },
  'tolerance': { plain: 'the body getting used to a medicine so it has less effect over time' },
  'dependence': { plain: 'needing a medicine to avoid withdrawal symptoms', context: 'This is different from addiction.' },
  'contralateral': { plain: 'on the opposite side of the body' },
  'ipsilateral': { plain: 'on the same side of the body' },
  'effusion': { plain: 'a collection of fluid in a body space', context: 'For example, fluid around the lungs or in a joint.' },
  'consolidation': { plain: 'a solidified area in the lungs, usually from infection (pneumonia)' },
  'opacification': { plain: 'an area that looks cloudy on a scan', context: 'This usually means there is fluid, tissue, or other material where there normally is not.' },
  'radiolucency': { plain: 'a dark area on an X-ray that allows radiation to pass through' },
  'radiopacity': { plain: 'a white area on an X-ray that blocks radiation', context: 'Bone is radiopaque, so it appears white.' },
  'intraoperative': { plain: 'during surgery' },
  'perioperative': { plain: 'the time around surgery (before, during, and after)' },
  'postoperative': { plain: 'after surgery' },
  'preoperative': { plain: 'before surgery' },
  'morbidity': { plain: 'the rate of disease or complications' },
  'mortality': { plain: 'the rate of death' },
  'prognosis': { plain: 'the expected outcome or course of a disease', context: 'This is your doctor\'s prediction of how the condition will progress.' },
  'etiology': { plain: 'the cause of a disease' },
  'pathogenesis': { plain: 'how a disease develops' },
  'pathophysiology': { plain: 'how a disease affects the body\'s normal processes' },
  'sign': { plain: 'an objective finding a doctor observes (like a rash)', context: 'This is different from a symptom, which is what you feel.' },
  'symptom': { plain: 'something you feel or experience (like pain)' },
  'syndrome': { plain: 'a group of symptoms that occur together' },
  'differential diagnosis': { plain: 'a list of possible conditions that could explain your symptoms' },
  'workup': { plain: 'the series of tests and examinations done to find a diagnosis' },
  'follow-up': { plain: 'a return visit to check on your condition' },
  'lifestyle modifications': { plain: 'changes to diet, exercise, or habits to improve health' },
  'compliance': { plain: 'how well you follow your treatment plan' },
  'adherence': { plain: 'how well you stick to your treatment plan' },
  'recurrence': { plain: 'the return of a disease or symptom after it had gone away' },
  'relapse': { plain: 'a return of symptoms after a period of improvement' },
  'screening': { plain: 'testing for a disease before you have symptoms' },
  'surveillance': { plain: 'ongoing monitoring to catch changes early' },
};

const FALLBACK_PREFIXES = [
  "Here's what this means in plain language:",
  "In simple terms, this means:",
  "Let me break this down for you:",
];

function generateFallbackSummary(text: string, terms: JargonTerm[]): string {
  let summary = text;

  for (const { term, explanation } of terms) {
    const regex = new RegExp(`\\b${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
    summary = summary.replace(regex, explanation);
  }

  const prefix = FALLBACK_PREFIXES[Math.floor(Math.random() * FALLBACK_PREFIXES.length)];
  return `${prefix}\n\n${summary}`;
}

function generateConfidenceNote(terms: JargonTerm[]): string {
  if (terms.length === 0) {
    return 'No difficult medical terms were detected. If the text is still unclear, try rephrasing it or check with your doctor.';
  }
  if (terms.length <= 3) {
    return 'This explanation covers the main medical terms. If anything is still unclear, please check with your doctor.';
  }
  return 'This text contains several medical terms. While we have explained the key ones, this is a simplified summary — please discuss the full details with your doctor.';
}

function findJargonTerms(text: string): JargonTerm[] {
  const lowerText = text.toLowerCase();
  const found: JargonTerm[] = [];

  const sortedKeys = Object.keys(JARGON_DICTIONARY).sort((a, b) => b.length - a.length);
  const matchedPositions: Array<[number, number]> = [];

  for (const key of sortedKeys) {
    const regex = new RegExp(`\\b${key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
    let match;
    while ((match = regex.exec(lowerText)) !== null) {
      const start = match.index;
      const end = start + match[0].length;

      const overlaps = matchedPositions.some(([s, e]) => (start >= s && start < e) || (end > s && end <= e) || (start <= s && end >= e));
      if (overlaps) continue;

      matchedPositions.push([start, end]);
      const entry = JARGON_DICTIONARY[key];
      const originalMatch = text.substring(start, end);
      const explanation = entry.context
        ? `${entry.plain}. ${entry.context}`
        : entry.plain;
      found.push({ term: originalMatch, explanation });
    }
  }

  return found.sort((a, b) => {
    const posA = lowerText.indexOf(a.term.toLowerCase());
    const posB = lowerText.indexOf(b.term.toLowerCase());
    return posA - posB;
  });
}

export function generateFallbackExplanation(text: string): ExplanationResult {
  const terms = findJargonTerms(text);

  if (terms.length === 0) {
    const sentences = text.split(/(?<=[.!?])\s+/);
    const shortSentences = sentences.filter(s => s.split(/\s+/).length < 20);
    const summary = shortSentences.length > 0
      ? `Here's what this means in plain language:\n\n${shortSentences.join(' ')}`
      : `Here's what this means in plain language:\n\n${text}`;

    return {
      plain_summary: summary,
      jargon_terms: [],
      confidence_level: 'low',
      confidence_note: 'No specific medical jargon was detected. This is a general summary — please check with your doctor for a full explanation.',
      source: 'fallback',
    };
  }

  const summary = generateFallbackSummary(text, terms);
  const confidenceLevel = terms.length <= 2 ? 'medium' : 'low';
  const confidenceNote = generateConfidenceNote(terms);

  return {
    plain_summary: summary,
    jargon_terms: terms,
    confidence_level: confidenceLevel,
    confidence_note: confidenceNote,
    source: 'fallback',
  };
}

export function hasJargonDictionaryTerms(text: string): boolean {
  return findJargonTerms(text).length > 0;
}
