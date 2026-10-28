const SESSION_KEY = 'session';

export const saveSession = ({ uuid, nickname }) => {
  localStorage.setItem(SESSION_KEY, JSON.stringify({ uuid, nickname }));
};

export const getSession = () => {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY));
  } catch {
    return null;
  }
};

export const clearSession = () => {
  localStorage.removeItem(SESSION_KEY);
};
