import React from "react";
import HiInput from "components/Form/hiInput";
import HiButton from "components/Button/hiButton";
import { fireauth } from "utils/firebase";
import { toast } from "react-toastify";
import EmailLogin from "./emailLogin";

type LoginState = {
  email: string;
  password: string;
  activeTab: string;
};

class Login extends React.Component<{}, LoginState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      email: "",
      password: "",
      activeTab: "sns",
    };
  }

  async loginByEmail(event: React.MouseEvent): Promise<void> {
    event.preventDefault();
    try {
      await fireauth.signInWithEmailAndPassword(
        this.state.email,
        this.state.password
      );
    } catch (e) {
      console.log(e);
      toast.error(e.message);
    }
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
            SNSでログイン
          </li>
          <li
            className={this.emailTabClass}
            onClick={() => {
              this.setState({ activeTab: "email" });
            }}
          >
            メールアドレスでログイン
          </li>
        </ul>
        {this.state.activeTab === "login" ? <EmailLogin /> : <EmailLogin />}
      </div>
    );
  }
}

export default Login;
