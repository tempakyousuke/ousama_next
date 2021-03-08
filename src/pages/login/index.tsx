import React from "react";
import HiCard from "components/Card/hiCard";
import HiInput from "components/Form/hiInput";
import HiButton from "components/Button/hiButton";
import { fireauth } from "utils/firebase";
import { AuthContext } from "context/auth";
import { toast } from "react-toastify";
import { withRouter, NextRouter } from "next/router";

interface WithRouterProps {
  router: NextRouter;
}

type LoginState = {
  email: string;
  password: string;
};

class Login extends React.Component<WithRouterProps, LoginState> {
  static contextType = AuthContext;

  constructor(props: WithRouterProps) {
    super(props);
    this.state = {
      email: "",
      password: "",
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

  async loginByEmail(): Promise<void> {
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

  render(): JSX.Element {
    return (
      <HiCard className="max-w-2xl mx-auto mt-5" title="ログイン">
        <form>
          <div className="mt-4">
            <HiInput
              label="メールアドレス"
              labelCols={3}
              value={this.state.email}
              handleChange={(value: string) => {
                this.setState({ email: value });
              }}
              placeholder="メールアドレス"
            />
          </div>
          <div className="mt-4">
            <HiInput
              label="パスワード"
              labelCols={3}
              value={this.state.password}
              handleChange={(value: string) => {
                this.setState({ password: value });
              }}
              type="password"
              placeholder="パスワード"
            />
          </div>
          <div className="w-10/12 mx-auto mt-4 md:w-6/12">
            <HiButton handleClick={this.loginByEmail.bind(this)}>
              ログイン
            </HiButton>
          </div>
        </form>
      </HiCard>
    );
  }
}

export default withRouter(Login);
