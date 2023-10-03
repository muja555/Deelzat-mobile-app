
describe('Example', () => {
  beforeAll(async () => {
    await device.launchApp({permissions: {notifications: 'NO'}});
  });

  beforeEach(async () => {
   // await device.reloadReactNative();
  });

  it('should have welcome screen', async () => {
    await waitFor(element(by.text('Skip'))).toBeVisible().withTimeout(10000);
    await element(by.text('Skip')).tap();
    await expect(element(by.id('main-page'))).toBeVisible();
    await element(by.id('DEEL_DAILY')).tap();
  });

  // it('should show world screen after tap', async () => {
  //   await element(by.id('world_button')).tap();
  //   await expect(element(by.text('World!!!'))).toBeVisible();
  // });
});
