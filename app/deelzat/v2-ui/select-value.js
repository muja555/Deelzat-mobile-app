import React, { useCallback } from 'react';
import { isArraysEqual } from 'modules/main/others/main-utils';

const SelectValue = (props) => {
  const {
    options = [],
    value = [],
    onChange = ([]) => {},
    keyBy = 'key',
    labelBy = 'label',
    multi = true,
    renderOption = (props) => {},
  } = props;

  const onItemPress = useCallback(
    (item) => {
      let newValue = [];
      if (value) {
        const exist = value.find((i) => {
          if (Array.isArray(i[keyBy]) && Array.isArray(item[keyBy])) {
            return isArraysEqual(i[keyBy], item[keyBy], 'value');
          } else {
            return i[keyBy] === item[keyBy];
          }
        });
        newValue = multi
          ? value.filter((i) => {
              if (Array.isArray(i[keyBy]) && Array.isArray(item[keyBy])) {
                return !isArraysEqual(i[keyBy], item[keyBy], 'value');
              } else {
                return i[keyBy] !== item[keyBy];
              }
            })
          : [];
        if (!exist) {
          newValue.push(item);
        }
      } else {
        newValue.push(item);
      }
      onChange(newValue);
    },
    [value]
  );

  return (
    <>
      {options.map((item, index) => {
        const _props = {
          ...props,
          item,
          index,
          onItemPress,
        };
        return renderOption(_props);
      })}
    </>
  );
};

export default SelectValue;
