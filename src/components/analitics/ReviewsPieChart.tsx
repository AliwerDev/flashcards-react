import { theme as antTheme, Card, Skeleton, Typography } from "antd";
import { Tooltip, Pie, PieChart, Cell } from "recharts";
import { TFunction } from "i18next";

interface IProps {
  data: any[];
  title?: string;
  t: TFunction;
  loading?: boolean;
}

export default function ReviewsPieChart({ data = [], title, t, loading }: IProps) {
  const { token } = antTheme.useToken();

  const correctReviews = data.reduce((acc, val) => acc + val.correct, 0);
  const incorrectReviews = data.reduce((acc, val) => acc + val.incorrect, 0);

  const values = [
    { name: t("correct-reviews"), value: correctReviews },
    { name: t("incorrect-reviews"), value: incorrectReviews },
  ];

  return (
    <Card classNames={{ body: "!p-2" }} className="h-full">
      <Typography.Title level={5} className="text-center mt-0 my-3">
        {title ? title : t("your-statistics")}
      </Typography.Title>
      <div className="flex justify-center min-h-40">
        {loading ? (
          <Skeleton active />
        ) : (
          <PieChart width={300} height={300}>
            <Pie dataKey="value" data={values} cx="50%" cy="50%" outerRadius={100} label>
              {values.map((_, index) => (
                <Cell key={`cell-${index}`} fill={index === 0 ? token.colorSuccess : token.colorError} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        )}
      </div>
    </Card>
  );
}
