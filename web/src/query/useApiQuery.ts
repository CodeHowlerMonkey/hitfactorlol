import { useQuery, UseQueryOptions } from "@tanstack/react-query";

export { keepPreviousData } from "@tanstack/react-query";

export const API_URL = "/api"; // react build served through node

export const queryKeyForPathAndQueryString = (pathAndQueryString: string): string[] => {
  try {
    const url = new URL(`https://0:0/${pathAndQueryString}`);
    const pathSegments = url.pathname.split("/").filter(Boolean);
    const searchParamPairs = [...url.searchParams]
      .filter(([, v]) => !!v)
      .map(([key, value]) => `${key}=${value}`);
    return ([] as string[]).concat(pathSegments, searchParamPairs);
  } catch (e) {
    console.error(e);
    return ["__INVALID_ENDPOINT_QUERY_KEY"];
  }
};

export const useApiQuery = (endpoint: string, options: UseQueryOptions) => {
  const url = API_URL + endpoint;

  const { data, isPending } = useQuery({
    ...options,
    queryKey: queryKeyForPathAndQueryString(url),
    queryFn: async () => {
      const response = await window.fetch(url);
      return response.json();
    },
  });

  return { json: data, loading: isPending };
};

export default useApiQuery;