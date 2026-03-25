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
        recipientName: string;
        recipientId: string;
        message: string;
    };

    const email = process.env[requestBody.recipientId];
    
    if (email) {
        return {
            statusCode: 200,
            body: JSON.stringify(requestBody),
        };
    }
    return {
        statusCode: 400,
        body: JSON.stringify("No email stored for submitted contact ID")
    }


};

export { handler };
