import type { Handler } from "@netlify/functions";

const handler: Handler = async function (event) {

    if (event.body === null) {
        return {
            statusCode: 400,
            body: JSON.stringify("Payload required"),
        };
    }

    const requestBody = JSON.parse(event.body) as {
        senderName: string;
        senderEmail: string;
        recipient: string;
        message: string;
    };

    return {
        statusCode: 200,
        body: JSON.stringify(requestBody),
    };
};

export { handler };
