import { useEffect } from 'react';
import { IconPlane } from '@tabler/icons-react';
import { useAppContext } from './state/AppContext';
import { TripBasicsStep } from './steps/TripBasics';
import { ChatPlannerStep } from './steps/ChatPlanner';
import { ItineraryViewStep } from './steps/ItineraryView';
import { AllTripsViewStep } from './steps/AllTripsView';
import { HowItWorksStep } from './steps/HowItWorks';

function App() {
  const { state, dispatch } = useAppContext();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [state.step]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-offwhite via-white to-sand">
      {/* Page header */}
      <header className="bg-white border-b border-gray-200">
        <div className="w-full px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => dispatch({ type: 'SET_STEP', payload: 1 })}
            className="text-lg font-serif font-bold text-ink flex items-center gap-2"
          >
            <IconPlane size={20} className="text-coral" /> Wayfare
          </button>
          <nav className="hidden sm:flex gap-6 text-sm text-gray-600">
            <button 
              onClick={() => {
                dispatch({ type: 'SET_STEP', payload: 1 });
                setTimeout(() => {
                  document.getElementById('hero-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 100);
              }}
              className="hover:text-coral text-left"
            >
              Plan a trip
            </button>
            <button onClick={() => dispatch({ type: 'SET_STEP', payload: 5 })} className="hover:text-coral text-left">
              How it works
            </button>
          </nav>
        </div>
      </header>

      {/* Main content */}
      {state.step === 1 ? (
        <TripBasicsStep />
      ) : state.step === 2 ? (
        <ChatPlannerStep />
      ) : state.step === 4 ? (
        <AllTripsViewStep />
      ) : state.step === 5 ? (
        <HowItWorksStep />
      ) : (
        <div className="max-w-6xl mx-auto px-4 py-8 flex-1 w-full">
          <ItineraryViewStep />
        </div>
      )}

      {/* Footer */}
      {state.step !== 2 && (
        <footer className="border-t border-gray-200 bg-white print:hidden">
          <div className="w-full px-6 py-10">
          <div className="flex flex-col md:flex-row md:justify-between gap-8">
            <div>
              <div className="text-lg font-serif font-bold text-ink flex items-center gap-2">
                <IconPlane size={20} className="text-coral" /> Wayfare
              </div>
              <p className="text-sm text-gray-500 mt-1 max-w-xs">
                AI-powered trip planning that fits your budget and your dates.
              </p>
            </div>
            <div className="flex gap-10 text-sm">
              <div className="space-y-2">
                <div className="font-semibold text-ink">Product</div>
                <button 
                  onClick={() => {
                    dispatch({ type: 'SET_STEP', payload: 1 });
                    setTimeout(() => {
                      document.getElementById('hero-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 100);
                  }}
                  className="block text-gray-500 hover:text-coral text-left"
                >
                  Plan a trip
                </button>
                <a href="#" className="block text-gray-500 hover:text-coral">
                  How it works
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-100 mt-8 pt-6 text-xs text-gray-400 text-center">
            © {new Date().getFullYear()} Wayfare. All prices shown are estimates.
          </div>
          </div>
        </footer>
      )}
    </div>
  );
}

export default App;
