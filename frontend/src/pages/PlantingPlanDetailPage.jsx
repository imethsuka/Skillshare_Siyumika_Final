import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../utils/AuthContext";
import PlantingPlanService from "../services/plantingPlanService";
import PlantProgressService from "../services/plantProgressService";

function PlantingPlanDetailPage() {
  const { planId } = useParams();
  const navigate = useNavigate();
  const { currentUser, isAuthenticated } = useAuth();
  const [plan, setPlan] = useState(null);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAllMilestones, setShowAllMilestones] = useState(false);

  useEffect(() => {
    const fetchPlanDetails = async () => {
      try {
        setLoading(true);
        const response = await PlantingPlanService.getPlanById(planId);
        setPlan(response.data);

        // If user is logged in, check if they're already tracking this plan
        if (isAuthenticated && currentUser) {
          try {
            const progressResponse = await PlantProgressService.getUserProgress(currentUser._id);
            const userProgress = progressResponse.data.find(
              p => p.plantingPlan._id === planId
            );
            setProgress(userProgress || null);
          } catch (err) {
            console.error("Error fetching user progress:", err);
          }
        }

        setLoading(false);
      } catch (err) {
        setError("Failed to load learning plan details");
        setLoading(false);
        console.error(err);
      }
    };

    fetchPlanDetails();
  }, [planId, currentUser, isAuthenticated]);

  const startProgress = async () => {
    try {
      const response = await PlantProgressService.startProgress(planId);
      setProgress(response.data);
      navigate(`/plant-progress/${response.data._id}`);
    } catch (err) {
      console.error("Failed to start tracking progress:", err);
      alert("Failed to start tracking this plan. Please try again.");
    }
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

  if (!plan) {
    return <div className="alert alert-warning mt-3">Learning plan not found</div>;
  }

  // Display only first 3 milestones by default, unless expanded
  const displayedMilestones = showAllMilestones 
    ? plan.milestones 
    : plan.milestones.slice(0, 3);

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-8">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/planting-plans">Learning Plans</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                {plan.title}
              </li>
            </ol>
          </nav>
          
          <div className="card mb-4">
            {plan.image && (
              <img 
                src={plan.image} 
                alt={plan.title} 
                className="card-img-top"
                style={{ maxHeight: "400px", objectFit: "cover" }}
              />
            )}
            <div className="card-body">
              <h1 className="card-title">{plan.title}</h1>
              
              <div className="d-flex mb-3">
                <span className="badge bg-info me-2">{plan.difficulty}</span>
                <span className="badge bg-secondary me-2">{plan.duration} days</span>
                {plan.categories?.map((category, index) => (
                  <span key={index} className="badge bg-primary me-2">{category}</span>
                ))}
              </div>
              
              <p className="lead">{plan.description}</p>
              
              {plan.requirements && (
                <div className="mb-4">
                  <h4>Requirements</h4>
                  <p>{plan.requirements}</p>
                </div>
              )}
              
              <h4>Milestones</h4>
              <div className="list-group mb-3">
                {displayedMilestones.map((milestone, index) => (
                  <div key={index} className="list-group-item">
                    <div className="d-flex w-100 justify-content-between">
                      <h5 className="mb-1">
                        {index + 1}. {milestone.title}
                      </h5>
                      {milestone.estimatedDays && (
                        <small className="text-muted">
                          {milestone.estimatedDays} days
                        </small>
                      )}
                    </div>
                    <p className="mb-1">{milestone.description}</p>
                    {milestone.tips && (
                      <small className="text-muted">
                        <strong>Tip:</strong> {milestone.tips}
                      </small>
                    )}
                  </div>
                ))}
              </div>
              
              {plan.milestones.length > 3 && (
                <button 
                  className="btn btn-outline-secondary mb-4" 
                  onClick={() => setShowAllMilestones(!showAllMilestones)}
                >
                  {showAllMilestones ? "Show Less" : `Show All ${plan.milestones.length} Milestones`}
                </button>
              )}
              
              {plan.tips && (
                <div className="card bg-light mb-4">
                  <div className="card-body">
                    <h5 className="card-title">Tips for Success</h5>
                    <p className="card-text">{plan.tips}</p>
                  </div>
                </div>
              )}
              
              {isAuthenticated ? (
                progress ? (
                  <div className="d-grid gap-2">
                    <Link 
                      to={`/plant-progress/${progress._id}`} 
                      className="btn btn-primary btn-lg"
                    >
                      View My Progress
                    </Link>
                  </div>
                ) : (
                  <div className="d-grid gap-2">
                    <button 
                      className="btn btn-success btn-lg" 
                      onClick={startProgress}
                    >
                      Start Tracking This Plan
                    </button>
                  </div>
                )
              ) : (
                <div className="alert alert-info">
                  <Link to="/login">Login</Link> or <Link to="/register">Register</Link> to track your progress with this learning plan
                </div>
              )}
            </div>
          </div>
          
          {/* Comments section could be added here */}
        </div>
        
        <div className="col-md-4">
          <div className="card mb-4">
            <div className="card-header">
              <h5 className="card-title mb-0">Author</h5>
            </div>
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="bg-light rounded-circle p-2 me-3">
                  <i className="bi bi-person-fill fs-3"></i>
                </div>
                <div>
                  <h6 className="mb-0">{plan.createdBy?.username || "Admin"}</h6>
                  <small className="text-muted">
                    Created on {new Date(plan.createdAt).toLocaleDateString()}
                  </small>
                </div>
              </div>
            </div>
          </div>
          
          <div className="card mb-4">
            <div className="card-header">
              <h5 className="card-title mb-0">Stats</h5>
            </div>
            <div className="card-body">
              <ul className="list-group list-group-flush">
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  Users following this plan
                  <span className="badge bg-primary rounded-pill">
                    {plan.usersFollowing?.length || 0}
                  </span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  Success rate
                  <span className="badge bg-success rounded-pill">
                    {plan.successRate || "N/A"}
                  </span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  Number of milestones
                  <span className="badge bg-info rounded-pill">
                    {plan.milestones.length}
                  </span>
                </li>
              </ul>
            </div>
          </div>
          
          {isAuthenticated && currentUser.role === "admin" && (
            <div className="d-grid gap-2">
              <Link to={`/planting-plans/${planId}/edit`} className="btn btn-outline-primary">
                Edit Plan
              </Link>
              <button className="btn btn-outline-danger">
                Delete Plan
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PlantingPlanDetailPage;