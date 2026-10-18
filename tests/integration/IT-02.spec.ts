import { test, expect, BrowserContext, Page } from '@playwright/test';

test('IT-02: DRIVER login state -> REAL Inventory and Cart', {
  annotation: {
    type: 'description',
    description: 'ใช้ Driver เตรียมสถานะ Login เพื่อทดสอบ Inventory และ Cart จริง'
  }
}, async ({ browser }) => {
  // 1. สร้างฟังก์ชัน driverOpenInventory() ทำหน้าที่ Driver เตรียมสถานะ Login
  const driverOpenInventory = async () => {
    const context = await browser.newContext();
    // 2. ใช้ BrowserContext.addCookies() กำหนด Cookie session-username เป็น standard_user บนโดเมน www.saucedemo.com
    await context.addCookies([
      {
        name: 'session-username',
        value: 'standard_user',
        domain: 'www.saucedemo.com',
        path: '/'
      }
    ]);
    const page = await context.newPage();
    // 3. ใช้ Driver เปิด https://www.saucedemo.com/inventory.html โดยตรง ไม่ผ่าน Login Form
    await page.goto('https://www.saucedemo.com/inventory.html');
    return { context, page };
  };

  let context: BrowserContext | undefined;
  let page!: Page;

  try {
    await test.step('สร้าง Driver และเปิด Inventory', async () => {
      const driver = await driverOpenInventory();
      context = driver.context;
      page = driver.page;
      // ยืนยันว่า Cookie ทำให้เข้า Inventory ได้จริง ไม่ถูกเด้งกลับหน้า Login
      await expect(page).toHaveURL(/inventory\.html/);
    });

    await test.step('ตรวจสอบ Inventory จริง', async () => {
      // 4. ตรวจสอบหน้า Inventory แสดงสินค้าครบ 6 รายการ
      await expect(page.locator('.inventory_item')).toHaveCount(6);
    });

    await test.step('เพิ่มสินค้า 2 รายการ', async () => {
      // 5. เพิ่มสินค้า Sauce Labs Backpack ลง Shopping Cart
      await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
      // 6. เพิ่มสินค้า Sauce Labs Bike Light ลง Shopping Cart
      await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
      // 7. ตรวจสอบ Cart Badge เป็น 2
      await expect(page.locator('.shopping_cart_badge')).toHaveText('2');
    });

    await test.step('ตรวจสอบสินค้าใน Cart', async () => {
      // 8. เปิดหน้า Shopping Cart
      await page.locator('.shopping_cart_link').click();
      await expect(page).toHaveURL(/cart\.html/);
      // 9. ตรวจสอบว่ามีสินค้าทั้งสองรายการอยู่ใน Cart
      await expect(page.locator('.cart_item')).toHaveCount(2);
      await expect(page.locator('[data-test="item-4-title-link"]')).toHaveText('Sauce Labs Backpack');
      await expect(page.locator('[data-test="item-0-title-link"]')).toHaveText('Sauce Labs Bike Light');
    });
  } finally {
    // 10. ปิด BrowserContext ที่สร้างเองเมื่อสิ้นสุดการทดสอบ (ปิดเสมอแม้ test พัง)
    await context?.close();
  }
});