import React, { useEffect } from 'react';
import { fetchGithubLogin } from '../../api/fetchMembers';
import { useNavigate } from 'react-router-dom';

export default function AuthLoadingPage() {
    const navigate = useNavigate();

    useEffect(() => {
        const url = new URL(window.location.href);
        const authorizationCode = url.searchParams.get('code');
        console.log('인증 코드:', authorizationCode); //인증 코드

        const githubLogin = async () => {
            try {
                const loginResult = await fetchGithubLogin(authorizationCode);

                if (loginResult.result) {
                    localStorage.setItem('storeUserData', JSON.stringify(loginResult.data));
                    navigate('/');
                }
            } catch (error) {
                console.error('Login Failed:', error);
                alert('다시 로그인해주세요!');
            }
        };

        if (authorizationCode) githubLogin();
    }, []);

    return <div>GitHub OAuth 로그인 처리 중...</div>;
}
