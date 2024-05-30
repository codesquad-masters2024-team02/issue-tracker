import React from 'react';
import { Navigate } from 'react-router-dom';
import { getAccessToken } from '../utils/userUtils';

export default function ProtectedRoute({ children }) {
    //TODO: 토큰을 기반으로 로그인 상태 확인
    const isUserAuthenticated = getAccessToken();

    if (!isUserAuthenticated) return <Navigate to="/members/login" />;

    return children;
}
