import I19n from "dz-I19n";

const getOrderPickupDayOptions = () => {
    const options = [];

    for (let i = 1; i < 16; i++) {
        options.push({
            label: i + ' ' + I19n.t('يوم'),
            key: i,
            value: i,
        });
    }

    return options;
};

export { getOrderPickupDayOptions as getOrderPickupDayOptions }

const getOrderPickupTimeOptions = () => {
    const times = [
        '6 AM - 8 AM',
        '8 AM - 10 AM',
        '10 AM - 12 PM',
        '12 PM - 2 PM',
        '2 PM - 4 PM',
        '4 PM - 6 PM',
        '6 PM - 8 PM',
    ];

    const options = [];

    times.forEach((item) => {
        options.push({
            label: item,
            key: item,
            value: item
        })
    });


    return options;
};

export { getOrderPickupTimeOptions as getOrderPickupTimeOptions }
