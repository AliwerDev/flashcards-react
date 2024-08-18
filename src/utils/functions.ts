export const makeKeysArrayFromPathname = (pathname: string): string[] => {
  const path = pathname.split("/").slice(2);
  if (path.length === 2) path[1] = path.join("/");
  return path;
};
