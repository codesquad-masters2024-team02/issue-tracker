import { getAccessToken } from '../utils/userUtils';

const LABELS_API_URI = '/api/labels';
const MEMBERS_API_URI = '/api/members';
const MILESTONES_API_URI = '/api/milestones?isClosed=';
const ISSUE_LIST_API_URI = '/api/home/issues';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
/**
 * 레이블 리스트 조회
 * @returns {jsonObject}
 */
export const fetchLabelsData = async () => {
    const accessToken = getAccessToken();
    try {
        const response = await fetch(`${import.meta.env.VITE_TEAM_SERVER}${LABELS_API_URI}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                credentials: 'include',
            },
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        if (response.status === 200) {
            return await response.json();
        }
    } catch (error) {
        throw error;
    }
};
/**
 * 유저 리스트 조회
 * @returns {jsonObject}
 */
export const fetchMembersData = async () => {
    const accessToken = getAccessToken();
    try {
        const response = await fetch(`${import.meta.env.VITE_TEAM_SERVER}${MEMBERS_API_URI}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                credentials: 'include',
            },
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        if (response.status === 200) {
            return await response.json();
        }
    } catch (error) {
        throw error;
    }
};

/**
 * 마일스톤 리스트 조회
 * @param {*Boolean} isClosed
 * @returns {jsonObject}
 */
export const fetchMilestonesData = async (isClosed) => {
    const accessToken = getAccessToken();
    try {
        // await delay(5000);

        const response = await fetch(`${import.meta.env.VITE_TEAM_SERVER}${MILESTONES_API_URI}${isClosed}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                credentials: 'include',
            },
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        if (response.status === 200) {
            return await response.json();
        }
    } catch (error) {
        throw error;
    }
};

/**
 * 이슈 리스트 조회
 * @param {*Boolean} isClosedParam
 * @param {*String} authorIdParam
 * @param {*String} assigneeIdParam
 * @param {*Array} noValuesParam
 * @param {*String} userId
 * @returns {jsonObject}
 */

export const fetchIssueListData = async (isClosedParam, authorIdParam, assigneeIdParam, labelIdParam, milestoneNameParam, noValuesParam) => {
    const accessToken = getAccessToken();
    const isClosed = isClosedParam ?? '';
    const authorId = authorIdParam ?? '';
    const assigneeId = assigneeIdParam ?? '';
    const labelName = labelIdParam ?? '';
    const noValues = noValuesParam ?? '';

    try {
        // await delay(2000);
        const response = await fetch(
            `${
                import.meta.env.VITE_TEAM_SERVER
            }${ISSUE_LIST_API_URI}?isClosed=${isClosed}&authorId=${authorId}&assigneeId=${assigneeId}&labelName=${labelName}&milestoneName=${milestoneNameParam}&noValues=${noValues}`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    credentials: 'include',
                    Origin: 'https://issue-tracker.site',
                },
            }
        );
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        if (response.status === 200) {
            return await response.json();
        }
    } catch (error) {
        throw error;
    }
};
