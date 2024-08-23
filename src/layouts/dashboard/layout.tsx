import { Breadcrumb, Button, Drawer, Flex, Layout, theme } from "antd";
import React, { ReactNode, useEffect } from "react";
import { LanguageElements } from "src/components/dashboard/language";
import ProfileItem from "src/components/dashboard/profile-item";

import { GoSidebarCollapse } from "react-icons/go";
import SidebarContent from "src/components/dashboard/sidebar";
import { TFunction } from "i18next";
import ICategory from "src/types/category";
import axiosInstance, { endpoints } from "src/utils/axios";
import { useQuery } from "@tanstack/react-query";
import get from "lodash.get";
import { useBoolean } from "src/hooks/use-boolean";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { storageKey } from "src/config-global";
const { Header, Sider, Content } = Layout;

interface ILayout {
  children: ReactNode;
}

const DashboardLayout: React.FC<ILayout> = ({ children }) => {
  const { pathname } = useLocation();
  const { t } = useTranslation();
  const sidebarBool = useBoolean();
  const categoriesDataFromStorage = JSON.parse(localStorage.getItem(storageKey.CATEGORIES) || "{}");

  const { data } = useQuery({ queryKey: ["categories"], queryFn: () => axiosInstance.get(endpoints.category.list), initialData: categoriesDataFromStorage });
  const categories: ICategory[] = get(data, "data", []);

  const breadcrumbItems = generateBreadcrumbs(pathname, t, categories || []);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  useEffect(() => {
    if (data) {
      localStorage.setItem(storageKey.CATEGORIES, JSON.stringify(data));
    }
  }, [data]);

  return (
    <Layout className="h-screen">
      <Drawer placement="left" onClose={sidebarBool.onFalse} open={sidebarBool.value} closable={false} rootClassName="block md:hidden" styles={{ body: { padding: "10px 0", background: colorBgContainer }, header: { paddingBlock: 10 } }} width="100vw">
        <SidebarContent closable closeSidebar={() => sidebarBool.value && sidebarBool.onFalse()} {...{ borderRadiusLG, colorBgContainer, t }} />
      </Drawer>

      <Sider
        style={{
          background: colorBgContainer,
          borderRadius: borderRadiusLG,
        }}
        width={250}
        onCollapse={sidebarBool.onToggle}
        className="hidden md:block"
        trigger={null}
        zeroWidthTriggerStyle={{ background: colorBgContainer }}
      >
        <SidebarContent closeSidebar={() => ""} {...{ t }} />
      </Sider>
      <Layout>
        <Header className="px-3 flex justify-between items-center" style={{ background: colorBgContainer }}>
          <Flex align="center" gap={5}>
            <Button type="text" className="flex " onClick={sidebarBool.onToggle} icon={<GoSidebarCollapse className="text-lg" />} />
            <Breadcrumb items={breadcrumbItems} />
          </Flex>
          <Flex gap="15px" align="center">
            <LanguageElements />
            <ProfileItem t={t} />
          </Flex>
        </Header>

        <Content style={{ maxHeight: "calc(100vh - 64px)", minHeight: "calc(100vh - 64px)", overflow: "hidden", position: "relative" }} className="p-2 sm:p-4 md:p-4">
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

const generateBreadcrumbs = (pathname: string, t: TFunction, categories: ICategory[]) => {
  const items = [];

  if (pathname.includes("users")) {
    items.push({ title: <>{t("Users")}</> });
  } else if (pathname.includes("analytics")) {
    items.push({ title: <>{t("Analytics")}</> });
  } else if (pathname.includes("profile")) {
    items.push({ title: <>{t("Profile")}</> });
  } else if (pathname.includes("dashboard/")) {
    const categoryId = pathname.split("/")[2];
    const category = categories.find((c) => c._id === categoryId);

    if (category) {
      items.push({ title: <>{category.title}</> });
    }
  }

  return items;
};

export default DashboardLayout;
