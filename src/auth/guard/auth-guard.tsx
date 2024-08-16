import { useState, useEffect, useCallback } from "react";
import { paths } from "src/routes/paths";
import { SplashScreen } from "src/components/shared/loading-screen";

import { useAuthContext } from "../hooks";
import { useNavigate } from "react-router-dom";

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function AuthGuard({ children }: Props) {
  const { loading } = useAuthContext();
  return <>{loading ? <SplashScreen /> : <Container>{children}</Container>}</>;
}

// ----------------------------------------------------------------------

function Container({ children }: Props) {
  const { authenticated } = useAuthContext();

  const [checked, setChecked] = useState(false);
  const navigate = useNavigate();

  const check = useCallback(() => {
    if (!authenticated) {
      const searchParams = new URLSearchParams({
        returnTo: window.location.pathname,
      }).toString();

      const href = `${paths.auth.login}?${searchParams}`;
      navigate(href, { replace: true });
    } else {
      setChecked(true);
    }
  }, [authenticated, navigate]);

  useEffect(() => {
    check();
  }, [authenticated, check]);

  if (!checked) {
    return null;
  }

  return <>{children}</>;
}
