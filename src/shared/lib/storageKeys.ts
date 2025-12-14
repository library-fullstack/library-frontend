export const STORAGE_KEYS = {
  auth: {
    token: "token",
    refreshToken: "refreshToken",
    user: "user",
  },

  cart: {
    state: "library_cart_state",
    items: "library_cart_items",
  },

  favourites: {
    state: "library_favourites_state",
  },

  banner: {
    cache: "banner_cache",
    active: "banner_active",
  },

  theme: {
    mode: "themeMode",
    color: "themeColor",
  },

  session: {
    loginSuccessOnce: "loginSuccessOnce",
    logoutSuccess: "_logoutSuccess",
    changePassStep: "changePassStep",
    changePassOtp: "changePassOtp",
  },

  reactQuery: {
    offlineCache: "REACT_QUERY_OFFLINE_CACHE",
  },
};

export const STORAGE_TTLs = {
  banner: 5 * 60 * 1000,
  session: 1 * 60 * 1000,
  cart: 24 * 60 * 60 * 1000,
  favourites: 24 * 60 * 60 * 1000,
};
