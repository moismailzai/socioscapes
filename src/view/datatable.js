/*jslint node: true */
/*global module, require, google*/
'use strict';
var newDispatcherCallback = require('./../construct/newDispatcherCallback.js');
module.exports = function (datatable_column_names) {
    var callback = newDispatcherCallback(arguments),
        columns_includeds = [],
        columns_excludeds = [],
        i = 0,
        no_of_cols = datatable_column_names.includeds.length;
    while (i < arguments.length) {
        columns_includeds.push({"data": arguments[i]});
        i++;
    }

    if ($.fn.dataTable.isDataTable(datatable_includeds_div)) {
        LAYER_ROOT.data.datatable = $(datatable_includeds_div).DataTable();
        LAYER_ROOT.data.datatable_excludeds = $(datatable_excludeds_div).DataTable();
    } else {
        $(datatable_includeds_div).dataTable({
            "data": LAYER_ROOT.data.getDataset,
            "columns": columns
        });

        $(datatable_excludeds_div).dataTable({
            "data": LAYER_ROOT.data.getDatasetOmitted,
            "columns": columns
        });
    }
    callback(this);
    return this;
};