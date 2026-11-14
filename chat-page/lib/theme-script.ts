export const THEME_STORAGE_KEY = "pm-theme";

/**
 * Runs in <head> before the page paints, so a dark-theme user never sees a white flash.
 * Keep in sync with applyTheme() in lib/theme.ts.
 */
export const themeInitScript = `(function(){try{var p=localStorage.getItem("${THEME_STORAGE_KEY}")||"system";var d=p==="dark"||(p==="system"&&matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.classList.toggle("dark",d);}catch(e){}})();`;
