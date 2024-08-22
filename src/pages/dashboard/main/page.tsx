import { IBox } from "src/types/box";
import { HiOutlineTrash } from "react-icons/hi2";
import axiosInstance, { endpoints } from "src/utils/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Badge, Button, Col, Flex, message, Popconfirm, Row, Skeleton, Space, theme, Typography } from "antd";
import { IoReload } from "react-icons/io5";
import { useBoolean } from "src/hooks/use-boolean";
import AddBoxModal from "src/components/dashboard/add-box-modal";
import { minSeconds } from "src/utils/others";
import { LuPencil, LuPlay, LuPlus, LuTrash } from "react-icons/lu";
import { ICard } from "src/types/card";
import AddEditCardModal from "src/components/dashboard/add-edit-card-modal";
import { motion } from "framer-motion";

import { defaultTransition } from "src/utils/constants";
import { Styled } from "src/components/dashboard/styled";
import { paths } from "src/routes/paths";
import AddEditCategoryModal from "src/components/dashboard/add-category-modal";
import get from "lodash.get";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";

const { Text, Title } = Typography;

const container = {
  hidden: { opacity: 1, scale: 0 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      delayChildren: 0.3,
      staggerChildren: 0.2,
    },
  },
};

const item = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
};

const Page = () => {
  const params = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const categoryId = params.categoryId as string;

  const createBoxBool = useBoolean();
  const editCategoryBool = useBoolean();
  const createEditCardBool = useBoolean();

  const { data, isLoading: isFetchingBoxes, isError } = useQuery({ queryKey: ["boxes-with-count", categoryId], queryFn: () => axiosInstance.get(endpoints.box.listWithCardCount(categoryId)) });
  const { data: activeCardsData } = useQuery({ queryKey: ["active-cards", categoryId], queryFn: () => axiosInstance.get(endpoints.card.getActive(categoryId)), enabled: !isFetchingBoxes && !isError });
  const { data: category } = useQuery({ queryKey: ["categories", categoryId], queryFn: () => axiosInstance.get(endpoints.category.getOne(categoryId)), enabled: !isFetchingBoxes && !isError });

  const boxes: IBox[] = data?.data || [];
  const active_cards: ICard[] = activeCardsData?.data || [];

  const { token } = theme.useToken();

  const { mutate: removeBox } = useMutation({
    mutationKey: ["add-box"],
    mutationFn: (id: string) => axiosInstance.delete(endpoints.box.delete(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["boxes-with-count"] });
      message.success(t("successfully_deleted"));
    },
    onError: () => "",
  });

  const { mutate: removeCategory } = useMutation({
    mutationKey: ["add-box"],
    mutationFn: (id: string) => axiosInstance.delete(endpoints.category.delete(id)),
    onSuccess: () => {
      message.success(t("successfully_deleted"));
      localStorage.setItem("lastpath", paths.dashboard.analytics);
      navigate(paths.dashboard.analytics);
      queryClient.invalidateQueries({ queryKey: ["categories"], exact: true });
    },
    onError: () => "",
  });

  useEffect(() => {
    if (isError) {
      localStorage.setItem("lastpath", paths.dashboard.analytics);
      navigate(paths.dashboard.analytics);
    }
  }, [isError]);

  const startButton = (
    <Button onClick={() => navigate(paths.dashboard.play(categoryId))} disabled={active_cards.length <= 0} className="w-full" size="large" type="primary" icon={<LuPlay />}>
      {t("start-learning")}
    </Button>
  );

  const boxStyle = (box: IBox | Record<string, string>) => ({ borderRadius: token.borderRadius, borderColor: token.colorBorder, backgroundColor: box.cardCount ? token.colorBgContainer : token.colorBgTextHover });

  return (
    <Styled>
      <Space className="absolute top-4 right-4">
        <Button onClick={() => editCategoryBool.onTrue(get(category, "data"))} type="dashed" icon={<LuPencil />} />
        <Popconfirm placement="bottomLeft" description={t("By deleting the category, all relevant boxes and cards will be deleted")} title={t("Are you sure to delete this category?")} onConfirm={() => removeCategory(categoryId)} okText={t("Yes")} cancelText={t("No")}>
          <Button danger type="dashed" icon={<LuTrash />} />
        </Popconfirm>
      </Space>

      <motion.div className="content" initial="hidden" animate="visible" variants={container}>
        <motion.div variants={item}>
          <Flex className="box-list">
            <div className="flex gap-2 boxes">
              {isFetchingBoxes ? (
                new Array(7).fill("-").map((_, i) => (
                  <div key={i} className="mb-2">
                    <Skeleton.Button className="!w-11 !h-11 overflow-hidden rounded-lg" active />
                  </div>
                ))
              ) : (
                <>
                  {boxes.map((box, i) => (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={defaultTransition} key={box._id} className="box">
                      <Text type="success" className="align-middle">
                        Lv {i + 1}
                      </Text>
                      <div style={boxStyle(box)} className={`box-content ${box.cardCount ? "hascard" : ""}`}>
                        {i > 0 && (
                          <Popconfirm title="Are you sure to delete this box?" onConfirm={() => removeBox(box._id)} okText={t("Yes")} cancelText={t("No")}>
                            <HiOutlineTrash className="remove-box" color="#F44336" />
                          </Popconfirm>
                        )}
                        <Title level={5} className="!my-0">
                          {box.cardCount}
                        </Title>
                      </div>
                      <Text type="secondary" className="flex gap-1 items-center flex-wrap text-xs justify-center">
                        <IoReload />
                        {minSeconds(box.reviewInterval, t)}
                      </Text>
                    </motion.div>
                  ))}
                  <motion.div onClick={createBoxBool.onTrue} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={defaultTransition} className="box mt-[21px]">
                    <div style={boxStyle({})} className={`box-content cursor-pointer hascard`}>
                      <LuPlus />
                    </div>
                  </motion.div>
                </>
              )}
            </div>
          </Flex>
        </motion.div>

        <Row className="justify-center py-10 px-5" gutter={[20, 20]}>
          {active_cards.length ? (
            <Col className="flex justify-center sm:hidden" xs={24}>
              <Text type="success">You have {active_cards.length} active cards!</Text>
            </Col>
          ) : null}
          <Col xs={24} md={12} lg={6} xl={4}>
            <motion.div variants={item}>
              <Badge className="w-full" count={active_cards.length}>
                {startButton}
              </Badge>
            </motion.div>
          </Col>
          <Col xs={24} md={12} lg={6} xl={4} className="flex gap-2">
            <motion.div className="flex-1" variants={item}>
              <Button block onClick={() => createEditCardBool.onTrue()} size="large" type="dashed" icon={<LuPlus />}>
                {t("Add card")}
              </Button>
            </motion.div>
          </Col>
        </Row>
      </motion.div>
      <AddEditCardModal openBool={createEditCardBool} categoryId={categoryId} {...{ boxes, t }} />
      <AddBoxModal categoryId={categoryId} t={t} open={createBoxBool} />
      <AddEditCategoryModal closeSidebar={() => ""} t={t} open={editCategoryBool} />

      <ul className="circles">
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
      </ul>
    </Styled>
  );
};

export default Page;
