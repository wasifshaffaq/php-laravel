import styled from "styled-components";
import Base from "./Base";

const Container = styled.div`
  display: flex;
  flex-direction: row;
  padding: 15px 25px;
  border-radius: 100px;
  border: 1px solid #fff;
  color: #fff;
  justify-content: center;
  align-items: center;
  width: 200px;
  font-size: 21px;
  cursor: pointer;

  border-radius: 10px;
  transform: skewX(150deg);
  transition: 0.25s ease-in-out;

  &:hover {
    transform: skewX(200deg);
    background-color: rgba(255, 255, 255, 0.2);
  }
`;

export default function Button({ children, onClick }) {
  return <Container onClick={onClick}>{children}</Container>;
}
