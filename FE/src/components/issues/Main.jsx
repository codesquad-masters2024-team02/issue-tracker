import { Button, Input, Checkbox, Select, Skeleton } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import IssueList from './IssueList';
import DropDownFilter from './DropDownFilter';
import { useFilterContext } from '../../context/FilterContext';
import NavStateType from './NavStateType';
import NavFilterType from './NavFilterType';
import { MainContainer } from '../../styles/theme';
import { TagsOutlined, PlusOutlined } from '@ant-design/icons';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useLabelsFilter, useMembersFilter, useMilestonesFilter } from '../../hooks/useFiltersData';
import { usefilteredIssueData } from '../../hooks/usefilteredIssueData';
import ClipLoader from 'react-spinners/ClipLoader';
import { useLabelMilestoneCountData } from '../../hooks/useLabelData';
import { CustomButton } from '../../assets/CustomButton';
import { IconMilestone } from '../../assets/icons/IconMilestone';

const stateModifyFilters = [{ title: '선택한 이슈' }];

const mainIssueFilters = [
    { title: '열린 이슈', value: 'is:open' },
    { title: '내가 작성한 이슈', value: 'author:@me' },
    { title: '나에게 할당된 이슈', value: 'assignee:@me' },
    { title: '내가 댓글을 남긴 이슈', value: 'mentions:@me' },
    { title: '닫힌 이슈', value: 'is:closed' },
];

const dispatchTypeByFilterContents = {
    'is:open': 'SET_SELECTED_IS_OPEN_FILTER',
    'is:closed': 'SET_SELECTED_IS_CLOSED_FILTER',
    'assignee:@me': 'SET_SELECTED_ASSIGNEE_ME_FILTER',
    'mentions:@me': 'SET_SELECTED_MENTIONS_ME_FILTER',
    'author:@me': 'SET_SELECTED_AUTHOR_ME_FILTER',
};

const issueFilters = {
    isOpen: 'is:open',
    isClosed: 'is:closed',
    authorMe: 'author:@me',
    assigneeMe: 'assignee:@me',
    mentionsMe: 'mentions:@me',
};
const initFilterItems = {
    labels: [],
    members: [],
    milestones: [],
};
const initIssueDatas = {
    count: {
        isOpen: 0,
        isClosed: 0,
    },
    list: [],
};
const initFetched = {
    assignee: false,
    label: false,
    milestone: false,
    author: false, //작성자
};
const resetListData = { id: null, title: null, createDate: null, milestoneName: null, author: null, assignees: null, labels: null };

