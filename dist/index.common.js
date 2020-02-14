"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.VXETablePluginAntd = void 0;

var _xeUtils = _interopRequireDefault(require("xe-utils/methods/xe-utils"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function isEmptyValue(cellValue) {
  return cellValue === null || cellValue === undefined || cellValue === '';
}

function matchCascaderData(index, list, values, labels) {
  var val = values[index];

  if (list && values.length > index) {
    _xeUtils["default"].each(list, function (item) {
      if (item.value === val) {
        labels.push(item.label);
        matchCascaderData(++index, item.children, values, labels);
      }
    });
  }
}

function formatDatePicker(defaultFormat) {
  return function (h, renderOpts, params) {
    return cellText(h, getDatePickerCellValue(renderOpts, params, defaultFormat));
  };
}

function getProps(_ref, _ref2, defaultProps) {
  var $table = _ref.$table;
  var props = _ref2.props;
  return _xeUtils["default"].assign($table.vSize ? {
    size: $table.vSize
  } : {}, defaultProps, props);
}

function getCellEvents(renderOpts, params) {
  var name = renderOpts.name,
      events = renderOpts.events;
  var $table = params.$table;
  var type = 'change';

  switch (name) {
    case 'AAutoComplete':
      type = 'select';
      break;

    case 'AInput':
      type = 'input';
      break;

    case 'AInputNumber':
      type = 'change';
      break;
  }

  var on = _defineProperty({}, type, function (evnt) {
    $table.updateStatus(params);

    if (events && events[type]) {
      events[type](params, evnt);
    }
  });

  if (events) {
    return _xeUtils["default"].assign({}, _xeUtils["default"].objectMap(events, function (cb) {
      return function () {
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        cb.apply(null, [params].concat.apply(params, args));
      };
    }), on);
  }

  return on;
}

function getSelectCellValue(renderOpts, params) {
  var options = renderOpts.options,
      optionGroups = renderOpts.optionGroups,
      _renderOpts$props = renderOpts.props,
      props = _renderOpts$props === void 0 ? {} : _renderOpts$props,
      _renderOpts$optionPro = renderOpts.optionProps,
      optionProps = _renderOpts$optionPro === void 0 ? {} : _renderOpts$optionPro,
      _renderOpts$optionGro = renderOpts.optionGroupProps,
      optionGroupProps = _renderOpts$optionGro === void 0 ? {} : _renderOpts$optionGro;
  var row = params.row,
      column = params.column;
  var labelProp = optionProps.label || 'label';
  var valueProp = optionProps.value || 'value';
  var groupOptions = optionGroupProps.options || 'options';

  var cellValue = _xeUtils["default"].get(row, column.property);

  if (!isEmptyValue(cellValue)) {
    return _xeUtils["default"].map(props.mode === 'multiple' ? cellValue : [cellValue], optionGroups ? function (value) {
      var selectItem;

      for (var index = 0; index < optionGroups.length; index++) {
        selectItem = _xeUtils["default"].find(optionGroups[index][groupOptions], function (item) {
          return item[valueProp] === value;
        });

        if (selectItem) {
          break;
        }
      }

      return selectItem ? selectItem[labelProp] : value;
    } : function (value) {
      var selectItem = _xeUtils["default"].find(options, function (item) {
        return item[valueProp] === value;
      });

      return selectItem ? selectItem[labelProp] : value;
    }).join(';');
  }

  return null;
}

function getCascaderCellValue(renderOpts, params) {
  var _renderOpts$props2 = renderOpts.props,
      props = _renderOpts$props2 === void 0 ? {} : _renderOpts$props2;
  var row = params.row,
      column = params.column;

  var cellValue = _xeUtils["default"].get(row, column.property);

  var values = cellValue || [];
  var labels = [];
  matchCascaderData(0, props.options, values, labels);
  return (props.showAllLevels === false ? labels.slice(labels.length - 1, labels.length) : labels).join(" ".concat(props.separator || '/', " "));
}

function getRangePickerCellValue(renderOpts, params) {
  var _renderOpts$props3 = renderOpts.props,
      props = _renderOpts$props3 === void 0 ? {} : _renderOpts$props3;
  var row = params.row,
      column = params.column;

  var cellValue = _xeUtils["default"].get(row, column.property);

  if (cellValue) {
    cellValue = _xeUtils["default"].map(cellValue, function (date) {
      return date.format(props.format || 'YYYY-MM-DD');
    }).join(' ~ ');
  }

  return cellValue;
}

function getTreeSelectCellValue(renderOpts, params) {
  var _renderOpts$props4 = renderOpts.props,
      props = _renderOpts$props4 === void 0 ? {} : _renderOpts$props4;
  var row = params.row,
      column = params.column;

  var cellValue = _xeUtils["default"].get(row, column.property);

  if (cellValue && (props.treeCheckable || props.multiple)) {
    cellValue = cellValue.join(';');
  }

  return cellValue;
}

function getDatePickerCellValue(renderOpts, params, defaultFormat) {
  var _renderOpts$props5 = renderOpts.props,
      props = _renderOpts$props5 === void 0 ? {} : _renderOpts$props5;
  var row = params.row,
      column = params.column;

  var cellValue = _xeUtils["default"].get(row, column.property);

  if (cellValue) {
    cellValue = cellValue.format(props.format || defaultFormat);
  }

  return cellValue;
}

function createEditRender(defaultProps) {
  return function (h, renderOpts, params) {
    var row = params.row,
        column = params.column;
    var attrs = renderOpts.attrs;
    var props = getProps(params, renderOpts, defaultProps);
    return [h(renderOpts.name, {
      props: props,
      attrs: attrs,
      model: {
        value: _xeUtils["default"].get(row, column.property),
        callback: function callback(value) {
          _xeUtils["default"].set(row, column.property, value);
        }
      },
      on: getCellEvents(renderOpts, params)
    })];
  };
}

function getFilterEvents(on, renderOpts, params, context) {
  var events = renderOpts.events;

  if (events) {
    return _xeUtils["default"].assign({}, _xeUtils["default"].objectMap(events, function (cb) {
      return function () {
        params = Object.assign({
          context: context
        }, params);

        for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          args[_key2] = arguments[_key2];
        }

        cb.apply(null, [params].concat.apply(params, args));
      };
    }), on);
  }

  return on;
}

function createFilterRender(defaultProps) {
  return function (h, renderOpts, params, context) {
    var column = params.column;
    var name = renderOpts.name,
        attrs = renderOpts.attrs,
        events = renderOpts.events;
    var props = getProps(params, renderOpts);
    var type = 'change';

    switch (name) {
      case 'AAutoComplete':
        type = 'select';
        break;

      case 'AInput':
        type = 'input';
        break;

      case 'AInputNumber':
        type = 'change';
        break;
    }

    return column.filters.map(function (item) {
      return h(name, {
        props: props,
        attrs: attrs,
        model: {
          value: item.data,
          callback: function callback(optionValue) {
            item.data = optionValue;
          }
        },
        on: getFilterEvents(_defineProperty({}, type, function (evnt) {
          handleConfirmFilter(context, column, !!item.data, item);

          if (events && events[type]) {
            events[type](Object.assign({
              context: context
            }, params), evnt);
          }
        }), renderOpts, params, context)
      });
    });
  };
}

function handleConfirmFilter(context, column, checked, item) {
  context[column.filterMultiple ? 'changeMultipleOption' : 'changeRadioOption']({}, checked, item);
}

function defaultFilterMethod(_ref3) {
  var option = _ref3.option,
      row = _ref3.row,
      column = _ref3.column;
  var data = option.data;

  var cellValue = _xeUtils["default"].get(row, column.property);
  /* eslint-disable eqeqeq */


  return cellValue === data;
}

function renderOptions(h, options, optionProps) {
  var labelProp = optionProps.label || 'label';
  var valueProp = optionProps.value || 'value';
  var disabledProp = optionProps.disabled || 'disabled';
  return _xeUtils["default"].map(options, function (item, index) {
    return h('a-select-option', {
      props: {
        value: item[valueProp],
        disabled: item[disabledProp]
      },
      key: index
    }, item[labelProp]);
  });
}

function cellText(h, cellValue) {
  return ['' + (isEmptyValue(cellValue) ? '' : cellValue)];
}

function createFormItemRender(defaultProps) {
  return function (h, renderOpts, params, context) {
    var data = params.data,
        property = params.property;
    var name = renderOpts.name;
    var attrs = renderOpts.attrs;
    var props = getFormProps(context, renderOpts, defaultProps);
    return [h(name, {
      attrs: attrs,
      props: props,
      model: {
        value: _xeUtils["default"].get(data, property),
        callback: function callback(value) {
          _xeUtils["default"].set(data, property, value);
        }
      },
      on: getFormEvents(renderOpts, params, context)
    })];
  };
}

function getFormProps(_ref4, _ref5, defaultProps) {
  var $form = _ref4.$form;
  var props = _ref5.props;
  return _xeUtils["default"].assign($form.vSize ? {
    size: $form.vSize
  } : {}, defaultProps, props);
}

function getFormEvents(renderOpts, params, context) {
  var events = renderOpts.events;
  var $form = params.$form;
  var type = 'change';

  switch (name) {
    case 'AAutoComplete':
      type = 'select';
      break;

    case 'AInput':
      type = 'input';
      break;

    case 'AInputNumber':
      type = 'change';
      break;
  }

  var on = _defineProperty({}, type, function (evnt) {
    $form.updateStatus(params);

    if (events && events[type]) {
      events[type](params, evnt);
    }
  });

  if (events) {
    return _xeUtils["default"].assign({}, _xeUtils["default"].objectMap(events, function (cb) {
      return function () {
        for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
          args[_key3] = arguments[_key3];
        }

        cb.apply(null, [params].concat.apply(params, args));
      };
    }), on);
  }

  return on;
}

function createDatePickerExportMethod(defaultFormat, isEdit) {
  var renderProperty = isEdit ? 'editRender' : 'cellRender';
  return function (params) {
    return getDatePickerCellValue(params.column[renderProperty], params, defaultFormat);
  };
}

function createExportMethod(valueMethod, isEdit) {
  var renderProperty = isEdit ? 'editRender' : 'cellRender';
  return function (params) {
    return valueMethod(params.column[renderProperty], params);
  };
}

function createFormItemRadioAndCheckboxRender() {
  return function (h, renderOpts, params, context) {
    var name = renderOpts.name,
        options = renderOpts.options,
        _renderOpts$optionPro2 = renderOpts.optionProps,
        optionProps = _renderOpts$optionPro2 === void 0 ? {} : _renderOpts$optionPro2;
    var data = params.data,
        property = params.property;
    var attrs = renderOpts.attrs;
    var props = getFormProps(context, renderOpts);
    var labelProp = optionProps.label || 'label';
    var valueProp = optionProps.value || 'value';
    var disabledProp = optionProps.disabled || 'disabled';
    return [h("".concat(name, "Group"), {
      props: props,
      attrs: attrs,
      model: {
        value: _xeUtils["default"].get(data, property),
        callback: function callback(cellValue) {
          _xeUtils["default"].set(data, property, cellValue);
        }
      },
      on: getFormEvents(renderOpts, params, context)
    }, options.map(function (option) {
      return h(name, {
        props: {
          value: option[valueProp],
          disabled: option[disabledProp]
        }
      }, option[labelProp]);
    }))];
  };
}
/**
 * 渲染函数
 */


