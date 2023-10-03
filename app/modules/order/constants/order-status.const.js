const OrderStatusConst = {};

OrderStatusConst.PENDING = 'PENDING';
OrderStatusConst.REJECTED = 'REJECTED';
OrderStatusConst.CANCELED = 'CANCELED';
OrderStatusConst.CONFIRMED = 'CONFIRMED';
OrderStatusConst.ORDER_PICKED = 'ORDER_PICKED';
OrderStatusConst.IN_HUB = 'IN_HUB';
OrderStatusConst.SHIPPED = 'SHIPPED';
OrderStatusConst.DELIVERED = 'DELIVERED';

Object.freeze(OrderStatusConst);
export default OrderStatusConst;