export default function Main() {
    const navigate = useNavigate();
    const { state: selectedFilters, dispatch } = useFilterContext();
    const [inputFilter, setInputFilter] = useState('');
    const [isClearFilter, setIsClearFilter] = useState(false);
    const [checkedItems, setCheckedItems] = useState([]);
    const [filterItemsByType, setFilterItemsByType] = useState(initFilterItems);
    const [issueDatas, setIssueDatas] = useState(initIssueDatas);
    const [hasFetched, setHasFetched] = useState(initFetched);
    const [labelCount, setLabelCount] = useState(0);
    const [milestoneCount, setMilestoneCount] = useState(0);

    const { data: countData } = useLabelMilestoneCountData();
    const { data: issueList, isLoading: issueListIsLoading } = usefilteredIssueData();
    const { data: labelsFilter, isLoading: labelsFilterIsLoading } = useLabelsFilter({ enabled: hasFetched.label });
    const { data: milestonesFilter, isLoading: milestonesFilterIsLoading } = useMilestonesFilter({ enabled: hasFetched.milestone });
    const { data: membersFilter, isLoading: membersFilterIsLoading } = useMembersFilter({ enabled: hasFetched.assignee });

    const clearFilter = () => dispatch({ type: 'SET_CLEAR_FILTER', payload: '' });

    const isFilterActive = () => {
        const selectedLists = filterSelectedLists(selectedFilters);
        if (selectedLists.length === 2 && selectedLists.includes('is:open')) return false;
        return true;
    };

    const filterSelectedLists = (selectedFilters) => {
        const filters = ['is:issue'];

        if (!selectedFilters || Object.keys(selectedFilters).length === 0) return;

        // 1. 이슈 필터 처리
        const issues = selectedFilters.issues || {};
        const issueEntries = Object.entries(issues);
        const hasNotNullValue = issueEntries.some(([key, value]) => value !== null);

        if (hasNotNullValue) issueEntries.filter(([key, value]) => value !== null).forEach(([key, value]) => filters.push(issueFilters[key]));
        else filters.push(issueFilters['isOpen']);

        // 2. 나머지 필터 처리
        Object.entries(selectedFilters)
            .filter(([key, value]) => value !== null && key !== 'issues')
            .forEach(([key, value]) => filters.push(`${key}:"${value}"`));

        return filters;
    };

    const toggleEntireCheckBox = () => {
        if (!issueList) return;
        if (checkedItems.length === issueList.filteredIssues.length) setCheckedItems([]);
        else setCheckedItems(issueList.filteredIssues.map(({ id }) => id));
    };

    const isSingleChecked = (key) => {
        return checkedItems.includes(key);
    };

    const setterFechedByType = {
        assignee: () => setHasFetched((prev) => ({ ...prev, assignee: true })),
        label: () => setHasFetched((prev) => ({ ...prev, label: true })),
        milestone: () => setHasFetched((prev) => ({ ...prev, milestone: true })),
        author: () => setHasFetched((prev) => ({ ...prev, author: true })),
    };
    const queryClient = useQueryClient();
    const useQueryByType = {
        assignee: () => queryClient.invalidateQueries({ queryKey: ['filter', 'members'], refetchType: 'active' }), //담당자
        label: () => queryClient.invalidateQueries({ queryKey: ['filter', 'labels'], refetchType: 'active' }),
        milestone: () => queryClient.invalidateQueries({ queryKey: ['filter', 'milestones'], refetchType: 'active' }),
        author: () => queryClient.invalidateQueries({ queryKey: ['filter', 'members'], refetchType: 'active' }), //작성자
    };

    const handleMouseEnter = (type) => {
        if (!hasFetched[type]) {
            useQueryByType[type](); // 마우스를 올렸을 때 쿼리 실행
            setterFechedByType[type](); //상태 업데이트
        }
    };

    useEffect(() => {
        setInputFilter(filterSelectedLists(selectedFilters).join(' '));
        setIsClearFilter(isFilterActive());
        queryClient.invalidateQueries({ queryKey: ['issue_list'], refetchType: 'active' });
    }, [selectedFilters]);

    useEffect(() => {
        if (!labelsFilter) return;
        const labelItems = labelsFilter.labels.map(({ name, bgColor, textColor }) => ({
            labelName: name,
            labelColor: bgColor,
            textColor: textColor,
        }));

        setFilterItemsByType((prev) => ({
            ...prev,
            labels: labelItems,
        }));
    }, [labelsFilter]);

    useEffect(() => {
        if (!milestonesFilter) return;
        const milestoneItems = milestonesFilter.milestoneDetailDtos.map(({ name }) => ({
            title: name,
        }));
        setFilterItemsByType((prev) => ({
            ...prev,
            milestones: milestoneItems,
        }));
    }, [milestonesFilter]);

    useEffect(() => {
        if (!membersFilter) return;
        const memberItems = membersFilter.map(({ id, imgUrl }) => ({
            avatarSrc: imgUrl,
            userName: id,
        }));

        setFilterItemsByType((prev) => ({
            ...prev,
            members: memberItems,
        }));
    }, [membersFilter]);

    useEffect(() => {
        if (!issueList) return;
        const issueListCount = issueList.count;
        const newIsOpenCount = issueListCount.openedIssueCount;
        const newIsClosedCount = issueListCount.closedIssueCount;

        const newIssueList = issueList.filteredIssues;
        setIssueDatas((prev) => ({ ...prev, count: { ...prev.count, isOpen: newIsOpenCount } }));
        setIssueDatas((prev) => ({ ...prev, count: { ...prev.count, isClosed: newIsClosedCount } }));
        setIssueDatas((prev) => ({ ...prev, list: newIssueList }));
    }, [issueList]);

    useEffect(() => {
        if (!countData) return;
        setLabelCount(countData.labelCount.count);
        setMilestoneCount(countData.milestoneCount.isOpened + countData.milestoneCount.isClosed);
    }, [countData]);

    return (
        <MainContainer>
            <StyledNav>
                <FlexRow>
                    <FlexRow className="inputFilter">
                        <IssueFilter>
                            <DropDownFilter
                                filterTitle={'issue'}
                                filterItems={mainIssueFilters}
                                dispatch={dispatch}
                                dispatchTypeByFilterContents={dispatchTypeByFilterContents}
                                checkedItems={checkedItems}
                                setCheckedItems={setCheckedItems}
                            >
                                필터
                            </DropDownFilter>
                        </IssueFilter>
                        <InputFilter value={inputFilter} onChange={(e) => setInputFilter(e.target.value)}></InputFilter>
                    </FlexRow>

                    <NavBtnContainer>
                        <StyledLabelBtn type={'outline'} size={'large'} isDisabled={false} onClick={() => navigate('/labels')}>
                            <TagsOutlined />
                            레이블({labelCount})
                        </StyledLabelBtn>
                        <StyledMilestoneBtn type={'outline'} size={'large'} isDisabled={false} onClick={() => navigate('/milestones')}>
                            <IconMilestone />
                            마일스톤({milestoneCount})
                        </StyledMilestoneBtn>

                        <StyledNewIssueBtn onClick={() => navigate('/issues/new')} size={'large'} isDisabled={false}>
                            <PlusOutlined />
                            이슈작성
                        </StyledNewIssueBtn>
                    </NavBtnContainer>
                </FlexRow>

                <div className={`clearBtn ${isClearFilter ? 'visible' : 'hidden'}`} style={{ visibility: isClearFilter ? 'visible' : 'hidden' }}>
                    <span onClick={clearFilter}>🧹 현재의 검색 필터 및 정렬 지우기</span>
                </div>
            </StyledNav>

            <StyledBox>
                <StyledBoxHeader>
                    <Checkbox
                        onClick={() => toggleEntireCheckBox()}
                        checked={checkedItems.length === issueList?.filteredIssues?.length}
                        className="checkbox"
                    />
                    {checkedItems.length > 0 ? (
                        <NavStateType
                            checkedItemsCount={checkedItems.length}
                            stateModifyFilters={stateModifyFilters}
                            dispatch={dispatch}
                            checkedItems={checkedItems}
                            setCheckedItems={setCheckedItems}
                        />
                    ) : (
                        <NavFilterType
                            issueCount={issueDatas.count}
                            dispatchTypeByFilterContents={dispatchTypeByFilterContents}
                            imageTypeItems={filterItemsByType.members}
                            labelTypeItems={filterItemsByType.labels}
                            milestoneTypeItems={filterItemsByType.milestones}
                            dispatch={dispatch}
                            ischecked={selectedFilters.issues.isClosed}
                            handleMouseEnter={handleMouseEnter}
                        />
                    )}
                </StyledBoxHeader>

                <StyledBoxBody>
                    {issueListIsLoading && (
                        <StyledLoader>
                            <ClipLoader color="#007AFF" />
                        </StyledLoader>
                    )}

                    {issueList &&
                        issueList.filteredIssues.map((list) => (
                            <IssueList
                                key={list.id}
                                isSingleChecked={isSingleChecked(list.id)}
                                setCheckedItems={setCheckedItems}
                                toggleEntireCheckBox={toggleEntireCheckBox}
                                listData={list}
                            />
                        ))}
                    {issueList?.filteredIssues.length === 0 && <IssueList isNoList={true} listData={resetListData} />}
                </StyledBoxBody>
            </StyledBox>
        </MainContainer>
    );
}

