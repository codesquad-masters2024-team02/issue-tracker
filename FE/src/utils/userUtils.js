export const getUserId = () => (localStorage.getItem('storeUserData') ? JSON.parse(localStorage.getItem('storeUserData')).memberProfile.id : '');

export const getUserImg = () => (localStorage.getItem('storeUserData') ? JSON.parse(localStorage.getItem('storeUserData')).memberProfile.imgUrl : '');

export const getAccessToken = () =>
    localStorage.getItem('storeUserData') ? JSON.parse(localStorage.getItem('storeUserData')).tokenResponse.accessToken : '';

export const getRefreshToken = () =>
    localStorage.getItem('storeUserData') ? JSON.parse(localStorage.getItem('storeUserData')).tokenResponse.refreshToken : '';
