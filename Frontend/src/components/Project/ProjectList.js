import React, {useContext, useEffect} from "react"
import * as UI from "@chakra-ui/react"
import projectContext from "../../context/project/projectsContext";
import Project from "./ProjectView";

const ProjectList = () => {
    const projectsContext = useContext(projectContext);
    const {projects, getProjects} = projectsContext;

    useEffect(() => {
        getProjects();
    }, [projects])

    if(projects.length === 0) {
        return <p>No projects available</p>
    }

    return (
        <>
            {
                projects.map((project) => (
                    <div>

                    </div>
                ))
            }
        </>
    )
}