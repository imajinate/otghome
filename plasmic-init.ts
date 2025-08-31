import { initPlasmicLoader } from "@plasmicapp/loader-nextjs";
import { AuthButton } from "./components/AuthButton";
import { AuthForm } from "./components/AuthForm";
import { AuthFormFirst } from "./components/AuthFormFirst";
import { AuthFormBookingsForm } from "./components/AuthFormBookingsForm";
import { PasswordResetForm } from "./components/PasswordResetForm";
import { UpdatePasswordForm } from "./components/UpdatePasswordForm";
import { EmailVerificationHandler } from "./components/EmailVerificationHandler";
import { TypewriterText } from './components/TypewriterText';
import { NavWrapper } from "./components/NavWrapper";
// import { UpdatePasswordFormNew } from "./components/UpdatePasswordFormNew";

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
// PLASMIC.substituteComponent(UpdatePasswordFormNew, "UpdatePasswordFormNew");


// You can register any code components that you want to use here; see
// https://docs.plasmic.app/learn/code-components-ref/
// And configure your Plasmic project to use the host url pointing at
// the /plasmic-host page of your nextjs app (for example,
// http://localhost:3000/plasmic-host).  See
// https://docs.plasmic.app/learn/app-hosting/#set-a-plasmic-project-to-use-your-app-host

// PLASMIC.registerComponent(.....);

// Registreer Field component
PLASMIC.registerComponent(EmailVerificationHandler, {
  name: "EmailVerificationHandler",
  importPath: "./components/EmailVerificationHandler",
    props: {
      firstName: {
        type: "string",
        defaultValue: "User",
      }
    },
  },
);

// Registreer de typewriter component
PLASMIC.registerComponent(TypewriterText, {
  name: 'RotatingText',
  importName: 'TypewriterText',
  importPath: './components/TypewriterText',
  props: {
    texts: {
      type: 'array',
      defaultValue: ['creator','influencer','model','singer','rapper','dj'],
    },
    speed: { type: 'number', defaultValue: 100 },
    pauseDuration: { type: 'number', defaultValue: 2000 },
    className: { type: 'string', defaultValue: '' },
  },
});


// Registreer NavWrapper als drag-&-drop component
PLASMIC.registerComponent(NavWrapper, {
  name: "NavWrapper",
  importPath: "./components/NavWrapper",
  props: {
    scrollThreshold: {
      type: "number",
      defaultValue: 0,
      description: "Scrollafstand (pixels) waarbij isScrolled true wordt"
    },
    children: {
      type: "slot"
    },
    className: {
      type: "string",
      defaultValue: ""
    }
  }
});

// Registreer NavWrapperContext voor dynamic values
PLASMIC.registerGlobalContext(NavWrapper, {
  name: "NavWrapperContext",
  importPath: "./components/NavWrapper",
  providesData: true,
  props: {
    scrollThreshold: {
      type: "number",
      defaultValue: 0,
      description: "Scrollafstand (pixels) waarbij isScrolled true wordt"
    }
  }
});