import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl, FormattedMessage, intlShape } from '@edx/frontend-platform/i18n';
import { getConfig } from '@edx/frontend-platform';
import { selectors } from '../../../../../data/redux';
import messages from './messages';

import TinyMceWidget from '../../../../../sharedComponents/TinyMceWidget';
import { prepareEditorRef, replaceStaticWithAsset } from '../../../../../sharedComponents/TinyMceWidget/hooks';

const QuestionWidget = ({
  // redux
  question,
  learningContextId,
  blockId,
  images,
  isLibrary,
  // injected
  intl,
}) => {
  const { editorRef, refReady, setEditorRef } = prepareEditorRef();
  const initialContent = question;
  const newContent = replaceStaticWithAsset({
    initialContent,
    learningContextId,
    blockId,
  });
  const questionContent = newContent || initialContent;
  let staticRootUrl;
  if (isLibrary) {
    staticRootUrl = `${getConfig().STUDIO_BASE_URL}/library_assets/blocks/${blockId}/`;
  }
  if (!refReady) { return null; }
  return (
    <div className="tinyMceWidget">
      <div className="h4 mb-3">
        <FormattedMessage {...messages.questionWidgetTitle} />
      </div>
      <TinyMceWidget
        id="question"
        editorType="question"
        editorRef={editorRef}
        editorContentHtml={questionContent}
        setEditorRef={setEditorRef}
        minHeight={150}
        placeholder={intl.formatMessage(messages.placeholder)}
        {...{
          images,
          isLibrary,
          learningContextId,
          blockId,
          staticRootUrl,
        }}
      />
    </div>
  );
};

QuestionWidget.propTypes = {
  // redux
  question: PropTypes.string.isRequired,
  learningContextId: PropTypes.string.isRequired,
  blockId: PropTypes.string,
  images: PropTypes.shape({}).isRequired,
  isLibrary: PropTypes.bool.isRequired,
  // injected
  intl: intlShape.isRequired,
};
QuestionWidget.defaultProps = {
  blockId: null,
};
export const mapStateToProps = (state) => ({
  question: selectors.problem.question(state),
  learningContextId: selectors.app.learningContextId(state),
  blockId: selectors.app.blockId(state),
  images: selectors.app.images(state),
  isLibrary: selectors.app.isLibrary(state),
});

export const QuestionWidgetInternal = QuestionWidget; // For testing only
export default injectIntl(connect(mapStateToProps)(QuestionWidget));
