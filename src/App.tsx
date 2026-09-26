import { useAppContext } from './state/AppContext';
import { TripBasicsStep } from './steps/TripBasics';
import { ChatPlannerStep } from './steps/ChatPlanner';
import { ItineraryViewStep } from './steps/ItineraryView';

function App() {
  const { state } = useAppContext();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-offwhite via-white to-sand">
      {/* Page header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <a href="#" className="text-lg font-serif font-bold text-ink flex items-center gap-2">
            <span>✈️</span> Wayfare
          </a>
          <nav className="hidden sm:flex gap-6 text-sm text-gray-600">
            <a href="#trip-form" className="hover:text-coral">
              Plan a trip
            </a>
            <a href="#" className="hover:text-coral">
              How it works
            </a>
          </nav>
        </div>
      </header>

      {/* Main content */}
      <div className="max-w-6xl mx-auto px-4 py-8 flex-1 w-full">
        {state.step === 1 && <TripBasicsStep />}
        {state.step === 2 && <ChatPlannerStep />}
        {state.step === 3 && <ItineraryViewStep />}
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white print:hidden">
        <div className="max-w-6xl mx-auto px-4 py-10">
          <div className="flex flex-col md:flex-row md:justify-between gap-8">
            <div>
              <div className="text-lg font-serif font-bold text-ink">✈️ Wayfare</div>
              <p className="text-sm text-gray-500 mt-1 max-w-xs">
                AI-powered trip planning that fits your budget and your dates.
              </p>
            </div>
            <div className="flex gap-10 text-sm">
              <div className="space-y-2">
                <div className="font-semibold text-ink">Product</div>
                <a href="#trip-form" className="block text-gray-500 hover:text-coral">
                  Plan a trip
                </a>
                <a href="#" className="block text-gray-500 hover:text-coral">
                  How it works
                </a>
              </div>
              <div className="space-y-2">
                <div className="font-semibold text-ink">Company</div>
                <a href="#" className="block text-gray-500 hover:text-coral">
                  About
                </a>
                <a href="#" className="block text-gray-500 hover:text-coral">
                  Contact
                </a>
              </div>
              <div className="space-y-2">
                <div className="font-semibold text-ink">Legal</div>
                <a href="#" className="block text-gray-500 hover:text-coral">
                  Privacy
                </a>
                <a href="#" className="block text-gray-500 hover:text-coral">
                  Terms
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-100 mt-8 pt-6 text-xs text-gray-400 text-center">
            © {new Date().getFullYear()} Wayfare. All prices shown are estimates.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
