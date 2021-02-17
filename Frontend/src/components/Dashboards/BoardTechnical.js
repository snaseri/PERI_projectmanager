import React, { useEffect, useState } from "react";
import { Box } from "@chakra-ui/react";
import UserService from "../../services/user.service";

const BoardTechnical = () => {
    const [content, setContent] = useState("");

    useEffect(() => {
        UserService.getTechnicalBoard().then(
            (response) => {
                setContent(response.data);
            },
            (error) => {
                const _content =
                    (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                    error.message ||
                    error.toString();

                setContent(_content);
            }
        );
    }, []);

    return (
        <Box>
            <h3>{content}</h3>
        </Box>
    );
};

export default BoardTechnical;
