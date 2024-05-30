import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { StyledButton, StyledInput } from '../../styles/theme';
import { Link, useNavigate } from 'react-router-dom';
import DarkLogotypeLarge from '../../assets/DarkLogotypeLarge.svg';
import LightLogotypeLarge from '../../assets/LightLogotypeLarge.svg';
import { DarkModeContext } from '../../context/DarkModeContext';
import { fetchGithubLogin, fetchLogin } from '../../api/fetchMembers';
import { CustomButton } from '../../assets/CustomButton';

export default function Login() {
    const { isDarkMode } = useContext(DarkModeContext);
    const [idInput, setIdInput] = useState('');
    const [pwInput, setPwInput] = useState('');
    const [isDisabled, setIsDisabled] = useState(true);
    const [loginCheck, setLoginCheck] = useState(false);
    const navigate = useNavigate();
    const matchingSetter = {
        membersId: setIdInput,
        membersPw: setPwInput,
    };

    const handleChange = ({ target }) => {
        const { value } = target;
        const type = target.dataset.inputtype;
        const setter = matchingSetter[type];
        if (setter) setter(value);
    };

    const lengthSettings = {
        min: 6,
        max: 12,
    };

    const isValidLength = (inputValue, lengthSettings) => {
        if (inputValue.length >= lengthSettings.min && inputValue.length <= lengthSettings.max) return true;
        return false;
    };

    const isInputValidation = () => {
        if (isValidLength(idInput, lengthSettings) && isValidLength(pwInput, lengthSettings)) return false;
        return true;
    };

    const handleIdLogin = async (e) => {
        e.preventDefault();

        try {
            const loginResult = await fetchLogin({ id: idInput, password: pwInput });

            if (loginResult.result) {
                setLoginCheck(true);
                localStorage.setItem('storeUserData', JSON.stringify(loginResult.data));
                navigate('/');
            }
        } catch (error) {
            setLoginCheck(false);
            console.error('Login Failed:', error);
            alert('다시 로그인해주세요!');
        }
    };

    const handleGithubLogin = async () => {
        const CLIENT_ID = 'Ov23liTzJL66RbPZt3fg';
        const REDIRECT_URI = `${import.meta.env.VITE_TEAM_CLIENT}/members/callback`;
        const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}`;

        window.location.href = githubAuthUrl;
    };

    useEffect(() => {
        setIdInput('');
        setPwInput('');
        setIsDisabled(true);
    }, []);

    useEffect(() => {
        if (isInputValidation()) setIsDisabled(true);
        else setIsDisabled(false);
    }, [idInput, pwInput]);

    return (
        <MembersContainer>
            <Logo>
                <img src={isDarkMode ? DarkLogotypeLarge : LightLogotypeLarge} className="logo" alt="logo" />
            </Logo>

            <GithubButton onClick={handleGithubLogin} type={'container'} size={'large'} isDisabled={false}>
                GitHub 계정으로 로그인
            </GithubButton>
            <StyledSpan style={{ marginBottom: '20px' }}>or</StyledSpan>

            <form onSubmit={handleIdLogin}>
                <InputContainer>
                    <StyledInput type="text" onChange={handleChange} value={idInput} data-inputtype="membersId" autoComplete="off" />
                    <StyledPlaceHolder>아이디</StyledPlaceHolder>
                </InputContainer>

                <InputContainer>
                    <StyledInput type="password" onChange={handleChange} value={pwInput} data-inputtype="membersPw" autoComplete="off" />
                    <StyledPlaceHolder>비밀번호</StyledPlaceHolder>
                </InputContainer>

                <StyledButton onClick={handleIdLogin} $bgcolor="#007AFF" $textcolor="#fff" style={{ marginBottom: '30px' }} disabled={isDisabled}>
                    아이디로 로그인
                </StyledButton>
            </form>

            <StyledSpan>
                <Link to="/members/join" style={linkStyle}>
                    회원가입
                </Link>
            </StyledSpan>
        </MembersContainer>
    );
}

const GithubButton = styled(CustomButton)`
    margin-bottom: 20px;
    width: 320px;
    height: 56px;
    padding: 10px 20px;
`;

const linkStyle = {
    textDecorationLine: 'none',
    fontSize: '16px',
    fontWeight: '500',
    color: '#6e7191',
};

const StyledSpan = styled.span`
    font-weight: 500;
    color: #6e7191;
    font-size: 16px;
    cursor: pointer;
`;
const InputContainer = styled.div`
    position: relative;
    margin-bottom: 20px;
`;

const StyledPlaceHolder = styled.span`
    color: #6e7191;
    position: absolute;
    top: 10px;
    left: 10px;
    font-size: 12px;

    //TODO: 타이핑 시 변경
    /* top: 17px;
    left: 10px;
    font-size: 24px; */
`;

const MembersContainer = styled.div`
    width: 400px;
    height: 700px;
    display: flex;
    flex-direction: column;
    align-items: center; /* 가로 방향으로 중앙 정렬 */
    justify-content: center;
`;
const Logo = styled.div`
    width: 342px;
    height: 72px;
    margin-bottom: 60px;
`;
