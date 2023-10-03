import FilterSectionTypeConst from 'modules/browse/constants/filter-section-type.const';
import uniqBy from 'lodash/uniqBy';
import {
  getColorsFilter,
  getPriceRangeFilter,
  getSortOptions,
  getTargetFilter,
} from 'modules/browse/others/filters.utils';
import { isEmptyValues } from 'modules/main/others/main-utils';
import I19n, { getLocale } from 'dz-I19n';
import store from 'modules/root/components/store-provider/store-provider';

/**
 *
 * @param {array of sub/categories} referenceCats
 * @param {*} param1
 */
export function buildFilters2(referenceCats = []) {
  const allFields = store?.getState()?.persistentData?.fields;

  let toAddSizes = [];
  let toAddColors = false;
  let toAddTarget = false;
  const resultFilters = [];

  referenceCats.forEach((category) => {
    let filters = category?.fields || [];

    if (isEmptyValues(allFields) || !filters?.length) {
      return;
    }

    // get full filter objects
    filters = filters.map((item) => allFields[item]);

    // remove condition filter because products would be filtered through tabs (new, used)
    // remove any field that isn't filter
    // map fields to be used in filters screen
    filters = filters
      .filter((field) => field.is_filter && field.name !== 'metafields.condition')
      .map((field) => ({
        ...field,
        options: field.options.map((option) => ({
          attribute: field.name,
          operator: ':',
          value: option.title,
          title: option.title,
          sectionTitle: field.name,
          ar: option.ar,
          en: option.en,
        })),
      }));

    filters.forEach((filter) => {
      if (!resultFilters.find((f) => f.title === filter.title)) {
        resultFilters.push(filter);
      }
    });

    let sizeFields = [];

    if (category.size_fields && Array.isArray(category.size_fields)) {
      sizeFields = category.size_fields.map((item) => allFields[item]);
      sizeFields = sizeFields.map((field) => ({
        ...field,
        options: field.options.map((option) => ({
          attribute: 'size',
          operator: ':',
          value: option.value,
          title: option.title,
          ar: option.ar || option.title,
          en: option.en || option.title,
        })),
      }));
      toAddSizes = [...toAddSizes, ...sizeFields];
    }

    if (category.has_variance) {
      toAddColors = true;
    }

    if (category.has_target) {
      toAddColors = true;
    }
  });

  if (toAddSizes.length > 0) {
    const allSizes = {
      title: I19n.t('الحجم'),
      name: 'size',
      type: FilterSectionTypeConst.SELECT_MULTI,
      options: uniqBy(
        toAddSizes.flatMap((sizeField) => sizeField.options),
        'value'
      ),
    };
    resultFilters.push(allSizes);
  }

  if (toAddColors) {
    resultFilters.push(getColorsFilter());
  }

  if (toAddTarget) {
    resultFilters.push(getTargetFilter());
  }

  resultFilters.push(getSortOptions());
  resultFilters.push(getPriceRangeFilter());

  return resultFilters;
}

const buildFilters = (category, subCategory, allFields) => {
  const referencedCategory = subCategory || category;

  let showNewUsedTabs = true;
  let filters = referencedCategory?.fields || [];

  if (isEmptyValues(allFields)) {
    return [showNewUsedTabs, filters];
  }

  const displayCategoryFields = !!filters?.length;

  if (displayCategoryFields) {
    // get full filter objects
    filters = filters.map((item) => allFields[item]);

    // set flag to not show new/used tabs if there's no condition field
    if (!filters.find((field) => field.name === 'metafields.condition')) {
      showNewUsedTabs = false;
    }

    // remove condition filter because products would be filtered through tabs (new, used)
    // remove any field that isn't filter
    // map fields to be used in filters screen
    filters = filters
      .filter((field) => field.is_filter && field.name !== 'metafields.condition')
      .map((field) => ({
        ...field,
        options: field.options.map((option) => ({
          attribute: field.name,
          operator: ':',
          value: option.title,
          title: option.title,
          sectionTitle: field.name,
          ar: option.ar,
          en: option.en,
        })),
      }));
  }

  let sizeFields = [];
  if (
    displayCategoryFields &&
    referencedCategory.size_fields &&
    Array.isArray(referencedCategory.size_fields)
  ) {
    sizeFields = referencedCategory.size_fields.map((item) => allFields[item]);
    sizeFields = sizeFields.map((field) => ({
      ...field,
      options: field.options.map((option) => ({
        attribute: 'size',
        operator: ':',
        value: option.value,
        title: option.title,
        ar: option.ar || option.title,
        en: option.en || option.title,
      })),
    }));
    if (sizeFields.length > 0) {
      const allSizes = {
        title: I19n.t('الحجم'),
        name: 'size',
        type: FilterSectionTypeConst.SELECT_MULTI,
        options: uniqBy(
          sizeFields.flatMap((sizeField) => sizeField.options),
          'value'
        ),
      };
      filters.push(allSizes);
    }
  }

  if (displayCategoryFields && referencedCategory.has_variance) {
    filters.push(getColorsFilter());
  }

  if (displayCategoryFields && referencedCategory.has_target) {
    filters.push(getTargetFilter());
  }

  filters.push(getSortOptions());
  filters.push(getPriceRangeFilter());

  return [showNewUsedTabs, filters];
};
export { buildFilters as buildFilters };
