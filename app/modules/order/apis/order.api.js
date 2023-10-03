import Http from "deelzat/http";
import SalesListInput from "modules/order/inputs/sales-list.input";
import OrderStatusUpdateInput from "modules/order/inputs/order-status-update.input";
import OrderCreateInput from "modules/order/inputs/order-create.input";
import OrdersListInput from "modules/order/inputs/orders-list-input";
const OrderApi = {};

OrderApi.listSales = async (inputs: SalesListInput) => {
    return Http.get('/app/shop/' + inputs.shopId + '/orders', inputs.query())
};

OrderApi.statusUpdate = async (inputs: OrderStatusUpdateInput) => {
    return Http.put('/app/shop/' + inputs.shopId + '/orders/' + inputs.orderId, inputs.payload())
};

OrderApi.createOrder = async (inputs: OrderCreateInput) => {
    return Http.post('/app/v2/orders', inputs.payload())
}

OrderApi.listOrders = (inputs: OrdersListInput) => {
    return Http.get('/app/orders', inputs.query());
}

OrderApi.getOrder = (orderId: number) => {
    return Http.get(`/app/orders/${orderId}`);
}

OrderApi.cancelOrder = (orderId: number) => {
    return Http.delete(`/app/orders/${orderId}`);
}


export default OrderApi;
