import React from "react";
import { AuthContext } from "context/auth";
import { withRouter, NextRouter } from "next/router";
import LoginCard from "components/pages/login/login";

interface WithRouterProps {
  router: NextRouter;
}

class Login extends React.Component<WithRouterProps, {}> {
  static contextType = AuthContext;

  constructor(props: WithRouterProps) {
    super(props);
  }

  componentDidMount() {
    this.loginRedirect();
  }

  componentDidUpdate() {
    this.loginRedirect();
  }

  loginRedirect(): void {
    if (this.context.currentUser) {
      if (typeof this.props.router.query.redirect === "string") {
        this.props.router.push(this.props.router.query.redirect);
      } else {
        this.props.router.push("/");
      }
    }
  }

  render(): JSX.Element {
    return (
      <>
        <LoginCard />
      </>
    );
  }
}

export default withRouter(Login);
