/*eslint no-undef: "off"*/
import fs from "fs";
import https from "https";

const webhookUrl = process.env.DISCORD_WEBHOOK;
const version = process.env.RELEASE_VERSION;

validateIfShouldRun(version);

const payload = buildPayload(version);
const options = buildRequestOptions(payload);
postToWebhook(payload, options);

function getChangelogVersion(version) {
  // Remove leading 'v'
  const clean = version.replace(/^v/i, "");

  // Split by dots and take first two parts
  const parts = clean.split(".");
  const majorMinor = parts.slice(0, 2).join(".");

  return majorMinor;
}

function postToWebhook(data, options) {
  const req = https.request(options, (res) => {
    console.log(`statusCode: ${res.statusCode}`);

    // let body = "";
    // res.on("data", (chunk) => (body += chunk));
    // res.on("end", () => console.log("Response body:", body));
  });

  req.on("error", (error) => {
    console.error(error);
  });

  req.write(data);
  req.end();
}

function buildRequestOptions(data) {
  const url = new URL(webhookUrl);
  return {
    hostname: url.hostname,
    path: url.pathname + url.search,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": data.length,
    },
  };
}

function toMarkdownList(items) {
  const maxItems = 4;
  const visibleItems = items.slice(0, maxItems);
  const remainingCount = items.length - maxItems;

  let markdown = visibleItems.map((item) => `- ${item}`).join("\n");
  if (remainingCount > 0) {
    markdown += `\n- ...and ${remainingCount} more`;
  }

  return markdown;
}

function getMessageFields() {
  const raw = fs.readFileSync("./CHANGELOG.json", "utf-8");
  const changelog = JSON.parse(raw);
  const recentChanges = changelog[getChangelogVersion(version)];
  return Object.entries(recentChanges).map(([key, values]) => ({
    name: key.slice(0, 1).toUpperCase() + key.slice(1) + ":",
    value: toMarkdownList(values),
  }));
}

function buildPayload(version) {
  const changes = getMessageFields(version);
  return JSON.stringify({
    embeds: [
      {
        title: `We have just released version ${version}!`,
        url: "https://mesbg-list-builder.com/changelog",
        description:
          "Below are some of the most important changes released in this version.",
        fields: changes,
        footer: {
          text: "For the full changelog, please visit https://mesbg-list-builder.com/changelog.",
        },
      },
    ],
  });
}

function validateIfShouldRun(version) {
  const semverRegex =
    /^v?(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-[\w.-]+)?(?:\+[\w.-]+)?$/;

  if (!semverRegex.test(version)) {
    console.log(
      "The version did not match a semver version. Was this run on a tag or manually?",
    );
    process.exit();
  }

  if (!version.endsWith(".0")) {
    console.log("This is just a patch release - no need to inform discord...");
    process.exit();
  }
}
