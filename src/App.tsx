import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./auth/context";
import { App as AntApp } from "antd";
import { SettingsProvider } from "./settings/context";
import Router from "./routes/sections";
import AntdProvider from "./style/antd-provider";
import "./i18";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SettingsProvider>
          <AntdProvider>
            <AntApp>
              <Router />
            </AntApp>
          </AntdProvider>
        </SettingsProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
