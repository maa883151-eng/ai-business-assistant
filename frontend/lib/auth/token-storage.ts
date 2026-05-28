const accessTokenKey = "ai_business_assistant_access_token";

export const tokenStorage = {
  get() {
    if (typeof window === "undefined") {
      return null;
    }

    return window.localStorage.getItem(accessTokenKey);
  },

  set(token: string) {
    window.localStorage.setItem(accessTokenKey, token);
  },

  clear() {
    window.localStorage.removeItem(accessTokenKey);
  },
};
