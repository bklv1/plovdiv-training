import { test, expect } from '@playwright/test';
import { LoginPage } from '../src/pages/login-page';
import { DashboardPage } from '../src/pages/dashboard-page';
import { config } from '../src/config/config';

test.describe('Dashboard Functionality', () => {
  let loginPage: LoginPage;
  let dashboardPage: DashboardPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    
    // Login before each test
    await loginPage.navigateToLoginPage();
    await loginPage.login(config.credentials.username, config.credentials.password);
    
    // Verify login was successful
    expect(await dashboardPage.isDashboardDisplayed()).toBeTruthy();
  });

  test('should display quick launch widgets', async () => {
    // Verify quick launch widgets are displayed
    const quickLaunchCount = await dashboardPage.getQuickLaunchItemsCount();
    expect(quickLaunchCount).toBeGreaterThan(0, 'Dashboard should have at least one quick launch widget');
    
    // Take a screenshot for the report
    await dashboardPage.takeScreenshot('dashboard-widgets');
  });

  test('should navigate to different sections from sidebar', async () => {
    // Navigate to Admin page
    await dashboardPage.navigateToMenu('Admin');
    
    // Verify Admin page is loaded
    const pageTitle = await dashboardPage.page.locator('.oxd-topbar-header-breadcrumb').textContent();
    expect(pageTitle).toContain('Admin');
  });

  test('should logout successfully', async () => {
    // Logout from the application
    await dashboardPage.logout();
    
    // Verify user is logged out and login page is displayed
    expect(await loginPage.isLoginPageDisplayed()).toBeTruthy('Login page should be displayed after logout');
    
    // Take a screenshot for the report
    await loginPage.takeScreenshot('after-logout');
  });
});
