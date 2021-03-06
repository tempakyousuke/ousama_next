import React from "react";
import EmailSignup from "./emailSignup";
import SnsLogin from "./snsLogin";

type LoginState = {
  activeTab: string;
};

class Login extends React.Component<{}, LoginState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      activeTab: "sns",
    };
  }

  get emailTabClass(): string {
    if (this.state.activeTab === "email") {
      return "px-6 py-2 bg-white rounded-t-lg";
    } else {
      return "px-6 py-2 text-gray-500 bg-white bg-gray-200 rounded-t-lg";
    }
  }

  get snsTabClass(): string {
    if (this.state.activeTab === "sns") {
      return "px-6 py-2 bg-white rounded-t-lg";
    } else {
      return "px-6 py-2 text-gray-500 bg-white bg-gray-200 rounded-t-lg";
    }
  }

  render(): JSX.Element {
    return (
      <div className="p-6 bg-white shadow-2xl rounded-xl">
        <ul className="flex cursor-pointer">
          <li
            className={this.snsTabClass}
            onClick={() => {
              this.setState({ activeTab: "sns" });
            }}
          >
            SNSで新規登録
          </li>
          <li
            className={this.emailTabClass}
            onClick={() => {
              this.setState({ activeTab: "email" });
            }}
          >
            メールアドレスで新規登録
          </li>
        </ul>
        {this.state.activeTab === "email" ? <EmailSignup /> : <SnsLogin />}
      </div>
    );
  }
}

export default Login;