const StyledNewIssueBtn = styled(CustomButton)`
    width: 120px;
    font-size: 15px;
    font-weight: 500;
    color: #fff;
    margin-left: 10px;
`;

const StyledMilestoneBtn = styled(CustomButton)`
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    width: 130px;
    font-size: 15px;
    font-weight: 500;
`;
const StyledLabelBtn = styled(CustomButton)`
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    width: 130px;
    font-size: 15px;
    font-weight: 500;
`;

const StyledLoader = styled.div`
    height: 100px;
    align-content: center;
`;

const StyledBoxBody = styled.div`
    min-height: 80px;
    /* background-color: skyblue; */
`;

const StyledBoxHeader = styled.div`
    background-color: ${(props) => props.theme.listHeaderColor};
    display: flex;
    flex-direction: row;
    /* justify-content: space-between; */
    align-items: center;
    height: 60px;
    color: ${(props) => props.theme.fontColor};
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;

    & .click {
        cursor: pointer;
    }

    & .checkbox {
        margin-left: 30px;
    }

    & .issue {
        width: 200px;
    }
    & .issue.state {
        width: 145px;
    }
    & .filter {
        width: 385px;
    }
    & .filter.state {
        width: 135px;
    }

    & .issue .issueOption {
        margin-left: 10px;
    }
    & .filter .filterOption {
        margin-right: 20px;
    }

    & .checked {
        font-weight: bold;
    }
`;

const IssueFilter = styled.div`
    /* background-color: yellow; */
    width: 100px;
    height: 35px;
    border-top-left-radius: 6px;
    border-bottom-left-radius: 6px;
    border: 1px solid;
    border-color: ${(props) => props.theme.borderColor};
    align-content: center;
`;
const InputFilter = styled.input`
    width: 100%;
    height: 35px;
    border-top-right-radius: 6px;
    border-bottom-right-radius: 6px;
    border: 1px solid;
    border-left: none;
    border-color: ${(props) => props.theme.borderColor};
    background-color: ${(props) => props.theme.listHeaderColor};
    padding-left: 30px;
    padding-right: 15px;
    color: ${(props) => props.theme.fontColor};

    &::placeholder {
        color: ${(props) => props.theme.fontColor};
    }
`;

const StyledBox = styled.div`
    margin-top: 20px;
    width: 100%;
    min-height: 160px;
    border-radius: 6px;
    border: 1px solid;
    border-color: ${(props) => props.theme.borderColor};
    background-color: ${(props) => props.theme.bgColorBody};
    color: ${(props) => props.theme.fontColor};
`;

const StyledBtn = styled(Button)`
    margin-left: 10px;
`;

const FlexRow = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    & .inputFilter {
        flex-basis: 70%;
    }
`;

const StyledNav = styled.nav`
    margin-top: 30px;

    & .clearBtn {
        text-align: left;
        margin-top: 15px;
        font-size: 12px;
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.5s ease, visibility 0.5s ease;
    }
    & .clearBtn.visible {
        opacity: 1;
        visibility: visible;
    }

    & .clearBtn span {
        cursor: pointer;
    }
`;

const NavBtnContainer = styled(FlexRow)`
    justify-content: end;
    margin-left: 10px;

    & .createBtn {
        margin-left: 10px;
    }
    button {
        font-size: 16px;
    }
`;
