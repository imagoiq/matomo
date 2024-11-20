/*!
 * Matomo - free/libre analytics platform
 *
 * Overlay screenshot tests.
 *
 * @link    https://matomo.org
 * @license https://www.gnu.org/licenses/gpl-3.0.html GPL v3 or later
 */
describe("Overlay", function () {
    this.timeout(0);

    async function removeOptOutIframe(page) {
        const frame = page.frames().find(f => f.name() === 'overlayIframe');
        if (frame) {
            await frame.evaluate(function () {
                $('iframe#optOutIframe').remove();
            });
        }
    }

    function getUrl (useTokenAuth, withSegment) {
        var baseUrl = '?module=Overlay&period=year&date=today&idSite=3';
        var hash = '#?l=' + encodeURIComponent(testEnvironment.overlayUrl).replace(/[%]/g, "$");

        if (useTokenAuth === true) {
            baseUrl += '&token_auth=a4ca4238a0b923820dcc509a6f75849f';
            testEnvironment.testUseMockAuth = 0;
            testEnvironment.overrideConfig('General', 'enable_framed_pages', 1);
            testEnvironment.save();
        }

        if (withSegment) {
            return baseUrl + '&segment=' + encodeURIComponent('visitIp==50.112.3.5') + hash;
        }

        return baseUrl + hash;
    }

    before(async function () {
        await testEnvironment.callApi("SitesManager.addSiteAliasUrls", {idSite: 3, urls: [config.piwikUrl, '127.0.0.1']});
    });

    after(async function () {
        testEnvironment.testUseMockAuth = 1;
        if (testEnvironment.configOverride.General && testEnvironment.configOverride.General.enable_framed_pages) {
            delete testEnvironment.configOverride.General.enable_framed_pages;
        }
        testEnvironment.save();

        await testEnvironment.callApi("SitesManager.setSiteAliasUrls", {idSite: 3, urls: []});
    });

    var testCases = [false, true];

    it("should load overlay correctly when coming from an widgetized action report", async function () {
        testEnvironment.testUseMockAuth = 0;
        testEnvironment.overrideConfig('General', 'enable_framed_pages', 1);
        testEnvironment.overrideConfig('General', 'enable_framed_allow_write_admin_token_auth', 1);
        testEnvironment.save();

        await page.goto('?module=Widgetize&action=iframe&disableLink=0&widget=1&moduleToWidgetize=Actions&actionToWidgetize=getPageUrls&idSite=3&period=year&date=yesterday&disableLink=1&widget=1&flat=1&token_auth=a4ca4238a0b923820dcc509a6f75849f', {waitUntil: 'networkidle0'});
        await page.waitForNetworkIdle();

        const row = await page.jQuery('.dataTable tbody tr:first', { waitFor: true });
        await row.hover();

        const icon = await page.waitForSelector('.dataTable tbody tr a.actionOverlay');

        const [popup] = await Promise.all([
          new Promise(resolve => page.once('popup', resolve)),
          await icon.click()
        ]);

        await popup.waitForTimeout(2500);

        await removeOptOutIframe(popup);

        await popup.waitForSelector('#overlayLoading', {hidden: true});
        await popup.click('#overlayDateRangeSelection');

        // Select yesterday
        await popup.waitForSelector('#overlayDateRangeSelection .select-dropdown li:nth-child(2)', {visible: true});
        await popup.click('#overlayDateRangeSelection .select-dropdown li:nth-child(2)');
        await page.waitForNetworkIdle();
        await popup.waitForSelector('#overlayLoading', {hidden: true});

        expect(await popup.screenshot({fullPage: true})).to.matchImage('loaded_from_actions');
    });

});
