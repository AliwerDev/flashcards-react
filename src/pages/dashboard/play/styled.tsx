import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.95) translateY(20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
`;

export const FlipCardStyled = styled.div`
  height: 100%;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow: hidden;

  .card {
    perspective: 1000px;
    position: relative;
    z-index: 15;
    width: 100%;

    .card-content {
      max-width: 400px;
      min-height: 450px;
      width: 100%;
      margin: 0 auto;
      transform-style: preserve-3d;
      transition: transform 1s;
      animation: ${fadeIn} 0.3s ease-in-out;
      border-radius: 10px;

      &.show {
        transform: rotateY(180deg);
      }
    }

    .card-front,
    .card-back {
      position: absolute;
      width: 100%;
      height: 100%;
      backface-visibility: hidden;
      display: flex;
      justify-content: center;
      align-items: center;

      h5 {
        text-align: center;
        padding-inline: 10px;
      }
    }

    .edit-button {
      width: 100%;
      max-width: 400px;
      position: absolute;
      top: -30px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 10px;
    }

    .play-button {
      position: absolute;
      right: 10px;
      bottom: 10px;
    }

    .card-back {
      transform: rotateY(180deg);
    }
  }

  .actions {
    max-width: 400px;
    width: 100%;
    margin: 0 auto;
    margin-top: 15px;

    button {
      flex: 1;
      width: 100%;
      height: 45px;
      border-radius: 10px;
      animation: ${fadeIn} 0.3s ease-in-out;

      svg {
        width: 20px;
        height: 20px;
      }
    }
  }

  .progress {
    position: absolute;
    left: 0;
    top: -10px;
    .ant-progress-inner,
    .ant-progress-bg {
      border-radius: 0;
    }
  }

  @media (max-width: 768px) {
    .desctop-element {
      display: none !important;
    }
  }
`;
