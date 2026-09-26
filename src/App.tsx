import { useAppContext } from './state/AppContext';
import { TripBasicsStep } from './steps/TripBasics';
import { ChatPlannerStep } from './steps/ChatPlanner';
import { ItineraryViewStep } from './steps/ItineraryView';

function App() {
  const { state } = useAppContext();

  return (
    <div className="min-h-screen bg-gradient-to-br from-offwhite via-white to-sand">
      {/* Progress indicator */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex gap-8">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm transition-colors ${
                      state.step === step
                        ? 'bg-coral text-white'
                        : state.step > step
                        ? 'bg-seaglass text-ink'
                        : 'bg-gray-300 text-gray-600'
                    }`}
                  >
                    {step}
                  </div>
                  <span
                    className={`text-sm font-medium ${
                      state.step === step ? 'text-coral' : 'text-gray-600'
                    }`}
                  >
                    {step === 1 ? 'Trip basics' : step === 2 ? 'Chat' : 'Itinerary'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {state.step === 1 && <TripBasicsStep />}
        {state.step === 2 && <ChatPlannerStep />}
        {state.step === 3 && <ItineraryViewStep />}
      </div>
    </div>
  );
}

export default App;
