import { getAccessToken } from '../utils/userUtils';

const ISSUE_DEFAULT_API_URI = '/api/issues';
const ISSUE_COMMENTS_DEFAULT_API_URI = '/api/comments';
const ISSUE_DEFAULT_FILE_URI = '/api/files';

/**
 * 이슈 상세 조회
 * @param {*String} issueId
 * @returns {jsonObject}
 */
export const fetchIssueDetailData = async (issueId) => {
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    const accessToken = getAccessToken();
    try {
        // await delay(2000);
        const response = await fetch(`${import.meta.env.VITE_TEAM_SERVER}${ISSUE_DEFAULT_API_URI}/${issueId}`, {
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
 * 이슈 열고 닫기
 * @param {*Boolean} toIssueState - 닫기:true, 열기:false
 * @param {*Array} issueIds - 이슈 id들
 * @returns {}
 */
export const fetchIssueStateToggle = async (toIssueState, issueIds) => {
    const accessToken = getAccessToken();
    try {
        const response = await fetch(`${import.meta.env.VITE_TEAM_SERVER}${ISSUE_DEFAULT_API_URI}/${toIssueState ? 'close' : 'open'}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
                'credentials': 'include',
            },
            body: JSON.stringify({ issueIds }),
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
 * 이슈 삭제
 * @param {*Number} issueId - 이슈 아이디
 * @returns {}
 *  - 성공: 200
    - 아이디 미존재시 : 404
    - 바인딩 에러시: 400
    - 서버 내부 오류시: 500
 
 */
export const fetchDeleteIssue = async (issueId) => {
    const accessToken = getAccessToken();
    try {
        const response = await fetch(`${import.meta.env.VITE_TEAM_SERVER}${ISSUE_DEFAULT_API_URI}/${issueId}`, {
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
 * 이슈 제목 수정
 * @param {*String} title - 수정하는 제목
 * @param {*Number} issueId - 이슈 id
 * @returns 
 *  - 성공: 200
    - 아이디 미존재시 : 404
    - 바인딩 에러시: 400
    - 서버 내부 오류시: 500
 */
export const fetchModifyIssueTitle = async (title, issueId) => {
    const accessToken = getAccessToken();
    try {
        const response = await fetch(`${import.meta.env.VITE_TEAM_SERVER}${ISSUE_DEFAULT_API_URI}/${issueId}/title`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
                'credentials': 'include',
            },
            body: JSON.stringify({ title }),
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
 * 이슈 본문 수정
 * @param {*String} content - 수정하는 제목
 * @param {*String} fileId - 파일아이디(없을 시 null)
 * @returns 
 *  - 성공: 200
    - 아이디 미존재시 : 404
    - 바인딩 에러시: 400
    - 서버 내부 오류시: 500
 */
export const fetchModifyIssueContent = async (content, fileId, issueId) => {
    const accessToken = getAccessToken();
    try {
        const response = await fetch(`${import.meta.env.VITE_TEAM_SERVER}${ISSUE_DEFAULT_API_URI}/${issueId}/body`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
                'credentials': 'include',
            },
            body: JSON.stringify({ content, fileId }),
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
 * 이슈 댓글 수정
 * @param {*String} content - 수정하는 댓글내용
 * @param {*String} fileId - 파일아이디(없을 시 null)
 * @returns 
 *  - 성공: 200
    - 아이디 미존재시 : 404
    - 바인딩 에러시: 400
    - 서버 내부 오류시: 500
 */
export const fetchModifyIssueComment = async (content, fileId, commentId) => {
    const accessToken = getAccessToken();
    try {
        const response = await fetch(`${import.meta.env.VITE_TEAM_SERVER}${ISSUE_COMMENTS_DEFAULT_API_URI}/${commentId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
                'credentials': 'include',
            },
            body: JSON.stringify({ content, fileId }),
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
 * 이슈 댓글 생성
 * @param {*String} writerId - 작성자 아이디
 * @param {*String} content - 댓글내용
 * @param {*Number} issueId - 이슈 아이디
 * @param {*Number} fileId - 파일아이디(없을 시 null)
 * @returns 
 *  - 성공: 201
    - 바인딩 에러시: 400
    - 서버 내부 오류시: 500
 */
export const fetchCreateIssueComment = async (writerId, content, issueId, fileId) => {
    const accessToken = getAccessToken();
    try {
        const response = await fetch(`${import.meta.env.VITE_TEAM_SERVER}${ISSUE_COMMENTS_DEFAULT_API_URI}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
                'credentials': 'include',
            },
            body: JSON.stringify({ writerId, content, issueId, fileId }),
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
 * 이슈 댓글 삭제
 * @param {*Number} issueId - 이슈 아이디
 * @returns {}
 *  - 성공: 200
    - 아이디 미존재시 : 404
    - 바인딩 에러시: 400
    - 서버 내부 오류시: 500
 */
export const fetchDeleteComment = async (commentId) => {
    const accessToken = getAccessToken();
    try {
        const response = await fetch(`${import.meta.env.VITE_TEAM_SERVER}${ISSUE_COMMENTS_DEFAULT_API_URI}/${commentId}`, {
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
 * 이슈 레이블 수정
 * @param {*Number} issueId - 이슈 아이디
 * @param {*Array} labelIds - 수정하는 레이블 아이디들
 * @returns 
 *  - 성공: 200
    - 아이디 미존재시 : 404
    - 바인딩 에러시: 400
    - 서버 내부 오류시: 500
 */
export const fetchModifyIssueLabels = async (issueId, labelIds) => {
    const accessToken = getAccessToken();
    try {
        const response = await fetch(`${import.meta.env.VITE_TEAM_SERVER}${ISSUE_DEFAULT_API_URI}/${issueId}/label`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
                'credentials': 'include',
            },
            body: JSON.stringify({ labelIds }),
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
 * 이슈 담당자 수정
 * @param {*Number} issueId - 이슈 아이디
 * @param {*Array} assigneeIds - 수정하는 담당자 아이디들
 * @returns 
 *  - 성공: 200
    - 아이디 미존재시 : 404
    - 바인딩 에러시: 400
    - 서버 내부 오류시: 500
 */
export const fetchModifyIssueAssignees = async (issueId, assigneeIds) => {
    const accessToken = getAccessToken();
    try {
        const response = await fetch(`${import.meta.env.VITE_TEAM_SERVER}${ISSUE_DEFAULT_API_URI}/${issueId}/assignee`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
                'credentials': 'include',
            },
            body: JSON.stringify({ assigneeIds }),
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
 * 이슈 마일스톤 수정
 * @param {*Number} issueId - 이슈 아이디
 * @param {*String} milestoneId - 수정하는 마일스톤 아이디
 * @returns 
 *  - 성공: 200
    - 아이디 미존재시 : 404
    - 바인딩 에러시: 400
    - 서버 내부 오류시: 500
 */
export const fetchModifyIssueMilestone = async (issueId, milestoneId) => {
    const accessToken = getAccessToken();
    try {
        const response = await fetch(`${import.meta.env.VITE_TEAM_SERVER}${ISSUE_DEFAULT_API_URI}/${issueId}/milestone`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
                'credentials': 'include',
            },
            body: JSON.stringify({ milestoneId }),
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
 * 이슈 파일 등록
 * @param {*} formData - formData
 * @returns 
 *  - 성공: 200
    - 파일 형식 미지원시: 415
    - 바인딩 에러시: 400
    - 서버 내부 오류시: 500
 */
//TODO: 파일 형식 미지원 시 에러 처리
export const fetchUploadFile = async (formData) => {
    const accessToken = getAccessToken();
    try {
        const response = await fetch(`${import.meta.env.VITE_TEAM_SERVER}${ISSUE_DEFAULT_FILE_URI}`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                credentials: 'include',
            },
            body: formData,
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
 * 새로운 이슈 생성
 * @param {*String} title - 제목
 * @param {*String} content - 내용
 * @param {*String} authorId - 작성자 
 * @param {*String} milestoneId - 마일스톤 아이디
 * @param {*String} fileId - 파일아이디(없을 시 null)
 * @param {*Array} labelIds - 레이블 아이디(없을 시 [])
 * @param {*Array} assigneeIds - 담당자 아이디(없을 시 [])
 * @returns {*jsonObject}
*   - 성공: 200
    - 바인딩 에러시: 400
    - 서버 내부 오류시: 500
 */
export const fetchCreateNewIssue = async (title, content, authorId, milestoneId, fileIdParam, labelIds, assigneeIds) => {
    const accessToken = getAccessToken();
    const fileId = fileIdParam || null;
    try {
        const response = await fetch(`${import.meta.env.VITE_TEAM_SERVER}${ISSUE_DEFAULT_API_URI}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
                'credentials': 'include',
            },
            body: JSON.stringify({ title, content, authorId, milestoneId, fileId, labelIds, assigneeIds }),
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        if (response.status === 200 || response.status === 201) {
            return await response.json();
        }
    } catch (error) {
        throw error;
    }
};
