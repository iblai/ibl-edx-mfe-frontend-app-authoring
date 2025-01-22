import TextareaAutosize from "react-textarea-autosize";
import PropTypes from "prop-types";
import { Form, Dropdown } from "@openedx/paragon";
import SectionSubHeader from "../../generic/section-sub-header";

function renderField(courseSettings, editSettings, param, onChange) {
  if (param.type === "SelectField") {
    return (
      <Dropdown className="bg-white">
        <Dropdown.Toggle variant="outline-primary" id={param.fieldId}>
          {param.config.label}
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {courseSettings[param.config.optionsKey]?.map((option) => (
            <Dropdown.Item
              key={option.value}
              onClick={() => onChange(option.value, param.config.formKey)}
              active={editSettings[param.config.optionsKey] === option.value}
            >
              {option.label}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    );
  }
  return (
    <Form.Control
      as={param.config.asTextarea ? TextareaAutosize : "input"}
      value={courseSettings[param.config.formKey]}
      name={param.config.formKey}
      maxLength={param.maxLength}
      onChange={(e) => onChange(e.target.value, param.config.formKey)}
      aria-label={param.config.label}
    />
  );
}

export const CourseMetadataSection = ({
  aboutPageEditable,
  mfeConfig,
  courseSettings,
  editSettings,
  onChange,
}) => {
  return (
    <section className="section-container course-metadata-section">
      {aboutPageEditable && (
        <SectionSubHeader
          title="Course Metadata"
          description="Add additional metadata about your course"
        />
      )}
      {aboutPageEditable &&
        (mfeConfig.STUDIO_COURSE_METADATA_FIELDS || []).map((param) => (
          <Form.Group className="form-group-custom" key={param.config.label}>
            <Form.Label>{param.config.label}</Form.Label>
            {renderField(courseSettings, editSettings, param, onChange)}
            <Form.Control.Feedback>{param.config.tip}</Form.Control.Feedback>
          </Form.Group>
        ))}
    </section>
  );
};

CourseMetadataSection.propTypes = {
  onChange: PropTypes.func.isRequired,
  mfeConfig: PropTypes.object.isRequired,
  courseSettings: PropTypes.object.isRequired,
  aboutPageEditable: PropTypes.bool.isRequired,
};
