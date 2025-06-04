import "react-router";

declare module "react-router" {
  interface Register {
    params: Params;
  }

  interface Future {
    unstable_middleware: false
  }
}

type Params = {
  "/": {};
  "/login": {};
  "/signup": {};
  "/signup/form": {};
  "/register-doctors": {};
  "/find-email": {};
  "/reset-password": {};
  "/reset-password/set": {};
};