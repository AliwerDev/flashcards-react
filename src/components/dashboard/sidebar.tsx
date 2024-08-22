import { useBoolean } from "src/hooks/use-boolean";
import { useDashboardMenus } from "src/hooks/use-dashboard-menus";
import { makeKeysArrayFromPathname } from "src/utils/functions";
import { Button, Divider, Image, Menu, MenuProps, Typography } from "antd";
import { TFunction } from "i18next";
import { GoPlus, GoSidebarExpand } from "react-icons/go";
import AddEditCategoryModal from "./add-category-modal";
import { useLocation, useNavigate } from "react-router-dom";
import logo from "src/assets/logo/flashcards1.svg";
const { Text } = Typography;

interface IProps {
  t: TFunction;
  closeSidebar: VoidFunction;
  closable?: boolean;
}

const SidebarContent = ({ t, closeSidebar, closable = false }: IProps) => {
  const menus = useDashboardMenus();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const creatingBool = useBoolean();
  const defaultSelectedKeys = makeKeysArrayFromPathname(pathname);

  const selectMenuItemHandler: MenuProps["onSelect"] = (menu) => {
    closeSidebar();
    const path = `/dashboard/${menu.key}`;
    localStorage.setItem("lastpath", path);
    navigate(path);
  };

  return (
    <>
      <div className="w-full flex justify-between items-center px-2 my-3 cursor-pointer">
        <Image preview={false} className="max-h-10 min-h-10" src={logo} alt="flashcards" height={40} width={180} />
        {closable && <Button onClick={closeSidebar} type="text" icon={<GoSidebarExpand className="text-lg" />} />}
      </div>
      <Menu selectedKeys={defaultSelectedKeys} items={menus[0]} onSelect={selectMenuItemHandler} getPopupContainer={(node) => node.parentNode as HTMLElement} />
      <Divider orientation="left">
        <Text type="secondary">{t("Categories")}</Text>
      </Divider>
      <Menu mode={closable ? "inline" : "vertical"} selectedKeys={defaultSelectedKeys} items={menus[1]} onSelect={selectMenuItemHandler} />
      {menus[1].length < 5 && (
        <div className="px-2 mt-2">
          <Button onClick={() => creatingBool.onTrue()} className="w-full" icon={<GoPlus />}>
            {t("Add category")}
          </Button>
        </div>
      )}
      <AddEditCategoryModal closeSidebar={closeSidebar} open={creatingBool} t={t} />
    </>
  );
};

export default SidebarContent;
