import LineChart from "src/components/analitics/LineChart";
import ReviewsPieChart from "src/components/analitics/ReviewsPieChart";
import { ICard } from "src/types/card";
import { IReview } from "src/types/other";
import axiosInstance, { endpoints } from "src/utils/axios";
import { useQuery } from "@tanstack/react-query";

import { Col, Row } from "antd";
import { useTranslation } from "react-i18next";

const AnaliticsPage = () => {
  const { t } = useTranslation();
  const { data, isLoading } = useQuery({ queryKey: ["reviews"], queryFn: () => axiosInstance.get(endpoints.card.reviews) });
  const { data: cardsList, isLoading: isLoadingCards } = useQuery({ queryKey: ["cards"], queryFn: () => axiosInstance.get(endpoints.card.list) });

  const reviews: IReview[] = data?.data || [];
  const cards: ICard[] = cardsList?.data || [];

  const loading = isLoading || isLoadingCards;

  return (
    <div>
      <Row gutter={[15, 15]}>
        <Col xs={24} lg={16}>
          <LineChart loading={loading} title={t("Analitics")} t={t} data={reviews} cards={cards} />
        </Col>
        <Col xs={24} lg={8}>
          <ReviewsPieChart loading={isLoading} title={t("all-reviews")} t={t} reviews={reviews} />
        </Col>
      </Row>
    </div>
  );
};

export default AnaliticsPage;
