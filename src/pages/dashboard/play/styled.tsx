import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

export const FlipCardStyled = styled.div`
  height: 100%;
  min-height: 90vh;
  display: flex;
  flex-direction: column;
  justify-content: center;

  .card {
    perspective: 1000px;
    position: relative;
    z-index: 15;
    width: 100%;

    animation: ${fadeIn} 0.5s ease-in-out;

    .card-content {
      max-width: 700px;
      min-height: 300px;
      width: 100%;
      margin: 0 auto;
      position: relative;
      transform-style: preserve-3d;
      transition: transform 1s;

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
      position: absolute;
      top: 10px;
      right: 10px;
      gap: 10px;
    }

    .play-button {
      position: absolute;
      right: 10px;
      bottom: 10px;
    }

    .message {
      width: 100%;
      position: absolute;
      display: flex;
      justify-content: center;
      bottom: 10px;
      left: 0;
    }

    .card-back {
      transform: rotateY(180deg);
    }
  }

  .actions {
    max-width: 700px;
    width: 100%;
    margin: 0 auto;
    margin-top: 15px;

    button {
      flex: 1;
      width: 100%;
      display: flex;
      height: 50px;
      flex-direction: column;
      align-items: center;
      svg {
        width: 30px;
        height: 30px;
      }
    }
  }

  @media (max-width: 768px) {
    .desctop-element {
      display: none !important;
    }
  }
`;
