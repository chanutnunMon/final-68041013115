import { test, expect } from '@playwright/test';

test.describe('UT-02: Product Button State Validation', () => {
  test('UT-02.1: verify add to cart and remove button state', {
    annotation: { type: 'description', description: 'ตรวจสอบสถานะปุ่ม Add to cart และ Remove' }
  }, async ({ page }) => {
    await test.step('Login เข้าสู่ระบบ', async () => {
      await page.goto('https://www.saucedemo.com/');
      await page.locator('[data-test="username"]').fill('standard_user');
      await page.locator('[data-test="password"]').fill('secret_sauce');
      await page.locator('[data-test="login-button"]').click();
    });

    await test.step('ตรวจสอบปุ่มก่อนเพิ่มสินค้า', async () => {
      // ก่อนเพิ่มสินค้าแสดงปุ่ม Add to cart
      await expect(page.locator('[data-test="add-to-cart-sauce-labs-backpack"]')).toBeVisible();
    });

    await test.step('เพิ่มสินค้าเข้า Cart', async () => {
      // เพิ่มสินค้าและตรวจสอบปุ่ม Remove และ Cart Badge = 1
      await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
      await expect(page.locator('[data-test="remove-sauce-labs-backpack"]')).toBeVisible();
      await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
    });

    await test.step('ลบสินค้าออกจาก Cart', async () => {
      // ลบสินค้า ตรวจสอบปุ่ม Add to cart และ Cart Badge หายไป
      await page.locator('[data-test="remove-sauce-labs-backpack"]').click();
      await expect(page.locator('[data-test="add-to-cart-sauce-labs-backpack"]')).toBeVisible();
      await expect(page.locator('.shopping_cart_badge')).not.toBeVisible();
    });
  });
});