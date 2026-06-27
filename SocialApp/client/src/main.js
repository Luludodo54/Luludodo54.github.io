console.log("SocialApp started 🚀");

import { initRouter } from "./core/router.js";
import { initAuth } from "./core/auth.js";

initAuth();
initRouter();
