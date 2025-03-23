import { Page, Locator, expect } from '@playwright/test';
import { Logger } from '../utils/logger';

/**
 * Base page object that all page objects will inherit from
 */
export class BasePage {
  constructor(protected page: Page) {}

  /**
   * Navigate to a specific URL
   * @param url URL to navigate to
   */
  async navigate(url: string): Promise<void> {
    Logger.info(`Navigating to: ${url}`);
    await this.page.goto(url);
  }

  /**
   * Wait for element to be visible
   * @param locator Element locator
   * @param timeout Timeout in milliseconds
   */
  async waitForElement(locator: Locator, timeout?: number): Promise<void> {
    Logger.debug(`Waiting for element to be visible: ${locator}`);
    await locator.waitFor({ state: 'visible', timeout });
  }

  /**
   * Click on an element
   * @param locator Element locator
   */
  async click(locator: Locator): Promise<void> {
    Logger.debug(`Clicking on element: ${locator}`);
    await this.waitForElement(locator);
    await locator.click();
  }

  /**
   * Fill a form field
   * @param locator Element locator
   * @param value Value to fill
   */
  async fill(locator: Locator, value: string): Promise<void> {
    Logger.debug(`Filling element: ${locator} with value: ${value}`);
    await this.waitForElement(locator);
    await locator.fill(value);
  }

  /**
   * Get text from an element
   * @param locator Element locator
   * @returns Text content
   */
  async getText(locator: Locator): Promise<string> {
    Logger.debug(`Getting text from element: ${locator}`);
    await this.waitForElement(locator);
    return await locator.textContent() || '';
  }

  /**
   * Check if element is visible
   * @param locator Element locator
   * @returns True if visible
   */
  async isVisible(locator: Locator): Promise<boolean> {
    Logger.debug(`Checking if element is visible: ${locator}`);
    return await locator.isVisible();
  }

  /**
   * Wait for page load
   */
  async waitForPageLoad(): Promise<void> {
    Logger.debug('Waiting for page to load');
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Take screenshot
   * @param name Screenshot name
   */
  async takeScreenshot(name: string): Promise<void> {
    Logger.info(`Taking screenshot: ${name}`);
    await this.page.screenshot({ path: `./screenshots/${name}.png` });
  }
}
