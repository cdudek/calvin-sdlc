# Media: which pattern for which job

**Patterns (line range):** image-gallery 7-14 · image-upload 15-22 · video-player 23-29

Media handling and display patterns. Full pattern files: `patterns/media/<slug>.md`.

## image-gallery: Image Gallery

Display and browse image collections. Build effort medium.
- **Also called:** lightbox, photo grid
- **Use for:** Portfolio and gallery pages; Product image collections; Documentation screenshots and walkthroughs
- **Not for:** Use a simpler image, link, or file input if full media handling is not actually needed; Avoid rich custom controls when browser-native behavior is enough for the task; Do not assume network-heavy media is appropriate for every audience or context
- **Alternatives:** Carousel (content-management/carousel): when users need carousel instead of image gallery as the primary interaction | Modal (content-management/modal): when users need modal instead of image gallery as the primary interaction | Image Upload (media/image-upload): when users need image upload instead of image gallery as the primary interaction

## image-upload: Image Upload

Upload and preview images. Build effort medium.
- **Also called:** avatar upload, cropper
- **Use for:** Profile or avatar uploads; Listing and catalog management; Documenting work with screenshots or photos
- **Not for:** Use a simpler image, link, or file input if full media handling is not actually needed; Avoid rich custom controls when browser-native behavior is enough for the task; Do not assume network-heavy media is appropriate for every audience or context
- **Alternatives:** File Input (forms/file-input): when users need file input instead of image upload as the primary interaction | Drag and Drop (content-management/drag-and-drop): when users need drag and drop instead of image upload as the primary interaction | Progress Indicator (user-feedback/progress-indicator): when users need progress indicator instead of image upload as the primary interaction

## video-player: Video Player

Video playback with controls. Build effort high.
- **Use for:** Course and tutorial playback; Marketing and explainer video; Embedded product walkthroughs
- **Not for:** Use a simpler image, link, or file input if full media handling is not actually needed; Avoid rich custom controls when browser-native behavior is enough for the task; Do not assume network-heavy media is appropriate for every audience or context
- **Alternatives:** Loading Indicator (user-feedback/loading-indicator): when users need loading indicator instead of video player as the primary interaction | Progress Indicator (user-feedback/progress-indicator): when users need progress indicator instead of video player as the primary interaction | Image Gallery (media/image-gallery): when users need image gallery instead of video player as the primary interaction
