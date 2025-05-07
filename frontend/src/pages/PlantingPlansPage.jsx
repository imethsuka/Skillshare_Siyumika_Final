import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PlantingPlanService from "../services/plantingPlanService";
import PlantProgressService from "../services/plantProgressService";
import { useAuth } from "../utils/AuthContext";

function PlantingPlansPage() {
  const [plans, setPlans] = useState([]);
  const [userProgress, setUserProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all"); // all, started, completed
  const { currentUser, isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true);
        const response = await PlantingPlanService.getAllPlans();
        setPlans(response.data);

        // If user is logged in, fetch their progress
        if (isAuthenticated) {
          const progressResponse = await PlantProgressService.getUserProgress(currentUser._id);
          setUserProgress(progressResponse.data);
        }

        setLoading(false);
      } catch (err) {
        setError("Failed to load learning plans");
        setLoading(false);
        console.error(err);
      }
    };

    fetchPlans();
  }, [currentUser, isAuthenticated]);

  const startProgress = async (planId) => {
    try {
      const response = await PlantProgressService.startProgress(planId);
      
      // Update the user progress state
      setUserProgress([...userProgress, response.data]);
    } catch (err) {
      console.error("Failed to start tracking progress:", err);
      alert("Failed to start tracking this plan. Please try again.");
    }
  };

  const getFilteredPlans = () => {
    if (!isAuthenticated || filter === "all") {
      return plans;
    }

    const progressMap = new Map(
      userProgress.map(progress => [progress.plantingPlan._id, progress])
    );

    return plans.filter(plan => {
      const progress = progressMap.get(plan._id);
      
      if (filter === "started" && progress) {
        return progress.progressPercentage < 100;
      }
      
      if (filter === "completed" && progress) {
        return progress.progressPercentage === 100;
      }
      
      if (filter === "not-started") {
        return !progress;
      }
      
      return true;
    });
  };

  const getUserProgressForPlan = (planId) => {
    return userProgress.find(p => p.plantingPlan._id === planId);
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-danger mt-3">{error}</div>;
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Learning Plans</h1>
        {isAuthenticated && currentUser.role === "admin" && (
          <Link to="/planting-plans/new" className="btn btn-primary">
            Create New Plan
          </Link>
        )}
      </div>

      {isAuthenticated && (
        <div className="mb-4">
          <div className="btn-group">
            <button 
              className={`btn ${filter === "all" ? "btn-primary" : "btn-outline-primary"}`}
              onClick={() => setFilter("all")}
            >
              All Plans
            </button>
            <button 
              className={`btn ${filter === "started" ? "btn-primary" : "btn-outline-primary"}`}
              onClick={() => setFilter("started")}
            >
              In Progress
            </button>
            <button 
              className={`btn ${filter === "completed" ? "btn-primary" : "btn-outline-primary"}`}
              onClick={() => setFilter("completed")}
            >
              Completed
            </button>
            <button 
              className={`btn ${filter === "not-started" ? "btn-primary" : "btn-outline-primary"}`}
              onClick={() => setFilter("not-started")}
            >
              Not Started
            </button>
          </div>
        </div>
      )}

      <div className="row">
        {getFilteredPlans().length > 0 ? (
          getFilteredPlans().map(plan => {
            const progress = getUserProgressForPlan(plan._id);
            
            return (
              <div className="col-md-4 mb-4" key={plan._id}>
                <div className="card h-100">
                  {plan.image && (
                    <img src={plan.image} alt={plan.title} className="card-img-top" style={{ height: "200px", objectFit: "cover" }} />
                  )}
                  <div className="card-body">
                    <h5 className="card-title">{plan.title}</h5>
                    <p className="card-text text-muted">{plan.description}</p>
                    
                    <div className="d-flex justify-content-between">
                      <div>
                        <span className="badge bg-info me-1">{plan.difficulty}</span>
                        <span className="badge bg-secondary">{plan.duration} days</span>
                      </div>
                      <div>
                        <i className="bi bi-people-fill"></i> {plan.usersFollowing?.length || 0}
                      </div>
                    </div>
                    
                    {progress && (
                      <div className="mt-3">
                        <div className="progress mb-2">
                          <div 
                            className="progress-bar bg-success" 
                            role="progressbar" 
                            style={{ width: `${progress.progressPercentage}%` }} 
                            aria-valuenow={progress.progressPercentage} 
                            aria-valuemin="0" 
                            aria-valuemax="100"
                          >
                            {progress.progressPercentage}%
                          </div>
                        </div>
                        <small className="text-muted">
                          {progress.completedMilestones.length} of {plan.milestones.length} milestones completed
                        </small>
                      </div>
                    )}
                  </div>
                  <div className="card-footer">
                    <div className="d-grid gap-2">
                      <Link to={`/planting-plans/${plan._id}`} className="btn btn-outline-primary">
                        View Details
                      </Link>
                      
                      {isAuthenticated && !progress && (
                        <button 
                          className="btn btn-success" 
                          onClick={() => startProgress(plan._id)}
                        >
                          Start Tracking
                        </button>
                      )}
                      
                      {isAuthenticated && progress && (
                        <Link 
                          to={`/plant-progress/${progress._id}`} 
                          className="btn btn-primary"
                        >
                          View My Progress
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-12 text-center mt-5">
            <p className="text-muted">No learning plans found for the selected filter.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default PlantingPlansPage;