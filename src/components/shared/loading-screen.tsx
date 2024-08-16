import { Spin, theme } from "antd";


export const SplashScreen = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  return (
    <div style={{ backgroundColor: colorBgContainer }} className="h-screen flex justify-center items-center">
      <Spin size="large" />
    </div>
  );
};
