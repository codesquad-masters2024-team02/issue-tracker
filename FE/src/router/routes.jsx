import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Join from '../components/members/Join';
import Login from '../components/members/Login';
import Index from '../components/Index';
import NotFound from '../components/NotFound';
import Milestones from '../components/milestones/Milestones';
import Labels from '../components/labels/Labels';
import ProtectedRoute from './ProtectedRoute';

export const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                <Route path="/members/login" element={<Login />} />
                <Route path="/members/join" element={<Join />} />
                <Route path="/milestones" element={<Milestones />} />
                <Route path="/labels" element={<Labels />} />
                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <Index />
                        </ProtectedRoute>
                    }
                />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Router>
    );
};