var renderMap = {
  AAutoComplete: {
    autofocus: 'input.ant-input',
    renderDefault: createEditRender(),
    renderEdit: createEditRender(),
    renderFilter: createFilterRender(),
    filterMethod: defaultFilterMethod,
    renderItem: createFormItemRender()
  },
  AInput: {
    autofocus: 'input.ant-input',
    renderDefault: createEditRender(),
    renderEdit: createEditRender(),
    renderFilter: createFilterRender(),
    filterMethod: defaultFilterMethod,
    renderItem: createFormItemRender()
  },
  AInputNumber: {
    autofocus: 'input.ant-input-number-input',
    renderDefault: createEditRender(),
    renderEdit: createEditRender(),
    renderFilter: createFilterRender(),
    filterMethod: defaultFilterMethod,
    renderItem: createFormItemRender()
  },
  ASelect: {
    renderEdit: function renderEdit(h, renderOpts, params) {
      var options = renderOpts.options,
          optionGroups = renderOpts.optionGroups,
          _renderOpts$optionPro3 = renderOpts.optionProps,
          optionProps = _renderOpts$optionPro3 === void 0 ? {} : _renderOpts$optionPro3,
          _renderOpts$optionGro2 = renderOpts.optionGroupProps,
          optionGroupProps = _renderOpts$optionGro2 === void 0 ? {} : _renderOpts$optionGro2;
      var row = params.row,
          column = params.column;
      var attrs = renderOpts.attrs;
      var props = getProps(params, renderOpts);

      if (optionGroups) {
        var groupOptions = optionGroupProps.options || 'options';
        var groupLabel = optionGroupProps.label || 'label';
        return [h('a-select', {
          props: props,
          attrs: attrs,
          model: {
            value: _xeUtils["default"].get(row, column.property),
            callback: function callback(cellValue) {
              _xeUtils["default"].set(row, column.property, cellValue);
            }
          },
          on: getCellEvents(renderOpts, params)
        }, _xeUtils["default"].map(optionGroups, function (group, gIndex) {
          return h('a-select-opt-group', {
            key: gIndex
          }, [h('span', {
            slot: 'label'
          }, group[groupLabel])].concat(renderOptions(h, group[groupOptions], optionProps)));
        }))];
      }

      return [h('a-select', {
        props: props,
        attrs: attrs,
        model: {
          value: _xeUtils["default"].get(row, column.property),
          callback: function callback(cellValue) {
            _xeUtils["default"].set(row, column.property, cellValue);
          }
        },
        on: getCellEvents(renderOpts, params)
      }, renderOptions(h, options, optionProps))];
    },
    renderCell: function renderCell(h, renderOpts, params) {
      return cellText(h, getSelectCellValue(renderOpts, params));
    },
    renderFilter: function renderFilter(h, renderOpts, params, context) {
      var options = renderOpts.options,
          optionGroups = renderOpts.optionGroups,
          _renderOpts$optionPro4 = renderOpts.optionProps,
          optionProps = _renderOpts$optionPro4 === void 0 ? {} : _renderOpts$optionPro4,
          _renderOpts$optionGro3 = renderOpts.optionGroupProps,
          optionGroupProps = _renderOpts$optionGro3 === void 0 ? {} : _renderOpts$optionGro3;
      var column = params.column;
      var attrs = renderOpts.attrs,
          events = renderOpts.events;
      var props = getProps(params, renderOpts);
      var type = 'change';

      if (optionGroups) {
        var groupOptions = optionGroupProps.options || 'options';
        var groupLabel = optionGroupProps.label || 'label';
        return column.filters.map(function (item) {
          return h('a-select', {
            props: props,
            attrs: attrs,
            model: {
              value: item.data,
              callback: function callback(optionValue) {
                item.data = optionValue;
              }
            },
            on: getFilterEvents(_defineProperty({}, type, function (value) {
              handleConfirmFilter(context, column, value && value.length > 0, item);

              if (events && events[type]) {
                events[type](Object.assign({
                  context: context
                }, params), value);
              }
            }), renderOpts, params, context)
          }, _xeUtils["default"].map(optionGroups, function (group, gIndex) {
            return h('a-select-opt-group', {
              key: gIndex
            }, [h('span', {
              slot: 'label'
            }, group[groupLabel])].concat(renderOptions(h, group[groupOptions], optionProps)));
          }));
        });
      }

      return column.filters.map(function (item) {
        return h('a-select', {
          props: props,
          attrs: attrs,
          model: {
            value: item.data,
            callback: function callback(optionValue) {
              item.data = optionValue;
            }
          },
          on: getFilterEvents({
            change: function change(value) {
              handleConfirmFilter(context, column, value && value.length > 0, item);

              if (events && events[type]) {
                events[type](Object.assign({
                  context: context
                }, params), value);
              }
            }
          }, renderOpts, params, context)
        }, renderOptions(h, options, optionProps));
      });
    },
    filterMethod: function filterMethod(_ref6) {
      var option = _ref6.option,
          row = _ref6.row,
          column = _ref6.column;
      var data = option.data;
      var property = column.property,
          renderOpts = column.filterRender;
      var _renderOpts$props6 = renderOpts.props,
          props = _renderOpts$props6 === void 0 ? {} : _renderOpts$props6;

      var cellValue = _xeUtils["default"].get(row, property);

      if (props.mode === 'multiple') {
        if (_xeUtils["default"].isArray(cellValue)) {
          return _xeUtils["default"].includeArrays(cellValue, data);
        }

        return data.indexOf(cellValue) > -1;
      }
      /* eslint-disable eqeqeq */


      return cellValue == data;
    },
    renderItem: function renderItem(h, renderOpts, params, context) {
      var options = renderOpts.options,
          optionGroups = renderOpts.optionGroups,
          _renderOpts$optionPro5 = renderOpts.optionProps,
          optionProps = _renderOpts$optionPro5 === void 0 ? {} : _renderOpts$optionPro5,
          _renderOpts$optionGro4 = renderOpts.optionGroupProps,
          optionGroupProps = _renderOpts$optionGro4 === void 0 ? {} : _renderOpts$optionGro4;
      var data = params.data,
          property = params.property;
      var attrs = renderOpts.attrs;
      var props = getFormProps(context, renderOpts);

      if (optionGroups) {
        var groupOptions = optionGroupProps.options || 'options';
        var groupLabel = optionGroupProps.label || 'label';
        return [h('a-select', {
          props: props,
          attrs: attrs,
          model: {
            value: _xeUtils["default"].get(data, property),
            callback: function callback(cellValue) {
              _xeUtils["default"].set(data, property, cellValue);
            }
          },
          on: getFormEvents(renderOpts, params, context)
        }, _xeUtils["default"].map(optionGroups, function (group, gIndex) {
          return h('a-select-opt-group', {
            key: gIndex
          }, [h('span', {
            slot: 'label'
          }, group[groupLabel])].concat(renderOptions(h, group[groupOptions], optionProps)));
        }))];
      }

      return [h('a-select', {
        props: props,
        attrs: attrs,
        model: {
          value: _xeUtils["default"].get(data, property),
          callback: function callback(cellValue) {
            _xeUtils["default"].set(data, property, cellValue);
          }
        },
        on: getFormEvents(renderOpts, params, context)
      }, renderOptions(h, options, optionProps))];
    },
    editExportMethod: createExportMethod(getSelectCellValue, true),
    cellExportMethod: createExportMethod(getSelectCellValue)
  },
  ACascader: {
    renderEdit: createEditRender(),
    renderCell: function renderCell(h, renderOpts, params) {
      return cellText(h, getCascaderCellValue(renderOpts, params));
    },
    renderItem: createFormItemRender(),
    editExportMethod: createExportMethod(getCascaderCellValue, true),
    cellExportMethod: createExportMethod(getCascaderCellValue)
  },
  ADatePicker: {
    renderEdit: createEditRender(),
    renderCell: formatDatePicker('YYYY-MM-DD'),
    renderItem: createFormItemRender(),
    editExportMethod: createDatePickerExportMethod('YYYY-MM-DD', true),
    cellExportMethod: createDatePickerExportMethod('YYYY-MM-DD')
  },
  AMonthPicker: {
    renderEdit: createEditRender(),
    renderCell: formatDatePicker('YYYY-MM'),
    renderItem: createFormItemRender(),
    editExportMethod: createDatePickerExportMethod('YYYY-MM', true),
    cellExportMethod: createDatePickerExportMethod('YYYY-MM')
  },
  ARangePicker: {
    renderEdit: createEditRender(),
    renderCell: function renderCell(h, renderOpts, params) {
      return cellText(h, getRangePickerCellValue(renderOpts, params));
    },
    renderItem: createFormItemRender(),
    editExportMethod: createExportMethod(getRangePickerCellValue, true),
    cellExportMethod: createExportMethod(getRangePickerCellValue)
  },
  AWeekPicker: {
    renderEdit: createEditRender(),
    renderCell: formatDatePicker('YYYY-WW周'),
    renderItem: createFormItemRender(),
    editExportMethod: createDatePickerExportMethod('YYYY-WW周', true),
    cellExportMethod: createDatePickerExportMethod('YYYY-WW周')
  },
  ATimePicker: {
    renderEdit: createEditRender(),
    renderCell: formatDatePicker('HH:mm:ss'),
    renderItem: createFormItemRender(),
    editExportMethod: createDatePickerExportMethod('HH:mm:ss', true),
    cellExportMethod: createDatePickerExportMethod('HH:mm:ss')
  },
  ATreeSelect: {
    renderEdit: createEditRender(),
    renderCell: function renderCell(h, renderOpts, params) {
      return cellText(h, getTreeSelectCellValue(renderOpts, params));
    },
    renderItem: createFormItemRender(),
    editExportMethod: createExportMethod(getTreeSelectCellValue, true),
    cellExportMethod: createExportMethod(getTreeSelectCellValue)
  },
  ARate: {
    renderDefault: createEditRender(),
    renderEdit: createEditRender(),
    renderFilter: createFilterRender(),
    filterMethod: defaultFilterMethod,
    renderItem: createFormItemRender()
  },
  ASwitch: {
    renderDefault: createEditRender(),
    renderEdit: createEditRender(),
    renderFilter: createFilterRender(),
    filterMethod: defaultFilterMethod,
    renderItem: createFormItemRender()
  },
  ARadio: {
    renderItem: createFormItemRadioAndCheckboxRender()
  },
  ACheckbox: {
    renderItem: createFormItemRadioAndCheckboxRender()
  }
};
/**
 * 事件兼容性处理
 */

function handleClearEvent(params, evnt, context) {
  var getEventTargetNode = context.getEventTargetNode;
  var bodyElem = document.body;

  if ( // 下拉框
  getEventTargetNode(evnt, bodyElem, 'ant-select-dropdown').flag || // 级联
  getEventTargetNode(evnt, bodyElem, 'ant-cascader-menus').flag || // 日期
  getEventTargetNode(evnt, bodyElem, 'ant-calendar-picker-container').flag || // 时间选择
  getEventTargetNode(evnt, bodyElem, 'ant-time-picker-panel').flag) {
    return false;
  }
}
/**
 * 基于 vxe-table 表格的适配插件，用于兼容 ant-design-vue 组件库
 */


var VXETablePluginAntd = {
  install: function install(xtable) {
    var interceptor = xtable.interceptor,
        renderer = xtable.renderer;
    renderer.mixin(renderMap);
    interceptor.add('event.clearFilter', handleClearEvent);
    interceptor.add('event.clearActived', handleClearEvent);
  }
};
exports.VXETablePluginAntd = VXETablePluginAntd;

function toMomentString(cellValue, format) {
  return cellValue ? cellValue.format(format) : '';
}

_xeUtils["default"].mixin({
  toMomentString: toMomentString
});

if (typeof window !== 'undefined' && window.VXETable) {
  window.VXETable.use(VXETablePluginAntd);
}

