import { Page, Locator } from '@playwright/test';
import { BasePage } from './base-page';
import { Logger } from '../utils/logger';

export class DashboardPage extends BasePage {
  // Page elements
  private readonly dashboardTitle: Locator;
  private readonly userDropdown: Locator;
  private readonly logoutButton: Locator;
  private readonly sidebarMenu: Locator;
  private readonly quickLaunchItems: Locator;

  constructor(page: Page) {
    super(page);
    this.dashboardTitle = page.locator('.oxd-topbar-header-title');
    this.userDropdown = page.locator('.oxd-userdropdown-tab');
    this.logoutButton = page.locator('a:has-text("Logout")');
    this.sidebarMenu = page.locator('.oxd-sidepanel-body');
    this.quickLaunchItems = page.locator('.orangehrm-quick-launch-card');
  }

  /**
   * Check if dashboard is displayed
   * @returns True if dashboard is displayed
   */
  async isDashboardDisplayed(): Promise<boolean> {
    Logger.info('Checking if dashboard is displayed');
    return await this.isVisible(this.dashboardTitle);
  }

  /**
   * Get dashboard title text
   * @returns Dashboard title text
   */
  async getDashboardTitle(): Promise<string> {
    Logger.info('Getting dashboard title');
    return await this.getText(this.dashboardTitle);
  }

  /**
   * Logout from the application
   */
  async logout(): Promise<void> {
    Logger.info('Logging out from the application');
    await this.click(this.userDropdown);
    await this.click(this.logoutButton);
    await this.waitForPageLoad();
  }

  /**
   * Navigate to a specific menu item
   * @param menuName Menu name to navigate to
   */
  async navigateToMenu(menuName: string): Promise<void> {
    Logger.info(`Navigating to menu: ${menuName}`);
    const menuItem = this.page.locator(`.oxd-main-menu-item:has-text("${menuName}")`);
    await this.click(menuItem);
    await this.waitForPageLoad();
  }

  /**
   * Get count of quick launch items
   * @returns Count of quick launch items
   */
  async getQuickLaunchItemsCount(): Promise<number> {
    Logger.info('Getting count of quick launch items');
    return await this.quickLaunchItems.count();
  }

  /**
   * Click on a specific quick launch item
   * @param itemName Item name to click
   */
  async clickQuickLaunchItem(itemName: string): Promise<void> {
    Logger.info(`Clicking on quick launch item: ${itemName}`);
    const item = this.page.locator(`.orangehrm-quick-launch-card:has-text("${itemName}")`);
    await this.click(item);
    await this.waitForPageLoad();
  }
}
