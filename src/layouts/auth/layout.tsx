import { ReactNode } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Image, theme } from "antd";
import FireFlies from "src/components/animations/firefly";
import styled from "@emotion/styled";
import { GOOGLE_CLIENT_ID } from "src/config-global";
import logo from "src/assets/logo/flashcards1.svg";

type AuthLayoutProps = {
  children: ReactNode;
};

export default function AuthLayout({ children }: AuthLayoutProps) {
  const {
    token: { colorBgContainer, colorBgLayout, colorText },
  } = theme.useToken();

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID as string}>
      <Styled bg={colorBgLayout} smBg={colorBgContainer}>
        <div style={{ background: colorBgContainer, color: colorText }} className="rounded-lg sm:max-w-md w-full p-3 sm:p-5 md:p-8 sm:shadow-md">
          <div className="absolute bottom-4 left-0 w-full flex justify-center">
            <Image preview={false} className="max-h-10 min-h-10" src={logo} alt="flashcards" height={40} width={200} />
          </div>
          {children}
        </div>
      </Styled>
      <FireFlies />
    </GoogleOAuthProvider>
  );
}

const Styled = styled.div<{ bg: string; smBg: string }>`
  background: ${({ bg }) => bg};
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;

  @media screen and (max-width: 639px) {
    background: ${({ smBg }) => smBg};
    align-items: flex-start;
    padding-top: 150px;
  }
`;
