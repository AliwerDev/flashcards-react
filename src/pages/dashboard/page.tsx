import { paths } from "src/routes/paths";
import axiosInstance, { endpoints } from "src/utils/axios";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import get from "lodash.get";

const Page = () => {
  const navigate = useNavigate();
  const { data: categories } = useQuery({ queryKey: ["categories"], queryFn: () => axiosInstance.get(endpoints.category.list) });

  useEffect(() => {
    const path = localStorage.getItem("lastpath");
    if (path) {
      navigate(path);
    } else if (get(categories, "data.length") > 0) {
      navigate(paths.dashboard.main(get(categories, "data[0]._id")));
    }
  }, [categories, navigate]);

  return <div></div>;
};

export default Page;