var _default = VXETablePluginAntd;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LnRzIl0sIm5hbWVzIjpbImlzRW1wdHlWYWx1ZSIsImNlbGxWYWx1ZSIsInVuZGVmaW5lZCIsIm1hdGNoQ2FzY2FkZXJEYXRhIiwiaW5kZXgiLCJsaXN0IiwidmFsdWVzIiwibGFiZWxzIiwidmFsIiwibGVuZ3RoIiwiWEVVdGlscyIsImVhY2giLCJpdGVtIiwidmFsdWUiLCJwdXNoIiwibGFiZWwiLCJjaGlsZHJlbiIsImZvcm1hdERhdGVQaWNrZXIiLCJkZWZhdWx0Rm9ybWF0IiwiaCIsInJlbmRlck9wdHMiLCJwYXJhbXMiLCJjZWxsVGV4dCIsImdldERhdGVQaWNrZXJDZWxsVmFsdWUiLCJnZXRQcm9wcyIsImRlZmF1bHRQcm9wcyIsIiR0YWJsZSIsInByb3BzIiwiYXNzaWduIiwidlNpemUiLCJzaXplIiwiZ2V0Q2VsbEV2ZW50cyIsIm5hbWUiLCJldmVudHMiLCJ0eXBlIiwib24iLCJldm50IiwidXBkYXRlU3RhdHVzIiwib2JqZWN0TWFwIiwiY2IiLCJhcmdzIiwiYXBwbHkiLCJjb25jYXQiLCJnZXRTZWxlY3RDZWxsVmFsdWUiLCJvcHRpb25zIiwib3B0aW9uR3JvdXBzIiwib3B0aW9uUHJvcHMiLCJvcHRpb25Hcm91cFByb3BzIiwicm93IiwiY29sdW1uIiwibGFiZWxQcm9wIiwidmFsdWVQcm9wIiwiZ3JvdXBPcHRpb25zIiwiZ2V0IiwicHJvcGVydHkiLCJtYXAiLCJtb2RlIiwic2VsZWN0SXRlbSIsImZpbmQiLCJqb2luIiwiZ2V0Q2FzY2FkZXJDZWxsVmFsdWUiLCJzaG93QWxsTGV2ZWxzIiwic2xpY2UiLCJzZXBhcmF0b3IiLCJnZXRSYW5nZVBpY2tlckNlbGxWYWx1ZSIsImRhdGUiLCJmb3JtYXQiLCJnZXRUcmVlU2VsZWN0Q2VsbFZhbHVlIiwidHJlZUNoZWNrYWJsZSIsIm11bHRpcGxlIiwiY3JlYXRlRWRpdFJlbmRlciIsImF0dHJzIiwibW9kZWwiLCJjYWxsYmFjayIsInNldCIsImdldEZpbHRlckV2ZW50cyIsImNvbnRleHQiLCJPYmplY3QiLCJjcmVhdGVGaWx0ZXJSZW5kZXIiLCJmaWx0ZXJzIiwiZGF0YSIsIm9wdGlvblZhbHVlIiwiaGFuZGxlQ29uZmlybUZpbHRlciIsImNoZWNrZWQiLCJmaWx0ZXJNdWx0aXBsZSIsImRlZmF1bHRGaWx0ZXJNZXRob2QiLCJvcHRpb24iLCJyZW5kZXJPcHRpb25zIiwiZGlzYWJsZWRQcm9wIiwiZGlzYWJsZWQiLCJrZXkiLCJjcmVhdGVGb3JtSXRlbVJlbmRlciIsImdldEZvcm1Qcm9wcyIsImdldEZvcm1FdmVudHMiLCIkZm9ybSIsImNyZWF0ZURhdGVQaWNrZXJFeHBvcnRNZXRob2QiLCJpc0VkaXQiLCJyZW5kZXJQcm9wZXJ0eSIsImNyZWF0ZUV4cG9ydE1ldGhvZCIsInZhbHVlTWV0aG9kIiwiY3JlYXRlRm9ybUl0ZW1SYWRpb0FuZENoZWNrYm94UmVuZGVyIiwicmVuZGVyTWFwIiwiQUF1dG9Db21wbGV0ZSIsImF1dG9mb2N1cyIsInJlbmRlckRlZmF1bHQiLCJyZW5kZXJFZGl0IiwicmVuZGVyRmlsdGVyIiwiZmlsdGVyTWV0aG9kIiwicmVuZGVySXRlbSIsIkFJbnB1dCIsIkFJbnB1dE51bWJlciIsIkFTZWxlY3QiLCJncm91cExhYmVsIiwiZ3JvdXAiLCJnSW5kZXgiLCJzbG90IiwicmVuZGVyQ2VsbCIsImNoYW5nZSIsImZpbHRlclJlbmRlciIsImlzQXJyYXkiLCJpbmNsdWRlQXJyYXlzIiwiaW5kZXhPZiIsImVkaXRFeHBvcnRNZXRob2QiLCJjZWxsRXhwb3J0TWV0aG9kIiwiQUNhc2NhZGVyIiwiQURhdGVQaWNrZXIiLCJBTW9udGhQaWNrZXIiLCJBUmFuZ2VQaWNrZXIiLCJBV2Vla1BpY2tlciIsIkFUaW1lUGlja2VyIiwiQVRyZWVTZWxlY3QiLCJBUmF0ZSIsIkFTd2l0Y2giLCJBUmFkaW8iLCJBQ2hlY2tib3giLCJoYW5kbGVDbGVhckV2ZW50IiwiZ2V0RXZlbnRUYXJnZXROb2RlIiwiYm9keUVsZW0iLCJkb2N1bWVudCIsImJvZHkiLCJmbGFnIiwiVlhFVGFibGVQbHVnaW5BbnRkIiwiaW5zdGFsbCIsInh0YWJsZSIsImludGVyY2VwdG9yIiwicmVuZGVyZXIiLCJtaXhpbiIsImFkZCIsInRvTW9tZW50U3RyaW5nIiwid2luZG93IiwiVlhFVGFibGUiLCJ1c2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7Ozs7O0FBR0EsU0FBU0EsWUFBVCxDQUF1QkMsU0FBdkIsRUFBcUM7QUFDbkMsU0FBT0EsU0FBUyxLQUFLLElBQWQsSUFBc0JBLFNBQVMsS0FBS0MsU0FBcEMsSUFBaURELFNBQVMsS0FBSyxFQUF0RTtBQUNEOztBQUVELFNBQVNFLGlCQUFULENBQTRCQyxLQUE1QixFQUEyQ0MsSUFBM0MsRUFBNkRDLE1BQTdELEVBQWlGQyxNQUFqRixFQUFtRztBQUNqRyxNQUFJQyxHQUFHLEdBQUdGLE1BQU0sQ0FBQ0YsS0FBRCxDQUFoQjs7QUFDQSxNQUFJQyxJQUFJLElBQUlDLE1BQU0sQ0FBQ0csTUFBUCxHQUFnQkwsS0FBNUIsRUFBbUM7QUFDakNNLHdCQUFRQyxJQUFSLENBQWFOLElBQWIsRUFBbUIsVUFBQ08sSUFBRCxFQUFjO0FBQy9CLFVBQUlBLElBQUksQ0FBQ0MsS0FBTCxLQUFlTCxHQUFuQixFQUF3QjtBQUN0QkQsUUFBQUEsTUFBTSxDQUFDTyxJQUFQLENBQVlGLElBQUksQ0FBQ0csS0FBakI7QUFDQVosUUFBQUEsaUJBQWlCLENBQUMsRUFBRUMsS0FBSCxFQUFVUSxJQUFJLENBQUNJLFFBQWYsRUFBeUJWLE1BQXpCLEVBQWlDQyxNQUFqQyxDQUFqQjtBQUNEO0FBQ0YsS0FMRDtBQU1EO0FBQ0Y7O0FBRUQsU0FBU1UsZ0JBQVQsQ0FBMkJDLGFBQTNCLEVBQWdEO0FBQzlDLFNBQU8sVUFBVUMsQ0FBVixFQUF1QkMsVUFBdkIsRUFBd0NDLE1BQXhDLEVBQW1EO0FBQ3hELFdBQU9DLFFBQVEsQ0FBQ0gsQ0FBRCxFQUFJSSxzQkFBc0IsQ0FBQ0gsVUFBRCxFQUFhQyxNQUFiLEVBQXFCSCxhQUFyQixDQUExQixDQUFmO0FBQ0QsR0FGRDtBQUdEOztBQUVE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QUEsUUFDeEJDLFdBRHdCLEdBQ0VELE1BREYsQ0FDeEJDLFdBRHdCO0FBQUEsUUFDWEMsUUFEVyxHQUNFRixNQURGLENBQ1hFLFFBRFc7QUFFOUJBLElBQUFBLFFBQVEsQ0FBQ0MsS0FBVCxDQUFlN0MsU0FBZjtBQUNBMkMsSUFBQUEsV0FBVyxDQUFDRyxHQUFaLENBQWdCLG1CQUFoQixFQUFxQ1osZ0JBQXJDO0FBQ0FTLElBQUFBLFdBQVcsQ0FBQ0csR0FBWixDQUFnQixvQkFBaEIsRUFBc0NaLGdCQUF0QztBQUNEO0FBTitCLENBQTNCOzs7QUFTUCxTQUFTYSxjQUFULENBQXlCbkosU0FBekIsRUFBeUNpRSxNQUF6QyxFQUF1RDtBQUNyRCxTQUFPakUsU0FBUyxHQUFHQSxTQUFTLENBQUNpRSxNQUFWLENBQWlCQSxNQUFqQixDQUFILEdBQThCLEVBQTlDO0FBQ0Q7O0FBYUR4RCxvQkFBUXdJLEtBQVIsQ0FBYztBQUNaRSxFQUFBQSxjQUFjLEVBQWRBO0FBRFksQ0FBZDs7QUFJQSxJQUFJLE9BQU9DLE1BQVAsS0FBa0IsV0FBbEIsSUFBaUNBLE1BQU0sQ0FBQ0MsUUFBNUMsRUFBc0Q7QUFDcERELEVBQUFBLE1BQU0sQ0FBQ0MsUUFBUCxDQUFnQkMsR0FBaEIsQ0FBb0JWLGtCQUFwQjtBQUNEOztlQUVjQSxrQiIsImZpbGUiOiJpbmRleC5jb21tb24uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgWEVVdGlscyBmcm9tICd4ZS11dGlscy9tZXRob2RzL3hlLXV0aWxzJ1xyXG5pbXBvcnQgVlhFVGFibGUgZnJvbSAndnhlLXRhYmxlL2xpYi92eGUtdGFibGUnXHJcblxyXG5mdW5jdGlvbiBpc0VtcHR5VmFsdWUgKGNlbGxWYWx1ZTogYW55KSB7XHJcbiAgcmV0dXJuIGNlbGxWYWx1ZSA9PT0gbnVsbCB8fCBjZWxsVmFsdWUgPT09IHVuZGVmaW5lZCB8fCBjZWxsVmFsdWUgPT09ICcnXHJcbn1cclxuXHJcbmZ1bmN0aW9uIG1hdGNoQ2FzY2FkZXJEYXRhIChpbmRleDogbnVtYmVyLCBsaXN0OiBBcnJheTxhbnk+LCB2YWx1ZXM6IEFycmF5PGFueT4sIGxhYmVsczogQXJyYXk8YW55Pikge1xyXG4gIGxldCB2YWwgPSB2YWx1ZXNbaW5kZXhdXHJcbiAgaWYgKGxpc3QgJiYgdmFsdWVzLmxlbmd0aCA+IGluZGV4KSB7XHJcbiAgICBYRVV0aWxzLmVhY2gobGlzdCwgKGl0ZW06IGFueSkgPT4ge1xyXG4gICAgICBpZiAoaXRlbS52YWx1ZSA9PT0gdmFsKSB7XHJcbiAgICAgICAgbGFiZWxzLnB1c2goaXRlbS5sYWJlbClcclxuICAgICAgICBtYXRjaENhc2NhZGVyRGF0YSgrK2luZGV4LCBpdGVtLmNoaWxkcmVuLCB2YWx1ZXMsIGxhYmVscylcclxuICAgICAgfVxyXG4gICAgfSlcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGZvcm1hdERhdGVQaWNrZXIgKGRlZmF1bHRGb3JtYXQ6IHN0cmluZykge1xyXG4gIHJldHVybiBmdW5jdGlvbiAoaDogRnVuY3Rpb24sIHJlbmRlck9wdHM6IGFueSwgcGFyYW1zOiBhbnkpIHtcclxuICAgIHJldHVybiBjZWxsVGV4dChoLCBnZXREYXRlUGlja2VyQ2VsbFZhbHVlKHJlbmRlck9wdHMsIHBhcmFtcywgZGVmYXVsdEZvcm1hdCkpXHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRQcm9wcyAoeyAkdGFibGUgfTogYW55LCB7IHByb3BzIH06IGFueSwgZGVmYXVsdFByb3BzPzogYW55KSB7XHJcbiAgcmV0dXJuIFhFVXRpbHMuYXNzaWduKCR0YWJsZS52U2l6ZSA/IHsgc2l6ZTogJHRhYmxlLnZTaXplIH0gOiB7fSwgZGVmYXVsdFByb3BzLCBwcm9wcylcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0Q2VsbEV2ZW50cyAocmVuZGVyT3B0czogYW55LCBwYXJhbXM6IGFueSkge1xyXG4gIGxldCB7IG5hbWUsIGV2ZW50cyB9ID0gcmVuZGVyT3B0c1xyXG4gIGxldCB7ICR0YWJsZSB9ID0gcGFyYW1zXHJcbiAgbGV0IHR5cGUgPSAnY2hhbmdlJ1xyXG4gIHN3aXRjaCAobmFtZSkge1xyXG4gICAgY2FzZSAnQUF1dG9Db21wbGV0ZSc6XHJcbiAgICAgIHR5cGUgPSAnc2VsZWN0J1xyXG4gICAgICBicmVha1xyXG4gICAgY2FzZSAnQUlucHV0JzpcclxuICAgICAgdHlwZSA9ICdpbnB1dCdcclxuICAgICAgYnJlYWtcclxuICAgIGNhc2UgJ0FJbnB1dE51bWJlcic6XHJcbiAgICAgIHR5cGUgPSAnY2hhbmdlJ1xyXG4gICAgICBicmVha1xyXG4gIH1cclxuICBsZXQgb24gPSB7XHJcbiAgICBbdHlwZV06IChldm50OiBhbnkpID0+IHtcclxuICAgICAgJHRhYmxlLnVwZGF0ZVN0YXR1cyhwYXJhbXMpXHJcbiAgICAgIGlmIChldmVudHMgJiYgZXZlbnRzW3R5cGVdKSB7XHJcbiAgICAgICAgZXZlbnRzW3R5cGVdKHBhcmFtcywgZXZudClcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuICBpZiAoZXZlbnRzKSB7XHJcbiAgICByZXR1cm4gWEVVdGlscy5hc3NpZ24oe30sIFhFVXRpbHMub2JqZWN0TWFwKGV2ZW50cywgKGNiOiBGdW5jdGlvbikgPT4gZnVuY3Rpb24gKC4uLmFyZ3M6IGFueVtdKSB7XHJcbiAgICAgIGNiLmFwcGx5KG51bGwsIFtwYXJhbXNdLmNvbmNhdC5hcHBseShwYXJhbXMsIGFyZ3MpKVxyXG4gICAgfSksIG9uKVxyXG4gIH1cclxuICByZXR1cm4gb25cclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0U2VsZWN0Q2VsbFZhbHVlIChyZW5kZXJPcHRzOiBhbnksIHBhcmFtczogYW55KSB7XHJcbiAgbGV0IHsgb3B0aW9ucywgb3B0aW9uR3JvdXBzLCBwcm9wcyA9IHt9LCBvcHRpb25Qcm9wcyA9IHt9LCBvcHRpb25Hcm91cFByb3BzID0ge30gfSA9IHJlbmRlck9wdHNcclxuICBsZXQgeyByb3csIGNvbHVtbiB9ID0gcGFyYW1zXHJcbiAgbGV0IGxhYmVsUHJvcCA9IG9wdGlvblByb3BzLmxhYmVsIHx8ICdsYWJlbCdcclxuICBsZXQgdmFsdWVQcm9wID0gb3B0aW9uUHJvcHMudmFsdWUgfHwgJ3ZhbHVlJ1xyXG4gIGxldCBncm91cE9wdGlvbnMgPSBvcHRpb25Hcm91cFByb3BzLm9wdGlvbnMgfHwgJ29wdGlvbnMnXHJcbiAgbGV0IGNlbGxWYWx1ZSA9IFhFVXRpbHMuZ2V0KHJvdywgY29sdW1uLnByb3BlcnR5KVxyXG4gIGlmICghaXNFbXB0eVZhbHVlKGNlbGxWYWx1ZSkpIHtcclxuICAgIHJldHVybiBYRVV0aWxzLm1hcChwcm9wcy5tb2RlID09PSAnbXVsdGlwbGUnID8gY2VsbFZhbHVlIDogW2NlbGxWYWx1ZV0sIG9wdGlvbkdyb3VwcyA/ICh2YWx1ZTogYW55KSA9PiB7XHJcbiAgICAgIGxldCBzZWxlY3RJdGVtXHJcbiAgICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCBvcHRpb25Hcm91cHMubGVuZ3RoOyBpbmRleCsrKSB7XHJcbiAgICAgICAgc2VsZWN0SXRlbSA9IFhFVXRpbHMuZmluZChvcHRpb25Hcm91cHNbaW5kZXhdW2dyb3VwT3B0aW9uc10sIChpdGVtOiBhbnkpID0+IGl0ZW1bdmFsdWVQcm9wXSA9PT0gdmFsdWUpXHJcbiAgICAgICAgaWYgKHNlbGVjdEl0ZW0pIHtcclxuICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBzZWxlY3RJdGVtID8gc2VsZWN0SXRlbVtsYWJlbFByb3BdIDogdmFsdWVcclxuICAgIH0gOiAodmFsdWU6IGFueSkgPT4ge1xyXG4gICAgICBsZXQgc2VsZWN0SXRlbSA9IFhFVXRpbHMuZmluZChvcHRpb25zLCAoaXRlbTogYW55KSA9PiBpdGVtW3ZhbHVlUHJvcF0gPT09IHZhbHVlKVxyXG4gICAgICByZXR1cm4gc2VsZWN0SXRlbSA/IHNlbGVjdEl0ZW1bbGFiZWxQcm9wXSA6IHZhbHVlXHJcbiAgICB9KS5qb2luKCc7JylcclxuICB9XHJcbiAgcmV0dXJuIG51bGxcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0Q2FzY2FkZXJDZWxsVmFsdWUgKHJlbmRlck9wdHM6IGFueSwgcGFyYW1zOiBhbnkpIHtcclxuICBsZXQgeyBwcm9wcyA9IHt9IH0gPSByZW5kZXJPcHRzXHJcbiAgbGV0IHsgcm93LCBjb2x1bW4gfSA9IHBhcmFtc1xyXG4gIGxldCBjZWxsVmFsdWUgPSBYRVV0aWxzLmdldChyb3csIGNvbHVtbi5wcm9wZXJ0eSlcclxuICB2YXIgdmFsdWVzID0gY2VsbFZhbHVlIHx8IFtdXHJcbiAgdmFyIGxhYmVsczogQXJyYXk8YW55PiA9IFtdXHJcbiAgbWF0Y2hDYXNjYWRlckRhdGEoMCwgcHJvcHMub3B0aW9ucywgdmFsdWVzLCBsYWJlbHMpXHJcbiAgcmV0dXJuIChwcm9wcy5zaG93QWxsTGV2ZWxzID09PSBmYWxzZSA/IGxhYmVscy5zbGljZShsYWJlbHMubGVuZ3RoIC0gMSwgbGFiZWxzLmxlbmd0aCkgOiBsYWJlbHMpLmpvaW4oYCAke3Byb3BzLnNlcGFyYXRvciB8fCAnLyd9IGApXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldFJhbmdlUGlja2VyQ2VsbFZhbHVlIChyZW5kZXJPcHRzOiBhbnksIHBhcmFtczogYW55KSB7XHJcbiAgbGV0IHsgcHJvcHMgPSB7fSB9ID0gcmVuZGVyT3B0c1xyXG4gIGxldCB7IHJvdywgY29sdW1uIH0gPSBwYXJhbXNcclxuICBsZXQgY2VsbFZhbHVlID0gWEVVdGlscy5nZXQocm93LCBjb2x1bW4ucHJvcGVydHkpXHJcbiAgaWYgKGNlbGxWYWx1ZSkge1xyXG4gICAgY2VsbFZhbHVlID0gWEVVdGlscy5tYXAoY2VsbFZhbHVlLCAoZGF0ZTogYW55KSA9PiBkYXRlLmZvcm1hdChwcm9wcy5mb3JtYXQgfHwgJ1lZWVktTU0tREQnKSkuam9pbignIH4gJylcclxuICB9XHJcbiAgcmV0dXJuIGNlbGxWYWx1ZVxyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRUcmVlU2VsZWN0Q2VsbFZhbHVlIChyZW5kZXJPcHRzOiBhbnksIHBhcmFtczogYW55KSB7XHJcbiAgbGV0IHsgcHJvcHMgPSB7fSB9ID0gcmVuZGVyT3B0c1xyXG4gIGxldCB7IHJvdywgY29sdW1uIH0gPSBwYXJhbXNcclxuICBsZXQgY2VsbFZhbHVlID0gWEVVdGlscy5nZXQocm93LCBjb2x1bW4ucHJvcGVydHkpXHJcbiAgaWYgKGNlbGxWYWx1ZSAmJiAocHJvcHMudHJlZUNoZWNrYWJsZSB8fCBwcm9wcy5tdWx0aXBsZSkpIHtcclxuICAgIGNlbGxWYWx1ZSA9IGNlbGxWYWx1ZS5qb2luKCc7JylcclxuICB9XHJcbiAgcmV0dXJuIGNlbGxWYWx1ZVxyXG59XHJcblxyXG5mdW5jdGlvbiBnZXREYXRlUGlja2VyQ2VsbFZhbHVlIChyZW5kZXJPcHRzOiBhbnksIHBhcmFtczogYW55LCBkZWZhdWx0Rm9ybWF0OiBzdHJpbmcpIHtcclxuICBsZXQgeyBwcm9wcyA9IHt9IH0gPSByZW5kZXJPcHRzXHJcbiAgbGV0IHsgcm93LCBjb2x1bW4gfSA9IHBhcmFtc1xyXG4gIGxldCBjZWxsVmFsdWUgPSBYRVV0aWxzLmdldChyb3csIGNvbHVtbi5wcm9wZXJ0eSlcclxuICBpZiAoY2VsbFZhbHVlKSB7XHJcbiAgICBjZWxsVmFsdWUgPSBjZWxsVmFsdWUuZm9ybWF0KHByb3BzLmZvcm1hdCB8fCBkZWZhdWx0Rm9ybWF0KVxyXG4gIH1cclxuICByZXR1cm4gY2VsbFZhbHVlXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNyZWF0ZUVkaXRSZW5kZXIgKGRlZmF1bHRQcm9wcz86IGFueSkge1xyXG4gIHJldHVybiBmdW5jdGlvbiAoaDogRnVuY3Rpb24sIHJlbmRlck9wdHM6IGFueSwgcGFyYW1zOiBhbnkpIHtcclxuICAgIGxldCB7IHJvdywgY29sdW1uIH0gPSBwYXJhbXNcclxuICAgIGxldCB7IGF0dHJzIH0gPSByZW5kZXJPcHRzXHJcbiAgICBsZXQgcHJvcHMgPSBnZXRQcm9wcyhwYXJhbXMsIHJlbmRlck9wdHMsIGRlZmF1bHRQcm9wcylcclxuICAgIHJldHVybiBbXHJcbiAgICAgIGgocmVuZGVyT3B0cy5uYW1lLCB7XHJcbiAgICAgICAgcHJvcHMsXHJcbiAgICAgICAgYXR0cnMsXHJcbiAgICAgICAgbW9kZWw6IHtcclxuICAgICAgICAgIHZhbHVlOiBYRVV0aWxzLmdldChyb3csIGNvbHVtbi5wcm9wZXJ0eSksXHJcbiAgICAgICAgICBjYWxsYmFjayAodmFsdWU6IGFueSkge1xyXG4gICAgICAgICAgICBYRVV0aWxzLnNldChyb3csIGNvbHVtbi5wcm9wZXJ0eSwgdmFsdWUpXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICBvbjogZ2V0Q2VsbEV2ZW50cyhyZW5kZXJPcHRzLCBwYXJhbXMpXHJcbiAgICAgIH0pXHJcbiAgICBdXHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRGaWx0ZXJFdmVudHMgKG9uOiBhbnksIHJlbmRlck9wdHM6IGFueSwgcGFyYW1zOiBhbnksIGNvbnRleHQ6IGFueSkge1xyXG4gIGxldCB7IGV2ZW50cyB9ID0gcmVuZGVyT3B0c1xyXG4gIGlmIChldmVudHMpIHtcclxuICAgIHJldHVybiBYRVV0aWxzLmFzc2lnbih7fSwgWEVVdGlscy5vYmplY3RNYXAoZXZlbnRzLCAoY2I6IEZ1bmN0aW9uKSA9PiBmdW5jdGlvbiAoLi4uYXJnczogYW55W10pIHtcclxuICAgICAgcGFyYW1zID0gT2JqZWN0LmFzc2lnbih7IGNvbnRleHQgfSwgcGFyYW1zKVxyXG4gICAgICBjYi5hcHBseShudWxsLCBbcGFyYW1zXS5jb25jYXQuYXBwbHkocGFyYW1zLCBhcmdzKSlcclxuICAgIH0pLCBvbilcclxuICB9XHJcbiAgcmV0dXJuIG9uXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNyZWF0ZUZpbHRlclJlbmRlciAoZGVmYXVsdFByb3BzPzogYW55KSB7XHJcbiAgcmV0dXJuIGZ1bmN0aW9uIChoOiBGdW5jdGlvbiwgcmVuZGVyT3B0czogYW55LCBwYXJhbXM6IGFueSwgY29udGV4dDogYW55KSB7XHJcbiAgICBsZXQgeyBjb2x1bW4gfSA9IHBhcmFtc1xyXG4gICAgbGV0IHsgbmFtZSwgYXR0cnMsIGV2ZW50cyB9ID0gcmVuZGVyT3B0c1xyXG4gICAgbGV0IHByb3BzID0gZ2V0UHJvcHMocGFyYW1zLCByZW5kZXJPcHRzKVxyXG4gICAgbGV0IHR5cGUgPSAnY2hhbmdlJ1xyXG4gICAgc3dpdGNoIChuYW1lKSB7XHJcbiAgICAgIGNhc2UgJ0FBdXRvQ29tcGxldGUnOlxyXG4gICAgICAgIHR5cGUgPSAnc2VsZWN0J1xyXG4gICAgICAgIGJyZWFrXHJcbiAgICAgIGNhc2UgJ0FJbnB1dCc6XHJcbiAgICAgICAgdHlwZSA9ICdpbnB1dCdcclxuICAgICAgICBicmVha1xyXG4gICAgICBjYXNlICdBSW5wdXROdW1iZXInOlxyXG4gICAgICAgIHR5cGUgPSAnY2hhbmdlJ1xyXG4gICAgICAgIGJyZWFrXHJcbiAgICB9XHJcbiAgICByZXR1cm4gY29sdW1uLmZpbHRlcnMubWFwKChpdGVtOiBhbnkpID0+IHtcclxuICAgICAgcmV0dXJuIGgobmFtZSwge1xyXG4gICAgICAgIHByb3BzLFxyXG4gICAgICAgIGF0dHJzLFxyXG4gICAgICAgIG1vZGVsOiB7XHJcbiAgICAgICAgICB2YWx1ZTogaXRlbS5kYXRhLFxyXG4gICAgICAgICAgY2FsbGJhY2sgKG9wdGlvblZhbHVlOiBhbnkpIHtcclxuICAgICAgICAgICAgaXRlbS5kYXRhID0gb3B0aW9uVmFsdWVcclxuICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIG9uOiBnZXRGaWx0ZXJFdmVudHMoe1xyXG4gICAgICAgICAgW3R5cGVdIChldm50OiBhbnkpIHtcclxuICAgICAgICAgICAgaGFuZGxlQ29uZmlybUZpbHRlcihjb250ZXh0LCBjb2x1bW4sICEhaXRlbS5kYXRhLCBpdGVtKVxyXG4gICAgICAgICAgICBpZiAoZXZlbnRzICYmIGV2ZW50c1t0eXBlXSkge1xyXG4gICAgICAgICAgICAgIGV2ZW50c1t0eXBlXShPYmplY3QuYXNzaWduKHsgY29udGV4dCB9LCBwYXJhbXMpLCBldm50KVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSwgcmVuZGVyT3B0cywgcGFyYW1zLCBjb250ZXh0KVxyXG4gICAgICB9KVxyXG4gICAgfSlcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGhhbmRsZUNvbmZpcm1GaWx0ZXIgKGNvbnRleHQ6IGFueSwgY29sdW1uOiBhbnksIGNoZWNrZWQ6IGFueSwgaXRlbTogYW55KSB7XHJcbiAgY29udGV4dFtjb2x1bW4uZmlsdGVyTXVsdGlwbGUgPyAnY2hhbmdlTXVsdGlwbGVPcHRpb24nIDogJ2NoYW5nZVJhZGlvT3B0aW9uJ10oe30sIGNoZWNrZWQsIGl0ZW0pXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGRlZmF1bHRGaWx0ZXJNZXRob2QgKHsgb3B0aW9uLCByb3csIGNvbHVtbiB9OiBhbnkpIHtcclxuICBsZXQgeyBkYXRhIH0gPSBvcHRpb25cclxuICBsZXQgY2VsbFZhbHVlID0gWEVVdGlscy5nZXQocm93LCBjb2x1bW4ucHJvcGVydHkpXHJcbiAgLyogZXNsaW50LWRpc2FibGUgZXFlcWVxICovXHJcbiAgcmV0dXJuIGNlbGxWYWx1ZSA9PT0gZGF0YVxyXG59XHJcblxyXG5mdW5jdGlvbiByZW5kZXJPcHRpb25zIChoOiBGdW5jdGlvbiwgb3B0aW9uczogYW55LCBvcHRpb25Qcm9wczogYW55KSB7XHJcbiAgbGV0IGxhYmVsUHJvcCA9IG9wdGlvblByb3BzLmxhYmVsIHx8ICdsYWJlbCdcclxuICBsZXQgdmFsdWVQcm9wID0gb3B0aW9uUHJvcHMudmFsdWUgfHwgJ3ZhbHVlJ1xyXG4gIGxldCBkaXNhYmxlZFByb3AgPSBvcHRpb25Qcm9wcy5kaXNhYmxlZCB8fCAnZGlzYWJsZWQnXHJcbiAgcmV0dXJuIFhFVXRpbHMubWFwKG9wdGlvbnMsIChpdGVtOiBhbnksIGluZGV4OiBudW1iZXIpID0+IHtcclxuICAgIHJldHVybiBoKCdhLXNlbGVjdC1vcHRpb24nLCB7XHJcbiAgICAgIHByb3BzOiB7XHJcbiAgICAgICAgdmFsdWU6IGl0ZW1bdmFsdWVQcm9wXSxcclxuICAgICAgICBkaXNhYmxlZDogaXRlbVtkaXNhYmxlZFByb3BdXHJcbiAgICAgIH0sXHJcbiAgICAgIGtleTogaW5kZXhcclxuICAgIH0sIGl0ZW1bbGFiZWxQcm9wXSlcclxuICB9KVxyXG59XHJcblxyXG5mdW5jdGlvbiBjZWxsVGV4dCAoaDogRnVuY3Rpb24sIGNlbGxWYWx1ZTogYW55KSB7XHJcbiAgcmV0dXJuIFsnJyArIChpc0VtcHR5VmFsdWUoY2VsbFZhbHVlKSA/ICcnIDogY2VsbFZhbHVlKV1cclxufVxyXG5cclxuZnVuY3Rpb24gY3JlYXRlRm9ybUl0ZW1SZW5kZXIgKGRlZmF1bHRQcm9wcz86IGFueSkge1xyXG4gIHJldHVybiBmdW5jdGlvbiAoaDogRnVuY3Rpb24sIHJlbmRlck9wdHM6IGFueSwgcGFyYW1zOiBhbnksIGNvbnRleHQ6IGFueSkge1xyXG4gICAgbGV0IHsgZGF0YSwgcHJvcGVydHkgfSA9IHBhcmFtc1xyXG4gICAgbGV0IHsgbmFtZSB9ID0gcmVuZGVyT3B0c1xyXG4gICAgbGV0IHsgYXR0cnMgfTogYW55ID0gcmVuZGVyT3B0c1xyXG4gICAgbGV0IHByb3BzOiBhbnkgPSBnZXRGb3JtUHJvcHMoY29udGV4dCwgcmVuZGVyT3B0cywgZGVmYXVsdFByb3BzKVxyXG4gICAgcmV0dXJuIFtcclxuICAgICAgaChuYW1lLCB7XHJcbiAgICAgICAgYXR0cnMsXHJcbiAgICAgICAgcHJvcHMsXHJcbiAgICAgICAgbW9kZWw6IHtcclxuICAgICAgICAgIHZhbHVlOiBYRVV0aWxzLmdldChkYXRhLCBwcm9wZXJ0eSksXHJcbiAgICAgICAgICBjYWxsYmFjayAodmFsdWU6IGFueSkge1xyXG4gICAgICAgICAgICBYRVV0aWxzLnNldChkYXRhLCBwcm9wZXJ0eSwgdmFsdWUpXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICBvbjogZ2V0Rm9ybUV2ZW50cyhyZW5kZXJPcHRzLCBwYXJhbXMsIGNvbnRleHQpXHJcbiAgICAgIH0pXHJcbiAgICBdXHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRGb3JtUHJvcHMgKHsgJGZvcm0gfTogYW55LCB7IHByb3BzIH06IGFueSwgZGVmYXVsdFByb3BzPzogYW55KSB7XHJcbiAgcmV0dXJuIFhFVXRpbHMuYXNzaWduKCRmb3JtLnZTaXplID8geyBzaXplOiAkZm9ybS52U2l6ZSB9IDoge30sIGRlZmF1bHRQcm9wcywgcHJvcHMpXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldEZvcm1FdmVudHMgKHJlbmRlck9wdHM6IGFueSwgcGFyYW1zOiBhbnksIGNvbnRleHQ6IGFueSkge1xyXG4gIGxldCB7IGV2ZW50cyB9OiBhbnkgPSByZW5kZXJPcHRzXHJcbiAgbGV0IHsgJGZvcm0gfSA9IHBhcmFtc1xyXG4gIGxldCB0eXBlID0gJ2NoYW5nZSdcclxuICBzd2l0Y2ggKG5hbWUpIHtcclxuICAgIGNhc2UgJ0FBdXRvQ29tcGxldGUnOlxyXG4gICAgICB0eXBlID0gJ3NlbGVjdCdcclxuICAgICAgYnJlYWtcclxuICAgIGNhc2UgJ0FJbnB1dCc6XHJcbiAgICAgIHR5cGUgPSAnaW5wdXQnXHJcbiAgICAgIGJyZWFrXHJcbiAgICBjYXNlICdBSW5wdXROdW1iZXInOlxyXG4gICAgICB0eXBlID0gJ2NoYW5nZSdcclxuICAgICAgYnJlYWtcclxuICB9XHJcbiAgbGV0IG9uID0ge1xyXG4gICAgW3R5cGVdOiAoZXZudDogYW55KSA9PiB7XHJcbiAgICAgICRmb3JtLnVwZGF0ZVN0YXR1cyhwYXJhbXMpXHJcbiAgICAgIGlmIChldmVudHMgJiYgZXZlbnRzW3R5cGVdKSB7XHJcbiAgICAgICAgZXZlbnRzW3R5cGVdKHBhcmFtcywgZXZudClcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuICBpZiAoZXZlbnRzKSB7XHJcbiAgICByZXR1cm4gWEVVdGlscy5hc3NpZ24oe30sIFhFVXRpbHMub2JqZWN0TWFwKGV2ZW50cywgKGNiOiBGdW5jdGlvbikgPT4gZnVuY3Rpb24gKC4uLmFyZ3M6IGFueVtdKSB7XHJcbiAgICAgIGNiLmFwcGx5KG51bGwsIFtwYXJhbXNdLmNvbmNhdC5hcHBseShwYXJhbXMsIGFyZ3MpKVxyXG4gICAgfSksIG9uKVxyXG4gIH1cclxuICByZXR1cm4gb25cclxufVxyXG5cclxuZnVuY3Rpb24gY3JlYXRlRGF0ZVBpY2tlckV4cG9ydE1ldGhvZCAoZGVmYXVsdEZvcm1hdDogc3RyaW5nLCBpc0VkaXQ/OiBib29sZWFuKSB7XHJcbiAgY29uc3QgcmVuZGVyUHJvcGVydHkgPSBpc0VkaXQgPyAnZWRpdFJlbmRlcicgOiAnY2VsbFJlbmRlcidcclxuICByZXR1cm4gZnVuY3Rpb24gKHBhcmFtczogYW55KSB7XHJcbiAgICByZXR1cm4gZ2V0RGF0ZVBpY2tlckNlbGxWYWx1ZShwYXJhbXMuY29sdW1uW3JlbmRlclByb3BlcnR5XSwgcGFyYW1zLCBkZWZhdWx0Rm9ybWF0KVxyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gY3JlYXRlRXhwb3J0TWV0aG9kICh2YWx1ZU1ldGhvZDogRnVuY3Rpb24sIGlzRWRpdD86IGJvb2xlYW4pIHtcclxuICBjb25zdCByZW5kZXJQcm9wZXJ0eSA9IGlzRWRpdCA/ICdlZGl0UmVuZGVyJyA6ICdjZWxsUmVuZGVyJ1xyXG4gIHJldHVybiBmdW5jdGlvbiAocGFyYW1zOiBhbnkpIHtcclxuICAgIHJldHVybiB2YWx1ZU1ldGhvZChwYXJhbXMuY29sdW1uW3JlbmRlclByb3BlcnR5XSwgcGFyYW1zKVxyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gY3JlYXRlRm9ybUl0ZW1SYWRpb0FuZENoZWNrYm94UmVuZGVyICgpIHtcclxuICByZXR1cm4gZnVuY3Rpb24gKGg6IEZ1bmN0aW9uLCByZW5kZXJPcHRzOiBhbnksIHBhcmFtczogYW55LCBjb250ZXh0OiBhbnkpIHtcclxuICAgIGxldCB7IG5hbWUsIG9wdGlvbnMsIG9wdGlvblByb3BzID0ge30gfSA9IHJlbmRlck9wdHNcclxuICAgIGxldCB7IGRhdGEsIHByb3BlcnR5IH0gPSBwYXJhbXNcclxuICAgIGxldCB7IGF0dHJzIH0gPSByZW5kZXJPcHRzXHJcbiAgICBsZXQgcHJvcHM6IGFueSA9IGdldEZvcm1Qcm9wcyhjb250ZXh0LCByZW5kZXJPcHRzKVxyXG4gICAgbGV0IGxhYmVsUHJvcDogc3RyaW5nID0gb3B0aW9uUHJvcHMubGFiZWwgfHwgJ2xhYmVsJ1xyXG4gICAgbGV0IHZhbHVlUHJvcDogc3RyaW5nID0gb3B0aW9uUHJvcHMudmFsdWUgfHwgJ3ZhbHVlJ1xyXG4gICAgbGV0IGRpc2FibGVkUHJvcDogc3RyaW5nID0gb3B0aW9uUHJvcHMuZGlzYWJsZWQgfHwgJ2Rpc2FibGVkJ1xyXG4gICAgcmV0dXJuIFtcclxuICAgICAgaChgJHtuYW1lfUdyb3VwYCwge1xyXG4gICAgICAgIHByb3BzLFxyXG4gICAgICAgIGF0dHJzLFxyXG4gICAgICAgIG1vZGVsOiB7XHJcbiAgICAgICAgICB2YWx1ZTogWEVVdGlscy5nZXQoZGF0YSwgcHJvcGVydHkpLFxyXG4gICAgICAgICAgY2FsbGJhY2sgKGNlbGxWYWx1ZTogYW55KSB7XHJcbiAgICAgICAgICAgIFhFVXRpbHMuc2V0KGRhdGEsIHByb3BlcnR5LCBjZWxsVmFsdWUpXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICBvbjogZ2V0Rm9ybUV2ZW50cyhyZW5kZXJPcHRzLCBwYXJhbXMsIGNvbnRleHQpXHJcbiAgICAgIH0sIG9wdGlvbnMubWFwKChvcHRpb246IGFueSkgPT4ge1xyXG4gICAgICAgIHJldHVybiBoKG5hbWUsIHtcclxuICAgICAgICAgIHByb3BzOiB7XHJcbiAgICAgICAgICAgIHZhbHVlOiBvcHRpb25bdmFsdWVQcm9wXSxcclxuICAgICAgICAgICAgZGlzYWJsZWQ6IG9wdGlvbltkaXNhYmxlZFByb3BdXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSwgb3B0aW9uW2xhYmVsUHJvcF0pXHJcbiAgICAgIH0pKVxyXG4gICAgXVxyXG4gIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIOa4suafk+WHveaVsFxyXG4gKi9cclxuY29uc3QgcmVuZGVyTWFwID0ge1xyXG4gIEFBdXRvQ29tcGxldGU6IHtcclxuICAgIGF1dG9mb2N1czogJ2lucHV0LmFudC1pbnB1dCcsXHJcbiAgICByZW5kZXJEZWZhdWx0OiBjcmVhdGVFZGl0UmVuZGVyKCksXHJcbiAgICByZW5kZXJFZGl0OiBjcmVhdGVFZGl0UmVuZGVyKCksXHJcbiAgICByZW5kZXJGaWx0ZXI6IGNyZWF0ZUZpbHRlclJlbmRlcigpLFxyXG4gICAgZmlsdGVyTWV0aG9kOiBkZWZhdWx0RmlsdGVyTWV0aG9kLFxyXG4gICAgcmVuZGVySXRlbTogY3JlYXRlRm9ybUl0ZW1SZW5kZXIoKVxyXG4gIH0sXHJcbiAgQUlucHV0OiB7XHJcbiAgICBhdXRvZm9jdXM6ICdpbnB1dC5hbnQtaW5wdXQnLFxyXG4gICAgcmVuZGVyRGVmYXVsdDogY3JlYXRlRWRpdFJlbmRlcigpLFxyXG4gICAgcmVuZGVyRWRpdDogY3JlYXRlRWRpdFJlbmRlcigpLFxyXG4gICAgcmVuZGVyRmlsdGVyOiBjcmVhdGVGaWx0ZXJSZW5kZXIoKSxcclxuICAgIGZpbHRlck1ldGhvZDogZGVmYXVsdEZpbHRlck1ldGhvZCxcclxuICAgIHJlbmRlckl0ZW06IGNyZWF0ZUZvcm1JdGVtUmVuZGVyKClcclxuICB9LFxyXG4gIEFJbnB1dE51bWJlcjoge1xyXG4gICAgYXV0b2ZvY3VzOiAnaW5wdXQuYW50LWlucHV0LW51bWJlci1pbnB1dCcsXHJcbiAgICByZW5kZXJEZWZhdWx0OiBjcmVhdGVFZGl0UmVuZGVyKCksXHJcbiAgICByZW5kZXJFZGl0OiBjcmVhdGVFZGl0UmVuZGVyKCksXHJcbiAgICByZW5kZXJGaWx0ZXI6IGNyZWF0ZUZpbHRlclJlbmRlcigpLFxyXG4gICAgZmlsdGVyTWV0aG9kOiBkZWZhdWx0RmlsdGVyTWV0aG9kLFxyXG4gICAgcmVuZGVySXRlbTogY3JlYXRlRm9ybUl0ZW1SZW5kZXIoKVxyXG4gIH0sXHJcbiAgQVNlbGVjdDoge1xyXG4gICAgcmVuZGVyRWRpdCAoaDogRnVuY3Rpb24sIHJlbmRlck9wdHM6IGFueSwgcGFyYW1zOiBhbnkpIHtcclxuICAgICAgbGV0IHsgb3B0aW9ucywgb3B0aW9uR3JvdXBzLCBvcHRpb25Qcm9wcyA9IHt9LCBvcHRpb25Hcm91cFByb3BzID0ge30gfSA9IHJlbmRlck9wdHNcclxuICAgICAgbGV0IHsgcm93LCBjb2x1bW4gfSA9IHBhcmFtc1xyXG4gICAgICBsZXQgeyBhdHRycyB9ID0gcmVuZGVyT3B0c1xyXG4gICAgICBsZXQgcHJvcHMgPSBnZXRQcm9wcyhwYXJhbXMsIHJlbmRlck9wdHMpXHJcbiAgICAgIGlmIChvcHRpb25Hcm91cHMpIHtcclxuICAgICAgICBsZXQgZ3JvdXBPcHRpb25zID0gb3B0aW9uR3JvdXBQcm9wcy5vcHRpb25zIHx8ICdvcHRpb25zJ1xyXG4gICAgICAgIGxldCBncm91cExhYmVsID0gb3B0aW9uR3JvdXBQcm9wcy5sYWJlbCB8fCAnbGFiZWwnXHJcbiAgICAgICAgcmV0dXJuIFtcclxuICAgICAgICAgIGgoJ2Etc2VsZWN0Jywge1xyXG4gICAgICAgICAgICBwcm9wcyxcclxuICAgICAgICAgICAgYXR0cnMsXHJcbiAgICAgICAgICAgIG1vZGVsOiB7XHJcbiAgICAgICAgICAgICAgdmFsdWU6IFhFVXRpbHMuZ2V0KHJvdywgY29sdW1uLnByb3BlcnR5KSxcclxuICAgICAgICAgICAgICBjYWxsYmFjayAoY2VsbFZhbHVlOiBhbnkpIHtcclxuICAgICAgICAgICAgICAgIFhFVXRpbHMuc2V0KHJvdywgY29sdW1uLnByb3BlcnR5LCBjZWxsVmFsdWUpXHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBvbjogZ2V0Q2VsbEV2ZW50cyhyZW5kZXJPcHRzLCBwYXJhbXMpXHJcbiAgICAgICAgICB9LCBYRVV0aWxzLm1hcChvcHRpb25Hcm91cHMsIChncm91cDogYW55LCBnSW5kZXg6IG51bWJlcikgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gaCgnYS1zZWxlY3Qtb3B0LWdyb3VwJywge1xyXG4gICAgICAgICAgICAgIGtleTogZ0luZGV4XHJcbiAgICAgICAgICAgIH0sIFtcclxuICAgICAgICAgICAgICBoKCdzcGFuJywge1xyXG4gICAgICAgICAgICAgICAgc2xvdDogJ2xhYmVsJ1xyXG4gICAgICAgICAgICAgIH0sIGdyb3VwW2dyb3VwTGFiZWxdKVxyXG4gICAgICAgICAgICBdLmNvbmNhdChcclxuICAgICAgICAgICAgICByZW5kZXJPcHRpb25zKGgsIGdyb3VwW2dyb3VwT3B0aW9uc10sIG9wdGlvblByb3BzKVxyXG4gICAgICAgICAgICApKVxyXG4gICAgICAgICAgfSkpXHJcbiAgICAgICAgXVxyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBbXHJcbiAgICAgICAgaCgnYS1zZWxlY3QnLCB7XHJcbiAgICAgICAgICBwcm9wcyxcclxuICAgICAgICAgIGF0dHJzLFxyXG4gICAgICAgICAgbW9kZWw6IHtcclxuICAgICAgICAgICAgdmFsdWU6IFhFVXRpbHMuZ2V0KHJvdywgY29sdW1uLnByb3BlcnR5KSxcclxuICAgICAgICAgICAgY2FsbGJhY2sgKGNlbGxWYWx1ZTogYW55KSB7XHJcbiAgICAgICAgICAgICAgWEVVdGlscy5zZXQocm93LCBjb2x1bW4ucHJvcGVydHksIGNlbGxWYWx1ZSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIG9uOiBnZXRDZWxsRXZlbnRzKHJlbmRlck9wdHMsIHBhcmFtcylcclxuICAgICAgICB9LCByZW5kZXJPcHRpb25zKGgsIG9wdGlvbnMsIG9wdGlvblByb3BzKSlcclxuICAgICAgXVxyXG4gICAgfSxcclxuICAgIHJlbmRlckNlbGwgKGg6IEZ1bmN0aW9uLCByZW5kZXJPcHRzOiBhbnksIHBhcmFtczogYW55KSB7XHJcbiAgICAgIHJldHVybiBjZWxsVGV4dChoLCBnZXRTZWxlY3RDZWxsVmFsdWUocmVuZGVyT3B0cywgcGFyYW1zKSlcclxuICAgIH0sXHJcbiAgICByZW5kZXJGaWx0ZXIgKGg6IEZ1bmN0aW9uLCByZW5kZXJPcHRzOiBhbnksIHBhcmFtczogYW55LCBjb250ZXh0OiBhbnkpIHtcclxuICAgICAgbGV0IHsgb3B0aW9ucywgb3B0aW9uR3JvdXBzLCBvcHRpb25Qcm9wcyA9IHt9LCBvcHRpb25Hcm91cFByb3BzID0ge30gfSA9IHJlbmRlck9wdHNcclxuICAgICAgbGV0IHsgY29sdW1uIH0gPSBwYXJhbXNcclxuICAgICAgbGV0IHsgYXR0cnMsIGV2ZW50cyB9ID0gcmVuZGVyT3B0c1xyXG4gICAgICBsZXQgcHJvcHMgPSBnZXRQcm9wcyhwYXJhbXMsIHJlbmRlck9wdHMpXHJcbiAgICAgIGxldCB0eXBlID0gJ2NoYW5nZSdcclxuICAgICAgaWYgKG9wdGlvbkdyb3Vwcykge1xyXG4gICAgICAgIGxldCBncm91cE9wdGlvbnMgPSBvcHRpb25Hcm91cFByb3BzLm9wdGlvbnMgfHwgJ29wdGlvbnMnXHJcbiAgICAgICAgbGV0IGdyb3VwTGFiZWwgPSBvcHRpb25Hcm91cFByb3BzLmxhYmVsIHx8ICdsYWJlbCdcclxuICAgICAgICByZXR1cm4gY29sdW1uLmZpbHRlcnMubWFwKChpdGVtOiBhbnkpID0+IHtcclxuICAgICAgICAgIHJldHVybiBoKCdhLXNlbGVjdCcsIHtcclxuICAgICAgICAgICAgcHJvcHMsXHJcbiAgICAgICAgICAgIGF0dHJzLFxyXG4gICAgICAgICAgICBtb2RlbDoge1xyXG4gICAgICAgICAgICAgIHZhbHVlOiBpdGVtLmRhdGEsXHJcbiAgICAgICAgICAgICAgY2FsbGJhY2sgKG9wdGlvblZhbHVlOiBhbnkpIHtcclxuICAgICAgICAgICAgICAgIGl0ZW0uZGF0YSA9IG9wdGlvblZhbHVlXHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBvbjogZ2V0RmlsdGVyRXZlbnRzKHtcclxuICAgICAgICAgICAgICBbdHlwZV0gKHZhbHVlOiBhbnkpIHtcclxuICAgICAgICAgICAgICAgIGhhbmRsZUNvbmZpcm1GaWx0ZXIoY29udGV4dCwgY29sdW1uLCB2YWx1ZSAmJiB2YWx1ZS5sZW5ndGggPiAwLCBpdGVtKVxyXG4gICAgICAgICAgICAgICAgaWYgKGV2ZW50cyAmJiBldmVudHNbdHlwZV0pIHtcclxuICAgICAgICAgICAgICAgICAgZXZlbnRzW3R5cGVdKE9iamVjdC5hc3NpZ24oeyBjb250ZXh0IH0sIHBhcmFtcyksIHZhbHVlKVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSwgcmVuZGVyT3B0cywgcGFyYW1zLCBjb250ZXh0KVxyXG4gICAgICAgICAgfSwgWEVVdGlscy5tYXAob3B0aW9uR3JvdXBzLCAoZ3JvdXA6IGFueSwgZ0luZGV4OiBudW1iZXIpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIGgoJ2Etc2VsZWN0LW9wdC1ncm91cCcsIHtcclxuICAgICAgICAgICAgICBrZXk6IGdJbmRleFxyXG4gICAgICAgICAgICB9LCBbXHJcbiAgICAgICAgICAgICAgaCgnc3BhbicsIHtcclxuICAgICAgICAgICAgICAgIHNsb3Q6ICdsYWJlbCdcclxuICAgICAgICAgICAgICB9LCBncm91cFtncm91cExhYmVsXSlcclxuICAgICAgICAgICAgXS5jb25jYXQoXHJcbiAgICAgICAgICAgICAgcmVuZGVyT3B0aW9ucyhoLCBncm91cFtncm91cE9wdGlvbnNdLCBvcHRpb25Qcm9wcylcclxuICAgICAgICAgICAgKSlcclxuICAgICAgICAgIH0pKVxyXG4gICAgICAgIH0pXHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIGNvbHVtbi5maWx0ZXJzLm1hcCgoaXRlbTogYW55KSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIGgoJ2Etc2VsZWN0Jywge1xyXG4gICAgICAgICAgcHJvcHMsXHJcbiAgICAgICAgICBhdHRycyxcclxuICAgICAgICAgIG1vZGVsOiB7XHJcbiAgICAgICAgICAgIHZhbHVlOiBpdGVtLmRhdGEsXHJcbiAgICAgICAgICAgIGNhbGxiYWNrIChvcHRpb25WYWx1ZTogYW55KSB7XHJcbiAgICAgICAgICAgICAgaXRlbS5kYXRhID0gb3B0aW9uVmFsdWVcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIG9uOiBnZXRGaWx0ZXJFdmVudHMoe1xyXG4gICAgICAgICAgICBjaGFuZ2UgKHZhbHVlOiBhbnkpIHtcclxuICAgICAgICAgICAgICBoYW5kbGVDb25maXJtRmlsdGVyKGNvbnRleHQsIGNvbHVtbiwgdmFsdWUgJiYgdmFsdWUubGVuZ3RoID4gMCwgaXRlbSlcclxuICAgICAgICAgICAgICBpZiAoZXZlbnRzICYmIGV2ZW50c1t0eXBlXSkge1xyXG4gICAgICAgICAgICAgICAgZXZlbnRzW3R5cGVdKE9iamVjdC5hc3NpZ24oeyBjb250ZXh0IH0sIHBhcmFtcyksIHZhbHVlKVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSwgcmVuZGVyT3B0cywgcGFyYW1zLCBjb250ZXh0KVxyXG4gICAgICAgIH0sIHJlbmRlck9wdGlvbnMoaCwgb3B0aW9ucywgb3B0aW9uUHJvcHMpKVxyXG4gICAgICB9KVxyXG4gICAgfSxcclxuICAgIGZpbHRlck1ldGhvZCAoeyBvcHRpb24sIHJvdywgY29sdW1uIH06IGFueSkge1xyXG4gICAgICBsZXQgeyBkYXRhIH0gPSBvcHRpb25cclxuICAgICAgbGV0IHsgcHJvcGVydHksIGZpbHRlclJlbmRlcjogcmVuZGVyT3B0cyB9ID0gY29sdW1uXHJcbiAgICAgIGxldCB7IHByb3BzID0ge30gfSA9IHJlbmRlck9wdHNcclxuICAgICAgbGV0IGNlbGxWYWx1ZSA9IFhFVXRpbHMuZ2V0KHJvdywgcHJvcGVydHkpXHJcbiAgICAgIGlmIChwcm9wcy5tb2RlID09PSAnbXVsdGlwbGUnKSB7XHJcbiAgICAgICAgaWYgKFhFVXRpbHMuaXNBcnJheShjZWxsVmFsdWUpKSB7XHJcbiAgICAgICAgICByZXR1cm4gWEVVdGlscy5pbmNsdWRlQXJyYXlzKGNlbGxWYWx1ZSwgZGF0YSlcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGRhdGEuaW5kZXhPZihjZWxsVmFsdWUpID4gLTFcclxuICAgICAgfVxyXG4gICAgICAvKiBlc2xpbnQtZGlzYWJsZSBlcWVxZXEgKi9cclxuICAgICAgcmV0dXJuIGNlbGxWYWx1ZSA9PSBkYXRhXHJcbiAgICB9LFxyXG4gICAgcmVuZGVySXRlbSAoaDogRnVuY3Rpb24sIHJlbmRlck9wdHM6IGFueSwgcGFyYW1zOiBhbnksIGNvbnRleHQ6IGFueSkge1xyXG4gICAgICBsZXQgeyBvcHRpb25zLCBvcHRpb25Hcm91cHMsIG9wdGlvblByb3BzID0ge30sIG9wdGlvbkdyb3VwUHJvcHMgPSB7fSB9ID0gcmVuZGVyT3B0c1xyXG4gICAgICBsZXQgeyBkYXRhLCBwcm9wZXJ0eSB9ID0gcGFyYW1zXHJcbiAgICAgIGxldCB7IGF0dHJzIH0gPSByZW5kZXJPcHRzXHJcbiAgICAgIGxldCBwcm9wczogYW55ID0gZ2V0Rm9ybVByb3BzKGNvbnRleHQsIHJlbmRlck9wdHMpXHJcbiAgICAgIGlmIChvcHRpb25Hcm91cHMpIHtcclxuICAgICAgICBsZXQgZ3JvdXBPcHRpb25zOiBzdHJpbmcgPSBvcHRpb25Hcm91cFByb3BzLm9wdGlvbnMgfHwgJ29wdGlvbnMnXHJcbiAgICAgICAgbGV0IGdyb3VwTGFiZWw6IHN0cmluZyA9IG9wdGlvbkdyb3VwUHJvcHMubGFiZWwgfHwgJ2xhYmVsJ1xyXG4gICAgICAgIHJldHVybiBbXHJcbiAgICAgICAgICBoKCdhLXNlbGVjdCcsIHtcclxuICAgICAgICAgICAgcHJvcHMsXHJcbiAgICAgICAgICAgIGF0dHJzLFxyXG4gICAgICAgICAgICBtb2RlbDoge1xyXG4gICAgICAgICAgICAgIHZhbHVlOiBYRVV0aWxzLmdldChkYXRhLCBwcm9wZXJ0eSksXHJcbiAgICAgICAgICAgICAgY2FsbGJhY2sgKGNlbGxWYWx1ZTogYW55KSB7XHJcbiAgICAgICAgICAgICAgICBYRVV0aWxzLnNldChkYXRhLCBwcm9wZXJ0eSwgY2VsbFZhbHVlKVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgb246IGdldEZvcm1FdmVudHMocmVuZGVyT3B0cywgcGFyYW1zLCBjb250ZXh0KVxyXG4gICAgICAgICAgfSwgWEVVdGlscy5tYXAob3B0aW9uR3JvdXBzLCAoZ3JvdXA6IGFueSwgZ0luZGV4OiBudW1iZXIpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIGgoJ2Etc2VsZWN0LW9wdC1ncm91cCcsIHtcclxuICAgICAgICAgICAgICBrZXk6IGdJbmRleFxyXG4gICAgICAgICAgICB9LCBbXHJcbiAgICAgICAgICAgICAgaCgnc3BhbicsIHtcclxuICAgICAgICAgICAgICAgIHNsb3Q6ICdsYWJlbCdcclxuICAgICAgICAgICAgICB9LCBncm91cFtncm91cExhYmVsXSlcclxuICAgICAgICAgICAgXS5jb25jYXQoXHJcbiAgICAgICAgICAgICAgcmVuZGVyT3B0aW9ucyhoLCBncm91cFtncm91cE9wdGlvbnNdLCBvcHRpb25Qcm9wcylcclxuICAgICAgICAgICAgKSlcclxuICAgICAgICAgIH0pKVxyXG4gICAgICAgIF1cclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gW1xyXG4gICAgICAgIGgoJ2Etc2VsZWN0Jywge1xyXG4gICAgICAgICAgcHJvcHMsXHJcbiAgICAgICAgICBhdHRycyxcclxuICAgICAgICAgIG1vZGVsOiB7XHJcbiAgICAgICAgICAgIHZhbHVlOiBYRVV0aWxzLmdldChkYXRhLCBwcm9wZXJ0eSksXHJcbiAgICAgICAgICAgIGNhbGxiYWNrIChjZWxsVmFsdWU6IGFueSkge1xyXG4gICAgICAgICAgICAgIFhFVXRpbHMuc2V0KGRhdGEsIHByb3BlcnR5LCBjZWxsVmFsdWUpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBvbjogZ2V0Rm9ybUV2ZW50cyhyZW5kZXJPcHRzLCBwYXJhbXMsIGNvbnRleHQpXHJcbiAgICAgICAgfSwgcmVuZGVyT3B0aW9ucyhoLCBvcHRpb25zLCBvcHRpb25Qcm9wcykpXHJcbiAgICAgIF1cclxuICAgIH0sXHJcbiAgICBlZGl0RXhwb3J0TWV0aG9kOiBjcmVhdGVFeHBvcnRNZXRob2QoZ2V0U2VsZWN0Q2VsbFZhbHVlLCB0cnVlKSxcclxuICAgIGNlbGxFeHBvcnRNZXRob2Q6IGNyZWF0ZUV4cG9ydE1ldGhvZChnZXRTZWxlY3RDZWxsVmFsdWUpXHJcbiAgfSxcclxuICBBQ2FzY2FkZXI6IHtcclxuICAgIHJlbmRlckVkaXQ6IGNyZWF0ZUVkaXRSZW5kZXIoKSxcclxuICAgIHJlbmRlckNlbGwgKGg6IEZ1bmN0aW9uLCByZW5kZXJPcHRzOiBhbnksIHBhcmFtczogYW55KSB7XHJcbiAgICAgIHJldHVybiBjZWxsVGV4dChoLCBnZXRDYXNjYWRlckNlbGxWYWx1ZShyZW5kZXJPcHRzLCBwYXJhbXMpKVxyXG4gICAgfSxcclxuICAgIHJlbmRlckl0ZW06IGNyZWF0ZUZvcm1JdGVtUmVuZGVyKCksXHJcbiAgICBlZGl0RXhwb3J0TWV0aG9kOiBjcmVhdGVFeHBvcnRNZXRob2QoZ2V0Q2FzY2FkZXJDZWxsVmFsdWUsIHRydWUpLFxyXG4gICAgY2VsbEV4cG9ydE1ldGhvZDogY3JlYXRlRXhwb3J0TWV0aG9kKGdldENhc2NhZGVyQ2VsbFZhbHVlKVxyXG4gIH0sXHJcbiAgQURhdGVQaWNrZXI6IHtcclxuICAgIHJlbmRlckVkaXQ6IGNyZWF0ZUVkaXRSZW5kZXIoKSxcclxuICAgIHJlbmRlckNlbGw6IGZvcm1hdERhdGVQaWNrZXIoJ1lZWVktTU0tREQnKSxcclxuICAgIHJlbmRlckl0ZW06IGNyZWF0ZUZvcm1JdGVtUmVuZGVyKCksXHJcbiAgICBlZGl0RXhwb3J0TWV0aG9kOiBjcmVhdGVEYXRlUGlja2VyRXhwb3J0TWV0aG9kKCdZWVlZLU1NLUREJywgdHJ1ZSksXHJcbiAgICBjZWxsRXhwb3J0TWV0aG9kOiBjcmVhdGVEYXRlUGlja2VyRXhwb3J0TWV0aG9kKCdZWVlZLU1NLUREJylcclxuICB9LFxyXG4gIEFNb250aFBpY2tlcjoge1xyXG4gICAgcmVuZGVyRWRpdDogY3JlYXRlRWRpdFJlbmRlcigpLFxyXG4gICAgcmVuZGVyQ2VsbDogZm9ybWF0RGF0ZVBpY2tlcignWVlZWS1NTScpLFxyXG4gICAgcmVuZGVySXRlbTogY3JlYXRlRm9ybUl0ZW1SZW5kZXIoKSxcclxuICAgIGVkaXRFeHBvcnRNZXRob2Q6IGNyZWF0ZURhdGVQaWNrZXJFeHBvcnRNZXRob2QoJ1lZWVktTU0nLCB0cnVlKSxcclxuICAgIGNlbGxFeHBvcnRNZXRob2Q6IGNyZWF0ZURhdGVQaWNrZXJFeHBvcnRNZXRob2QoJ1lZWVktTU0nKVxyXG4gIH0sXHJcbiAgQVJhbmdlUGlja2VyOiB7XHJcbiAgICByZW5kZXJFZGl0OiBjcmVhdGVFZGl0UmVuZGVyKCksXHJcbiAgICByZW5kZXJDZWxsIChoOiBGdW5jdGlvbiwgcmVuZGVyT3B0czogYW55LCBwYXJhbXM6IGFueSkge1xyXG4gICAgICByZXR1cm4gY2VsbFRleHQoaCwgZ2V0UmFuZ2VQaWNrZXJDZWxsVmFsdWUocmVuZGVyT3B0cywgcGFyYW1zKSlcclxuICAgIH0sXHJcbiAgICByZW5kZXJJdGVtOiBjcmVhdGVGb3JtSXRlbVJlbmRlcigpLFxyXG4gICAgZWRpdEV4cG9ydE1ldGhvZDogY3JlYXRlRXhwb3J0TWV0aG9kKGdldFJhbmdlUGlja2VyQ2VsbFZhbHVlLCB0cnVlKSxcclxuICAgIGNlbGxFeHBvcnRNZXRob2Q6IGNyZWF0ZUV4cG9ydE1ldGhvZChnZXRSYW5nZVBpY2tlckNlbGxWYWx1ZSlcclxuICB9LFxyXG4gIEFXZWVrUGlja2VyOiB7XHJcbiAgICByZW5kZXJFZGl0OiBjcmVhdGVFZGl0UmVuZGVyKCksXHJcbiAgICByZW5kZXJDZWxsOiBmb3JtYXREYXRlUGlja2VyKCdZWVlZLVdX5ZGoJyksXHJcbiAgICByZW5kZXJJdGVtOiBjcmVhdGVGb3JtSXRlbVJlbmRlcigpLFxyXG4gICAgZWRpdEV4cG9ydE1ldGhvZDogY3JlYXRlRGF0ZVBpY2tlckV4cG9ydE1ldGhvZCgnWVlZWS1XV+WRqCcsIHRydWUpLFxyXG4gICAgY2VsbEV4cG9ydE1ldGhvZDogY3JlYXRlRGF0ZVBpY2tlckV4cG9ydE1ldGhvZCgnWVlZWS1XV+WRqCcpXHJcbiAgfSxcclxuICBBVGltZVBpY2tlcjoge1xyXG4gICAgcmVuZGVyRWRpdDogY3JlYXRlRWRpdFJlbmRlcigpLFxyXG4gICAgcmVuZGVyQ2VsbDogZm9ybWF0RGF0ZVBpY2tlcignSEg6bW06c3MnKSxcclxuICAgIHJlbmRlckl0ZW06IGNyZWF0ZUZvcm1JdGVtUmVuZGVyKCksXHJcbiAgICBlZGl0RXhwb3J0TWV0aG9kOiBjcmVhdGVEYXRlUGlja2VyRXhwb3J0TWV0aG9kKCdISDptbTpzcycsIHRydWUpLFxyXG4gICAgY2VsbEV4cG9ydE1ldGhvZDogY3JlYXRlRGF0ZVBpY2tlckV4cG9ydE1ldGhvZCgnSEg6bW06c3MnKVxyXG4gIH0sXHJcbiAgQVRyZWVTZWxlY3Q6IHtcclxuICAgIHJlbmRlckVkaXQ6IGNyZWF0ZUVkaXRSZW5kZXIoKSxcclxuICAgIHJlbmRlckNlbGwgKGg6IEZ1bmN0aW9uLCByZW5kZXJPcHRzOiBhbnksIHBhcmFtczogYW55KSB7XHJcbiAgICAgIHJldHVybiBjZWxsVGV4dChoLCBnZXRUcmVlU2VsZWN0Q2VsbFZhbHVlKHJlbmRlck9wdHMsIHBhcmFtcykpXHJcbiAgICB9LFxyXG4gICAgcmVuZGVySXRlbTogY3JlYXRlRm9ybUl0ZW1SZW5kZXIoKSxcclxuICAgIGVkaXRFeHBvcnRNZXRob2Q6IGNyZWF0ZUV4cG9ydE1ldGhvZChnZXRUcmVlU2VsZWN0Q2VsbFZhbHVlLCB0cnVlKSxcclxuICAgIGNlbGxFeHBvcnRNZXRob2Q6IGNyZWF0ZUV4cG9ydE1ldGhvZChnZXRUcmVlU2VsZWN0Q2VsbFZhbHVlKVxyXG4gIH0sXHJcbiAgQVJhdGU6IHtcclxuICAgIHJlbmRlckRlZmF1bHQ6IGNyZWF0ZUVkaXRSZW5kZXIoKSxcclxuICAgIHJlbmRlckVkaXQ6IGNyZWF0ZUVkaXRSZW5kZXIoKSxcclxuICAgIHJlbmRlckZpbHRlcjogY3JlYXRlRmlsdGVyUmVuZGVyKCksXHJcbiAgICBmaWx0ZXJNZXRob2Q6IGRlZmF1bHRGaWx0ZXJNZXRob2QsXHJcbiAgICByZW5kZXJJdGVtOiBjcmVhdGVGb3JtSXRlbVJlbmRlcigpXHJcbiAgfSxcclxuICBBU3dpdGNoOiB7XHJcbiAgICByZW5kZXJEZWZhdWx0OiBjcmVhdGVFZGl0UmVuZGVyKCksXHJcbiAgICByZW5kZXJFZGl0OiBjcmVhdGVFZGl0UmVuZGVyKCksXHJcbiAgICByZW5kZXJGaWx0ZXI6IGNyZWF0ZUZpbHRlclJlbmRlcigpLFxyXG4gICAgZmlsdGVyTWV0aG9kOiBkZWZhdWx0RmlsdGVyTWV0aG9kLFxyXG4gICAgcmVuZGVySXRlbTogY3JlYXRlRm9ybUl0ZW1SZW5kZXIoKVxyXG4gIH0sXHJcbiAgQVJhZGlvOiB7XHJcbiAgICByZW5kZXJJdGVtOiBjcmVhdGVGb3JtSXRlbVJhZGlvQW5kQ2hlY2tib3hSZW5kZXIoKVxyXG4gIH0sXHJcbiAgQUNoZWNrYm94OiB7XHJcbiAgICByZW5kZXJJdGVtOiBjcmVhdGVGb3JtSXRlbVJhZGlvQW5kQ2hlY2tib3hSZW5kZXIoKVxyXG4gIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIOS6i+S7tuWFvOWuueaAp+WkhOeQhlxyXG4gKi9cclxuZnVuY3Rpb24gaGFuZGxlQ2xlYXJFdmVudCAocGFyYW1zOiBhbnksIGV2bnQ6IGFueSwgY29udGV4dDogYW55KSB7XHJcbiAgbGV0IHsgZ2V0RXZlbnRUYXJnZXROb2RlIH0gPSBjb250ZXh0XHJcbiAgbGV0IGJvZHlFbGVtID0gZG9jdW1lbnQuYm9keVxyXG4gIGlmIChcclxuICAgIC8vIOS4i+aLieahhlxyXG4gICAgZ2V0RXZlbnRUYXJnZXROb2RlKGV2bnQsIGJvZHlFbGVtLCAnYW50LXNlbGVjdC1kcm9wZG93bicpLmZsYWcgfHxcclxuICAgIC8vIOe6p+iBlFxyXG4gICAgZ2V0RXZlbnRUYXJnZXROb2RlKGV2bnQsIGJvZHlFbGVtLCAnYW50LWNhc2NhZGVyLW1lbnVzJykuZmxhZyB8fFxyXG4gICAgLy8g5pel5pyfXHJcbiAgICBnZXRFdmVudFRhcmdldE5vZGUoZXZudCwgYm9keUVsZW0sICdhbnQtY2FsZW5kYXItcGlja2VyLWNvbnRhaW5lcicpLmZsYWcgfHxcclxuICAgIC8vIOaXtumXtOmAieaLqVxyXG4gICAgZ2V0RXZlbnRUYXJnZXROb2RlKGV2bnQsIGJvZHlFbGVtLCAnYW50LXRpbWUtcGlja2VyLXBhbmVsJykuZmxhZ1xyXG4gICkge1xyXG4gICAgcmV0dXJuIGZhbHNlXHJcbiAgfVxyXG59XHJcblxyXG4vKipcclxuICog5Z+65LqOIHZ4ZS10YWJsZSDooajmoLznmoTpgILphY3mj5Lku7bvvIznlKjkuo7lhbzlrrkgYW50LWRlc2lnbi12dWUg57uE5Lu25bqTXHJcbiAqL1xyXG5leHBvcnQgY29uc3QgVlhFVGFibGVQbHVnaW5BbnRkID0ge1xyXG4gIGluc3RhbGwgKHh0YWJsZTogdHlwZW9mIFZYRVRhYmxlKSB7XHJcbiAgICBsZXQgeyBpbnRlcmNlcHRvciwgcmVuZGVyZXIgfSA9IHh0YWJsZVxyXG4gICAgcmVuZGVyZXIubWl4aW4ocmVuZGVyTWFwKVxyXG4gICAgaW50ZXJjZXB0b3IuYWRkKCdldmVudC5jbGVhckZpbHRlcicsIGhhbmRsZUNsZWFyRXZlbnQpXHJcbiAgICBpbnRlcmNlcHRvci5hZGQoJ2V2ZW50LmNsZWFyQWN0aXZlZCcsIGhhbmRsZUNsZWFyRXZlbnQpXHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiB0b01vbWVudFN0cmluZyAoY2VsbFZhbHVlOiBhbnksIGZvcm1hdDogc3RyaW5nKTogc3RyaW5nIHtcclxuICByZXR1cm4gY2VsbFZhbHVlID8gY2VsbFZhbHVlLmZvcm1hdChmb3JtYXQpIDogJydcclxufVxyXG5cclxuZGVjbGFyZSBtb2R1bGUgJ3hlLXV0aWxzL21ldGhvZHMveGUtdXRpbHMnIHtcclxuICBpbnRlcmZhY2UgWEVVdGlsc01ldGhvZHMge1xyXG4gICAgLyoqXHJcbiAgICAgKiDlsIYgTW9tZW50IOaXpeacn+agvOW8j+WMluS4uuWtl+espuS4slxyXG4gICAgICogQHBhcmFtIGNlbGxWYWx1ZSDlgLxcclxuICAgICAqIEBwYXJhbSBmb3JtYXQg5qC85byP5YyWXHJcbiAgICAgKi9cclxuICAgIHRvTW9tZW50U3RyaW5nOiB0eXBlb2YgdG9Nb21lbnRTdHJpbmc7XHJcbiAgfVxyXG59XHJcblxyXG5YRVV0aWxzLm1peGluKHtcclxuICB0b01vbWVudFN0cmluZ1xyXG59KVxyXG5cclxuaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmIHdpbmRvdy5WWEVUYWJsZSkge1xyXG4gIHdpbmRvdy5WWEVUYWJsZS51c2UoVlhFVGFibGVQbHVnaW5BbnRkKVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBWWEVUYWJsZVBsdWdpbkFudGRcclxuIl19
