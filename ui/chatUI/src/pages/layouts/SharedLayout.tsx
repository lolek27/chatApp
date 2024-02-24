import { Outlet } from "react-router-dom";
import Card from "../../components/Card";

const SharedLayout = () => {
  return (
    <Card>
      <Card.Body>
        <Outlet />
      </Card.Body>
      <Card.CardFooter>Text</Card.CardFooter>
    </Card>
  );
};

export default SharedLayout;
