import { test, expect } from '@playwright/test';
import * as OTPAuth from "otpauth"

let totp = new OTPAuth.TOTP({
    issuer: "GitHub",
    label: "USERNAME",
    algorithm: "SHA1",
    digits: 6,
    period: 30,
    secret: process.env.GITHUB_OTP_SECRET,
  })
test('test', async ({ page }) => {
  await page.goto(`${process.env.REVIEWTIME_FRONTEND_URL}`);
  await expect(page).toHaveURL(`${process.env.REVIEWTIME_FRONTEND_URL}/login`); // should redirect to login page since we are not logged in
  await page.getByRole('link', { name: 'Sign in with GitHub' }).click();
  await page.getByLabel('Username or email address').click({
    modifiers: ['Control']
  });
  await page.getByLabel('Username or email address').fill(process.env.GITHUB_USER);
  await page.getByLabel('Password').click({
    modifiers: ['Control']
  });
  await page.getByLabel('Password').fill(process.env.GITHUB_PW);
  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.getByPlaceholder('XXXXXX').click();
  await page.getByPlaceholder('XXXXXX').fill(totp.generate())
  await page.getByRole('heading', { name: 'Dashboard' }).click();
  await page.getByRole('img', { name: 'reviewtime' }).click();
  await page.getByRole('button', { name: 'Open user menu' }).click();
});