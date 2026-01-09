export const getBasicAuthToken = () => {
  const username = process.env.BASIC_AUTH_USERNAME;
  const password = process.env.BASIC_AUTH_PASSWORD;

  if (username && password) {
    const token = btoa(`${username}:${password}`);
    return `Basic ${token}`;
  }

  return undefined;
};

export const getDraftAuthToken = () => {
  const username = process.env.DRAFT_AUTH_USERNAME;
  const password = process.env.DRAFT_AUTH_PASSWORD;

  if (username && password) {
    const token = btoa(`${username}:${password}`);
    return `Basic ${token}`;
  }

  return undefined;
};
