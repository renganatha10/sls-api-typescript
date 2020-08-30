import { APIGatewayProxyHandler } from "aws-lambda";
import dynamodb from "../../dynamodb";

const list: APIGatewayProxyHandler = async () => {
  const params = {
    TableName: `${process.env.DYNAMODB_TABLE}-user`
  };

  try {
    const users = await dynamodb.scan(params).promise();
    const items = users.Items;
    return {
      statusCode: 200,
      body: JSON.stringify(items)
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: error.statusCode || 501,
      headers: { "Content-Type": "text/plain" },
      body: "Couldn't get the users list"
    };
  }
};

export default list;
