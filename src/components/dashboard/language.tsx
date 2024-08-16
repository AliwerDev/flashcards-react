import { Dropdown, MenuProps, Typography } from "antd";
import { useTranslation } from "react-i18next";
import { useSettingsContext } from "src/settings/hooks";

import flagUz from "src/assets/flags/uzbekistan.png";
import flagEn from "src/assets/flags/united-kingdom.png";
import flagRu from "src/assets/flags/russia.png";

import { useEffect } from "react";
import { Lang } from "src/settings/types";

export const LanguageElements = () => {
  const { i18n } = useTranslation();
  const { lang, updateData } = useSettingsContext();

  useEffect(() => {
    i18n.changeLanguage(lang);
  }, [lang]);

  const onClick: MenuProps["onClick"] = (item) => {
    updateData({ lang: item.key as Lang });
  };

  const items: MenuProps["items"] = [
    {
      label: (
        <div className="flex items-center gap-2">
          <img src={flagUz} alt="" width={24} height={24} />
          <Typography>O'zbek tili</Typography>
        </div>
      ),
      key: "uz",
    },
    {
      label: (
        <div className="flex items-center gap-2">
          <img src={flagRu} alt="" width={24} height={24} />
          <Typography>Rus tili</Typography>
        </div>
      ),
      key: "ru",
    },
    {
      label: (
        <div className="flex items-center gap-2">
          <img src={flagEn} alt="" width={24} height={24} />
          <Typography>Ingliz tili</Typography>
        </div>
      ),
      key: "en",
    },
  ];

  return (
    <Dropdown menu={{ items, onClick }}>
      <img className="cursor-pointer" src={lang === "uz" ? flagUz : lang === "en" ? flagEn : flagRu} alt="language" width={24} height={24} />
    </Dropdown>
  );
};
