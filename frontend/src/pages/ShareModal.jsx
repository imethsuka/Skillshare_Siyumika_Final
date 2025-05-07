import React from "react";
import { CheckCircle, Circle } from "lucide-react";
import badgeIcon from "../images/progress/badge.png"; // Importing the badge image

const ShareModal = ({ progress, steps, completedSteps, notes, closeModal }) => {
  return (
    <div className="fixed inset-0 bg-white-800 bg-opacity-50 flex justify-center items-center z-50">
      <div className="relative bg-white p-8 rounded-xl shadow-2xl w-[90%] sm:w-[50%] text-center border-4 border-green-500 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-400 via-yellow-400 to-green-700 blur-lg opacity-30 rounded-xl"></div>
        <h2 className="text-2xl font-bold text-green-700 relative z-10">🎉 Progress Shared! 🎉</h2>

        {/* Progress Bar */}
        <div className="relative z-10 my-4">
          <h3 className="font-semibold text-lg text-green-700">Progress: {progress}%</h3>
          <div className="w-full bg-gray-200 rounded-full h-5 mt-2 overflow-hidden">
            <div
              className="bg-green-400 h-5 rounded-full transition-all duration-500 ease-in-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Steps Display */}
        <div className="relative z-10">
          <h3 className="text-lg font-semibold text-green-700">Steps:</h3>
          <ul className="list-none text-gray-800 font-medium mb-4 space-y-2">
            {steps.map((step, index) => (
              <li
                key={index}
                className={`flex items-center justify-between p-3 rounded-lg shadow-sm transition-all duration-300 ${
                  completedSteps[index] ? "bg-gray-100 text-gray-500 line-through" : "bg-green-100"
                }`}
              >
                <span className="flex items-center gap-2">
                  {completedSteps[index] ? (
                    <CheckCircle className="text-green-500" size={20} />
                  ) : (
                    <Circle className="text-gray-400" size={20} />
                  )}
                  {step}
                </span>
                {notes[index] && (
                  <div className="ml-4 text-sm text-gray-600 italic">📝 {notes[index]}</div>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Badge Display */}
        {progress === 100 && (
          <div className="relative z-10 mt-4">
            <img src={badgeIcon} alt="Achievement Badge" className="w-34 h-54 mx-auto" />
            <p className="text-lg font-semibold text-green-600 pt-2">You've earned your badge! 🎖️</p>
          </div>
        )}

        {/* Close Button */}
        <div className="relative z-10 mt-6">
          <button
            onClick={closeModal}
            className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-bold shadow-md"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;