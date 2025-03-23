import { Page, Locator } from '@playwright/test';
import { BasePage } from './base-page';
import { Logger } from '../utils/logger';
import { config } from '../config/config';

export class LoginPage extends BasePage {
  // Page elements
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;
  private readonly forgotPasswordLink: Locator;
  private readonly errorMessage: Locator;
  private readonly orangeHrmLogo: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput = page.locator('input[name="username"]');
    this.passwordInput = page.locator('input[name="password"]');
    this.loginButton = page.locator('button[type="submit"]');
    this.forgotPasswordLink = page.locator('.orangehrm-login-forgot');
    this.errorMessage = page.locator('.oxd-alert-content-text');
    this.orangeHrmLogo = page.locator('.orangehrm-login-branding img');
  }

  /**
   * Navigate to login page
   */
  async navigateToLoginPage(): Promise<void> {
    Logger.info('Navigating to login page');
    await this.navigate(`${config.baseUrl}/web/index.php/auth/login`);
    await this.waitForElement(this.orangeHrmLogo);
  }

  /**
   * Login with username and password
   * @param username Username
   * @param password Password
   */
  async login(username: string = config.credentials.username, password: string = config.credentials.password): Promise<void> {
    Logger.info(`Logging in with username: ${username}`);
    await this.fill(this.usernameInput, username);
    await this.fill(this.passwordInput, password);
    await this.click(this.loginButton);
    await this.waitForPageLoad();
  }

  /**
   * Click on forgot password link
   */
  async clickForgotPassword(): Promise<void> {
    Logger.info('Clicking on forgot password link');
    await this.click(this.forgotPasswordLink);
    await this.waitForPageLoad();
  }

  /**
   * Get error message text
   * @returns Error message text
   */
  async getErrorMessage(): Promise<string> {
    Logger.info('Getting error message');
    if (await this.isVisible(this.errorMessage)) {
      return await this.getText(this.errorMessage);
    }
    return '';
  }

  /**
   * Check if login page is displayed
   * @returns True if login page is displayed
   */
  async isLoginPageDisplayed(): Promise<boolean> {
    Logger.info('Checking if login page is displayed');
    return await this.isVisible(this.orangeHrmLogo);
  }
}
