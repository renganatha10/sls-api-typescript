import { APIGatewayProxyHandler } from "aws-lambda";
import jwt from "jsonwebtoken";

const get: APIGatewayProxyHandler = async event => {
  const { pathParameters } = event;

  if (!pathParameters || !pathParameters.id) {
    console.error("user id is empty");
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Bad Request" })
    };
  }

  const { id } = pathParameters;
  const { JWT_SECRET } = process.env;

  const jwtToken = JWT_SECRET || "";
  const token = jwt.sign({ id }, jwtToken, { expiresIn: "1y" });

  try {
    return {
      statusCode: 200,
      body: JSON.stringify({ userId: id, token })
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: error.statusCode || 501,
      body: JSON.stringify({ message: "Couldn't delete the user item." })
    };
  }
};

export default get;
