import { Avatar, Divider, Dropdown, theme, Typography, MenuProps, Flex, Switch, Modal } from "antd";
import { useAuthContext } from "src/auth/hooks";
import { useSettingsContext } from "src/settings/hooks";
import { MoonOutlined } from "@ant-design/icons";
import React, { useCallback, useMemo } from "react";
import { CgProfile } from "react-icons/cg";
import { FaRegUser } from "react-icons/fa";
import { HiOutlineLogout } from "react-icons/hi";
import { paths } from "src/routes/paths";
import { TFunction } from "i18next";
import { useNavigate } from "react-router-dom";

const ProfileItem = ({ t }: { t: TFunction }) => {
  const navigate = useNavigate();
  const [modal, contextHolder] = Modal.useModal();
  const { logout, user } = useAuthContext();
  const { theme: apptheme, changeMode } = useSettingsContext();

  const { token } = theme.useToken();

  const confirmLogeOut = useCallback(() => {
    modal.confirm({
      title: t("are-you-sure-you-want-to-log-out"),
      content: t(`You will be logged out of the system`),
      okText: t("Yes"),
      cancelText: t("No"),
      onOk() {
        navigate(paths.auth.login);
        logout();
      },
    });
  }, [logout, modal, navigate, t]);

  const profileItems: MenuProps["items"] = useMemo(
    () => [
      {
        label: (
          <p className={"m-0 flex items-center gap-2"}>
            <CgProfile />
            {t(`Profile`)}
          </p>
        ),
        key: "profile",
        onClick: () => navigate(paths.dashboard.profile),
      },
      {
        label: (
          <Flex justify="space-between" align="center">
            <p className={"m-0 flex items-center gap-2"}>
              <MoonOutlined />
              {t("dark-mode")}
            </p>
            <Switch defaultChecked={apptheme === "dark"} size="small" onChange={(value) => changeMode(value ? "dark" : "light")} />
          </Flex>
        ),
        key: "mode",
      },
      {
        label: (
          <p className={"m-0 flex items-center"}>
            <HiOutlineLogout className={"mr-2"} /> {t("exit")}
          </p>
        ),
        key: "log-out",
        danger: true,
        onClick: confirmLogeOut,
      },
    ],
    [apptheme, changeMode, confirmLogeOut, navigate, t]
  );

  return (
    <>
      <Dropdown
        menu={{ items: profileItems }}
        trigger={["click"]}
        dropdownRender={(menu) => (
          <div
            style={{
              background: token.colorBgElevated,
              borderRadius: token.borderRadiusLG,
            }}
          >
            <div className={"flex items-center px-3 py-2"}>
              <Avatar size="large" src={user && user.picture} className={"mr-2"} icon={<FaRegUser />} />
              <div className={"m-0"}>
                <Typography className={"font-bold"}>{user && (user.firstName || user.lastName) ? `${user.firstName} ${user.lastName}` : t("User")}</Typography>
                <Typography>{user && user.email}</Typography>
              </div>
            </div>
            <Divider className={"my-0 py-0"} />
            {React.cloneElement(menu as React.ReactElement, { style: { boxShadow: "none" } })}
          </div>
        )}
      >
        <Avatar src={user && user.picture} className={"cursor-pointer"} icon={<FaRegUser />} />
      </Dropdown>
      {contextHolder}
    </>
  );
};

export default ProfileItem;
