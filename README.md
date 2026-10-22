# texture
An archive of fancy named but visually bland interior materials

## Airtable data

GitHub Actions fetches Airtable records and deploys them with the site. The Airtable token stays in GitHub Actions secrets and is not sent to visitors.

1. Revoke the previously exposed Airtable token. Create a replacement with `data.records:read` access to this base only.
2. In the GitHub repository, open **Settings → Secrets and variables → Actions → New repository secret**. Set the name to `AIRTABLE_TOKEN` and paste the replacement token as the value.
3. Open **Settings → Pages**. Set the build and deployment source to **GitHub Actions**.
4. Push this repository's changes to `main`, or run **Deploy GitHub Pages** from the **Actions** tab.

The workflow fetches fresh records on each push and once per hour. It publishes the records as public site data, but never publishes the Airtable token. Airtable image URLs can expire, so the hourly refresh helps keep them current.
