import { test, expect } from '@playwright/test';
import { LoginPage } from '@pages/login-page';
import { DashboardPage } from '@pages/dashboard-page';
import { config } from '@config/config';

// Add retry for flaky tests in CI
test.describe.configure({retries: 2});

test.describe('Dashboard Functionality', () => {
    let loginPage: LoginPage;
    let dashboardPage: DashboardPage;

    test.beforeEach(async ({page}) => {
        // Create a unique test ID for this test run
        const testId = `dashboard-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

        // Initialize page objects
        loginPage = new LoginPage(page);
        dashboardPage = new DashboardPage(page);

        // Set longer timeouts for CI environment
        page.setDefaultTimeout(90000);

        try {
            // Login before each test
            await loginPage.navigateToLoginPage();

            // Add retry logic for login in CI environment
            let retries = 3;
            let loginSuccess = false;

            while (retries > 0 && !loginSuccess) {
                try {
                    await loginPage.login(config.credentials.username, config.credentials.password);
                    await page.waitForTimeout(2000); // Wait for navigation
                    loginSuccess = await dashboardPage.isDashboardDisplayed();
                    if (loginSuccess) break;
                } catch (error) {
                    console.log(`Login attempt failed, retries left: ${retries - 1}`);
                    if (retries === 1) throw error;
                }
                retries--;
            }

            // Verify login was successful and take screenshot
            expect(loginSuccess).toBeTruthy();
            await dashboardPage.takeScreenshot(`${testId}-logged-in`);
        } catch (error) {
            console.error('Error in beforeEach:', error);
            // Take screenshot of error state
            await page.screenshot({path: `./screenshots/error-${testId}.png`});
            throw error;
        }
    });

    test('should display quick launch widgets', async () => {
        // Verify quick launch widgets are displayed
        const quickLaunchCount = await dashboardPage.getQuickLaunchItemsCount();
        expect(quickLaunchCount).toBeGreaterThan(0);

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
        expect(await loginPage.isLoginPageDisplayed()).toBeTruthy();

        // Take a screenshot for the report
        await loginPage.takeScreenshot('after-logout');
    });

    test('apply leave should be empty', async () => {
        await dashboardPage.page.locator("button[title=\"Apply Leave\"]").click();
        await dashboardPage.waitForPageLoad();
        const actualMessage : string | null = await dashboardPage.page.locator('.oxd-text--subtitle-2').textContent();
        expect(actualMessage).toEqual('No Leave Types with Leave Balance.');
    })
});
