import { APIGatewayProxyHandler } from "aws-lambda";
import dynamodb from "../../dynamodb";

const update: APIGatewayProxyHandler = async event => {
  const timestamp = new Date().getTime();
  const { pathParameters } = event;
  const data = event.body ? JSON.parse(event.body) : null;

  if (!pathParameters || !pathParameters.id) {
    console.error("user id is empty");
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Bad Request" })
    };
  }

  if (!data) {
    console.error("request body is empty");
    return {
      statusCode: 400,
      headers: { "Content-Type": "text/plain" },
      body: "Couldn't create the todo item."
    };
  }

  const { id } = pathParameters;
  const { name } = data;

  const params = {
    TableName: `${process.env.DYNAMODB_TABLE}-user`,
    Key: {
      id
    },
    ExpressionAttributeNames: {
      "#user_name": "name"
    },
    ExpressionAttributeValues: {
      ":name": name,
      ":updatedAt": timestamp
    },
    UpdateExpression: "SET #user_name = :name, updatedAt = :updatedAt",
    ReturnValues: "ALL_NEW"
  };

  try {
    await dynamodb.update(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "name updated" })
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: error.statusCode || 501,
      headers: { "Content-Type": "text/plain" },
      body: "Couldn't update the user item."
    };
  }
};

export default update;
