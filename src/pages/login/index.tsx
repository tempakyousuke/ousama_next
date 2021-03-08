import React from "react";
import { AuthContext } from "context/auth";
import { withRouter, NextRouter } from "next/router";
import LoginForm from "components/pages/login/login";
import SignupForm from "components/pages/login/signup";

interface WithRouterProps {
  router: NextRouter;
}

type LoginState = {
  activeTab: string;
};

class Login extends React.Component<WithRouterProps, LoginState> {
  static contextType = AuthContext;

  constructor(props: WithRouterProps) {
    super(props);
    this.state = {
      activeTab: "login",
    };
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

  get loginClass(): string {
    if (this.state.activeTab === "login") {
      return "px-6 py-2 bg-white rounded-t-lg";
    } else {
      return "px-6 py-2 text-gray-500 bg-white bg-gray-200 rounded-t-lg";
    }
  }

  get signupClass(): string {
    if (this.state.activeTab === "signup") {
      return "px-6 py-2 bg-white rounded-t-lg";
    } else {
      return "px-6 py-2 text-gray-500 bg-white bg-gray-200 rounded-t-lg";
    }
  }

  render(): JSX.Element {
    return (
      <div className="max-w-2xl mx-auto mt-5">
        <ul className="flex cursor-pointer">
          <li
            className={this.loginClass}
            onClick={() => {
              this.setState({ activeTab: "login" });
            }}
          >
            ログイン
          </li>
          <li
            className={this.signupClass}
            onClick={() => {
              this.setState({ activeTab: "signup" });
            }}
          >
            新規登録
          </li>
        </ul>
        {this.state.activeTab === "login" ? <LoginForm /> : <SignupForm />}
      </div>
    );
  }
}

export default withRouter(Login);
