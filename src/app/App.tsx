import { useState } from "react";
import { ScanCard } from "./components/ScanCard";
import { Check, X, RotateCcw, Activity } from "lucide-react";
import { Button } from "./components/ui/button";

interface Scan {
  id: string;
  patientId: string;
  patientName: string;
  age: number;
  gender: string;
  scanType: string;
  scanDate: string;
  imageUrl: string;
  bodyPart: string;
}

interface Review {
  scanId: string;
  patientName: string;
  decision: "healthy" | "sick";
  timestamp: Date;
}

const mockScans: Scan[] = [
  {
    id: "1",
    patientId: "PT-2024-001",
    patientName: "Sarah Johnson",
    age: 45,
    gender: "Female",
    scanType: "PET/CT",
    scanDate: "Dec 24, 2024",
    imageUrl: "https://images.unsplash.com/photo-1706065638524-eb52e7165abf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwQ1QlMjBzY2FufGVufDF8fHx8MTc2NjcyODE1NHww&ixlib=rb-4.1.0&q=80&w=1080",
    bodyPart: "Chest",
  },
  {
    id: "2",
    patientId: "PT-2024-002",
    patientName: "Michael Chen",
    age: 62,
    gender: "Male",
    scanType: "PET Scan",
    scanDate: "Dec 24, 2024",
    imageUrl: "https://images.unsplash.com/photo-1587010580103-fd86b8ea14ca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxQRVQlMjBzY2FuJTIwbWVkaWNhbHxlbnwxfHx8fDE3NjY3MjgxNTV8MA&ixlib=rb-4.1.0&q=80&w=1080",
    bodyPart: "Full Body",
  },
  {
    id: "3",
    patientId: "PT-2024-003",
    patientName: "Emma Davis",
    age: 38,
    gender: "Female",
    scanType: "Brain MRI",
    scanDate: "Dec 25, 2024",
    imageUrl: "https://images.unsplash.com/photo-1758691463569-66de91d76452?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicmFpbiUyMHNjYW4lMjBpbWFnaW5nfGVufDF8fHx8MTc2NjcyODE1NXww&ixlib=rb-4.1.0&q=80&w=1080",
    bodyPart: "Brain",
  },
  {
    id: "4",
    patientId: "PT-2024-004",
    patientName: "Robert Wilson",
    age: 55,
    gender: "Male",
    scanType: "Chest X-Ray",
    scanDate: "Dec 25, 2024",
    imageUrl: "https://images.unsplash.com/photo-1584555684040-bad07f46a21f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGVzdCUyMHhyYXklMjBtZWRpY2FsfGVufDF8fHx8MTc2NjcyODE1NXww&ixlib=rb-4.1.0&q=80&w=1080",
    bodyPart: "Chest",
  },
  {
    id: "5",
    patientId: "PT-2024-005",
    patientName: "Lisa Martinez",
    age: 51,
    gender: "Female",
    scanType: "CT Scan",
    scanDate: "Dec 26, 2024",
    imageUrl: "https://images.unsplash.com/photo-1631563020912-213371f1d768?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwaW1hZ2luZyUyMHJhZGlvbG9neXxlbnwxfHx8fDE3NjY3MjgxNTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    bodyPart: "Abdomen",
  },
];

export default function App() {
  const [scans, setScans] = useState<Scan[]>(mockScans);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleSwipe = (direction: "left" | "right") => {
    if (currentIndex < scans.length) {
      const scan = scans[currentIndex];
      setReviews([
        ...reviews,
        {
          scanId: scan.id,
          patientName: scan.patientName,
          decision: direction === "right" ? "healthy" : "sick",
          timestamp: new Date(),
        },
      ]);
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleUndo = () => {
    if (reviews.length > 0) {
      setReviews(reviews.slice(0, -1));
      setCurrentIndex(Math.max(0, currentIndex - 1));
    }
  };

  const handleButtonClick = (decision: "healthy" | "sick") => {
    handleSwipe(decision === "healthy" ? "right" : "left");
  };

  const remainingScans = scans.length - currentIndex;
  const healthyCount = reviews.filter((r) => r.decision === "healthy").length;
  const sickCount = reviews.filter((r) => r.decision === "sick").length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl">Scan Review</h1>
                <p className="text-sm text-gray-500">Quick PET/CT Classification</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <p className="text-sm text-gray-500">Remaining</p>
                <p className="text-2xl text-indigo-600">{remainingScans}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500">Healthy</p>
                <p className="text-2xl text-green-600">{healthyCount}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500">Sick</p>
                <p className="text-2xl text-red-600">{sickCount}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md">
          {/* Card Stack */}
          <div className="relative w-full aspect-[3/4] mb-8">
            {currentIndex >= scans.length ? (
              <div className="w-full h-full flex items-center justify-center bg-white rounded-3xl shadow-2xl">
                <div className="text-center p-8">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="w-10 h-10 text-green-600" />
                  </div>
                  <h2 className="text-2xl mb-2">All Done!</h2>
                  <p className="text-gray-500 mb-6">
                    You've reviewed all scans.
                  </p>
                  <div className="space-y-2 text-left bg-gray-50 rounded-xl p-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Reviewed:</span>
                      <span>{reviews.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Healthy:</span>
                      <span className="text-green-600">{healthyCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Sick:</span>
                      <span className="text-red-600">{sickCount}</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {/* Show next card in background */}
                {currentIndex + 1 < scans.length && (
                  <div className="absolute w-full h-full">
                    <div className="w-full h-full bg-white rounded-3xl shadow-lg opacity-50 scale-95 transform origin-center" />
                  </div>
                )}
                {/* Current card */}
                <ScanCard
                  scan={scans[currentIndex]}
                  onSwipe={handleSwipe}
                  isTop={true}
                />
              </>
            )}
          </div>

          {/* Action Buttons */}
          {currentIndex < scans.length && (
            <div className="flex items-center justify-center gap-4">
              <Button
                variant="outline"
                size="lg"
                className="w-16 h-16 rounded-full bg-white border-2 border-red-500 text-red-500 hover:bg-red-50 hover:border-red-600 hover:text-red-600 shadow-lg"
                onClick={() => handleButtonClick("sick")}
              >
                <X className="w-8 h-8" />
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="w-14 h-14 rounded-full bg-white border-2 border-gray-300 text-gray-600 hover:bg-gray-50 shadow-lg"
                onClick={handleUndo}
                disabled={reviews.length === 0}
              >
                <RotateCcw className="w-6 h-6" />
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="w-16 h-16 rounded-full bg-white border-2 border-green-500 text-green-500 hover:bg-green-50 hover:border-green-600 hover:text-green-600 shadow-lg"
                onClick={() => handleButtonClick("healthy")}
              >
                <Check className="w-8 h-8" />
              </Button>
            </div>
          )}
        </div>
      </main>

      {/* Recent Reviews */}
      {reviews.length > 0 && (
        <div className="bg-white border-t border-gray-200 p-4">
          <div className="max-w-7xl mx-auto">
            <h3 className="text-sm text-gray-500 mb-2">Recent Reviews</h3>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {reviews.slice(-5).reverse().map((review, idx) => (
                <div
                  key={idx}
                  className={`flex-shrink-0 px-3 py-2 rounded-lg text-sm ${
                    review.decision === "healthy"
                      ? "bg-green-50 text-green-700 border border-green-200"
                      : "bg-red-50 text-red-700 border border-red-200"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {review.decision === "healthy" ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <X className="w-4 h-4" />
                    )}
                    <span>{review.patientName}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
