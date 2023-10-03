const EVENT_PARAM = {}

EVENT_PARAM.IS_TEST = 'is_test'

EVENT_PARAM.ITEM_ID = 'item_id'
EVENT_PARAM.ITEM_NAME = 'item_name'

EVENT_PARAM.PRICE = 'price'
EVENT_PARAM.INVENTORY = 'inventory'
EVENT_PARAM.COMPARE_AT_PRICE = 'compare_at_price'

EVENT_PARAM.IS_NEW = 'is_new'
EVENT_PARAM.IS_DISCOUNT = 'is_discount'
EVENT_PARAM.IS_FOUND = 'is_found'
EVENT_PARAM.IS_FREE = 'is_free'

EVENT_PARAM.SHOP_ID = 'shop_id'
EVENT_PARAM.SHOP_NAME = 'shop_name'
EVENT_PARAM.IS_OWNER = 'is_owner'

EVENT_PARAM.FROM_PRODUCT_ID = 'from_product_id'
EVENT_PARAM.FROM_PRODUCT_NAME = 'from_product_name'
EVENT_PARAM.FROM_PRODUCT_CATEGORY_ID = 'from_product_category_id'
EVENT_PARAM.FROM_PRODUCT_CATEGORY_NAME = 'from_product_category_name'
EVENT_PARAM.FROM_PRODUCT_SUBCATEGORY_ID = 'from_product_subcategory_id'
EVENT_PARAM.FROM_PRODUCT_SUBCATEGORY_NAME = 'from_product_subcategory_name'

EVENT_PARAM.SELECTED_FILTERS = 'selected_filters'
EVENT_PARAM.ORDER_ID = 'order_id'
EVENT_PARAM.ORDER_PRODUCT_ID = 'order_product_id'
EVENT_PARAM.PICKUP_TIME = 'pickup_time'
EVENT_PARAM.PICKUP_DAY = 'pickup_day'

EVENT_PARAM.IS_NEW_SHOP = 'is_new_shop' // If had to a shop in post product funnel
EVENT_PARAM.VARIANTS_COUNT = 'variants_count'
EVENT_PARAM.PRICE_MODE = 'price_mode'
EVENT_PARAM.IS_SELECTED = 'is_selected'

// Organic sources
EVENT_PARAM.SOURCE = 'source'
EVENT_PARAM.SOURCE_ATTR_1 = 'source_attr1'
EVENT_PARAM.SOURCE_ATTR_2 = 'source_attr2'
EVENT_PARAM.SOURCE_POSITION = 'source_position'


EVENT_PARAM.POSITION = 'position'
EVENT_PARAM.PAGE_NAME = 'page_name'

EVENT_PARAM.PAYMENT_METHOD = 'payment_method'
EVENT_PARAM.ADDONS = 'addons'
EVENT_PARAM.SHIPPING_CITY = 'shipping_city'
EVENT_PARAM.ORIGIN_COUNTRY = 'origin_country' // buyer country

EVENT_PARAM.ERROR_MESSAGE = 'error_message'

EVENT_PARAM.IS_UPDATE_PRODUCT = 'is_update_product'
EVENT_PARAM.IMAGE_SOURCE = 'image_source'
EVENT_PARAM.IMAGES_COUNT = 'images_count'
EVENT_PARAM.UPLOADED_IMAGES_COUNT = 'uploaded_images_count'
EVENT_PARAM.FIELD_NAME = 'field_name'
EVENT_PARAM.FIELD_VALUE = 'field_value'
EVENT_PARAM.STEP = 'step'

EVENT_PARAM.FOLLWING_LIST_COUNT = 'following_list_count'
EVENT_PARAM.FILTER_NAME = 'filter_name'
EVENT_PARAM.FILTERS_NAMES = 'filters_names'
EVENT_PARAM.FILTER_VALUE = 'filter_value'
EVENT_PARAM.SECTION_NAME = 'section_name'
EVENT_PARAM.SAVED_ADDRESS = 'saved_address'
EVENT_PARAM.IS_FOLLOWING = 'is_following'
EVENT_PARAM.IS_BLOCKED = 'is_blocked'
EVENT_PARAM.FEED_POSITION = 'feed_position'
EVENT_PARAM.TAB_NAME = 'tab_name'
EVENT_PARAM.IS_VALID = 'is_valid'
EVENT_PARAM.COLLECTION_ID = 'collection_id'
EVENT_PARAM.COLLECTION_NAME = 'collection_name'
EVENT_PARAM.BANNER_ID = 'banner_id'
EVENT_PARAM.BANNER_NAME = 'banner_name'
EVENT_PARAM.ACTIVITY_NAME = 'activity_name'
EVENT_PARAM.ADDON_ID = 'addon_id'
EVENT_PARAM.ADDON_NAME = 'addon_name'
EVENT_PARAM.WITH_USER_ID = 'with_user_id'
EVENT_PARAM.ACTION = 'action'
EVENT_PARAM.TO = 'to'
EVENT_PARAM.THEME_ID = 'theme_id'


// Firebase pre-defined params
EVENT_PARAM.VALUE = 'value'
EVENT_PARAM.CURRENCY = 'currency'
EVENT_PARAM.ITEMS = 'items'
EVENT_PARAM.ITEM_BRAND = 'item_brand'
EVENT_PARAM.ITEM_CATEGORY = 'item_category'
EVENT_PARAM.ITEM_CATEGORY2 = 'item_category2'
EVENT_PARAM.ITEM_CATEGORY_ID = 'item_category_id'
EVENT_PARAM.ITEM_CATEGORY2_ID = 'item_category2_id'
EVENT_PARAM.ITEM_TARGET = 'item_target'
EVENT_PARAM.ITEM_VARIANT_ID = 'item_variant_id'
EVENT_PARAM.ITEM_VARIANT = 'item_variant'
EVENT_PARAM.QUANTITY = 'quantity'
EVENT_PARAM.SEARCH_TERM = 'search_term'
EVENT_PARAM.CONTENT_TYPE = 'content_type'
EVENT_PARAM.METHOD  = 'method'
EVENT_PARAM.TRANSACTION_ID = 'transaction_id'
EVENT_PARAM.SHIPPING = 'shipping' // shipping cost
EVENT_PARAM.COUPON = 'coupon' // coupon


Object.freeze(EVENT_PARAM);
export default EVENT_PARAM
