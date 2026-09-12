# Super Tutors Apps Script setup

This folder contains the optional Google Apps Script layer for live assignments and lead management. The public website remains usable before this automation is connected.

## 1. Create the Google Sheet tabs

Create these tabs:

- `PARENT_LEADS`
- `TUTORS`
- `ASSIGNMENTS`
- `MATCHES`
- `INTERESTED_TUTORS`

Use the suggested column names from the long-form project brief. The `ASSIGNMENTS` tab must include at least:

`Assignment ID`, `Class`, `Board`, `Subject`, `Area`, `Locality`, `Mode`, `Timing`, `Days`, `Duration`, `Fee`, `Description`, `Status`, `Publish`, `Created Date`, `Last Updated`, `Assigned Tutor ID`.

## 2. Add the script

1. Open the spreadsheet.
2. Choose **Extensions → Apps Script**.
3. Replace the starter file with `Code.gs`.
4. Save the project.
5. Add installable form-submit triggers for `onParentFormSubmit` and `onTutorFormSubmit`.

The script keeps private parent/student data in the sheet and explicitly selects only public fields for the website endpoint.

## 3. Publish the public endpoint

1. Choose **Deploy → New deployment**.
2. Select **Web app**.
3. Run as the spreadsheet owner.
4. Choose access that matches the owner's privacy decision.
5. Copy the `/exec` URL.
6. Put it in `src/config.ts` as `assignmentsApiUrl`.
7. Change `assignmentsApiEnabled` to `true`.

The endpoint returns:

```json
{
  "success": true,
  "updatedAt": "2026-01-01T00:00:00.000Z",
  "assignments": [
    {
      "id": "ST-104",
      "class": "7",
      "board": "ICSE",
      "subject": "All Subjects",
      "area": "Arera Colony",
      "mode": "Home",
      "timing": "After 4 PM",
      "days": "6 Days / Week",
      "duration": "1.5 Hours",
      "fee": "₹4,000/month",
      "status": "Open"
    }
  ]
}
```

Only rows where `Status = Open` and `Publish = YES` appear publicly. When a row changes to `Filled` or `Closed`, it disappears from the public page on the next fetch.

## 4. Connect the website

Update only the central configuration in `src/config.ts`:

- `parentFormUrl`
- `tutorFormUrl`
- `tutorInterestFormUrl`
- `assignmentsApiUrl`
- `assignmentsApiEnabled`

If a form URL is blank, the website shows a clear configuration note and keeps the WhatsApp fallback available. If the API is disabled, demo assignments are shown with an explicit sample label.

## Privacy checklist

Never return parent names, student names, phone numbers, exact addresses, private notes, tutor phone numbers, documents, credentials or full spreadsheet rows from the public endpoint.