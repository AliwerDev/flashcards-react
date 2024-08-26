import { useEffect, useCallback } from "react";

import { paths } from "src/routes/paths";
import { useAuthContext } from "../hooks";
import { SplashScreen } from "src/components/shared/loading-screen";
import { useNavigate } from "react-router-dom";
import { storageKey } from "src/config-global";

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function GuestGuard({ children }: Props) {
  const { loading } = useAuthContext();

  return (
    <Container>
      <SplashScreen loading={loading} />
      {children}
    </Container>
  );
}

// ----------------------------------------------------------------------

function Container({ children }: Props) {
  const navigate = useNavigate();

  const { authenticated } = useAuthContext();

  const check = useCallback(() => {
    if (authenticated) {
      const path = localStorage.getItem(storageKey.LAST_PATH);
      if (path) {
        navigate(path);
      } else {
        navigate(paths.dashboard.main("ALL"));
      }
    }
  }, [authenticated, navigate]);

  useEffect(() => {
    check();
  }, [check]);

  return <>{children}</>;
}
