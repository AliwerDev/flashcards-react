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

  return (
    <Container>
      <SplashScreen loading={loading} />
      {children}
    </Container>
  );
}

// ----------------------------------------------------------------------

function Container({ children }: Props) {
  const { authenticated, loading } = useAuthContext();

  const [checked, setChecked] = useState(false);
  const navigate = useNavigate();

  const check = useCallback(() => {
    if (!authenticated) {
      navigate(paths.auth.login, { replace: true });
    } else {
      setChecked(true);
    }
  }, [authenticated, navigate]);

  useEffect(() => {
    if (!loading) check();
  }, [authenticated, check, loading]);

  if (!checked) {
    return null;
  }

  return <>{children}</>;
}
