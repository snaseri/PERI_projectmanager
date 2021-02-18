import React, { useEffect, useRef, useState } from "react";
import {
    Box,
    Button,
    Heading,
    HStack,
    Input,
    InputGroup,
    InputLeftElement,
    Select,
    Spacer,
} from "@chakra-ui/react";
import { Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/table";
import { Text } from "@chakra-ui/layout";
import ProjectService from "../../services/project.service";
import AuthService from "../../services/auth.service";
import { Search2Icon } from "@chakra-ui/icons";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const BoardDesigner = () => {
    let authenticatedUser = AuthService.getCurrentUser();
    let unfilteredProjects = useRef();
    const [projects, setProjects] = useState([]);
    let filters = useRef({});

    useEffect(() => {
        ProjectService.getDesignerProjects(authenticatedUser.id).then((data) => {
            setProjects(data)
        }, (error) => {
            console.log(error)
        });
    }, []);


    function displayProjects() {
        if (projects.length >= 1) {
            return projects.map((data) => (
                <Tr>
                    <Td>{data.number}</Td>
                    <Td>{data.name}</Td>
                    <Td>{data.client}</Td>
                    <Td>{new Date(data.date_required).toLocaleDateString()}</Td>
                    <Td>{data.status[data.status.length - 1].value}</Td>
                </Tr>
            ));
        } else {
            return (
                <Tr>
                    <Th />
                    <Th />
                    <Th> No projects</Th>
                    <Th />
                    <Th />
                </Tr>
            );
        }
    }


    function filterProjects() {
        let displayedProjects = unfilteredProjects.current;

        for (const [key, value] of Object.entries(filters.current)) {
            if (key === "name") {
                displayedProjects = displayedProjects.filter((project) =>
                    project.name.toLowerCase().includes(value.toLowerCase())
                );
            }
            if (key === "number") {
                displayedProjects = displayedProjects.filter((project) =>
                    project.number.includes(value)
                );
            }
            if (key === "client") {
                displayedProjects = displayedProjects.filter((project) =>
                    project.client.toLowerCase().includes(value.toLowerCase())
                );
            }
            if (key === "from_date") {
                displayedProjects = displayedProjects.filter(
                    (project) =>
                        Date.parse(project.date_required) >= Date.parse(value)
                );
            }
            if (key === "to_date") {
                displayedProjects = displayedProjects.filter(
                    (project) =>
                        Date.parse(project.date_required) <= Date.parse(value)
                );
            }
            if (key === "status") {
                displayedProjects = displayedProjects.filter((project) =>
                    project.status[project.status.length - 1].value
                        .toLowerCase()
                        .includes(value.toLowerCase())
                );
            }
        }

        setProjects(displayedProjects);
    }

    function handleChange(event) {
        let inputChanged = event.target.name;
        let value = event.target.value;

        if (inputChanged === "project_name") {
            filters.current.name = value;
        } else if (inputChanged === "project_number") {
            filters.current.number = value;
        } else if (inputChanged === "project_client") {
            filters.current.client = value;
        } else if (inputChanged === "project_status") {
            filters.current.status = value;
        }

        filterProjects();
    }

    function handleDate(event) {
        if (this.name === "from_date") {
            filters.current.from_date = new Date(event);
        }
        if (this.name === "to_date") {
            filters.current.to_date = new Date(event);
        }

        filterProjects();
    }

    function handleKeyPress(event) {
        // checking if the key pressed is a letter and if so it prevents the
        // letter from being typed in
        let key = event.keyCode || event.which;
        key = String.fromCharCode(key);

        let regex = /[0-9]|\./;
        if (!regex.test(key)) {
            event.returnValue = false;
            if (event.preventDefault) event.preventDefault();
        }
    }

    function clearFilters() {
        //resetting filter values
        filters.current.name = "";
        filters.current.number = "";
        filters.current.client = "";
        filters.current.from_date = "";
        filters.current.to_date = "";
        filters.current.status = "";

        setProjects(unfilteredProjects.current);
    }

    return (
        <div>
            <Box m="10px">
                <Heading>Welcome back {authenticatedUser.firstname}!</Heading>
            </Box>
            <HStack m="10px">
                <InputGroup size="sm">
                    <InputLeftElement
                        pointerEvents="none"
                        children={<Search2Icon color="gray.300" />}
                    />
                    <Input
                        name="project_number"
                        value={filters.current.number}
                        placeholder="Number"
                        onKeyPress={handleKeyPress}
                        onChange={handleChange}
                    />
                </InputGroup>
                <InputGroup size="sm">
                    <InputLeftElement
                        pointerEvents="none"
                        children={<Search2Icon color="gray.300" />}
                    />
                    <Input
                        name="project_name"
                        onChange={handleChange}
                        placeholder="Project Name"
                        value={filters.current.name}
                    />
                </InputGroup>
                <InputGroup size="sm">
                    <InputLeftElement
                        pointerEvents="none"
                        children={<Search2Icon color="gray.300" />}
                    />
                    <Input
                        name="project_client"
                        value={filters.current.client}
                        onChange={handleChange}
                        placeholder="Client"
                    />
                </InputGroup>

                <InputGroup size="sm" w={"200%"}>
                    <Text color={"brand.accents"}> Date Required from </Text>
                    <Spacer />
                    <DatePicker
                        name="from_date"
                        placeholderText="choose a date"
                        selected={filters.current.from_date}
                        onSelect={handleDate}
                        dateFormat={"dd/MM/yyyy"}
                    />
                    <Text color={"brand.accents"}> to </Text>
                    <Spacer />
                    <DatePicker
                        name="to_date"
                        placeholderText="choose a date"
                        selected={filters.current.to_date}
                        onSelect={handleDate}
                        dateFormat={"dd/MM/yyyy"}
                    />
                </InputGroup>

                <Select
                    w="70%"
                    size="sm"
                    placeholder="Select a status"
                    name="project_status"
                    onChange={handleChange}
                    value={filters.current.status}
                >
                    <option value="Design Pending">Design Pending</option>
                    <option value="Preliminary Design Ongoing">
                        Preliminary Design Ongoing
                    </option>
                    <option value="Preliminary Design Complete">
                        Preliminary Design Complete
                    </option>
                    <option value="Awaiting Customer Approval">
                        Awaiting Customer Approval
                    </option>
                    <option value="Detailed Design Pending​">
                        Detailed Design Pending​
                    </option>
                    <option value="Detailed Design Ongoing​">
                        Detailed Design Ongoing​
                    </option>
                    <option value="Design Complete">Design Complete​​</option>
                    <option value="Project Complete">Project Complete</option>
                    <option value="Project Cancelled​">
                        Project Cancelled​
                    </option>
                </Select>
                <Button
                    size="sm"
                    w="20%"
                    colorScheme="red"
                    onClick={clearFilters}
                >
                    Clear All
                </Button>
            </HStack>
            <Box m="10px">
                <Table
                    variant="simple"
                    size="md"
                    borderWidth="2px"
                    borderColor="#463E39"
                    borderRadius="mg"
                    bg="brand.background"
                >
                    <Thead bg="brand.tertiary">
                        <Tr color="#463E39">
                            <Th>
                                <Text fontSize="lg">Number </Text>
                            </Th>
                            <Th>
                                <Text fontSize="lg">Name </Text>
                            </Th>
                            <Th>
                                <Text fontSize="lg">Client</Text>
                            </Th>
                            <Th>
                                <Text fontSize="lg">Date Required</Text>
                            </Th>
                            <Th>
                                <Text fontSize="lg">Status</Text>
                            </Th>
                        </Tr>
                    </Thead>
                    <Tbody>{displayDesignerProjects()}</Tbody>
                </Table>
            </Box>
        </div>
    );
};

export default BoardDesigner;
