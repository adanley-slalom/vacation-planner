import { useAppContext } from '../state/AppContext';
import { IconArrowRight, IconBrain, IconMessage2, IconMap, IconCreditCard } from '@tabler/icons-react';

export function HowItWorksStep() {
  const { dispatch } = useAppContext();

  const handleBack = () => {
    dispatch({ type: 'SET_STEP', payload: 1 });
    setTimeout(() => {
      document.getElementById('hero-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const steps = [
    {
      icon: IconCreditCard,
      number: '1',
      title: 'Tell us your budget',
      description: 'Start by letting us know your travel budget, dates, and who\'s traveling. Give us as much or as little detail as you\'d like.',
    },
    {
      icon: IconBrain,
      number: '2',
      title: 'AI understands you',
      description: 'Our AI learns your preferences through conversation. It asks clarifying questions to understand your travel style, interests, and must-haves.',
    },
    {
      icon: IconMessage2,
      number: '3',
      title: 'Chat and customize',
      description: 'Have a natural conversation with Wayfare AI. Ask questions, get suggestions, and refine your itinerary in real-time.',
    },
    {
      icon: IconMap,
      number: '4',
      title: 'Get your itinerary',
      description: 'Receive a detailed, day-by-day itinerary with booking links for flights, hotels, activities, and restaurants—all tailored to your budget.',
    },
  ];

  return (
    <div className="flex-1 w-full">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Back button and header */}
        <div className="mb-12">
          <button
            onClick={handleBack}
            className="text-coral hover:text-coral/70 font-semibold mb-6 flex items-center gap-2 transition-colors"
          >
            ← Back
          </button>
          <h1 className="text-5xl font-serif font-bold text-ink mb-4">
            How it works
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl">
            Wayfare AI transforms how you plan trips. No more endless scrolling through reviews or spreadsheets — just a conversation that builds your perfect itinerary.
          </p>
        </div>

        {/* Steps section */}
        <div className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {steps.map((step, idx) => {
              const IconComponent = step.icon;
              return (
                <div key={step.number} className="relative">
                  <div className="flex gap-6">
                    {/* Icon and number */}
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-coral/20 to-seaglass/20 flex items-center justify-center flex-shrink-0 mb-4">
                        <IconComponent size={32} className="text-coral" strokeWidth={1.5} />
                      </div>
                      {idx < steps.length - 2 && (
                        <div className="hidden md:block w-0.5 h-12 bg-gradient-to-b from-coral/30 to-transparent mt-2" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="pt-1 pb-8">
                      <div className="flex items-center gap-3 mb-2">
                        <span
                          className="inline-flex items-center justify-center w-7 h-7 rounded-full text-white text-sm font-bold shadow-soft"
                          style={{ background: 'linear-gradient(135deg, #555dff 0%, #555dffcc 100%)' }}
                        >
                          {step.number}
                        </span>
                        <h3 className="text-2xl font-serif font-bold text-ink">
                          {step.title}
                        </h3>
                      </div>
                      <p className="text-gray-600 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Features section */}
        <div className="mb-16 card bg-gradient-to-br from-seaglass/10 via-sand/10 to-coral/5 p-8 md:p-12">
          <h2 className="text-3xl font-serif font-bold text-ink mb-8">Why Wayfare AI?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-serif font-bold text-ink mb-2">Truly personalized</h3>
              <p className="text-gray-600">
                Every itinerary is unique. Our AI adapts to your budget, pace, and interests in real-time.
              </p>
            </div>
            <div>
              <h3 className="font-serif font-bold text-ink mb-2">Fast & effortless</h3>
              <p className="text-gray-600">
                Get a complete itinerary in minutes, not hours. No forms, spreadsheets, or tedious booking processes.
              </p>
            </div>
            <div>
              <h3 className="font-serif font-bold text-ink mb-2">Ready to book</h3>
              <p className="text-gray-600">
                Every activity, hotel, and restaurant comes with direct booking links at your budget level.
              </p>
            </div>
          </div>
        </div>

        {/* CTA section */}
        <div className="text-center">
          <h2 className="text-3xl font-serif font-bold text-ink mb-6">Ready to plan your trip?</h2>
          <button
            onClick={handleBack}
            className="btn btn-dark btn-pill py-3 px-8"
          >
            Start planning <IconArrowRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
