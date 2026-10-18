import { test, expect } from '@playwright/test';

test.describe('UT-02: Product Button State Validation', () => {
  test('UT-02.1: verify add to cart and remove button state', {
    annotation: { type: 'description', description: 'ตรวจสอบสถานะปุ่ม Add to cart และ Remove' }
  }, async ({ page }) => {
    const addBtn = page.locator('[data-test="add-to-cart-sauce-labs-backpack"]');
    const removeBtn = page.locator('[data-test="remove-sauce-labs-backpack"]');
    const badge = page.locator('.shopping_cart_badge');

    await test.step('Login เข้าสู่ระบบ', async () => {
      await page.goto('https://www.saucedemo.com/');
      await page.locator('[data-test="username"]').fill('standard_user');
      await page.locator('[data-test="password"]').fill('secret_sauce');
      await page.locator('[data-test="login-button"]').click();
      await expect(page).toHaveURL(/inventory\.html/);
    });

    await test.step('ตรวจสอบปุ่มก่อนเพิ่มสินค้า', async () => {
      // ก่อนเพิ่มสินค้าแสดงปุ่ม Add to cart, ไม่มีปุ่ม Remove และไม่มี Cart Badge
      await expect(addBtn).toBeVisible();
      await expect(addBtn).toHaveText('Add to cart');
      await expect(removeBtn).toHaveCount(0);
      await expect(badge).toHaveCount(0);
    });

    await test.step('เพิ่มสินค้าเข้า Cart', async () => {
      // เพิ่มสินค้าและตรวจสอบปุ่ม Remove, ปุ่ม Add to cart หายไป และ Cart Badge = 1
      await addBtn.click();
      await expect(removeBtn).toBeVisible();
      await expect(removeBtn).toHaveText('Remove');
      await expect(addBtn).toHaveCount(0);
      await expect(badge).toHaveText('1');
    });

    await test.step('ลบสินค้าออกจาก Cart', async () => {
      // ลบสินค้า ตรวจสอบปุ่ม Add to cart กลับมา, ปุ่ม Remove หายไป และ Cart Badge หายไป
      await removeBtn.click();
      await expect(addBtn).toBeVisible();
      await expect(removeBtn).toHaveCount(0);
      await expect(badge).toHaveCount(0);
    });
  });
});