const fetchEndpoint = (endpoint, params) => {
  const search = new URLSearchParams(params).toString();
  const query = endpoint + '?' + search;
  return fetch(query);
};

export const fetchJson = async (endpoint, params) => {
  const response = await fetchEndpoint(endpoint, params);
  return await response.json();
};

export const fetchText = async (endpoint, params) => {
  const response = await fetchEndpoint(endpoint, params);
  return await response.text();
};
