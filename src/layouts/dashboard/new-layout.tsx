import React, { ReactNode, useEffect } from "react";
import { Flex, Image, Layout, theme } from "antd";
import { LanguageElements } from "src/components/dashboard/language";
import ProfileItem from "src/components/dashboard/profile-item";
import logo from "src/assets/logo/flashcards1.svg";

import SimpleBar from "simplebar-react";
import axiosInstance, { endpoints } from "src/utils/axios";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { storageKey } from "src/config-global";
import HeaderSections from "src/components/dashboard/header-sections";
const { Header, Content } = Layout;

interface ILayout {
  children: ReactNode;
}

const DashboardLayout: React.FC<ILayout> = ({ children }) => {
  const { t } = useTranslation();
  const categoriesDataFromStorage = JSON.parse(localStorage.getItem(storageKey.CATEGORIES) || "{}");

  const { data } = useQuery({ queryKey: ["categories"], queryFn: () => axiosInstance.get(endpoints.category.list), initialData: categoriesDataFromStorage });

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  useEffect(() => {
    if (data) {
      localStorage.setItem(storageKey.CATEGORIES, JSON.stringify(data));
    }
  }, [data]);

  return (
    <Layout className="h-screen">
      <Header className="px-3 flex justify-between items-center" style={{ background: colorBgContainer }}>
        <div className="flex justify-between items-center px-2 my-3 cursor-pointer">
          <Image preview={false} className="max-h-10 min-h-10" src={logo} alt="flashcards" height={40} width={180} />
        </div>

        <HeaderSections />

        <Flex gap="15px" align="center">
          <LanguageElements />
          <ProfileItem t={t} />
        </Flex>
      </Header>

      <SimpleBar style={{ maxHeight: "calc(100vh - 64px)" }}>
        <Content className="p-2 sm:p-4 md:p-4">{children}</Content>
      </SimpleBar>
    </Layout>
  );
};

export default DashboardLayout;
