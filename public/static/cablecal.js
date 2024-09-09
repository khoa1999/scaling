// JavaScript source code
document.getElementById('exportButton').addEventListener('click', function () {
    // Tạo một Workbook mới
    var wb = XLSX.utils.book_new();

    // Tạo một mảng chứa dữ liệu từ bảng HTML
    var data = [];
    //Thêm 4 dòng trống trong excel
    for (var i = 0; i < 4; i++) {
        data.push([""]); // Thêm một mảng rỗng vào mảng dữ liệu
    }

    var table = document.getElementById('resultTable');

    var headerRow = [];
    for (var j = 0; j < table.rows[0].cells.length - 1; j++) {
        headerRow.push(table.rows[0].cells[j].textContent);
    }

    headerRow.push("Name of Area/Plant/Zone");
    headerRow.push("Area/Plant/Zone Number");
    headerRow.push("Name of Equipment");
    headerRow.push("Equipment Tag");
    headerRow.push("Quantity");
    headerRow.push("Current");

    data.push(headerRow);

    for (var i = 1; i < table.rows.length; i++) {
        var rowData = [];
        for (var j = 0; j < table.rows[i].cells.length - 1; j++) { //không lấy cột cuối trong table html
            rowData.push(table.rows[i].cells[j].textContent);
        }

        var areaPlantZoneName = document.getElementById('areaPlantZoneName').value;
        var areaPlantZoneNumber = document.getElementById('areaPlantZoneNumber').value;
        var equipmentName = document.getElementById('equipmentName').value;
        var equipmentTag = document.getElementById('equipmentTag').value;
        var quantity = document.getElementById('quantity').value;
        var current = document.getElementById('current').value;

        rowData.push(areaPlantZoneName);
        rowData.push(areaPlantZoneNumber);
        rowData.push(equipmentName);
        rowData.push(equipmentTag);
        rowData.push(quantity);
        rowData.push(current);

        data.push(rowData);
    }


    // Tạo một Worksheet từ mảng dữ liệu
    var ws = XLSX.utils.aoa_to_sheet(data);

    // Điều chỉnh độ rộng của các cột dựa trên nội dung
    var range = XLSX.utils.decode_range(ws['!ref']);
    for (var C = range.s.c; C <= range.e.c; ++C) {
        var maxCellLength = 0;
        for (var R = range.s.r; R <= range.e.r; ++R) {
            var cellAddress = { c: C, r: R };
            var cellRef = XLSX.utils.encode_cell(cellAddress);
            if (!ws[cellRef]) continue;
            var cellLength = ws[cellRef].v.toString().length;
            if (cellLength > maxCellLength) maxCellLength = cellLength;
        }
        ws['!cols'] = ws['!cols'] || [];
        ws['!cols'][C] = { wch: maxCellLength + 2 }; // Tăng kích thước một chút để tránh tràn nội dung
    }

    // Căn giữa các giá trị trong các ô
    var range = XLSX.utils.decode_range(ws['!ref']);
    for (var R = range.s.r; R <= range.e.r; ++R) {
        for (var C = range.s.c; C <= range.e.c; ++C) {
            var cellAddress = { c: C, r: R };
            var cellRef = XLSX.utils.encode_cell(cellAddress);
            if (!ws[cellRef]) continue;
            ws[cellRef].s = { alignment: { horizontal: 'center', vertical: 'center', wrapText: true } };
        }
    }

    // Thêm Worksheet vào Workbook với tên là "Data"
    XLSX.utils.book_append_sheet(wb, ws, "Data");

    // Xuất Workbook thành file Excel
    XLSX.writeFile(wb, 'data.xlsx');
});