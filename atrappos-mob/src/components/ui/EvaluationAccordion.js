import React from 'react';
import {Accordion, Card} from "react-bootstrap";
import {RadioSelectionGroup} from "../content/RadioSelectionGroup";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheckSquare} from "@fortawesome/free-solid-svg-icons";


export const EvaluationAccordion = (props) => {
    const {showSave} = props;
    return (
        <Accordion defaultActiveKey="0">
            <Card className="evaluation__card">
                <Accordion.Toggle as={Card.Header} eventKey="0">
                   <i>
                       <FontAwesomeIcon icon={faCheckSquare} />
                   </i>
                    <span>Evaluate</span>
                </Accordion.Toggle>
                <Accordion.Collapse eventKey="0">
                    <Card.Body>
                        <RadioSelectionGroup />

                    </Card.Body>
                </Accordion.Collapse>
            </Card>
            <Card className="snap_card">
                <Accordion.Toggle as={Card.Header} eventKey="1">
                    <span>Snap to road</span>
                </Accordion.Toggle>
                <Accordion.Collapse eventKey="1">
                    <Card.Body>Hello! I'm another body</Card.Body>
                </Accordion.Collapse>
            </Card>
        </Accordion>
    );
};

