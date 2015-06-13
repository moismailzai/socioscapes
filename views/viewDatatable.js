module.exports = function (datatable_column_names) {
    var columns_includeds = [];
    var columns_excludeds = [];

    var i = 0;
    var no_of_cols = datatable_column_names.includeds.length;
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
    return this;
};