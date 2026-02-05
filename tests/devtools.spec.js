import { test, expect } from '@playwright/test';

test.describe('DevTools & Living Specs', () => {
    test.beforeEach(async ({ page }) => {
        page.on('console', msg => console.log('PAGE LOG:', msg.text()));
        page.on('pageerror', exception => console.log(`PAGE ERROR: "${exception}"`));
        // Use 5173 consistently
        await page.goto('http://localhost:5173/experiments/create');
        await page.waitForSelector('.ant-form', { timeout: 10000 });
    });

    test('DevToolbar should be visible', async ({ page }) => {
        const toolbar = page.locator('text=显示需求标注');
        await expect(toolbar).toBeVisible({ timeout: 10000 });
    });

    test('Toggle Show Specs should show markers', async ({ page }) => {
        // 1. Initial State: No markers visible
        const marker = page.locator('.anticon-bulb').first();
        await expect(marker).not.toBeVisible();

        // 2. Toggle "Show Specs"
        await page.click('#dev-specs-switch', { force: true });

        // 3. Verify Spec Markers appear (💡 icons)
        await expect(page.locator('.anticon-bulb').first()).toBeVisible();

        // Check for a specific rule using data-spec-id
        const basicRule = page.locator('[data-spec-id="rule_basic_required"]').first();
        await expect(basicRule).toBeVisible();
    });

    test('Clicking Marker should open Sidebar', async ({ page }) => {
        await page.click('#dev-specs-switch', { force: true });

        // Find a marker and click it
        const firstMarker = page.locator('.anticon-bulb').first();
        await firstMarker.click();

        // Verify Sidebar (Drawer) is open
        const drawer = page.locator('.ant-drawer-content');
        await expect(drawer).toBeVisible();
        await expect(drawer).toContainText('PRD 需求详情');
    });

    test('Living Specs should appear on all workflow pages', async ({ page }) => {
        await page.click('#dev-specs-switch', { force: true });

        // --- Step 1: Basic Info ---
        await expect(page.locator('[data-spec-id="rule_basic_required"]').first()).toBeVisible();

        // Fill form
        await page.fill('#name', 'Test Experiment');
        await page.click('#featureId', { force: true });
        // Use names from INITIAL_DATA in mockStore.js
        await page.click('.ant-select-item-option-content >> text=主底按钮颜色', { force: true });
        await page.fill('#owner', '管理员');
        await page.click('button >> text=下 一 步');

        // --- Step 2: Strategy ---
        await page.waitForSelector('text=生效策略配置', { timeout: 10000 });
        await expect(page.locator('[data-spec-id="rule_traffic_limit"]').first()).toBeVisible();

        await page.click('#layer-selector', { force: true });
        await page.click('.ant-select-item-option-content >> text=首页 UI 层');
        await page.fill('.ant-input-number-input', '10');

        // Audience selection (depends on what's in the UI, usually "新用户包" is a mock default)
        await page.click('.ant-select-selector >> nth=1', { force: true });
        await page.click('.ant-select-item-option-content >> text=新用户包', { force: true });

        await page.click('button >> text=下 一 步');

        // --- Step 3: Grouping ---
        await page.waitForSelector('text=实验分组', { timeout: 10000 });
        await expect(page.locator('[data-spec-id="rule_group_ratio_sum"]').first()).toBeVisible();

        // 5. Check Feature Management Page
        await page.goto('http://localhost:5173/features');
        await page.waitForSelector('text=Feature 列表');
        await page.click('#dev-specs-switch', { force: true });
        await expect(page.locator('[data-spec-id="rule_feature_lock"]').first()).toBeVisible();
    });
});
