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
  "/signup/social-form": {};
  "/register-doctors": {};
  "/appointments": {};
  "/appointments/list": {};
};