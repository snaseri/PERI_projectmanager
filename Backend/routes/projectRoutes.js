const express = require("express");
const router = express.Router();
const projects = require("../models/projectModel");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

urlencodedParser = bodyParser.urlencoded({ extended: false });
jsonParser = bodyParser.json();

router.post("/addProject", jsonParser, (req, res) => {
    let newProject = new projects();
    newProject._id = new mongoose.Types.ObjectId();
    newProject.number = req.body.number;
    newProject.name = req.body.name;
    newProject.system = req.body.system;
    newProject.sector = req.body.sector;
    newProject.description = req.body.description;
    newProject.client = req.body.client;
    newProject.engineers.sales_engineer_id =
        req.body.engineers.sales_engineer_id;
    newProject.engineers.technical_lead_id =
        req.body.engineers.technical_lead_id;
    newProject.engineers.designer_id = req.body.engineers.designer_id;
    newProject.engineers.design_checker_id = req.body.design_checker_id;
    newProject.date_required = req.body.date_required;
    newProject.anticipated_date = req.body.anticipated_date;
    newProject.status.push({ time_set: new Date(), value: req.body.status });

    newProject.save((err) => {
        if (err) return res.json({ success: false, error: err });
        return res.json({ success: true });
    });
});

router.get(
    "/api/projects/getProjectsByDesigner/:designerID",
    jsonParser,
    (req, res) => {
        let designerId = new mongoose.Types.ObjectId(req.params.designerID);
        projects.find({ "engineers.designer_id": designerId }, (err, data) => {
            if (err) {
                return res.json({ success: false, error: err });
            } else {
                return res.json({ success: true, data: data });
            }
        });
    }
);

router.get(
    "/api/projects/getProjectsByTechnicalLead/:technicalLeadID",
    jsonParser,
    (req, res) => {
        let technicalLeadId = new mongoose.Types.ObjectId(
            req.params.technicalLeadID
        );
        projects.find(
            { "engineers.technical_lead_id": technicalLeadId },
            (err, data) => {
                if (err) {
                    return res.json({ success: false, error: err });
                } else {
                    return res.json({ success: true, data: data });
                }
            }
        );
    }
);

router.get(
    "/api/projects/getProjectsWithDesignEngineersByEngineerID/:engineerID",
    jsonParser,
    (req, res) => {
        let engineerId = new mongoose.Types.ObjectId(req.params.engineerID);
        projects
            .find(
                {
                    $or: [
                        { "engineers.sales_engineer_id": engineerId },
                        { "engineers.technical_lead_id": engineerId },
                        { "engineers.designer_id": engineerId },
                        { "engineers.design_checker_id": engineerId },
                    ],
                },
                (err, data) => {
                    if (err) {
                        return res.json({ success: false, error: err });
                    } else {
                        return res.json({ success: true, data: data });
                    }
                }
            )
            .populate("engineers.designer_id")
            .populate("engineers.design_checker_id");
    }
);

router.get(
    "/api/projects/filter/getProjectsWithDesignEngineersByEngineerID/:engineerID",
    jsonParser,
    (req, res) => {
        let engineerId = new mongoose.Types.ObjectId(req.params.engineerID);

        let filters = {
            $or: [
                { "engineers.sales_engineer_id": engineerId },
                { "engineers.technical_lead_id": engineerId },
                { "engineers.designer_id": engineerId },
                { "engineers.design_checker_id": engineerId },
            ],
        };

        let filterNames = Object.keys(req.query);

        for (let i = 0; i < filterNames.length; i++) {
            if (filterNames[i] === "from_date") {
                if (filters["date_required"] === undefined) {
                    filters["date_required"] = {};
                }
                filters["date_required"]["$gte"] = new Date(
                    req.query[filterNames[i]]
                );
            } else if (filterNames[i] === "to_date") {
                if (filters["date_required"] === undefined) {
                    filters["date_required"] = {};
                }
                filters["date_required"]["$lt"] = new Date(
                    req.query[filterNames[i]]
                );
            }
            // else if (filterNames[i] === "status") {
            //     filters[filterNames[i]] = {
            //         $arrayElemAt: ["$status", -1],
            //         value: req.query[filterNames[i]],
            //     };
            // }
            else {
                filters[filterNames[i]] = {
                    $regex: req.query[filterNames[i]],
                    $options: "i",
                };
            }
        }

        projects
            .find(filters, (err, data) => {
                if (err) {
                    return res.json({ success: false, error: err });
                } else {
                    return res.json({ success: true, data: data });
                }
            })
            .populate("engineers.designer_id")
            .populate("engineers.design_checker_id");
    }
);

router.put(
    "/api/projects/updateProjectStatus/:projectID/:aStatus",
    jsonParser,
    (req, res) => {
        let designerId = new mongoose.Types.ObjectId(req.params.projectID);
        projects
            .findById(designerId, (err, data) => {
                if (err) {
                    return res.json({ success: false, error: err });
                } else {
                    let project = data;
                    project.status.push({
                        time_set: new Date(),
                        value: req.params.aStatus,
                    });
                    project.save();
                    return res.json({ success: true, data: data });
                }
            })
            .populate("engineers.designer_id")
            .populate("engineers.design_checker_id");
    }
);

router.put(
    "/api/projects/updateProjectDesignEngineer/:projectID/:anEngineerId",
    jsonParser,
    (req, res) => {
        let projectID = new mongoose.Types.ObjectId(req.params.projectID);
        let engineerID = new mongoose.Types.ObjectId(req.params.anEngineerId);

        projects
            .findById(projectID, (err, data) => {
                if (err) {
                    return res.json({ success: false, error: err });
                } else {
                    let project = data;
                    project.engineers.designer_id = engineerID;
                    project.save();
                    return res.json({ success: true, data: data });
                }
            })
            .populate("engineers.designer_id")
            .populate("engineers.design_checker_id");
    }
);
router.put(
    "/api/projects/updateProjectDesignChecker/:projectID/:anEngineerId",
    jsonParser,
    (req, res) => {
        let projectID = new mongoose.Types.ObjectId(req.params.projectID);
        let engineerID = new mongoose.Types.ObjectId(req.params.anEngineerId);

        projects.findById(projectID, (err, data) => {
            if (err) {
                return res.json({ success: false, error: err });
            } else {
                let project = data;
                project.engineers.design_checker_id = engineerID;
                project.save();
                projects
                    .findById(projectID)
                    .populate("engineers.design_checker_id")
                    .populate("engineers.designer_id")
                    .exec((err, project) => {
                        return res.json({ success: true, data: project });
                    });
            }
        });
    }
);

router.get(
    "/api/projects/getProjectByID/:projectId",
    jsonParser,
    (req, res) => {
        let projectId = new mongoose.Types.ObjectId(req.params.projectId);
        projects.findById({ _id: projectId }, (err, data) => {
            if (err) {
                return res.json({ success: false, error: err });
            } else {
                return res.json({ success: true, data: data });
            }
        });
    }
);

module.exports = router;
