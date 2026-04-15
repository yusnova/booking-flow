import { test, expect } from "@playwright/test"
import { BOOKING_TEST_DATA } from "common/constants/constants"
import { BookingFlowPage } from "pages/booking-flow.page"

let booking: BookingFlowPage

test.beforeEach(async ({ page }) => {
  booking = new BookingFlowPage(page)
})

test.describe("Booking UI", () => {
  test("[GeneralWaste] | Verify completes booking with address list, review breakdown, and confirmation", async () => {

    await booking.goto()

    await expect(booking.bookingWrapper).toBeVisible()
    await expect(booking.stepPostcode).toBeVisible()

    await booking.lookupPostcode(BOOKING_TEST_DATA.postcodes.manyAddresses)
    await expect(booking.addressList).toBeVisible()
    await expect(
      booking.addressOption(BOOKING_TEST_DATA.addressIds.downingStreet10),
    ).toBeVisible()

    await booking.nextFromStep1.click()
    await expect(booking.stepWaste).toBeVisible()

    await booking.wastePathGeneral.click()
    await booking.nextFromStep2.click()
    await expect(booking.stepSkip).toBeVisible()

    await expect(booking.skipList).toBeVisible()
    await booking.skipOption(BOOKING_TEST_DATA.skipSizes.fourYard).click()
    await booking.nextFromStep3.click()
    await expect(booking.stepReview).toBeVisible()

    await expect(booking.priceBreakdown).toBeVisible()
    await expect(booking.priceTotal).toContainText(
      BOOKING_TEST_DATA.copy.currencySymbol,
    )

    await booking.confirmBooking.click()
    await expect(booking.bookingSuccess).toBeVisible()
    await expect(booking.bookingId).toContainText(
      BOOKING_TEST_DATA.copy.bookingIdPrefix,
    )

  })

  test("[HeavyWaste] | Verify completes booking with disabled large skips", async () => {

    await booking.goto()

    await booking.lookupPostcode(BOOKING_TEST_DATA.postcodes.manyAddresses)
    await expect(
      booking.addressOption(BOOKING_TEST_DATA.addressIds.downingStreet11),
    ).toBeVisible()
    await booking
      .addressOption(BOOKING_TEST_DATA.addressIds.downingStreet11)
      .click()
    await booking.nextFromStep1.click()

    await booking.wastePathHeavy.click()
    await booking.nextFromStep2.click()

    await expect(
      booking.skipOption(BOOKING_TEST_DATA.skipSizes.twelveYard),
    ).toBeDisabled()
    await expect(
      booking.skipOption(BOOKING_TEST_DATA.skipSizes.fourteenYard),
    ).toBeDisabled()
    await expect(
      booking.skipDisabledReason(BOOKING_TEST_DATA.skipSizes.twelveYard),
    ).toBeVisible()

    await booking.skipOption(BOOKING_TEST_DATA.skipSizes.sixYard).click()
    await booking.nextFromStep3.click()

    await expect(booking.summaryWaste).toContainText(
      BOOKING_TEST_DATA.copy.heavyWasteSummary,
    )
    await booking.confirmBooking.click()
    await expect(booking.bookingSuccess).toBeVisible()
  })
  
})
