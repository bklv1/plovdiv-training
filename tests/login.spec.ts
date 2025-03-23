import { test, expect } from '@playwright/test';
import { LoginPage } from '../src/pages/login-page';
import { DashboardPage } from '../src/pages/dashboard-page';
import { config } from '../src/config/config';

test.describe('Login Functionality', () => {
  let loginPage: LoginPage;
  let dashboardPage: DashboardPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    await loginPage.navigateToLoginPage();
  });

  test('should login with valid credentials', async () => {
    await loginPage.login(config.credentials.username, config.credentials.password);
    
    // Verify user is logged in and dashboard is displayed
    expect(await dashboardPage.isDashboardDisplayed()).toBeTruthy();
    expect(await dashboardPage.getDashboardTitle()).toContain('Dashboard');
  });

  test('should display error message with invalid credentials', async () => {
    await loginPage.login('invalid_user', 'invalid_password');
    
    // Verify error message is displayed
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toContain('Invalid credentials');
  });

  test('should navigate to forgot password page', async () => {
    await loginPage.clickForgotPassword();
    
    // Verify forgot password page is displayed
    const pageTitle = await loginPage.page.title();
    expect(pageTitle).toContain('OrangeHRM');
    
    // Verify the URL contains reset-password
    const url = loginPage.page.url();
    expect(url).toContain('requestPasswordResetCode');
  });

  test('should require username and password', async () => {
    // Try to login without entering credentials
    await loginPage.login('', '');
    
    // Verify user is still on login page
    expect(await loginPage.isLoginPageDisplayed()).toBeTruthy();
  });
});
