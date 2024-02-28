import { Outlet } from "react-router-dom";
import Card from "../../components/Card";
import LoginLink from "../../components/LoginLink";

const SharedLayout = () => {
  return (
    <Card>
      <Card.Body>
        <Outlet />
      </Card.Body>
      <Card.CardFooter>
        <LoginLink />
      </Card.CardFooter>
    </Card>
  );
};

export default SharedLayout;
