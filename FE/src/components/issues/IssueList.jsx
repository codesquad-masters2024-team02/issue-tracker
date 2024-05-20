import { Checkbox } from 'antd';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { IconMilestone } from '../../assets/icons/IconMilestone';

export default function IssueList({ isSingleChecked, setCheckedItems, listData }) {
    const { id, title, createDate, milestoneName, authorId, assignees, labels } = listData;
    const [pastTime, setPastTime] = useState('');
    const navigate = useNavigate();

    const toggleCheckBox = () => {
        if (isSingleChecked) setCheckedItems((prev) => prev.filter((item) => item !== id));
        else setCheckedItems((prev) => [...prev, id]);
    };

    const calculatePastTime = () => {
        const registerDate = new Date(createDate);
        const diffDate = Math.abs(new Date() - registerDate);
        const diffMiniutes = Math.floor(diffDate / (1000 * 60));
        const diffHours = Math.floor(diffDate / (1000 * 60 * 60));
        const diffDays = Math.floor(diffDate / (1000 * 60 * 60 * 24));

        if (diffDays >= 1) return `${diffDays}일 전`;
        if (diffHours >= 1) return `${diffHours}시간 전`;
        return diffMiniutes >= 1 ? `${diffMiniutes}분 전` : `방금 전`;
    };

    useEffect(() => {
        setPastTime(calculatePastTime());

        const intervalPerTime = () => {
            setInterval(() => {
                setPastTime(calculatePastTime());
            }, 1000 * 60);
        };

        return () => clearInterval(intervalPerTime);
    }, [createDate]);

    return (
        <ListContainer id={id}>
            <ListTitle>
                <Checkbox onClick={toggleCheckBox} checked={isSingleChecked} />
                <ListBody>
                    <div className="titleContainer">
                        <span className="title" onClick={() => navigate(`/issues/${id}`)}>
                            ! {title}
                        </span>
                        {labels &&
                            labels.map(({ name, bgColor, textColor }) => (
                                <StyledLabel key={name} style={{ backgroundColor: bgColor, color: textColor }}>
                                    {name}
                                </StyledLabel>
                            ))}
                    </div>
                    <div>
                        <span>#{id}</span>
                        <span>
                            이 이슈가 {pastTime}, {authorId || ''}님에 의해 작성되었습니다.
                        </span>

                        <span>
                            {/* <IconMilestone /> */}
                            {milestoneName || ''}
                        </span>
                    </div>
                </ListBody>
            </ListTitle>

            <StyledProfile>
                {assignees && assignees.map(({ id, imgUrl }) => <CustomProfile key={id} src={imgUrl} size={'medium'} alt="assigneeProfile" />)}
            </StyledProfile>
        </ListContainer>
    );
}

const ListBody = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-left: 20px;

    .titleContainer {
        margin-bottom: 20px;
    }

    .title {
        font-weight: bold;
        cursor: pointer;
    }
    & span {
        margin-left: 10px;
    }
`;

const StyledIconMilestone = styled(IconMilestone)``;
const ListTitle = styled.div`
    display: flex;
    flex-direction: row;
    margin-left: 30px;
    align-items: baseline;
`;
const ListContainer = styled.div`
    height: 80px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;

    border-top: 1px solid;
    border-color: ${(props) => props.theme.borderColor};
`;

const StyledProfile = styled.span`
    margin-right: 30px;

    & img {
        border-radius: 50%;
        width: 25px;
        height: 25px;
        object-fit: cover;
    }
`;

const StyledLabel = styled.span`
    display: inline-block;
    align-content: center;
    margin-left: 10px;
    min-width: 20px;
    height: 23px;
    padding: 2px 10px;
    border-radius: 25px;
    border: 1px solid;
    border-color: ${(props) => props.theme.borderColor};
    font-size: 15px;
`;
