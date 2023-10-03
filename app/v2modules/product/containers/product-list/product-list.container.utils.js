import { countFilters } from 'modules/browse/others/filters.utils';
import I19n from 'dz-I19n';
import store from 'modules/root/components/store-provider/store-provider';
import * as RootNavigation from 'v2modules/root/utils/root-navigation.helper';

const insertWithTabFilters = (externalFilters, routeName) => {
  let tabFilters;
  if (routeName?.includes('NEW')) {
    tabFilters = [
      [
        {
          attribute: 'NOT metafields.condition',
          operator: ':',
          value: 'كالجديد',
        },
      ],
      [
        {
          attribute: 'NOT metafields.condition',
          operator: ':',
          value: 'جيد',
        },
      ],
    ];
  } else if (routeName?.includes('USED')) {
    tabFilters = [
      [
        {
          attribute: 'metafields.condition',
          operator: ':',
          value: 'كالجديد',
        },
        {
          attribute: 'metafields.condition',
          operator: ':',
          value: 'جيد',
        },
      ],
    ];
  } else {
    return externalFilters;
  }

  // remove pre selected conditions from external sources
  // and replace with selected tab condition
  let _filters = externalFilters || [];
  _filters = _filters.filter(
    (subFilters) => subFilters?.length && subFilters[0].attribute !== 'metafields.condition'
  );

  return tabFilters.concat(_filters);
};

export { insertWithTabFilters as insertWithTabFilters };

const getEmptyViewContents = (selectedFilters, onResetFilters) => {
  if (countFilters(selectedFilters) > 0) {
    return {
      title: I19n.t('لا يوجد منتجات متوفرة بالوقت الحالي') + '  🙂',
      buttonText: I19n.t('إعادة ضبط الفلاتر'),
      buttonOnPress: onResetFilters,
    };
  } else {
    return {
      title: I19n.t('لا يوجد منتجات متوفرة بالوقت الحالي') + '  🙂',
      buttonText: I19n.t('تصفح خيارات أخرى'),
      buttonOnPress: RootNavigation.goBack,
    };
  }
};

export { getEmptyViewContents as getEmptyViewContents };

const getReferenceCategoryFromList = (productList = []) => {
  const allSubCategories = store?.getState()?.persistentData?.subCategories;
  const allCategories = store?.getState()?.persistentData?.categories;

  if (!allCategories && !allSubCategories) {
    return;
  }

  let referencedCategory;
  productList.forEach((product) => {
    if (!referencedCategory) {
      const productSubCatTitle = product.meta?.global?.subCategory;
      const productCatTitle = product.meta?.global?.category;

      // Search for suitable sub category
      if (productSubCatTitle && allSubCategories) {
        Object.keys(allSubCategories).forEach((key) => {
          if (!referencedCategory && allSubCategories[key]) {
            if (allSubCategories[key]?.all_titles?.includes(productSubCatTitle)) {
              referencedCategory = allSubCategories[key];
              return;
            }
          }
        });
      } else if (productCatTitle) {
        referencedCategory = allCategories.find((cat) => cat.all_titles?.includes(productCatTitle));
        if (referencedCategory) {
          return;
        }
      }
    }
  });

  return referencedCategory;
};
export { getReferenceCategoryFromList as getReferenceCategoryFromList };
