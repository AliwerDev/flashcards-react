import AddEditCardModal from "src/components/dashboard/add-edit-card-modal";
import { useBoolean } from "src/hooks/use-boolean";
import { useFilter } from "src/hooks/use-filter";
import { IBox } from "src/types/box";
import { ICard } from "src/types/card";
import axiosInstance, { endpoints } from "src/utils/axios";
import { useQuery } from "@tanstack/react-query";
import { Button, Col, Input, List, Row, Segmented, Select, theme } from "antd";
import debounce from "lodash.debounce";
import React, { useEffect, useMemo } from "react";
import { LuPencil, LuSearch } from "react-icons/lu";
import styled from "@emotion/styled";
import { useNavigate, useParams } from "react-router-dom";
import get from "lodash.get";
import { useTranslation } from "react-i18next";
import { paths } from "src/routes/paths";
import SimpleBar from "simplebar-react";

const CardsPage = () => {
  const { t } = useTranslation();
  const params = useParams();
  const navigate = useNavigate();
  const categoryId = get(params, "categoryId") as string;
  const editCardBool = useBoolean();
  const filter = useFilter({ search: "", boxId: "ALL", status: "ALL" });
  const {
    token: { colorBgContainer, borderRadius },
  } = theme.useToken();

  const { data: cardData, isLoading: isLoadingCards, isError } = useQuery({ queryKey: ["cards", categoryId], queryFn: () => axiosInstance.get(endpoints.card.list + `?categoryId=${categoryId}`) });
  const filteredCards: ICard[] = useMemo(() => {
    return filterFunction(cardData?.data, filter.value as Ifilter);
  }, [filter, cardData]);

  const { data } = useQuery({ queryKey: ["boxes", categoryId], queryFn: () => axiosInstance.get(endpoints.box.list(categoryId)), enabled: !isLoadingCards && !isError });
  const boxes: IBox[] = data?.data || [];

  useEffect(() => {
    if (isError) {
      localStorage.setItem("lastpath", paths.dashboard.analytics);
      navigate(paths.dashboard.analytics);
    }
  }, [isError]);

  return (
    <Styled>
      <SimpleBar style={{ maxHeight: "100%" }}>
        <div className="card-list-header p-1 xl:p-3" style={{ backgroundColor: colorBgContainer, borderRadius }}>
          <Row gutter={[10, 10]}>
            <Col xs={24} md={8}>
              <Input className="md:max-w-60" onChange={debounce((e) => filter.changeFilter("search", e.target.value), 300)} prefix={<LuSearch />} placeholder={t("Search")} size="large" />
            </Col>
            <Col xs={24} md={8}>
              <Segmented
                block
                onChange={(value) => filter.changeFilter("status", value)}
                size="large"
                options={[
                  { label: t("All"), value: "ALL" },
                  { label: t("Learned"), value: "LEARNED" },
                ]}
              />
            </Col>
            <Col xs={24} md={8}>
              <Select className="md:max-w-60 ml-auto block" onChange={(value) => filter.changeFilter("boxId", value)} defaultValue="ALL" size="large">
                <Select.Option value={"ALL"}>{t("All")}</Select.Option>
                {boxes.map((box, index) => (
                  <Select.Option key={box._id} value={box._id}>
                    {index + 1} - {t("level")}
                  </Select.Option>
                ))}
              </Select>
            </Col>
          </Row>
        </div>

        <List
          style={{ backgroundColor: colorBgContainer }}
          bordered
          loading={isLoadingCards}
          dataSource={filteredCards}
          renderItem={(item, i) => (
            <List.Item actions={[<Button onClick={() => editCardBool.onTrue(item)} type="text" icon={<LuPencil />} />]}>
              {i + 1}. {item.front}
            </List.Item>
          )}
        />
      </SimpleBar>

      <AddEditCardModal categoryId={categoryId} {...{ boxes, t }} openBool={editCardBool} />
    </Styled>
  );
};

const Styled = styled.div`
  height: 100%;

  .card-list-header {
    margin-bottom: 10px;
    position: sticky;
    z-index: 2;
    top: 0;
  }

  .ant-empty {
    margin-top: 100px;
  }
`;

type Ifilter = {
  search: string;
  boxId: string;
  status: string;
};

const filterFunction = (cards: ICard[] = [], filter: Ifilter): ICard[] => {
  cards = cards.filter((card) => {
    const isMatchBoxId = filter.boxId === "ALL" ? true : card.boxId === filter.boxId;
    const isMatchStatus = filter.status === "ALL" ? true : false;
    const isMatchSearch = filter.search ? card.front.includes(filter.search) : true;

    return isMatchBoxId && isMatchSearch && isMatchStatus;
  });

  return cards;
};

export default CardsPage;
