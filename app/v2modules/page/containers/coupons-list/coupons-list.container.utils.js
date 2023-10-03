import I19n from "dz-I19n";
import CouponTypeConst from 'v2modules/checkout/constants/coupon-type.const';

export function getCouponListItemTitle(coupon, currencyCode) {

    if (!coupon) {
        return I19n.t('لا يوجد قسائم خاصة بك بالوقت الحالي') + '!';
    }

    if (coupon.type === CouponTypeConst.FIXED_AMOUNT || coupon.type === CouponTypeConst.FIXED_AMOUNT_WITH_FREE_DELIVERY) {
        return `${I19n.t('خصم بقيمة')} ${parseFloat(coupon.discount)} ${currencyCode}`;
    }
    else if (coupon.type === CouponTypeConst.PERCENTAGE_DISCOUNT || CouponTypeConst.PERCENTAGE_DISCOUNT_WITH_FREE_DELIVERY) {
        return `${I19n.t('خصم')} ${parseFloat(coupon.discount)}%`
    }
    else if (coupon.type === CouponTypeConst.FREE_DELIVERY) {
        return I19n.t('توصيل مجاني');
    }
}
