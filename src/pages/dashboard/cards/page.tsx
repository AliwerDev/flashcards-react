import AddEditCardModal from "src/components/dashboard/add-edit-card-modal";
import { useBoolean } from "src/hooks/use-boolean";
import { useFilter } from "src/hooks/use-filter";
import { IBox } from "src/types/box";
import { ICard } from "src/types/card";
import axiosInstance, { endpoints } from "src/utils/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { App, Button, Col, Input, Row, Segmented, Select, Table, theme } from "antd";
import debounce from "lodash.debounce";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { LuSearch } from "react-icons/lu";
import styled from "@emotion/styled";
import { useNavigate, useParams } from "react-router-dom";
import get from "lodash.get";
import { useTranslation } from "react-i18next";
import { paths } from "src/routes/paths";
import { BiPencil, BiTrash } from "react-icons/bi";

const CardsPage = () => {
  const { t } = useTranslation();
  const params = useParams();
  const { message, modal } = App.useApp();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const categoryId = get(params, "categoryId") as string;

  const [selectedCardIds, setSelectedCardIds] = useState<React.Key[]>([]);
  const editCardBool = useBoolean();
  const filter = useFilter({ search: "", boxId: "ALL", status: "ALL" });
  const {
    token: { colorBgContainer, borderRadius },
  } = theme.useToken();

  const { data: cardData, isLoading: isLoadingCards, isError } = useQuery({ queryKey: ["cards", categoryId], queryFn: () => axiosInstance.get(endpoints.card.list + `?categoryId=${categoryId}`) });
  const { data, isError: isErrorInBoxes } = useQuery({ queryKey: ["boxes", categoryId], queryFn: () => axiosInstance.get(endpoints.box.list(categoryId)), enabled: !isLoadingCards && !isError });

  const filteredCards: ICard[] = useMemo(() => {
    return filterFunction(cardData?.data, filter.value as Ifilter);
  }, [filter, cardData]);

  const { mutate: deleteCards } = useMutation({
    mutationKey: ["delete-cards"],
    mutationFn: () => axiosInstance.delete(endpoints.card.deleteList, { data: { ids: selectedCardIds } }),
    onSuccess: () => {
      setSelectedCardIds([]);
      queryClient.invalidateQueries({ queryKey: ["cards"] });
      queryClient.invalidateQueries({ queryKey: ["active-cards"] });
      message.success(t("successfully_delated"));
    },
    onError: () => "",
  });

  const confirmRemove = useCallback(() => {
    modal.confirm({
      title: t("are-you-sure-you-want-to-delete-all-selected-cards"),
      okText: t("yes"),
      onOk() {
        deleteCards();
      },
      onCancel() {},
    });
  }, [modal]);

  const rowSelection = {
    selectedRowKeys: selectedCardIds,
    onChange: (selectedIds: React.Key[]) => setSelectedCardIds(selectedIds),
    getCheckboxProps: (record: ICard) => ({
      disabled: record._id === "Disabled User",
      name: record.front,
    }),
  };

  useEffect(() => {
    if (isError || isErrorInBoxes) {
      localStorage.setItem("lastpath", paths.dashboard.analytics);
      navigate(paths.dashboard.analytics);
    }
  }, [isError, isErrorInBoxes]);

  const columns = useMemo(
    () => [
      {
        title: t("front"),
        dataIndex: "front",
      },
      {
        title: selectedCardIds?.length ? (
          <Button onClick={confirmRemove} danger type="primary" size="small" icon={<BiTrash />}>
            {t("delete")}
          </Button>
        ) : (
          t("actions")
        ),
        dataIndex: "actions",
        align: "right" as const,
        width: 150,
        render: (_: string, record: ICard) => (
          <div className="flex gap-2 justify-end">
            <Button onClick={() => editCardBool.onTrue(record)} type="text" size="small" icon={<BiPencil />} />
          </div>
        ),
      },
    ],
    [selectedCardIds, confirmRemove]
  );

  return (
    <Styled>
      <div className="card-list-header p-1" style={{ backgroundColor: colorBgContainer, borderRadius }}>
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
              {get(data, "data", []).map((box: IBox, index: number) => (
                <Select.Option key={box._id} value={box._id}>
                  {index + 1} - {t("level")}
                </Select.Option>
              ))}
            </Select>
          </Col>
        </Row>
      </div>

      <div className="card-list-body p-1">
        <Table
          rowSelection={{
            ...rowSelection,
          }}
          columns={columns}
          dataSource={filteredCards}
          size="small"
          rowKey="_id"
          loading={isLoadingCards}
          // scroll={{ y: 500, scrollToFirstRowOnChange: true }}
          pagination={false}
          sticky={true}
        />
      </div>

      <AddEditCardModal boxes={get(data, "data", [])} {...{ categoryId, t }} openBool={editCardBool} />
    </Styled>
  );
};

const Styled = styled.div`
  height: 100%;
  display: grid;
  grid-template-columns: 100%;
  grid-template-rows: max-content auto;

  .card-list-header {
    margin-bottom: 10px;
    position: sticky;
    z-index: 2;
    top: 0;
  }

  .card-list-body {
    overflow-y: auto;
    ::-webkit-scrollbar {
      width: 0;
      height: 0;
    }
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
