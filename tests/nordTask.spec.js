const { test, expect } = require('@playwright/test');

test.describe('Banking Application Tests', () => {
  const baseURL = 'https://www.globalsqa.com/angularJs-protractor/BankingProject/#/login';

  // Test 1: successful loading of main page
  test('Landing Page Load', async ({ page }) => {
    await page.goto(baseURL);
    await expect(page).toHaveTitle(/XYZ Bank/i); // Check the page title
    await expect(page.locator('button[ng-click="customer()"]')).toBeVisible(); // Verify customer login button
    await expect(page.locator('button[ng-click="manager()"]')).toBeVisible(); // Verify manager login button
  });


  // Test 2: Customer Login - Valid Loginnnn
  test('Customer Login - Valid', async ({ page }) => {
    await page.goto(baseURL);

    // Navigate to Customer Login Page
    await page.locator('button[ng-click="customer()"]').click();

    // Select a valid customer from dropdown
    await page.locator('select#userSelect').selectOption({ label: 'Hermoine Granger' });
    await page.locator('button[type="submit"]').click();

    // Verify successful login
    const welcomeText = await page.locator('.fontBig').textContent();
    expect(welcomeText).toContain('Hermoine Granger');
  });

  // Test 3: Customer - Deposit Money
  test('Customer - Deposit Money', async ({ page }) => {
    await page.goto(baseURL);

    // Login as Customer
    await page.locator('button[ng-click="customer()"]').click();
    await page.locator('select#userSelect').selectOption({ label: 'Harry Potter' });
    await page.locator('button[type="submit"]').click();

    // Navigate to Deposit tab
    await page.locator('button[ng-click="deposit()"]').click();

    // Perform a deposit
    await page.locator('input[ng-model="amount"]').fill('1000');
    await page.locator('button[type="submit"]').click();

    // Verify deposit success message
    const depositMessage = await page.locator('.error').textContent();
    expect(depositMessage).toContain('Deposit Successful');
  });

  // Test 4: Customer - unsuccessful Money withdrawal
  test('Customer - Withdraw Money', async ({ page }) => {
    await page.goto(baseURL);

    // Login as Customer
    await page.locator('button[ng-click="customer()"]').click();
    await page.locator('select#userSelect').selectOption({ label: 'Ron Weasly' });
    await page.locator('button[type="submit"]').click();
    await page.locator('button[ng-click="withdrawl()"]').click();

    // Perform a withdrawal (with sufficient funds)
    await page.locator('input[ng-model="amount"]').fill('20');
    await page.locator('button[type="submit"]').click();

    // Verify withdrawal success message
    const withdrawMessage = await page.locator('.error').textContent();
    expect(withdrawMessage).toContain("Transaction Failed. You can not withdraw amount more than the balance.");
  });

  // Test 5: Bank Manager - Add Customer
  test('Bank Manager - Add Customer', async ({ page })=> {
    await page.goto(baseURL);

    // Navigate to Bank Manager Login Page
    await page.locator('button[ng-click="manager()"]').click();

    // Add a new customer
    await page.locator('button[ng-click="addCust()"]').click();
    await page.locator('input[ng-model="fName"]').fill('seye');
    await page.locator('input[ng-model="lName"]').fill('Ade');
    await page.locator('input[ng-model="postCd"]').fill('9999');
    await page.locator('button[type="submit"]').click();

    // Verify new customer alert appears
    page.on('dialog', dialog => console.log(dialog.message()));
    await page.getByText('Customer added successfully with customer id'); // Will hang here
    //  await page.waitForEvent('dialog').then(dialog => {
    // expect(dialog.message()).toContain('Customer added successfully');
      dialog.dismiss();
    });
  });

  // Test 6: Bank Manager - Open Account
  test('Bank Manager - Open Account for Customer', async ({ page }) => {
    await page.goto(baseURL);

    // Navigate to Bank Manager Login Page
    await page.locator('button[ng-click="manager()"]').click();

    // Open Account for a customer
    await page.locator('button[ng-click="openAccount()"]').click();
    await page.locator('select[ng-model="custId"]').selectOption({ label: 'seye ade' });
    // await page.locator('currency').click();
    await page.locator('select[ng-model="currency"]').selectOption({ label: 'Dollar' });
    await page.locator('button[type="submit"]').click();

    // Verify account opening success alert
    await page.waitForEvent('dialog').then(dialog => {
      expect(dialog.message()).toContain('Account created successfully with account Number');
      dialog.dismiss();
    });
  });


