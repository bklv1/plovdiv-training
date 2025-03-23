/**
 * Utility to generate test data
 */
export class TestDataGenerator {
  /**
   * Generate a random string with specified length
   * @param length Length of the string
   * @returns Random string
   */
  static generateRandomString(length: number = 8): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    
    return result;
  }

  /**
   * Generate a random email
   * @returns Random email
   */
  static generateRandomEmail(): string {
    return `test.${this.generateRandomString(8)}@example.com`;
  }

  /**
   * Generate a random employee name
   * @returns Random name
   */
  static generateRandomName(): string {
    const firstNames = ['John', 'Jane', 'Michael', 'Sarah', 'David', 'Lisa', 'Robert', 'Emily'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Miller', 'Davis', 'Garcia'];
    
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    
    return `${firstName} ${lastName}`;
  }
}
