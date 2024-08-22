import LineChart from "src/components/analitics/LineChart";
import ReviewsPieChart from "src/components/analitics/ReviewsPieChart";
import axiosInstance, { endpoints } from "src/utils/axios";
import { useQuery } from "@tanstack/react-query";

import { Col, Row, Select, Typography } from "antd";
import { useTranslation } from "react-i18next";
import SimpleBar from "simplebar-react";
import get from "lodash.get";
import { useFilter } from "src/hooks/use-filter";
import { useCallback } from "react";

const AnaliticsPage = () => {
  const { t } = useTranslation();
  const { value: filter, changeFilter } = useFilter({ from: defaultDate() });
  const { data, isLoading } = useQuery({ queryKey: ["statistics", filter.from], queryFn: () => axiosInstance.get(endpoints.statistics.root, { params: { from: filter.from } }) });

  const handleChange = useCallback(
    (value: string) => {
      let from;
      switch (value) {
        case "weekly":
          from = new Date();
          from.setDate(from.getDate() - 7);
          break;
        case "monthly":
          from = new Date();
          from.setMonth(from.getMonth() - 1);
          break;
        case "yearly":
          from = new Date();
          from.setFullYear(from.getFullYear() - 1);
          break;
        default:
          from = null;
      }
      if (from) changeFilter("from", from.getTime());
    },
    [changeFilter]
  );

  return (
    <SimpleBar style={{ maxHeight: "100%", width: "100%" }}>
      <Row gutter={[15, 15]} className="w-full">
        <Col xs={24} className="flex justify-between">
          <Typography.Title level={4} className="mt-0">
            {t("your-statistics")}
          </Typography.Title>
          <Select onChange={handleChange} size="large" defaultValue="weekly" style={{ width: "150px" }}>
            <Select.Option value="weekly">{t("weekly")}</Select.Option>
            <Select.Option value="monthly">{t("monthly")}</Select.Option>
            <Select.Option value="yearly">{t("yearly")}</Select.Option>
          </Select>
        </Col>
        <Col xs={24} lg={16}>
          <LineChart lines={[{ name: "count", color: "#1db8f0", label: t("new-cards-count"), type: "step" }]} loading={isLoading} title={t("new-cards")} t={t} data={get(data, "data.newcards", [])} />
        </Col>
        <Col xs={24} lg={8}>
          <ReviewsPieChart loading={isLoading} title={t("all-reviews")} t={t} data={get(data, "data.reviews", [])} />
        </Col>
        <Col xs={24}>
          <LineChart
            lines={[
              { name: "correct", color: "#49aa19", label: t("correct-reviews") },
              { name: "incorrect", color: "#dc4446", label: t("incorrect-reviews") },
            ]}
            loading={isLoading}
            title={t("Reviews")}
            t={t}
            data={get(data, "data.reviews", [])}
          />
        </Col>
      </Row>
    </SimpleBar>
  );
};

const defaultDate = () => {
  const now = new Date();
  now.setDate(now.getDate() - 7);
  return now.getTime();
};

export default AnaliticsPage;
