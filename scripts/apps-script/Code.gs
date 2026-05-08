/**
 * Juno contact form — Google Apps Script Web App
 *
 * Receives contact form submissions from /api/contact (Next.js),
 * validates a shared secret, appends a row to a Google Sheet, and
 * sends an auto-reply from hello@withjuno.ai.
 *
 * ---------------------------------------------------------------
 * ONE-TIME SETUP
 * ---------------------------------------------------------------
 * 1. Create a Google Sheet to store submissions. The first row
 *    will be auto-populated as a header on first run. Copy its ID
 *    from the URL (the long string between /d/ and /edit).
 *
 * 2. In the Sheet, choose Extensions → Apps Script. Paste this
 *    file in as Code.gs (replacing any default content).
 *
 * 3. Open Project Settings (gear icon) → Script Properties and add:
 *      SHEET_ID       — the Sheet ID from step 1
 *      SHEET_NAME     — usually "Sheet1"
 *      SHARED_SECRET  — same value as APPS_SCRIPT_SECRET in Next.js
 *      REPLY_FROM     — hello@withjuno.ai
 *      REPLY_NAME     — The Juno Team (optional, used in From label)
 *
 * 4. Verify the Gmail "send-as" alias for hello@withjuno.ai under
 *    the Google account that owns this script:
 *      Gmail → Settings → Accounts → "Send mail as" → Add another
 *      address. Verify it. The alias must be confirmed before
 *      GmailApp.sendEmail({ from: "hello@withjuno.ai" }) will work
 *      — otherwise the script throws "Invalid arguments: from".
 *
 * 5. Run the `setup` function once from the Apps Script editor to
 *    grant scopes (Gmail send + Sheets write) and seed the header
 *    row. Approve the OAuth consent prompt.
 *
 * 6. Deploy → New deployment → Type: Web app.
 *      Execute as: Me (the account that owns the alias)
 *      Who has access: Anyone
 *    Copy the resulting /exec URL — that is APPS_SCRIPT_URL in
 *    your Next.js env.
 *
 * 7. Whenever you edit the script, deploy a NEW version (or
 *    "Manage deployments" → edit → New version) so the live URL
 *    serves the updated code.
 * ---------------------------------------------------------------
 */

const HEADER_ROW = [
  "Timestamp",
  "Name",
  "Email",
  "Intent",
  "Message",
  "Referral source",
];

function setup() {
  const props = PropertiesService.getScriptProperties();
  const sheetId = props.getProperty("SHEET_ID");
  const sheetName = props.getProperty("SHEET_NAME") || "Sheet1";
  if (!sheetId) throw new Error("SHEET_ID script property is not set.");

  const sheet = SpreadsheetApp.openById(sheetId).getSheetByName(sheetName);
  if (!sheet) throw new Error("Sheet '" + sheetName + "' not found.");

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADER_ROW);
    sheet.getRange(1, 1, 1, HEADER_ROW.length).setFontWeight("bold");
  }
}

function doPost(e) {
  try {
    const props = PropertiesService.getScriptProperties();
    const expectedSecret = props.getProperty("SHARED_SECRET");
    const sheetId = props.getProperty("SHEET_ID");
    const sheetName = props.getProperty("SHEET_NAME") || "Sheet1";
    const replyFrom = props.getProperty("REPLY_FROM");
    const replyName = props.getProperty("REPLY_NAME") || "The Juno Team";

    if (!expectedSecret || !sheetId || !replyFrom) {
      return jsonResponse({ ok: false, error: "Server not configured." }, 500);
    }

    const payload = JSON.parse(e.postData.contents || "{}");

    if (payload.secret !== expectedSecret) {
      return jsonResponse({ ok: false, error: "Forbidden." }, 403);
    }

    const name = String(payload.name || "").trim();
    const email = String(payload.email || "").trim();
    const intent = String(payload.intent || "").trim();
    const message = String(payload.message || "").trim();
    const referral = String(payload.referral || "").trim();

    if (!name || !email || !message) {
      return jsonResponse({ ok: false, error: "Missing required fields." }, 400);
    }

    const sheet = SpreadsheetApp.openById(sheetId).getSheetByName(sheetName);
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADER_ROW);
      sheet.getRange(1, 1, 1, HEADER_ROW.length).setFontWeight("bold");
    }
    sheet.appendRow([
      new Date(),
      name,
      email,
      intent,
      message,
      referral,
    ]);

    const subject = "Thanks for reaching out to Juno";
    const body =
      "Hi " + name + ",\n\n" +
      "Thanks for reaching out to Juno! We've received your message:\n\n" +
      "\"" + message + "\"\n\n" +
      "We'll get back to you shortly.\n\n" +
      "— The Juno Team\n" +
      replyFrom + "\n";

    GmailApp.sendEmail(email, subject, body, {
      from: replyFrom,
      name: replyName,
      replyTo: replyFrom,
    });

    return jsonResponse({ ok: true });
  } catch (err) {
    console.error(err);
    return jsonResponse({ ok: false, error: "Internal error." }, 500);
  }
}

function doGet() {
  return jsonResponse({ ok: true, status: "alive" });
}

function jsonResponse(obj, _status) {
  // Apps Script Web Apps always return 200 to the client; the
  // caller checks the `ok` field in the body. _status is kept
  // for readability of intent.
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
