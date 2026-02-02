# Changelog

## [0.1.1] - 2026-02-02

### Fixed
- **Library Image Preview in TinyMCE Editor**: Fixed broken image display in TinyMCE editor for library content
  - Images uploaded to library problems were not rendering in the editor due to authentication requirements on cross-origin API URLs
  - Now uses TinyMCE's `document_base_url` with the `library_assets` endpoint to resolve relative image paths, matching the existing TextEditor approach
  - QuestionWidget and ExplanationWidget now compute and pass `staticRootUrl` to TinyMceWidget
  - `replaceStaticWithAsset()` converts `/static/filename` to relative `static/filename` for library content, allowing `document_base_url` resolution

- **Library Image Upload Deduplication**: Fixed duplicate image detection for library assets
  - `imageMatchRegex` only matched course `asset-v1` URLs, causing library image dedup to fail
  - Added filename-based fallback comparison in `matchImageStringsByIdentifiers()`

- **Library Image Insert Flow**: Fixed image insertion to use resolvable URLs
  - `imgProps()` now extracts `static/filename` from the full API URL for library images
  - TinyMCE's `document_base_url` resolves these to the correct `library_assets` endpoint

- **Library Image Save Flow**: Fixed save to convert full URLs back to portable paths
  - `setAssetToStaticUrl()` now handles both API URLs (`/api/libraries/v2/blocks/.../assets/static/...`) and `library_assets` URLs (`/library_assets/blocks/.../static/...`)
  - Converts both patterns back to portable `/static/filename` in stored OLX

- **isLibrary Prop Bug**: Fixed `isLibrary` always being `true` in ImageUploadModal
  - TinyMceWidget was passing `isLibrary` as a bare JSX attribute (equivalent to `isLibrary={true}`)
  - Now correctly passes `isLibrary={isLibrary}` to reflect the actual context

### Files Modified
- `src/editors/sharedComponents/TinyMceWidget/hooks.js` - URL conversion logic for library images
- `src/editors/sharedComponents/TinyMceWidget/index.jsx` - Fixed isLibrary prop passing
- `src/editors/sharedComponents/ImageUploadModal/index.jsx` - Library image insertion paths
- `src/editors/containers/ProblemEditor/components/EditProblemView/QuestionWidget/index.jsx` - Added staticRootUrl
- `src/editors/containers/ProblemEditor/components/EditProblemView/ExplanationWidget/index.jsx` - Added staticRootUrl
- `src/editors/containers/TextEditor/index.jsx` - Pass blockId to replaceStaticWithAsset

---

## [0.1.0] - Initial IBL fork

### Added
- IBL customizations for MFE configuration handling
