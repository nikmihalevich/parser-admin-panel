import React from "react";
import axios from "axios"

// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Container,
  Col,
  Row,
} from "reactstrap";

import history from "../history"

class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      login: '',
      password: ''
    }
  }
  componentDidMount() {
    document.body.classList.toggle("login-page");
  }
  componentWillUnmount() {
    document.body.classList.toggle("login-page");
  }

  login(e) {
    e.preventDefault()
    console.log(this.state)

    let user = this.state

    axios.post('/auth/login', user)
    .then((res) => {
      if(res.data.success) {
        localStorage.setItem("_id", res.data.user._id)
        history.push("/admin/dashboard")
      }
    })
    .catch(e => console.error(e))

  }
  render() {
    return (
      <div className="login-page">
        <Container>
          <Row>
            <Col className="ml-auto mr-auto" lg="4" md="6">
              <Form action="" className="form" method="">
                <Card className="card-login">
                  <CardHeader>
                    <CardHeader>
                      <h3 className="header text-center">Вход</h3>
                    </CardHeader>
                  </CardHeader>
                  <CardBody>
                    <InputGroup>
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="nc-icon nc-single-02" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input 
                        placeholder="Логин" 
                        type="text" 
                        value={this.state.login} 
                        onChange={(e) => this.setState({ login: e.target.value })} 
                      />
                    </InputGroup>
                    <InputGroup>
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="nc-icon nc-key-25" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        placeholder="Пароль"
                        type="password"
                        autoComplete="off"
                        value={this.state.password}
                        onChange={(e) => this.setState({ password: e.target.value })}
                      />
                    </InputGroup>
                  </CardBody>
                  <CardFooter>
                    <Button
                      block
                      className="btn-round mb-3"
                      color="warning"
                      onClick={(e) => this.login(e)}
                    >
                      Войти
                    </Button>
                  </CardFooter>
                </Card>
              </Form>
            </Col>
          </Row>
        </Container>
        <div
          className="full-page-background"
          style={{
            // backgroundImage: `url(${require("assets/img/bg/fabio-mangione.jpg")})`,
            backgroundColor: "black"
          }}
        />
      </div>
    );
  }
}

export default Login;
