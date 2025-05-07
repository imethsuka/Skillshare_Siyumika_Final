
import React, { useState } from "react";
import { useAuth } from "../utils/AuthContext";
import { CheckCircle, Circle, Plus } from "lucide-react";
import leafIcon from "../images/progress/leaf.png";
import badgeIcon from "../images/progress/badge.png";
import plantIcon from "../images/progress/plant.png";
import styled from "styled-components";
import ShareModal from "./ShareModal"; // Adjust the path if necessary

// Loader Component
const Loader = () => {
  return (
    <StyledWrapper>
      <div className="spinner">
        <div className="spinnerin" />
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  .spinner {
    width: 18em;
    height: 18em;
    cursor: not-allowed;
    border-radius: 50%;
    border: 2px solid #444;
    box-shadow: -10px -10px 10px #cddc39, 0px -10px 10px 0px #fff176,
      10px -10px 10px #ffb74d, 10px 0 10px 4px #4caf50,
      10px 10px 10px 0px #ff5500, 0 10px 10px 0px #ff9500,
      -10px 10px 10px 0px #ffb700;
    animation: rot55 2s linear infinite;
  }

  .spinnerin {
    width: 1.5em;
    height: 1.5em;
    border-radius: 50%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-1000%, -1000%);
  }

  @keyframes rot55 {
    to {
      transform: rotate(360deg);
    }
  }
`;

const PlantProgressDetailPage = () => {
  const { currentUser } = useAuth();
  const [steps, setSteps] = useState([]);
  const [progress, setProgress] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [formInputs, setFormInputs] = useState([""]); // Initially, one input field
  const [completedSteps, setCompletedSteps] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [notes, setNotes] = useState({});
  const [allStepsCompleted, setAllStepsCompleted] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  const handleInputChange = (e, index) => {
    const newFormInputs = [...formInputs];
    newFormInputs[index] = e.target.value;
    setFormInputs(newFormInputs);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const parsedSteps = formInputs
      .map((step) => step.trim())
      .filter((step) => step.length > 0);
    setSteps(parsedSteps);
    setProgress(0);
    setCompleted(false);
    setCompletedSteps(new Array(parsedSteps.length).fill(false));
    setFormInputs([""]);
    setAllStepsCompleted(false);
  };

  const toggleStepCompletion = (index) => {
    if (!isEditMode && completedSteps[index]) return;
    if (index > 0 && !completedSteps[index - 1] && !isEditMode) return;

    const newCompletedSteps = [...completedSteps];
    newCompletedSteps[index] = !newCompletedSteps[index];
    setCompletedSteps(newCompletedSteps);

    const completedCount = newCompletedSteps.filter((step) => step).length;
    const newProgress = Math.round((completedCount / steps.length) * 100);
    setProgress(newProgress);

    if (newProgress === 100) {
      setCompleted(true);
      setAllStepsCompleted(true);
    } else {
      setCompleted(false);
      setAllStepsCompleted(false);
    }

    if (isEditMode && !newCompletedSteps[index]) {
      const newNotes = { ...notes };
      delete newNotes[index];
      setNotes(newNotes);
    }
  };

  const toggleEditMode = () => setIsEditMode(!isEditMode);

  const handleNoteChange = (index, event) => {
    const newNotes = { ...notes, [index]: event.target.value };
    setNotes(newNotes);
  };

  const cancelEdit = () => {
    setSteps([]);
    setProgress(0);
    setCompleted(false);
    setCompletedSteps([]);
    setNotes({});
    setFormInputs([""]);
    setAllStepsCompleted(false);
  };

  const handleShareProgress = () => {
    setShowShareModal(true);
  };

  const closeShareModal = () => {
    setShowShareModal(false);
  };

  const getShareableData = () => {
    return {
      steps,
      progress,
      completed,
      completedSteps,
      notes,
    };
  };

  const handleAddStep = () => {
    setFormInputs([...formInputs, ""]);
  };

  return (
<div className="max-w-2xl mx-auto py-4 px-4 bg-[rgba(236,255,220,0.6)] rounded-lg shadow-md mt-30 relative">
{/* plant Image */}
      <img
        src={plantIcon}
        alt="Plant"
        className="w-88 h-98 absolute top-0 left-0 opacity-40"
      />
      <div className="relative z-10">
        {currentUser && (
          <div className="text-center text-xl font-semibold mb-4">
            Welcome, {currentUser.username}!
          </div>
        )}

        <h2 className="text-2xl font-semibold text-center mb-4">
          Track Your Plant's Progress
        </h2>

        <form onSubmit={handleSubmit} className="mb-6">
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Enter plant steps you expect:
          </label>

          {/* Render dynamic input fields */}
          {formInputs.map((input, index) => (
            <div key={index} className="mb-4">
              <textarea
                value={input}
                onChange={(e) => handleInputChange(e, index)}
                rows="3"
                className="w-full px-3 py-2 bg-[#C1E1C1] border rounded-md text-gray-700"
                placeholder={`Step ${index + 1}: Enter step description`}
              />
            </div>
          ))}

          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={handleAddStep}
              className="text-blue-500 hover:text-blue-600"
            >
              <Plus size={20} /> Add Another Step
            </button>

            <button
              type="submit"
              className="relative inline-flex items-center justify-center p-0.5 mb-2 mt-4 overflow-hidden text-sm font-medium text-gray-900 rounded-full group bg-gradient-to-br from-teal-300 to-lime-300 group-hover:from-teal-300 group-hover:to-lime-300 dark:text-white dark:hover:text-gray-900 focus:ring-4 focus:outline-none focus:ring-lime-200 dark:focus:ring-lime-800"
            >
              <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-green dark:bg-green-900 rounded-full group-hover:bg-transparent group-hover:dark:bg-transparent">
                Submit Steps
              </span>
            </button>
          </div>
        </form>

        {/* Progress bar */}
        <div className="bg-white p-10 rounded-lg shadow-md w-full max-w-screen-xl mx-auto">
          <div className="relative pt-1 mb-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-green-600">
                Progress
              </span>
              <span className="text-sm font-semibold text-green-600">
                {progress}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-5 mt-2">
              <div
                className="bg-green-400 h-5 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          {/* Steps buttons */}
          {steps.length > 0 && (
            <div className="flex flex-wrap gap-3">
              {steps.map((step, index) => (
                <div key={index} className="flex flex-col items-center">
                  <button
                    className={`relative text-white bg-gradient-to-r from-green-400 via-blue-400 to-yellow-500 
                              px-6 py-3 rounded-xl text-lg cursor-pointer transition-all duration-500 
                              before:absolute before:inset-1 before:bg-gray-900 before:rounded-lg before:transition-opacity 
                              hover:before:opacity-70 
                              after:absolute after:inset-0 after:bg-gradient-to-r after:from-green-400 after:via-green-700 
                              after:to-yellow-500 after:rounded-lg after:blur-lg after:opacity-0 after:transition-opacity 
                              hover:after:opacity-100
                              flex items-center gap-3 text-left`}
                    onClick={() => toggleStepCompletion(index)}
                    disabled={!isEditMode && completedSteps[index]}
                  >
                    {/* Leaf Image */}
                    <img
                      src={leafIcon}
                      alt="Leaf"
                      className="w-6 h-6 relative z-10"
                    />

                    <span className="relative z-10">{`Stage ${
                      index + 1
                    }: ${step}`}</span>
                    {completedSteps[index] ? (
                      <CheckCircle size={24} className="relative z-10" />
                    ) : (
                      <Circle size={24} className="relative z-10" />
                    )}
                  </button>

                  {/* Plus icon to add notes */}
                  <button
                    type="button"
                    onClick={() => {
                      const newNotes = { ...notes };
                      if (!newNotes[index]) newNotes[index] = "";
                      setNotes(newNotes);
                    }}
                    className="mt-2 text-green-500 hover:text-green-600"
                  >
                    <Plus size={20} />
                  </button>

                  {/* Notes input field */}
                  {notes[index] !== undefined && (
                    <div className="relative w-[200px] h-[250px] flex flex-col items-center justify-center rounded-xl shadow-2xl overflow-hidden">
                      <div className="absolute top-[5px] left-[5px] w-[190px] h-[240px] bg-white/95 backdrop-blur-xl rounded-lg outline-2 outline-white z-10"></div>
                      <div className="absolute top-1/2 left-1/2 w-[150px] h-[150px] bg-green-500 opacity-80 blur-lg rounded-full animate-[blobBounce_5s_infinite_ease] z-0"></div>
                      <textarea
                        value={notes[index]}
                        onChange={(e) => handleNoteChange(index, e)}
                        rows="3"
                        className="relative z-20 mt-2 w-[180px] px-3 py-2 border rounded-md text-gray-700 bg-transparent outline-none placeholder-gray-500 shadow-md"
                        placeholder="Add your notes here..."
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {completed && (
          <div className="mt-4 text-center text-xl font-bold text-green-600">
            Congratulations! Your plant is fully grown! 🌱🎉
          </div>
        )}

        {allStepsCompleted && (
          <div className="mt-4 text-center relative">
            <Loader />
            <img
              src={badgeIcon}
              alt="Badge"
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 w-36 h-56"
            />
          </div>
        )}

        {/* Edit, Cancel, Share Buttons */}
        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={toggleEditMode}
            className="text-gray-900 bg-gradient-to-r from-teal-200 to-lime-200 hover:bg-gradient-to-l hover:from-teal-200 hover:to-lime-200 focus:ring-4 focus:outline-none focus:ring-lime-200 dark:focus:ring-teal-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
          >
            {isEditMode ? "Save Changes" : "Edit Progress"}
          </button>
          <button
            onClick={cancelEdit}
            className="text-gray-900 bg-gradient-to-r from-teal-200 to-lime-200 hover:bg-gradient-to-l hover:from-teal-200 hover:to-lime-200 focus:ring-4 focus:outline-none focus:ring-lime-200 dark:focus:ring-teal-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
          >
            Cancel
          </button>
          <button
            onClick={handleShareProgress}
            className="text-gray-900 bg-gradient-to-r from-teal-200 to-lime-200 hover:bg-gradient-to-l hover:from-teal-200 hover:to-lime-200 focus:ring-4 focus:outline-none focus:ring-lime-200 dark:focus:ring-teal-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
          >
            Share Progress
          </button>
        </div>

        {/* Share Progress Modal */}
        {showShareModal && (
          <ShareModal
            progress={progress}
            steps={steps}
            completedSteps={completedSteps}
            notes={notes}
            closeModal={closeShareModal}
          />
        )}
      </div>
    </div>
  );
};

export default PlantProgressDetailPage;
