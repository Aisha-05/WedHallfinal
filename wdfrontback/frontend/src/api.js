// API Base URL - use proxy for same-origin requests
const API_BASE_URL = "/backend/index.php";

// Map file-based endpoints to route-based endpoints
const endpointMap = {
  "/auth/signup.php": "auth/signup",
  "/auth/login.php": "auth/login",
  "/auth/logout.php": "auth/logout",
  "/auth/me.php": "auth/me",
  "/halls/getHalls.php": "halls/get",
  "/halls/getOwnerHalls.php": "halls/getOwner",
  "/halls/getHall.php": "halls/detail",
  "/halls/addHall.php": "halls/add",
  "/halls/updateHall.php": "halls/update",
  "/halls/deleteHall.php": "halls/delete",
  "/favorites/getFavorites.php": "favorites/get",
  "/favorites/addFavorite.php": "favorites/add",
  "/favorites/removeFavorite.php": "favorites/remove",
  "/bookings/getBookings.php": "bookings/get",
  "/bookings/createBooking.php": "bookings/create",
  "/bookings/updateBooking.php": "bookings/update",
  "/ratings/getRatings.php": "ratings/get",
  "/ratings/submitRating.php": "ratings/submit",
  "/auth/updateProfile.php": "auth/updateProfile",
  "/auth/uploadProfilePicture.php": "auth/uploadProfilePicture",
};

// Helper function for safe JSON parsing
const safeJsonParse = async (response) => {
  const text = await response.text();
  if (!text) {
    return null;
  }
  try {
    return JSON.parse(text);
  } catch (e) {
    console.error("JSON parse error:", e, "Response text:", text);
    throw new Error("Invalid JSON response from server");
  }
};

// Helper function for API calls
export const apiCall = async (endpoint, options = {}) => {
  const defaultOptions = {
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  };

  // Get base endpoint without query params
  const baseEndpoint = endpoint.split("?")[0];
  const route = endpointMap[baseEndpoint] || baseEndpoint.substring(1);

  // Build query string with route and any additional params
  let queryString = `route=${encodeURIComponent(route)}`;
  const queryParams = endpoint.split("?")[1];
  if (queryParams) {
    queryString += "&" + queryParams;
  }

  const response = await fetch(`${API_BASE_URL}?${queryString}`, {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  });

  // Handle errors - treat 409 as success for favorite operations only
  if (!response.ok) {
    const error = await safeJsonParse(response);

    // For favorite operations, 409 Conflict means already favorited (treated as success)
    if (response.status === 409 && route.includes("favorites")) {
      return error || { error: "Already favorited" };
    }

    // For all other cases (including booking conflicts), treat 409 as an error
    throw new Error(error?.error || "API request failed");
  }

  const data = await safeJsonParse(response);
  return data || {};
};

// Auth API calls
export const authAPI = {
  signup: (data) =>
    apiCall("/auth/signup.php", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  login: (data) =>
    apiCall("/auth/login.php", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  logout: () =>
    apiCall("/auth/logout.php", {
      method: "POST",
    }),

  me: () =>
    apiCall("/auth/me.php", {
      method: "GET",
    }),

  updateProfile: (data) =>
    apiCall("/auth/updateProfile.php", {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  uploadProfilePicture: async (file) => {
    const formData = new FormData();
    formData.append("profile_picture", file);

    const response = await fetch(
      `${API_BASE_URL}/?route=auth/uploadProfilePicture`,
      {
        method: "POST",
        body: formData,
        credentials: "include",
      },
    );

    const text = await response.text();
    let data = null;
    if (text) {
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error("JSON parse error:", e);
        throw new Error("Invalid response from server");
      }
    }

    if (!response.ok) {
      throw new Error(data?.error || "Upload failed");
    }

    return data || {};
  },
};

// Halls API calls
export const hallsAPI = {
  getAll: () => apiCall("/halls/getHalls.php"),

  getOwnerHalls: () => apiCall("/halls/getOwnerHalls.php"),

  getById: (id) => apiCall(`/halls/getHall.php?id=${id}`),

  create: (data) =>
    apiCall("/halls/addHall.php", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id, data) =>
    apiCall(`/halls/updateHall.php?id=${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: (id) =>
    apiCall(`/halls/deleteHall.php?id=${id}`, {
      method: "DELETE",
    }),
};

// Favorites API calls
export const favoritesAPI = {
  getAll: () => apiCall("/favorites/getFavorites.php"),

  add: (hallId) =>
    apiCall("/favorites/addFavorite.php", {
      method: "POST",
      body: JSON.stringify({ hall_id: hallId }),
    }),

  remove: (hallId) =>
    apiCall(`/favorites/removeFavorite.php?id=${hallId}`, {
      method: "DELETE",
    }),
};

// Bookings API calls
export const bookingsAPI = {
  getAll: () => apiCall("/bookings/getBookings.php"),

  create: (data) =>
    apiCall("/bookings/createBooking.php", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id, data) =>
    apiCall(`/bookings/updateBooking.php?id=${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
};

// Ratings API calls
export const ratingsAPI = {
  getByHall: (hallId) => apiCall(`/ratings/getRatings.php?id=${hallId}`),

  submit: (data) =>
    apiCall("/ratings/submitRating.php", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};
