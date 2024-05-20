import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../header/Header';
import { IndexContainer, StyledInput } from '../../styles/theme';
import styled from 'styled-components';
import { MainContainer } from '../../styles/theme';
import { Button } from 'antd';
import { IconAlertCircle } from '../../assets/icons/IconAlertCircle';
import IssueDetailTitle from './IssueDetailTitle';
import IssueDetailComment from './IssueDetailComment';
import mockData from '../../data/issueDetail.json';

export default function IssueDetail() {
    let { id } = useParams();

    const [editState, setEditState] = useState(false);
    const toggleEditState = () => {
        setEditState((prev) => !prev);
    };

    return (
        <StyledDetailContainer>
            <Header />
            <MainContainer>
                <TitleContainer className="title">
                    <HeaderShow>
                        <IssueDetailTitle editState={editState} toggleEditState={toggleEditState}></IssueDetailTitle>

                        <HeaderSummary>
                            <StyledIssueState>
                                <IconAlertCircle />
                                <span>열린 이슈</span>
                            </StyledIssueState>
                            <div>
                                <span>
                                    이 이슈가 3분전에 <b>woody</b>님에 의해서 열렸습니다.
                                </span>
                                <span>💭</span>
                                <span>코멘트 1개</span>
                            </div>
                        </HeaderSummary>
                    </HeaderShow>
                </TitleContainer>

                <ContentsContainer>
                    <StyledComments>
                        <IssueDetailComment detailData={mockData} />
                        <IssueDetailComment />
                        <IssueDetailComment />
                    </StyledComments>
                    <Filters>
                        <Filter>담당자</Filter>
                        <Filter>레이블</Filter>
                        <Filter>마일스톤</Filter>
                        이슈삭제
                    </Filters>
                </ContentsContainer>
            </MainContainer>
        </StyledDetailContainer>
    );
}

const StyledComments = styled.div`
    width: 700px;
    min-height: 200px;
    background-color: azure;
    display: flex;
    flex-direction: column;
    justify-content: baseline;
    align-items: center;
`;

const StyledDetailContainer = styled(IndexContainer)`
    .title {
        position: relative;
    }
    .title::after {
        content: '';
        position: absolute;
        width: 100%;
        height: 1px;
        left: 0;
        bottom: 0;
        background-color: ${(props) => props.theme.borderColor};
    }
`;
const StyledIssueState = styled.div`
    background-color: var(--primary-color);
    color: var(--font-color);
    height: 30px;
    width: 100px;
    border: 1px solid var(--font-color);
    border-radius: 20px;
    align-content: center;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
`;

const HeaderSummary = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-top: 15px;
    span {
        margin-left: 5px;
    }
`;

const HeaderShow = styled.div`
    & h1 {
        font-size: 32px;
        font-weight: 700;
    }
    & .issueId {
        margin-left: 10px;
        color: #6e7191;
    }
`;

const TitleContainer = styled.div`
    width: 100%;
    height: 100px;
    /* background-color: antiquewhite; */
`;
const ContentsContainer = styled.div`
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 700px;
    /* background-color: aquamarine; */
`;
const Filters = styled.div`
    width: 200px;
    height: 200px;
    /* background-color: beige; */
`;
const Filter = styled.div`
    width: 90%;
    min-height: 100px;
    margin-bottom: 10px;
    /* background-color: #fff; */
`;
