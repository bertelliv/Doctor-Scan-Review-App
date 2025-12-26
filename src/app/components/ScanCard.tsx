import { motion, useMotionValue, useTransform } from "motion/react";
import { useState } from "react";
import { Check, X } from "lucide-react";

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

interface ScanCardProps {
  scan: Scan;
  onSwipe: (direction: "left" | "right") => void;
  isTop: boolean;
}

export function ScanCard({ scan, onSwipe, isTop }: ScanCardProps) {
  const [exitX, setExitX] = useState(0);
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);

  const handleDragEnd = (_: any, info: any) => {
    if (Math.abs(info.offset.x) > 100) {
      setExitX(info.offset.x > 0 ? 1000 : -1000);
      onSwipe(info.offset.x > 0 ? "right" : "left");
    }
  };

  return (
    <motion.div
      className="absolute w-full h-full cursor-grab active:cursor-grabbing"
      style={{
        x,
        rotate,
        opacity: isTop ? 1 : 0.8,
        zIndex: isTop ? 10 : 5,
      }}
      drag={isTop ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      animate={{ x: exitX }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="relative w-full h-full bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Swipe indicators */}
        <motion.div
          className="absolute top-8 left-8 z-20 bg-red-500 text-white px-6 py-3 rounded-xl rotate-[-20deg] pointer-events-none"
          style={{ opacity: useTransform(x, [-100, 0], [1, 0]) }}
        >
          <div className="flex items-center gap-2">
            <X className="w-6 h-6" />
            <span>SICK</span>
          </div>
        </motion.div>
        <motion.div
          className="absolute top-8 right-8 z-20 bg-green-500 text-white px-6 py-3 rounded-xl rotate-[20deg] pointer-events-none"
          style={{ opacity: useTransform(x, [0, 100], [0, 1]) }}
        >
          <div className="flex items-center gap-2">
            <Check className="w-6 h-6" />
            <span>HEALTHY</span>
          </div>
        </motion.div>

        {/* Scan Image */}
        <div className="w-full h-[60%] bg-gray-900 relative overflow-hidden">
          <img
            src={scan.imageUrl}
            alt={`${scan.scanType} scan`}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded-lg text-sm">
            {scan.scanType}
          </div>
        </div>

        {/* Patient Info */}
        <div className="p-8 h-[40%] flex flex-col justify-between">
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl mb-1">{scan.patientName}</h2>
              <p className="text-gray-500">
                Patient ID: {scan.patientId}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Age</p>
                <p>{scan.age} years</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Gender</p>
                <p>{scan.gender}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Body Part</p>
                <p>{scan.bodyPart}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Scan Date</p>
                <p>{scan.scanDate}</p>
              </div>
            </div>
          </div>

          {/* Swipe instruction */}
          <p className="text-center text-gray-400 text-sm">
            ← Swipe to classify →
          </p>
        </div>
      </div>
    </motion.div>
  );
}
