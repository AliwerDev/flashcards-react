import { paths } from "src/routes/paths";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { storageKey } from "src/config-global";

const Page = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const path = localStorage.getItem(storageKey.LAST_PATH);
    if (path) {
      navigate(path);
    } else {
      navigate(paths.dashboard.main("ALL"));
    }
  }, [navigate]);

  return <div></div>;
};

export default Page;
