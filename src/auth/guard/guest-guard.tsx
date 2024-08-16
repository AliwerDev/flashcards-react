import { useEffect, useCallback } from "react";

import { paths } from "src/routes/paths";
import { useAuthContext } from "../hooks";
import { SplashScreen } from "src/components/shared/loading-screen";
import { useNavigate, useSearchParams } from "react-router-dom";

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function GuestGuard({ children }: Props) {
  const { loading } = useAuthContext();

  return <>{loading ? <SplashScreen /> : <Container>{children}</Container>}</>;
}

// ----------------------------------------------------------------------

function Container({ children }: Props) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const returnTo = searchParams.get("returnTo") || paths.dashboard.root;
  const { authenticated } = useAuthContext();

  const check = useCallback(() => {
    if (authenticated) {
      navigate(returnTo, { replace: true });
    }
  }, [authenticated, returnTo, navigate]);

  useEffect(() => {
    check();
  }, [check]);

  return <>{children}</>;
}
