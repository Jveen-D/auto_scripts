# Auto Scripts

Daily AMUX check-in through GitHub Actions.

## Schedule

The workflow runs at `22:00 UTC`, which is `06:00 Asia/Shanghai`.

GitHub scheduled workflows can be delayed by platform load, so this is the closest GitHub Actions can get to a 06:00 run.

## GitHub setup

1. Push this repository to GitHub.
2. Open the repository on GitHub.
3. Go to `Settings` -> `Secrets and variables` -> `Actions` -> `New repository secret`.
4. Add these secrets:
   - `AMUX_USER_ID`: your own AMUX user id.
   - `AMUX_ACCESS_TOKEN`: your AMUX access token, without the `Bearer ` prefix.
   - `AMUX_COOKIE`: your AMUX session cookie, for example `session=...`.
   - You only need one auth secret: `AMUX_ACCESS_TOKEN` or `AMUX_COOKIE`.
5. Open `Actions` -> `AMUX Check-in` -> `Run workflow` to test it once manually.

## Finding auth

Do not commit tokens or cookies, and do not paste them into chat.

Try these places in your logged-in browser:

1. Open DevTools on `amux.ai`.
2. In `Network`, enable `Preserve log`, refresh the page, and filter by `Fetch/XHR`.
3. Click requests to `api.amux.ai`, then check `Request Headers`.
4. If there is no `Authorization` header, open `Application`:
   - `Local storage` -> search for `token`, `access_token`, `auth`, `jwt`.
   - `Session storage` -> search for the same keywords.
   - `Cookies` for `amux.ai` and `api.amux.ai` -> look for session/auth cookies.
5. If the login response only returns `Set-Cookie`, use the `session=...` value as the `AMUX_COOKIE` GitHub secret.

For `AMUX_COOKIE`, save only the cookie name and value:

```text
session=...
```

Do not include `Path`, `Expires`, `Max-Age`, `HttpOnly`, or `SameSite`.

Session cookies expire. If check-in starts returning `401` or `403`, sign in again and replace the `AMUX_COOKIE` secret with a fresh `session=...` value.
