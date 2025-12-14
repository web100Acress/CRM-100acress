
// 5. src/pages/Onboarding/components/StageProgress.jsx
// ============================================

import React from "react";
import { CheckCircle, Circle, Clock } from "lucide-react";
import { stageLabels } from "../constants";

export const StageProgress = ({ stages, currentIndex, status }) => {
  return (
    <div className="flex items-center space-x-1">
      {stages.map((s, idx) => {
        const done = status === "completed" || idx < currentIndex;
        const current = idx === currentIndex && status !== "completed";
        const isLast = idx === stages.length - 1;
        return (
          <div key={s} className="flex items-center">
            <div className="flex flex-col items-center">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 ${
                done ? "bg-green-500 text-white" : current ? "bg-blue-500 text-white animate-pulse" : "bg-gray-200 text-gray-400"
              }`}>
                {done ? <CheckCircle size={18} /> : current ? <Clock size={18} /> : <Circle size={18} />}
              </div>
              <div className={`mt-1 text-xs font-medium text-center ${
                done ? "text-green-700" : current ? "text-blue-700" : "text-gray-400"
              }`}>
                {stageLabels.find((x) => x.key === s)?.label || s}
              </div>
            </div>
            {!isLast && (
              <div className={`mx-3 h-0.5 w-16 transition-all duration-300 ${
                done ? "bg-green-500" : "bg-gray-200"
              }`}></div>
            )}
          </div>
        );
      })}
    </div>
  );
};
