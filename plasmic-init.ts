import { initPlasmicLoader } from "@plasmicapp/loader-nextjs";
import { AuthButton } from "./components/AuthButton";
import { AuthForm } from "./components/AuthForm";
import { AuthFormFirst } from "./components/AuthFormFirst";
import { AuthFormBookingsForm } from "./components/AuthFormBookingsForm";
import { PasswordResetForm } from "./components/PasswordResetForm";
import { UpdatePasswordForm } from "./components/UpdatePasswordForm";

export const PLASMIC = initPlasmicLoader({
  projects: [
    {
      id: "rpSUvc8HqqQeYPehLJKGyo",
      token: "NWvE2qb5XELSL3Ckwqf0sc0XGcjTj52GxZwtrQSKJUeReVXA7SyFqQhh07bJi12CbLkBf6ZP0u5O7PrTIQ",
    },
  ],

  // By default Plasmic will use the last published version of your project.
  // For development, you can set preview to true, which will use the unpublished
  // project, allowing you to see your designs without publishing.  Please
  // only use this for development, as this is significantly slower.
  preview: false,
});

PLASMIC.substituteComponent(AuthButton, "AuthButton");
PLASMIC.substituteComponent(AuthForm, "AuthForm");
PLASMIC.substituteComponent(AuthFormBookingsForm, "AuthFormBookingsForm");
PLASMIC.substituteComponent(AuthFormFirst, "AuthFormFirst");
PLASMIC.substituteComponent(PasswordResetForm, "PasswordResetForm");
PLASMIC.substituteComponent(UpdatePasswordForm, "UpdatePasswordForm");


// You can register any code components that you want to use here; see
// https://docs.plasmic.app/learn/code-components-ref/
// And configure your Plasmic project to use the host url pointing at
// the /plasmic-host page of your nextjs app (for example,
// http://localhost:3000/plasmic-host).  See
// https://docs.plasmic.app/learn/app-hosting/#set-a-plasmic-project-to-use-your-app-host

// PLASMIC.registerComponent(...);
