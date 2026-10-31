# Social: which pattern for which job

**Patterns (line range):** activity-feed 7-14 · comment-system 15-22 · like-button 23-30 · share-dialog 31-38

Social interaction and engagement patterns. Full pattern files: `patterns/social/<slug>.md`.

## activity-feed: Activity Feed

Social activity and updates stream. Build effort high.
- **Also called:** news feed
- **Use for:** Project and team updates; Community or social streams; Audit and changelog-style feeds
- **Not for:** Avoid social or engagement mechanics when they do not create real user value; Do not add public counts or visibility states without understanding the trust implications; Do not ship the surface without moderation, abuse, or reversal planning
- **Alternatives:** Comment System (social/comment-system): when users need comment system instead of activity feed as the primary interaction | Notification (user-feedback/notification): when users need notification instead of activity feed as the primary interaction | Infinite Scroll (navigation/infinite-scroll): when users need infinite scroll instead of activity feed as the primary interaction

## comment-system: Comment System

User comments and discussion threads. Build effort high.
- **Also called:** comments, threads, replies
- **Use for:** Article and discussion comments; Team review threads; Support and community conversations
- **Not for:** Avoid social or engagement mechanics when they do not create real user value; Do not add public counts or visibility states without understanding the trust implications; Do not ship the surface without moderation, abuse, or reversal planning
- **Alternatives:** Textarea (forms/textarea): when users need textarea instead of comment system as the primary interaction | Activity Feed (social/activity-feed): when users need activity feed instead of comment system as the primary interaction | Notification (user-feedback/notification): when users need notification instead of comment system as the primary interaction

## like-button: Like Button

Like and reaction buttons. Build effort low.
- **Also called:** reactions
- **Use for:** Social or content reactions; Lightweight endorsement signals; Bookmark-like appreciation moments
- **Not for:** Avoid social or engagement mechanics when they do not create real user value; Do not add public counts or visibility states without understanding the trust implications; Do not ship the surface without moderation, abuse, or reversal planning
- **Alternatives:** Response Feedback (ai-intelligence/response-feedback): when users need response feedback instead of like button as the primary interaction | Rating Input (forms/rating-input): when users need rating input instead of like button as the primary interaction | Notification (user-feedback/notification): when users need notification instead of like button as the primary interaction

## share-dialog: Share Dialog

Social sharing functionality. Build effort medium.
- **Also called:** share sheet
- **Use for:** Copying and sharing links; Native mobile share handoff; Referral or invite flows
- **Not for:** Avoid social or engagement mechanics when they do not create real user value; Do not add public counts or visibility states without understanding the trust implications; Do not ship the surface without moderation, abuse, or reversal planning
- **Alternatives:** Modal (content-management/modal): when users need modal instead of share dialog as the primary interaction | Notification (user-feedback/notification): when users need notification instead of share dialog as the primary interaction | Like Button (social/like-button): when users need like button instead of share dialog as the primary interaction
