import type { Locator, Page } from "@playwright/test"

export class BookingFlowPage {
  page: Page

  bookingWrapper: Locator
  stepPostcode: Locator
  postcodeInput: Locator
  lookupButton: Locator
  addressList: Locator
  nextFromStep1: Locator
  stepWaste: Locator
  wastePathGeneral: Locator
  wastePathHeavy: Locator
  nextFromStep2: Locator
  stepSkip: Locator
  skipList: Locator
  nextFromStep3: Locator
  stepReview: Locator
  priceBreakdown: Locator
  priceTotal: Locator
  confirmBooking: Locator
  bookingSuccess: Locator
  bookingId: Locator
  summaryWaste: Locator

  constructor(page: Page) {
    this.page = page

    this.bookingWrapper = page.locator('[data-testid="booking-flow"]')
    this.stepPostcode = page.locator('[data-testid="step-postcode"]')
    this.postcodeInput = page.locator('[data-testid="postcode-input"]')
    this.lookupButton = page.locator('[data-testid="lookup-button"]')
    this.addressList = page.locator('[data-testid="address-list"]')
    this.nextFromStep1 = page.locator('[data-testid="next-from-step1"]')
    this.stepWaste = page.locator('[data-testid="step-waste"]')
    this.wastePathGeneral = page.locator('[data-testid="waste-path-general"]')
    this.wastePathHeavy = page.locator('[data-testid="waste-path-heavy"]')
    this.nextFromStep2 = page.locator('[data-testid="next-from-step2"]')
    this.stepSkip = page.locator('[data-testid="step-skip"]')
    this.skipList = page.locator('[data-testid="skip-list"]')
    this.nextFromStep3 = page.locator('[data-testid="next-from-step3"]')
    this.stepReview = page.locator('[data-testid="step-review"]')
    this.priceBreakdown = page.locator('[data-testid="price-breakdown"]')
    this.priceTotal = page.locator('[data-testid="price-total"]')
    this.confirmBooking = page.locator('[data-testid="confirm-booking"]')
    this.bookingSuccess = page.locator('[data-testid="booking-success"]')
    this.bookingId = page.locator('[data-testid="booking-id"]')
    this.summaryWaste = page.locator('[data-testid="summary-waste"]')
  }

  async goto(): Promise<void> {
    await this.page.goto("/")
  }

  addressOption(id: string): Locator {
    return this.page.locator(`[data-testid="address-option-${id}"]`)
  }

  skipOption(size: string): Locator {
    return this.page.locator(`[data-testid="skip-option-${size}"]`)
  }

  skipDisabledReason(size: string): Locator {
    return this.page.locator(`[data-testid="skip-disabled-reason-${size}"]`)
  }

  async lookupPostcode(value: string): Promise<void> {
    await this.postcodeInput.fill(value)
    await this.lookupButton.click()
  }
}
