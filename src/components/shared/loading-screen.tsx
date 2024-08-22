import { Image, theme } from "antd";
import { keyframes } from "@emotion/react";
import styled from "@emotion/styled";
import logo from "src/assets/logo/flashcards.svg";
import logoCard from "src/assets/logo/card.png";

const cardAnimation = keyframes`
  0% {
    transform: translate(0, 0) scale(1);
  }
  40% {
    transform: translate(-6px, -6px) scale(1.2) rotate(0);
  }
  60% {
    transform: translate(-6px, -6px) scale(1.2) rotate(90deg);
  }
  100% {
    transform: translate(0, 0) scale(1)  rotate(180deg);
  }
`;

const cardAnimation2 = keyframes`
  0% {
    transform: translate(0, 0) scale(1);
  }
  40% {
    transform: translate(6px, 6px) scale(1.2) rotate(0);
  }
  60% {
    transform: translate(6px, 6px) scale(1.2) rotate(-90deg);
  }
  100% {
    transform: translate(0, 0) scale(1)  rotate(-180deg);
  }
`;

const Styled = styled.div`
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;

  .logo {
    display: flex;
    gap: 16px;
  }

  .logo-cards {
    width: 30px;
    height: 30px;
    position: relative;

    img {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;

      &:first-child {
        animation: 1.5s ${cardAnimation} linear infinite;
      }

      &:last-child {
        animation: 1.5s ${cardAnimation2} linear infinite;
      }
    }
  }
`;

export const SplashScreen = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  return (
    <Styled style={{ backgroundColor: colorBgContainer }}>
      <div className="logo">
        <div className="logo-cards">
          <img src={logoCard} className="logo-cards-item" />
          <img src={logoCard} className="logo-cards-item" />
        </div>
        <Image width={250} preview={false} src={logo} alt="flashcards" />
      </div>
    </Styled>
  );
};
