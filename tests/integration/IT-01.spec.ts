import { test, expect } from '@playwright/test';

test('IT-01: top down REAL Login -> browser-level Inventory STUB', {
  annotation: {
    type: 'description',
    description: 'ทดสอบ Login จริงร่วมกับ Inventory Stub ที่จำลองด้วย page.setContent()'
  }
}, async ({ page }) => {
  await test.step('Login ผ่านหน้าเว็บไซต์จริง', async () => {
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    await expect(page).toHaveURL(/.*inventory.html/);
  });

  await test.step('สร้าง Inventory Stub', async () => {
    // ใช้ page.setContent() แสดง Mock Inventory Ready และสินค้าจำลอง 2 รายการ
    await page.setContent(`
      <div>
        <h1>Mock Inventory Ready</h1>
        <div class="inventory_item">Mock Backpack</div>
        <div class="inventory_item">Mock Bike Light</div>
      </div>
    `);
  });

  await test.step('ตรวจสอบผลจาก Stub', async () => {
    // ตรวจสอบข้อความ และชื่อสินค้าจำลอง
    await expect(page.locator('h1')).toHaveText('Mock Inventory Ready');
    await expect(page.locator('.inventory_item').first()).toHaveText('Mock Backpack');
    await expect(page.locator('.inventory_item').nth(1)).toHaveText('Mock Bike Light');
  });
});