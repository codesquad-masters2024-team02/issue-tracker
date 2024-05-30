import React from 'react';
import Header from '../header/Header';
import { FlexRow, IndexContainer, MainContainer } from '../../styles/theme';
import { TagsOutlined, PlusOutlined } from '@ant-design/icons';
import { CustomButton } from '../../assets/CustomButton';
import { IconMilestone } from '../../assets/icons/IconMilestone';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

export default function MilestoneMain() {
    const naivgate = useNavigate();
    const clickMileStone = () => naivgate('/milestones');
    const clickLabel = () => naivgate('/labels');

    return (
        <IndexContainer>
            <Header />
            <MainContainer>
                <NavContainer>
                    <NavBtnContainer>
                        <StyledLabelBtn type={'container'} size={'large'} isDisabled={false} onClick={clickLabel}>
                            <TagsOutlined />
                            레이블(0)
                        </StyledLabelBtn>
                        <StyledMilestoneBtn type={'outline'} size={'large'} isDisabled={false} onClick={clickMileStone}>
                            <IconMilestone />
                            마일스톤(0)
                        </StyledMilestoneBtn>
                    </NavBtnContainer>
                    <CustomButton type={'container'} size={'large'} isDisabled={false}>
                        <PlusOutlined />
                        마일스톤 추가
                    </CustomButton>
                </NavContainer>
                🚧마일스톤 페이지 입니다🚧
            </MainContainer>
        </IndexContainer>
    );
}
const NavBtnContainer = styled(FlexRow)`
    justify-content: end;
    & .createBtn {
        margin-left: 10px;
    }
    button {
        font-size: 16px;
    }
`;
const StyledMilestoneBtn = styled(CustomButton)`
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    width: 150px;
`;
const StyledLabelBtn = styled(CustomButton)`
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    width: 150px;
`;
const NavContainer = styled(FlexRow)`
    justify-content: space-between;
    width: 100%;
    height: 70px;
    margin-bottom: 10px;
    button {
        font-size: 16px;
    }
`;
