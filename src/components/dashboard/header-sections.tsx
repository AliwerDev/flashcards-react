import styled from "@emotion/styled";
import { theme } from "antd";
import { useCallback, useRef } from "react";
import type { ThemeConfig } from "antd";

const MENU_ITEM_WIDTH = 200;
const GAP = 3;
const HEIGHT = 50;

const HeaderSections = () => {
  const bgEffectRef = useRef<HTMLDivElement>(null);

  const themeConfig: ThemeConfig = theme.useToken();

  const handleMouseEnter = useCallback(
    (index: number) => () => {
      if (!bgEffectRef.current) return;
      bgEffectRef.current.style.left = `${index * MENU_ITEM_WIDTH + GAP * (index + 1)}px`;
    },
    []
  );

  return (
    <Styled themeConfig={themeConfig}>
      <div className="menu">
        <div onMouseEnter={handleMouseEnter(0)} className="menu-item active">
          All
        </div>
        <div onMouseEnter={handleMouseEnter(1)} className="menu-item">
          Start Learn
        </div>
        <div onMouseEnter={handleMouseEnter(2)} className="menu-item">
          Cards list
        </div>
        <div ref={bgEffectRef} className="background-effect"></div>
      </div>
    </Styled>
  );
};

const Styled = styled.div<{ themeConfig: ThemeConfig }>`
  .menu {
    background-color: ${({ themeConfig }) => themeConfig.token?.colorBgContainer};
    height: ${HEIGHT}px;
    display: flex;
    padding: ${GAP}px;
    gap: ${GAP / 2}px;
    border-radius: ${HEIGHT / 2}px;
    position: relative;

    &:hover {
      .background-effect {
        background-color: ${({ themeConfig }) => themeConfig.token?.colorPrimary}50;
      }
    }

    &-item {
      height: 100%;
      width: ${MENU_ITEM_WIDTH}px;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: ${HEIGHT / 2}px;
      cursor: pointer;

      &.active {
        background-color: ${({ themeConfig }) => themeConfig.token?.colorPrimary};
        color: white;
      }
    }

    .background-effect {
      content: "";
      width: ${MENU_ITEM_WIDTH}px;
      height: ${HEIGHT - 2 * GAP}px;
      background-color: transparent;
      border-radius: ${HEIGHT / 2}px;
      position: absolute;
      top: ${GAP}px;
      left: ${GAP}px;
      transition: background-color 0.2s ease-in-out, left 0.3s ease-in-out;
    }
  }
`;

export default HeaderSections;
