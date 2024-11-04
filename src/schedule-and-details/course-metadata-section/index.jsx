import TextareaAutosize from "react-textarea-autosize";
import { Form } from "@openedx/paragon";
import SectionSubHeader from "../../generic/section-sub-header";

function renderField(courseSettings, param, onChange) {
  if (param.type === "SelectField") {
    return (
      <Dropdown className="bg-white">
        <Dropdown.Toggle variant="outline-primary" id={param.fieldId}>
          {param.config.defaultValue}
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {courseSettings[param.config.optionsKey]?.map((option) => (
            <Dropdown.Item
              key={option[0]}
              onClick={() => onChange(option[0], param.config.formKey)}
            >
              {option[1]}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    );
  }
  return (
    <Form.Control
      as={param.config.asTextarea ? TextareaAutosize : "input"}
      value={param.config.defaultValue}
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
            {renderField(courseSettings, param, onChange)}
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
