import styled from "styled-components";

export const PageHeader = styled.div`
  display: flex;
  margin-bottom: 20px;
  padding-left: 16px;

  h1 {
    margin-bottom: 8px;
    margin-right: 20px;
    font-size: 26px;
  }
`;

export const ActiveFilters = styled.div`
  display: flex;
  flex-direction: row;
  gap: 4px;
`;

export const PageControlBar = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
`;
