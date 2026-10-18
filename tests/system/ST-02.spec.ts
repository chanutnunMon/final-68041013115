import { test, expect } from '@playwright/test';

test('ST-02: checkout validation and recovery', {
  annotation: {
    type: 'description',
    description: 'ตรวจสอบ Checkout Validation และการแก้ไขข้อมูลจนสั่งซื้อสำเร็จ'
  }
}, async ({ page }) => {
  await test.step('Login เพิ่มสินค้า และเปิด Checkout', async () => {
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    await expect(page).toHaveURL(/inventory\.html/);

    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');

    await page.locator('.shopping_cart_link').click();
    await expect(page).toHaveURL(/cart\.html/);

    await page.locator('[data-test="checkout"]').click();
    await page.waitForURL('**/checkout-step-one.html');
  });

  await test.step('ตรวจสอบ First Name is required', async () => {
    await page.locator('[data-test="continue"]').click();
    await expect(page.locator('[data-test="error"]')).toContainText('First Name is required');
  });

  await test.step('ตรวจสอบ Last Name is required', async () => {
    await page.locator('[data-test="firstName"]').fill('John');
    await page.locator('[data-test="continue"]').click();
    await expect(page.locator('[data-test="error"]')).toContainText('Last Name is required');
  });

  await test.step('ตรวจสอบ Postal Code is required', async () => {
    await page.locator('[data-test="lastName"]').fill('Doe');
    await page.locator('[data-test="continue"]').click();
    await expect(page.locator('[data-test="error"]')).toContainText('Postal Code is required');
  });

  await test.step('แก้ไขข้อมูลและสั่งซื้อสำเร็จ', async () => {
    await page.locator('[data-test="postalCode"]').fill('50000');
    await page.locator('[data-test="continue"]').click();
    await page.waitForURL('**/checkout-step-two.html');
    await page.locator('[data-test="finish"]').click();
    await page.waitForURL('**/checkout-complete.html');
    await expect(page.locator('[data-test="complete-header"]')).toHaveText('Thank you for your order!');
  });
});