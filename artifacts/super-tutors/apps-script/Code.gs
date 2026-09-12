/*
 * Super Tutors — Google Apps Script starter
 *
 * Paste this file into a Google Apps Script project connected to the
 * spreadsheet that contains the tabs listed in README.md.
 *
 * Before publishing:
 * 1. Confirm the sheet tab names and header names.
 * 2. Add installable form-submit triggers for the parent and tutor forms.
 * 3. Deploy as a web app and copy the public /exec URL into src/config.ts.
 *
 * The public endpoint intentionally constructs a small response from
 * allow-listed assignment fields. It never serializes a full spreadsheet row.
 */

const SHEETS = {
  parents: 'PARENT_LEADS',
  tutors: 'TUTORS',
  assignments: 'ASSIGNMENTS',
  matches: 'MATCHES',
  interests: 'INTERESTED_TUTORS',
};

function doGet() {
  const response = {
    success: true,
    updatedAt: new Date().toISOString(),
    assignments: getPublicAssignments(),
  };

  return ContentService
    .createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
}

function getPublicAssignments() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEETS.assignments);
  if (!sheet || sheet.getLastRow() < 2) return [];

  const rows = sheet.getDataRange().getDisplayValues();
  const headers = rows.shift();
  const records = rows.map(function(row) {
    return headers.reduce(function(record, header, index) {
      record[header] = row[index];
      return record;
    }, {});
  });

  return records
    .filter(function(record) {
      return String(record.Status).toLowerCase() === 'open' &&
        String(record.Publish).toLowerCase() === 'yes';
    })
    .sort(function(a, b) {
      return new Date(b['Created Date']).getTime() - new Date(a['Created Date']).getTime();
    })
    .map(function(record) {
      return {
        id: record['Assignment ID'] || '',
        class: record.Class || '',
        board: record.Board || '',
        subject: record.Subject || '',
        area: record.Area || record.Locality || '',
        mode: record.Mode || '',
        timing: record.Timing || '',
        days: record.Days || '',
        duration: record.Duration || '',
        fee: record.Fee || '',
        status: 'Open',
        createdDate: record['Created Date'] || '',
      };
    })
    .filter(function(record) {
      return record.id && record.class && record.board && record.subject && record.area;
    });
}

function onParentFormSubmit(event) {
  const values = event.namedValues || {};
  const leadId = generateId('LEAD');
  const assignmentId = generateAssignmentId();
  const assignments = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEETS.assignments);

  // Keep private form values in the parent sheet. Only the public fields below
  // should ever be copied to ASSIGNMENTS after owner review.
  appendNamedValues(SHEETS.parents, values, leadId);

  if (assignments) {
    assignments.appendRow([
      assignmentId,
      leadId,
      firstValue(values, 'Class'),
      firstValue(values, 'Board'),
      firstValue(values, 'Subjects'),
      firstValue(values, 'Locality'),
      firstValue(values, 'Locality'),
      firstValue(values, 'Mode'),
      firstValue(values, 'Preferred Timing'),
      firstValue(values, 'Preferred Days'),
      firstValue(values, 'Duration'),
      '',
      firstValue(values, 'Additional Requirement'),
      'New',
      'NO',
      new Date(),
      new Date(),
      '',
    ]);
  }

  sendOwnerNotification('New parent requirement ' + leadId + ' created assignment ' + assignmentId);
}

function onTutorFormSubmit(event) {
  const values = event.namedValues || {};
  const tutorId = generateId('TUTOR');
  appendNamedValues(SHEETS.tutors, values, tutorId);
  sendOwnerNotification('New tutor registration ' + tutorId + ' received.');
}

