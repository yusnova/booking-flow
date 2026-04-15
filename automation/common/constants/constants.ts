/**
 * Shared booking E2E data 
 */

export const BOOKING_TEST_DATA = {
  postcodes: {
    manyAddresses: "SW1A 1AA",
    emptyAddresses: "EC1A 1BB",
    slowLookup: "M1 1AE",
    failThenRetry: "BS1 4DJ",
  },
  addressIds: {
    downingStreet10: "addr_1",
    downingStreet11: "addr_2",
  },
  skipSizes: {
    fourYard: "4-yard",
    sixYard: "6-yard",
    twelveYard: "12-yard",
    fourteenYard: "14-yard",
  },
  copy: {
    heavyWasteSummary: "Heavy",
    bookingIdPrefix: "BK-",
    currencySymbol: "£",
  },
} as const
