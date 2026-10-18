import { test, expect } from '@playwright/test';

test('ST-01: complete purchase of two products', {
  annotation: {
    type: 'description',
    description: 'ทดสอบการซื้อ Backpack และ Bike Light ตั้งแต่ Login จนสั่งซื้อสำเร็จ'
  }
}, async ({ page }) => {
  await test.step('Login และตรวจสอบ Inventory', async () => {
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    await expect(page).toHaveURL(/.*inventory.html/);
  });

  await test.step('เพิ่มสินค้าสองรายการ', async () => {
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
    await expect(page.locator('.shopping_cart_badge')).toHaveText('2');
  });

  await test.step('ตรวจสอบ Cart และไปหน้า Checkout', async () => {
    await page.locator('.shopping_cart_link').click();
    await expect(page.locator('[data-test="item-4-title-link"]')).toHaveText('Sauce Labs Backpack');
    await expect(page.locator('[data-test="item-0-title-link"]')).toHaveText('Sauce Labs Bike Light');

    await page.locator('[data-test="checkout"]').click();
    await page.waitForURL('**/checkout-step-one.html');
  });

  await test.step('กรอก Checkout Information', async () => {
    await page.locator('[data-test="firstName"]').fill('John');
    await page.locator('[data-test="lastName"]').fill('Doe');
    await page.locator('[data-test="postalCode"]').fill('12340');
    await page.locator('[data-test="continue"]').click();
  });

  await test.step('ตรวจสอบ Overview และสั่งซื้อ', async () => {
    await page.waitForURL('**/checkout-step-two.html');
    await expect(page.locator('[data-test="item-4-title-link"]')).toHaveText('Sauce Labs Backpack');
    await expect(page.locator('[data-test="item-0-title-link"]')).toHaveText('Sauce Labs Bike Light');
    await page.locator('[data-test="finish"]').click();
  });

  await test.step('ตรวจสอบ Order Complete', async () => {
    await page.waitForURL('**/checkout-complete.html');
    await expect(page.locator('[data-test="complete-header"]')).toHaveText('Thank you for your order!');
  });
});