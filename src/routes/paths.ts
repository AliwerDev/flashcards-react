const ROOTS = {
  AUTH: "/auth",
  DASHBOARD: "/dashboard",
};

export const paths = {
  // AUTH
  auth: {
    login: `${ROOTS.AUTH}/login`,
    register: `${ROOTS.AUTH}/register`,
  },
  // DASHBOARD
  dashboard: {
    root: `${ROOTS.DASHBOARD}`,
    users: `${ROOTS.DASHBOARD}/users`,
    cards: (categoryId: string) => `${ROOTS.DASHBOARD}/${categoryId}/cards`,
    play: (categoryId: string) => `${ROOTS.DASHBOARD}/${categoryId}/play`,
    main: (categoryId: string) => `${ROOTS.DASHBOARD}/${categoryId}/main`,
    profile: `${ROOTS.DASHBOARD}/profile`,
    settings: `${ROOTS.DASHBOARD}/settings`,
  },
};
