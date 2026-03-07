import React, { useState } from "react";

import { Button, Flex, Input, Modal } from "antd";

import { CONTACT_FUNCTION_PATH } from "../constants";
import { Allenite } from "../types";

interface ContactModalProps {
    authors: ReadonlyArray<Allenite> | null;
    open: boolean;
    primaryContact: Allenite | null;
    title: string;
    onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({
    authors,
    onClose,
    open,
    primaryContact,
    title,
}) => {
    const [senderName, setSenderName] = useState("");
    const [senderEmail, setSenderEmail] = useState("");
    const [message, setMessage] = useState("");

    const hasPrimaryContact = !!primaryContact;
    const hasAuthors = !!authors && authors.length > 0;

    const filteredAuthors =
        authors
            ?.map((author) => author.name)
            .filter(Boolean)
            .join(", ") ?? "the authors";

    const recipientLabel = hasPrimaryContact
        ? primaryContact.name
        : hasAuthors
          ? filteredAuthors
          : // TODO use real contact info
            "fake default email inbox";

    const handleSubmit = async () => {
        try {
            const response = await fetch(CONTACT_FUNCTION_PATH, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    senderName: senderName,
                    senderEmail: senderEmail,
                    recipient: recipientLabel,
                    message: message,
                }),
            });

            if (response.ok) {
                console.log("Message sent successfully, response:", response);
            } else {
                console.log("Failed to send message. Please try again later.");
            }
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    return (
        <Modal
            title="Contact the Authors"
            open={open}
            onCancel={onClose}
            footer={[
                <Button key="cancel" onClick={onClose}>
                    Cancel
                </Button>,
                <Button key="submit" type="primary" onClick={handleSubmit}>
                    Send
                </Button>,
            ]}
        >
            <p>
                <strong>Idea:</strong> {title}
            </p>
            {hasAuthors && (
                <p>
                    <strong>Authors:</strong> {filteredAuthors}
                </p>
            )}
            <p>
                Your message will be sent to <strong>{recipientLabel}</strong>.
                Reach out with questions, collaboration interest, or feedback on
                this idea.
            </p>
            <Flex vertical gap={12}>
                <Input
                    placeholder="Your name"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                />
                <Input
                    type="email"
                    placeholder="Your email address"
                    value={senderEmail}
                    onChange={(e) => setSenderEmail(e.target.value)}
                />
                <Input.TextArea
                    rows={4}
                    placeholder="Write your message here..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
            </Flex>
        </Modal>
    );
};