function createAssignment(parentLeadId, publicFields) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEETS.assignments);
  if (!sheet) throw new Error('ASSIGNMENTS sheet not found');
  const assignmentId = generateAssignmentId();
  sheet.appendRow([
    assignmentId,
    parentLeadId,
    publicFields.class || '',
    publicFields.board || '',
    publicFields.subject || '',
    publicFields.area || '',
    publicFields.locality || publicFields.area || '',
    publicFields.mode || '',
    publicFields.timing || '',
    publicFields.days || '',
    publicFields.duration || '',
    publicFields.fee || '',
    publicFields.description || '',
    'New',
    'NO',
    new Date(),
    new Date(),
    '',
  ]);
  return assignmentId;
}

function generateAssignmentId() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEETS.assignments);
  const nextNumber = Math.max(sheet ? sheet.getLastRow() : 0, 1) + 100;
  return 'ST-' + nextNumber;
}

function findMatchingTutors(assignment) {
  // Keep matching suggestions advisory. The owner makes the final decision.
  return calculateMatchScore(assignment, readTutorProfiles())
    .sort(function(a, b) { return b.totalScore - a.totalScore; })
    .slice(0, 10);
}

function calculateMatchScore(assignment, tutors) {
  return tutors.map(function(tutor) {
    const subject = sameValue(tutor.Subjects, assignment.subject) ? 30 : 0;
    const classScore = sameValue(tutor['Classes Taught'], assignment.class) ? 20 : 0;
    const board = sameValue(tutor.Boards, assignment.board) ? 15 : 0;
    const locality = sameValue(tutor.Areas, assignment.area) ? 15 : 0;
    const timing = sameValue(tutor['Preferred Timing'], assignment.timing) ? 10 : 0;
    const days = sameValue(tutor['Available Days'], assignment.days) ? 5 : 0;
    const mode = sameValue(tutor['Teaching Mode'], assignment.mode) ? 5 : 0;
    const totalScore = subject + classScore + board + locality + timing + days + mode;
    return {
      tutorId: tutor['Tutor ID'],
      totalScore: totalScore,
      category: totalScore >= 90 ? 'Excellent Match' :
        totalScore >= 75 ? 'Good Match' :
        totalScore >= 60 ? 'Possible Match' : 'Low Match',
    };
  });
}

function saveMatches(assignmentId, matches) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEETS.matches);
  if (!sheet) return;
  matches.forEach(function(match) {
    sheet.appendRow([
      generateId('MATCH'),
      assignmentId,
      match.tutorId,
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      match.totalScore,
      match.category,
      'Suggested',
      new Date(),
    ]);
  });
}

function recordTutorInterest(assignmentId, tutorId, notes) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEETS.interests);
  if (!sheet) throw new Error('INTERESTED_TUTORS sheet not found');
  sheet.appendRow([generateId('INTEREST'), assignmentId, tutorId, new Date(), 'New', notes || '']);
}

function sendOwnerNotification(message) {
  // Optional: connect this to an email notification after the owner confirms
  // the preferred address. Keep credentials and private addresses out of Git.
  console.log(message);
}

function appendNamedValues(sheetName, values, id) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  if (!sheet) throw new Error(sheetName + ' sheet not found');
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const row = headers.map(function(header) {
    if (header === 'Lead ID' || header === 'Tutor ID') return id;
    if (header === 'Timestamp') return new Date();
    return firstValue(values, header);
  });
  sheet.appendRow(row);
}

function readTutorProfiles() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEETS.tutors);
  if (!sheet || sheet.getLastRow() < 2) return [];
  const rows = sheet.getDataRange().getDisplayValues();
  const headers = rows.shift();
  return rows.map(function(row) {
    return headers.reduce(function(record, header, index) {
      record[header] = row[index];
      return record;
    }, {});
  });
}

function firstValue(values, key) {
  return values[key] && values[key][0] ? values[key][0] : '';
}

function sameValue(first, second) {
  return String(first || '').trim().toLowerCase() === String(second || '').trim().toLowerCase();
}

function generateId(prefix) {
  return prefix + '-' + Utilities.getUuid().slice(0, 8).toUpperCase();
}