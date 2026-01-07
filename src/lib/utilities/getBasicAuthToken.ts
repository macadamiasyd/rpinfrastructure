export const getBasicAuthToken = () => {
  const username = process.env.BASIC_AUTH_USERNAME;
  const password = process.env.BASIC_AUTH_PASSWORD;

  if (username && password) {
    const token = btoa(`${username}:${password}`);
    return `Basic ${token}`;
  }

  return undefined;
};
