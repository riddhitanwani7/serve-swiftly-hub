// Mock client-side auth helpers (frontend-only demo).
const TOKEN_KEY = "pp_auth_token";
const ONBOARD_KEY = "pp_onboarded";

export const auth = {
  isAuthed(): boolean {
    if (typeof window === "undefined") return false;
    return !!localStorage.getItem(TOKEN_KEY);
  },
  isOnboarded(): boolean {
    if (typeof window === "undefined") return false;
    return localStorage.getItem(ONBOARD_KEY) === "1";
  },
  login(email: string) {
    localStorage.setItem(TOKEN_KEY, `mock:${email}`);
  },
  logout() {
    localStorage.removeItem(TOKEN_KEY);
  },
  completeOnboarding() {
    localStorage.setItem(ONBOARD_KEY, "1");
  },
  resetOnboarding() {
    localStorage.removeItem(ONBOARD_KEY);
  },
};
