# Authentication: which pattern for which job

**Patterns (line range):** account-settings 7-14 · login 15-22 · password-reset 23-30 · signup 31-38 · social-login 39-46 · two-factor 47-54 · user-profile 55-62

Authentication and user management patterns. Full pattern files: `patterns/authentication/<slug>.md`.

## account-settings: Account Settings

User account configuration and preferences. Build effort medium. Popularity high.
- **Also called:** preferences, settings page
- **Use for:** Changing account email or password; Managing notification preferences (email, push, in-app); Configuring privacy and data sharing settings; Setting up or managing two-factor authentication; Managing connected applications and social login providers; Deleting or deactivating an account
- **Not for:** Public-facing profile display (use User Profile instead) → user-profile; Application-level settings that affect all users (use an admin panel); First-time onboarding configuration (use an onboarding wizard); Content or project settings specific to a workspace (use project settings)
- **Alternatives:** User Profile (authentication/user-profile): when displaying user information publicly or editing profile details like name and avatar | Two-Factor Authentication (authentication/two-factor): when setting up or managing the second authentication factor | Password Reset (authentication/password-reset): when the user has forgotten their password and needs recovery

## login: Login Form

User authentication and sign-in forms. Build effort medium. Popularity high.
- **Also called:** sign in
- **Use for:** Web applications requiring user authentication before accessing features; E-commerce sites where users sign in to view orders, wishlists, and saved addresses; SaaS platforms gating features behind user accounts; Community or social platforms requiring identity for participation; Admin dashboards and internal tools with role-based access
- **Not for:** Public-facing pages that don't require authentication; Read-only content that benefits from open access (blogs, documentation); One-time interactions where authentication creates unnecessary friction; Kiosk or shared-device interfaces where session management is impractical
- **Alternatives:** Social Login (authentication/social-login): when users prefer authenticating via existing accounts (Google, GitHub, Apple) | Sign Up Flow (authentication/signup): when the user doesn't have an account yet and needs to register | Two-Factor Authentication (authentication/two-factor): when additional security is needed beyond username and password

## password-reset: Password Reset

Password recovery and reset flows. Build effort medium. Popularity high.
- **Also called:** forgot password
- **Use for:** User forgot their password and cannot log in; User wants to change a potentially compromised password; Administrator triggers a mandatory password reset for security; Account recovery after detecting suspicious activity; Periodic password rotation required by security policies
- **Not for:** Passwordless authentication systems (magic links replace the need); Applications using only social login without local passwords; SSO-only environments where the identity provider handles password management; Systems where admins provision temporary credentials directly
- **Alternatives:** Login Form (authentication/login): when the user remembers their password and needs to authenticate | Social Login (authentication/social-login): when the user can authenticate via a third-party provider instead | Two-Factor Authentication (authentication/two-factor): when additional verification is needed during the reset process

## signup: Sign Up Flow

User registration and account creation. Build effort medium. Popularity high.
- **Also called:** registration, sign up
- **Use for:** Web applications requiring user accounts for personalized features; E-commerce platforms where accounts enable order tracking and wishlists; SaaS products gating features behind registered accounts; Community platforms where identity is needed for participation; Subscription services requiring billing and profile information
- **Not for:** Content that should be freely accessible without registration; One-time transactions where guest checkout suffices; Internal tools where accounts are provisioned by administrators; Situations where a login wall would drive users away (consider delayed registration)
- **Alternatives:** Login Form (authentication/login): when the user already has an account and needs to authenticate | Social Login (authentication/social-login): when users prefer registering via existing provider accounts | Account Settings (authentication/account-settings): when users need to update profile information after initial registration

## social-login: Social Login

OAuth and social media authentication. Build effort medium. Popularity high.
- **Also called:** SSO, OAuth, sign in with Google
- **Use for:** Consumer web applications where speed of registration matters; Developer tools where GitHub authentication is natural; Mobile apps where Google or Apple sign-in follows platform conventions; E-commerce sites reducing checkout friction for guest users; Community platforms where social identity adds credibility
- **Not for:** Enterprise or B2B applications where corporate SSO (SAML) is the norm; Highly regulated industries (healthcare, finance) where provider dependency is a risk; Applications requiring identity verification beyond what providers offer; Offline-first applications where OAuth redirects are impractical; When your user base has strong privacy concerns about third-party data sharing
- **Alternatives:** Login Form (authentication/login): when users should authenticate with email and password | Sign Up Flow (authentication/signup): when collecting more user data during registration is needed | Two-Factor Authentication (authentication/two-factor): when additional verification beyond the initial authentication

## two-factor: Two-Factor Authentication

Two-factor authentication setup and verification. Build effort high. Popularity high.
- **Also called:** 2FA, MFA, OTP
- **Use for:** Financial applications, banking, and payment platforms; Email services and communication platforms; Admin dashboards and privileged user accounts; Healthcare and legal applications with sensitive data; Developer platforms with access to infrastructure and code repositories
- **Not for:** Low-risk applications where the cost of 2FA outweighs the security benefit; Applications targeting users with limited technical proficiency (consider risk-based auth instead); When the friction of 2FA would significantly reduce adoption of a consumer product (make it optional); Kiosk or shared-device environments where device-based factors are impractical
- **Alternatives:** Login Form (authentication/login): when basic password authentication is sufficient for the security level | Social Login (authentication/social-login): when delegating authentication to a trusted provider | Password Reset (authentication/password-reset): when recovering access to an account

## user-profile: User Profile

User profile and account management. Build effort medium. Popularity high.
- **Also called:** profile page
- **Use for:** Displaying a user's public profile on community or social platforms; Showing the authenticated user's own profile with edit capabilities; Team member profiles in collaboration tools; Author profiles on content platforms (blogs, documentation); Contributor profiles on open-source or marketplace platforms
- **Not for:** Account security settings (use Account Settings) → account-settings; Application-level configuration unrelated to the user (use app settings); Contact cards in a directory where interaction isn't needed (use a simple card component); User management admin panels (use a data table or admin interface)
- **Alternatives:** Account Settings (authentication/account-settings): when managing security, notifications, and account configuration | Sign Up Flow (authentication/signup): when collecting initial user information during registration | Login Form (authentication/login): when authenticating user identity, not displaying it
