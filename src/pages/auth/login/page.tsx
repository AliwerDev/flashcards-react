import { Form, Input, Button, Divider, message } from "antd";
import { LuUser, LuLock } from "react-icons/lu";
import { paths } from "src/routes/paths";
import { useAuthContext } from "src/auth/hooks";
import { useGoogleLogin, useGoogleOneTapLogin, googleLogout } from "@react-oauth/google";
import { useBoolean } from "src/hooks/use-boolean";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { LoginDataType } from "src/auth/types";
import GoogleLogo from "src/assets/icons/ic_google.svg";

export default function LoginPage() {
  const { t } = useTranslation();
  const { login, loginByGoogle } = useAuthContext();
  const loadingBool = useBoolean();

  const onFinish = (values: LoginDataType) => {
    loadingBool.onTrue();
    login(values).finally(() => loadingBool.onFalse());
  };

  const loginWithgoogle = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      loadingBool.onTrue();
      googleLogout();
      loginByGoogle({ access_token: tokenResponse.access_token as string }).finally(() => {
        loadingBool.onFalse();
      });
    },
    onError: () => {
      message.error("Login Failed");
    },
  });

  useGoogleOneTapLogin({
    onSuccess: (credentialResponse) => {
      loadingBool.onTrue();
      googleLogout();
      loginByGoogle({ credential: credentialResponse.credential as string }).finally(() => {
        loadingBool.onFalse();
      });
    },
    onError: () => {
      message.error("Login Failed");
    },
  });

  return (
    <>
      <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
      <Form name="login" className="login-form" onFinish={onFinish}>
        <Form.Item
          name="email"
          rules={[
            {
              required: true,
              message: "Please input your Email!",
            },
          ]}
        >
          <Input size="large" prefix={<LuUser />} placeholder="Email" type="email" className="w-full p-2 border rounded" />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: "Please input your Password!",
            },
          ]}
        >
          <Input size="large" prefix={<LuLock />} type="password" placeholder="Password" className="w-full p-2 border rounded" />
        </Form.Item>

        <Form.Item>
          <Button size="large" loading={loadingBool.value} type="primary" htmlType="submit" className="w-full text-white p-2 rounded">
            {t("Log in")}
          </Button>
          <div className="text-center mt-4">
            {t("Don't have an account")}?
            <Link to={paths.auth.register} className="text-blue-500 ml-2">
              {t("Register now")}!
            </Link>
          </div>
        </Form.Item>
      </Form>

      <Divider className="my-4" orientation="center" plain>
        {t("or")}
      </Divider>

      <Button size="large" onClick={() => loginWithgoogle()} type="dashed" icon={<img src={GoogleLogo} width="20px" height="20px" alt="google" />} className="w-full !bg-white dark:!bg-inherit mb-2">
        {t("Continue with Google")}
      </Button>
    </>
  );
}
