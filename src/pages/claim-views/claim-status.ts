import { ProfileLevels, StatusConstants } from '../../dbSettings/companySettings';

export function getResultantStatus(element: any) {
    if (element.PROFILE_LEVEL == ProfileLevels.ONE && element.STATUS == StatusConstants.PENDING)
        element.STATUS = StatusConstants.PENDINGSUPERIOR
    else if (element.PROFILE_LEVEL == ProfileLevels.TWO && element.STATUS == StatusConstants.PENDING)
        element.STATUS = StatusConstants.PENDINGFINANCEVALIDATION
    else if (element.PROFILE_LEVEL == ProfileLevels.THREE && element.STATUS == StatusConstants.APPROVED)
        element.STATUS = StatusConstants.PENDINGPAYMENT
    else if (element.PROFILE_LEVEL == ProfileLevels.ZERO && element.PREVIOUS_LEVEL == ProfileLevels.ONE && element.STATUS == StatusConstants.REJECTED)
        element.STATUS = StatusConstants.SUPERIORREJECTED
    else if (element.PROFILE_LEVEL == ProfileLevels.ZERO && element.PREVIOUS_LEVEL == ProfileLevels.TWO && element.STATUS == StatusConstants.REJECTED)
        element.STATUS = StatusConstants.FINANCEREJECTED
    else if (element.PROFILE_LEVEL == ProfileLevels.ZERO && element.PREVIOUS_LEVEL == ProfileLevels.THREE && element.STATUS == StatusConstants.REJECTED)
        element.STATUS = StatusConstants.PAYMENTREJECTED
    return element.STATUS
}
