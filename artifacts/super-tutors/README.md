# Super Tutors

Lightweight Bhopal tutoring website for parents, students and tutors. The site is static-first: it has no custom database, user accounts, payments or authentication.

## Run locally

From the workspace root:

```bash
pnpm --filter @workspace/super-tutors run dev
```

## Deploy to GitHub and Vercel

1. Push the project to GitHub.
2. Import the repository into Vercel.
3. Use the default Vite build settings, or set:
   - Build command: `pnpm --filter @workspace/super-tutors run build`
   - Output directory: `artifacts/super-tutors/dist/public`
4. Deploy as a static site.

## Central configuration

The editable business and integration values live in `src/config.ts`:

- `business.name`
- `business.phone`
- `business.whatsappUrl`
- `business.address`
- `business.googleReviewsUrl`
- `siteConfig.parentFormUrl`
- `siteConfig.tutorFormUrl`
- `siteConfig.tutorInterestFormUrl`
- `siteConfig.assignmentsApiUrl`
- `siteConfig.assignmentsApiEnabled`

The current phone number is `+91 9993337582`. Replace form URLs and uncertain business details only after confirming them with the owner.

## Google Forms

The parent and tutor pages open configurable Google Forms when their URLs are present. Until those URLs are added, both pages keep a smaller WhatsApp fallback so the website remains usable.

## Live assignments

The assignments page supports:

- Live JSON from Google Apps Script
- `Status = Open` and `Publish = YES` filtering in the Apps Script layer
- Client-side class, board, subject, area, mode and timing filters
- A public-field-only response shape
- Demo assignments when the API is disabled
- Friendly loading, empty and API-error states
- Assignment-specific interest links

The Apps Script starter and setup instructions are in `apps-script/`.

## Matching workflow

The Apps Script starter includes advisory matching scores:

- Subject: 30
- Class: 20
- Board: 15
- Locality: 15
- Timing: 10
- Days: 5
- Mode: 5

The business owner remains responsible for tutor verification, the final tutor decision, fee discussion, parent communication and assignment confirmation.

## Important privacy rule

Do not put private Google Sheet columns, credentials, service-account keys or Apps Script secrets into the frontend or GitHub. The public assignments response must be explicitly constructed from safe fields.