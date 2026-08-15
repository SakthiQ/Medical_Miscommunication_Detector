import { ArrowRight, ArrowDown } from 'lucide-react';

interface LandingProps {
  onGetStarted: () => void;
  onAuthClick: () => void;
}

export function Landing({ onGetStarted, onAuthClick }: LandingProps) {
  const examples = [
    {
      medical: 'You have mild hepatic steatosis with elevated ALT.',
      plain: 'Your liver has a small amount of extra fat. This is common and can usually improve with diet and exercise.',
    },
    {
      medical: 'The patient presents with hyperlipidemia and stage 1 hypertension.',
      plain: 'You have high cholesterol and mildly high blood pressure. Both can often be managed with lifestyle changes.',
    },
    {
      medical: 'ECG shows sinus tachycardia with no signs of ischemia.',
      plain: 'Your heart tracing shows a slightly faster heartbeat than usual, but no signs of reduced blood flow to the heart.',
    },
  ];

  const features = [
    { title: 'Jargon detection', desc: 'Identifies difficult medical terms and explains each one in everyday words.' },
    { title: 'Plain-language rewrite', desc: 'Rewrites your entire report in simple language, not just word-by-word swaps.' },
    { title: 'Image upload + OCR', desc: 'Upload a photo of a printed medical report and we\'ll extract the text automatically.' },
    { title: 'Voice playback', desc: 'Listen to the explanation read aloud — useful for elderly patients or accessibility.' },
    { title: 'Regional translations', desc: 'Translate the simplified explanation into Hindi, Spanish, Bengali, Tamil, and more.' },
    { title: 'Saved to your account', desc: 'Create an account to save your history and revisit explanations on any device.' },
  ];

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="border-b border-gray-200">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
          <div className="max-w-2xl">
            <p className="label-tag mb-4">Medical communication, simplified</p>
            <h1 className="text-[2rem] leading-[1.15] font-semibold text-gray-900 sm:text-5xl sm:leading-[1.1]">
              Understand your medical report in{' '}
              <span className="text-primary-700">plain language</span>.
            </h1>
            <p className="mt-5 text-lg text-gray-600 leading-relaxed max-w-xl">
              Doctors write in clinical terms. Patients shouldn't need a medical degree to understand their own health. Paste your report or upload a photo — get a clear explanation with voice, translations, and a jargon glossary.
            </p>
            <div className="mt-8 flex items-center gap-3">
              <button onClick={onGetStarted} className="btn-primary">
                Translate a report
                <ArrowRight className="h-4 w-4" />
              </button>
              <a href="#examples" className="btn-secondary">
                See examples
                <ArrowDown className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Examples */}
      <section id="examples" className="border-b border-gray-200 bg-gray-50">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-1">Before and after</h2>
          <p className="text-sm text-gray-500 mb-8">Real examples of how MedTranslate converts clinical language into something a patient can actually understand.</p>

          <div className="space-y-4">
            {examples.map((ex, i) => (
              <div key={i} className="card overflow-hidden">
                <div className="grid divide-y divide-gray-200 md:grid-cols-2 md:divide-x md:divide-y-0">
                  <div className="p-5">
                    <p className="label-tag mb-2">Doctor wrote</p>
                    <p className="font-serif text-[15px] italic leading-relaxed text-gray-500">{ex.medical}</p>
                  </div>
                  <div className="p-5 bg-primary-50/40">
                    <p className="label-tag text-primary-700 mb-2">Patient reads</p>
                    <p className="text-[15px] leading-relaxed text-gray-800">{ex.plain}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
        <div className="grid gap-x-12 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <div key={i}>
              <h3 className="text-sm font-semibold text-gray-900">{f.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-gray-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-gray-200 bg-gray-50">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-8">How it works</h2>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              { n: '1', t: 'Paste or upload', d: 'Type or paste medical text, or upload a photo of a printed report — we\'ll extract the text for you.' },
              { n: '2', t: 'Get an explanation', d: 'The system identifies jargon, explains each term, and rewrites the full passage simply.' },
              { n: '3', t: 'Listen, translate, save', d: 'Hear it spoken aloud, translate it into your language, and save it to your account.' },
            ].map((s) => (
              <div key={s.n} className="flex gap-4">
                <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-primary-700 text-sm font-semibold text-white">{s.n}</span>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">{s.t}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-gray-500">{s.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900">Ready to understand your health?</h2>
          <p className="mt-2 text-gray-500">Paste your medical report and get a clear explanation in seconds.</p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <button onClick={onGetStarted} className="btn-primary">
              Get started
              <ArrowRight className="h-4 w-4" />
            </button>
            <button onClick={onAuthClick} className="btn-secondary">
              Create an account
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
