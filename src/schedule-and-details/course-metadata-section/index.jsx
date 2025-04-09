import TextareaAutosize from "react-textarea-autosize";
import PropTypes from "prop-types";
import { Form, Dropdown } from "@openedx/paragon";
import SectionSubHeader from "../../generic/section-sub-header";

function renderField(courseSettings, editedValues, param, onChange) {
  console.log('Rendering field:', param);
  console.log('Course settings:', courseSettings);
  console.log('Edited values:', editedValues);

  if (param.type === "SelectField") {
    const options = courseSettings.formChoices?.[param.config.optionsKey] || [];
    console.log('Select field config:', {
      optionsKey: param.config.optionsKey,
      formKey: param.config.formKey,
      options,
      currentValue: editedValues[param.config.formKey],
      defaultValue: param.config.defaultValue
    });

    return (
      <Dropdown className="bg-white">
        <Dropdown.Toggle variant="outline-primary" id={param.fieldId}>
          {editedValues[param.config.formKey] || param.config.defaultValue || '---'}
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {options.map((option) => {
            console.log('Rendering option:', option);
            return (
              <Dropdown.Item
                key={option.value}
                onClick={() => {
                  console.log('Selected option:', option);
                  onChange(option.value, param.config.formKey);
                }}
                active={editedValues[param.config.formKey] === option.value}
              >
                {option.label}
              </Dropdown.Item>
            );
          })}
        </Dropdown.Menu>
      </Dropdown>
    );
  }

  if (param.type === "TagField") {
    // Convert string of tags to array if needed
    const currentValue = editedValues[param.config.formKey] || '';
    const tags = typeof currentValue === 'string' ? currentValue.split(',').filter(Boolean) : currentValue;

    return (
      <div>
        <Form.Control
          value={tags.join(', ')}
          placeholder={param.config.placeholder}
          onChange={(e) => {
            const newTags = e.target.value.split(',').map(tag => tag.trim()).filter(Boolean);
            onChange(newTags, param.config.formKey);
          }}
          aria-label={param.config.label}
          title={param.config.titleTip}
        />
      </div>
    );
  }

  return (
    <Form.Control
      as={param.config.asTextarea ? TextareaAutosize : "input"}
      value={editedValues[param.config.formKey] || ''}
      name={param.config.formKey}
      placeholder={param.config.placeholder}
      onChange={(e) => onChange(e.target.value, param.config.formKey)}
      aria-label={param.config.label}
    />
  );
}

export const CourseMetadataSection = ({
  aboutPageEditable,
  mfeConfig,
  courseSettings,
  editedValues,
  onChange,
}) => {
  console.log('CourseMetadataSection props:', {
    aboutPageEditable,
    mfeConfig,
    courseSettings,
    editedValues
  });

  return (
    <section className="section-container course-metadata-section">
      <SectionSubHeader
        title="Course Metadata"
        description="Add additional metadata about your course"
      />
      {(mfeConfig.STUDIO_COURSE_METADATA_FIELDS || []).map((param) => (
        <Form.Group className="form-group-custom" key={param.config.label}>
          <Form.Label>{param.config.label}</Form.Label>
          {renderField(courseSettings, editedValues, param, onChange)}
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
  editedValues: PropTypes.object.isRequired,
  aboutPageEditable: PropTypes.bool,
};

export default CourseMetadataSection;
