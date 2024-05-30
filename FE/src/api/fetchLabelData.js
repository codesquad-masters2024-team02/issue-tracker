import { getAccessToken } from '../utils/userUtils';

const LABEL_DEFAULT_API_URI = '/api/labels';
const HOME_DEFAULT_API_URI = '/api/home/components';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * 레이블 마일스톤 - 개수 조회
 * @param {*String} issueId
 * @returns {jsonObject}
 *  - 성공: 200
 */
export const fetchLabelMilestoneCountData = async () => {
    const accessToken = getAccessToken();
    try {
        // await delay(2000);
        const response = await fetch(`${import.meta.env.VITE_TEAM_SERVER}${HOME_DEFAULT_API_URI}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                credentials: 'include',
            },
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        if (response.status === 200 || response.status === 201) {
            return await response.json();
        }
    } catch (error) {
        throw error;
    }
};
/**
 * 레이블 조회
 * @param {*String} issueId
 * @returns {jsonObject}
 */
export const fetchLabelDetailData = async () => {
    const accessToken = getAccessToken();
    try {
        // await delay(2000);
        const response = await fetch(`${import.meta.env.VITE_TEAM_SERVER}${LABEL_DEFAULT_API_URI}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                credentials: 'include',
            },
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        if (response.status === 200 || response.status === 201) {
            return await response.json();
        }
    } catch (error) {
        throw error;
    }
};

/**
 * 레이블 수정
 * @param {*String} name 
 * @param {*String} descriptionParam 없을 경우 null
 * @param {*String} textColor 
 * @param {*String} bgColor 
 * @param {*String} labelId 
 * @returns 
 *  - 성공: 200
    - 데이터 바인딩(즉, 이름이나 배경 색깔이 비어져서 왔을 때) 실패: 400
    - 유효하지 않은 배경 색깔: 400
    - 존재하지 않는 라벨 아이디: 404
 */
export const fetchModifyLabel = async (name, descriptionParam, textColor, bgColor, labelId) => {
    const accessToken = getAccessToken();
    const description = descriptionParam || null;
    try {
        const response = await fetch(`${import.meta.env.VITE_TEAM_SERVER}${LABEL_DEFAULT_API_URI}/${labelId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
                'credentials': 'include',
            },
            body: JSON.stringify({ name, description, textColor, bgColor }),
        });
        const result = await response.json();

        if (response.status === 400 || response.status === 404 || response.status === 409) {
            throw new Error({ code: response.status, result });
        }

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        if (response.status === 200 || response.status === 201) {
            return result;
        }
    } catch (error) {
        throw error;
    }
};

/**
 * 레이블 삭제
 * @param {*String} labelId 
 * @returns 
- 성공: 200
- 존재하지 않는 라벨 아이디: 404
 */
export const fetchDeleteLabel = async (labelId) => {
    const accessToken = getAccessToken();
    try {
        const response = await fetch(`${import.meta.env.VITE_TEAM_SERVER}${LABEL_DEFAULT_API_URI}/${labelId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
                'credentials': 'include',
            },
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        return {
            status: response.status,
            statusText: response.statusText,
        };
    } catch (error) {
        throw error;
    }
};

/**
 * 새로운 레이블 생성
 * @param {*String} name 
 * @param {*String} descriptionParam 없을 경우 null
 * @param {*String} textColor 
 * @param {*String} bgColor 
 * @returns 
 *  - 성공: 201 
    - 데이터 바인딩(즉, 이름이나 배경 색깔이 비어져서 왔을 때) 실패: 400 
    - 유효하지 않은 배경 색깔: 400 
    - 라벨 이름 중복: 409 
 */
export const fetchCreateNewLabel = async (name, descriptionParam, textColor, bgColor) => {
    const accessToken = getAccessToken();
    const description = descriptionParam || null;
    try {
        const response = await fetch(`${import.meta.env.VITE_TEAM_SERVER}${LABEL_DEFAULT_API_URI}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
                'credentials': 'include',
            },
            body: JSON.stringify({ name, description, textColor, bgColor }),
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        if (response.status === 200 || response.status === 201) {
            return await response.json();
        }
    } catch (error) {
        throw error;
    }
};
