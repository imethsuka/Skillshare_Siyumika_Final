// src/App.js
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./utils/AuthContext";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import LearningPathExplorer from "./pages/LearningPathExplorer";
import LearningPathDetail from "./pages/LearningPathDetail";
import LearningProgressPage from "./pages/LearningProgressPage";
import PostsPage from "./pages/PostsPage";
import PostDetailPage from "./pages/PostDetailPage";
import CreatePostPage from "./pages/CreatePostPage";
import "bootstrap/dist/css/bootstrap.min.css";
import CreateLearningPath from "./pages/CreateLearningPath";
import EditLearningPath from "./pages/EditLearningPath";
import ProfileEditPage from "./pages/ProfileEditPage";
import LearningPathProgressDetail from "./pages/LearningPathProgressDetail";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="d-flex flex-column min-vh-100">
          <Navbar />
          <main className="flex-grow-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/profile/:username" element={<ProfilePage />} />
              <Route
                path="/learning-paths"
                element={<LearningPathExplorer />}
              />
              <Route
                path="/learning-paths/:pathId"
                element={<LearningPathDetail />}
              />
              <Route
                path="/learning-paths/:pathId/edit"
                element={<EditLearningPath />}
              />
              <Route path="/posts" element={<PostsPage />} />
              <Route path="/posts/new" element={<CreatePostPage />} />
              <Route path="/posts/:postId" element={<PostDetailPage />} />
              <Route path="/create-path" element={<CreateLearningPath />} />
              <Route path="/profile/edit" element={<ProfileEditPage />} />
              <Route
                path="/learning-progress"
                element={<LearningProgressPage />}
              />
              <Route
                path="/learning-progress/:progressId"
                element={<LearningPathProgressDetail />}
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
