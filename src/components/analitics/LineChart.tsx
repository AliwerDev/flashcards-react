import { LineChart as ReLineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";

import React, { useEffect, useRef, useState } from "react";
import { theme as antTheme, Card, Flex, Skeleton, Typography } from "antd";
import { TFunction } from "i18next";
import { t } from "i18next";

type ILine = {
  name: string;
  type?: "linear" | "basis" | "monotone" | "step" | "stepAfter";
  label: string;
  color: string;
};

interface LineChartProps {
  t: TFunction;
  title?: string;
  loading?: boolean;
  lines: ILine[];
  data: Record<string, any>[];
}

const LineChart: React.FC<LineChartProps> = ({ data = [], title, loading, lines }) => {
  const { token } = antTheme.useToken();
  const cardRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(300);

  const tooltipStyle = { background: token.colorBgBase, boxShadow: token.boxShadow, borderRadius: token.borderRadius, borderColor: token.colorBorder };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div style={tooltipStyle} className="p-1 flex flex-col">
          <Typography.Text className="text-xs text-center">{label}</Typography.Text>

          {lines.map((line, i) => (
            <Typography.Text key={line.name} style={{ fontSize: "12px", color: line.color }}>{`${line.label}: ${payload[i].value}`}</Typography.Text>
          ))}
        </div>
      );
    }

    return null;
  };

  useEffect(() => {
    if (cardRef.current) {
      const cardWidth = cardRef.current.offsetWidth;
      setWidth(cardWidth);
    }
  }, [cardRef]);

  return (
    <Card classNames={{ body: "!p-2" }} style={{ minHeight: "350px" }}>
      <Flex justify="space-between" className="mb-4 px-1">
        <Typography.Title level={5} className="mt-0">
          {title ? title : t("Statistics")}
        </Typography.Title>
      </Flex>
      <div className="max-w-full overflow-hidden min-h-40" ref={cardRef}>
        {loading ? (
          <Skeleton active />
        ) : (
          <ReLineChart
            width={width}
            height={300}
            data={data}
            margin={{
              left: -20,
              bottom: -10,
            }}
          >
            <CartesianGrid stroke={token.colorTextDisabled} strokeDasharray="3 3" />
            <XAxis dataKey="_id" />
            <YAxis />
            <Tooltip content={CustomTooltip} contentStyle={tooltipStyle} />
            {lines.map((line) => (
              <Line key={line.name} type={line.type || "monotone"} dataKey={line.name} stroke={line.color} activeDot={{ radius: 0.5 }} dot={false} />
            ))}
          </ReLineChart>
        )}
      </div>
    </Card>
  );
};

export default LineChart;
