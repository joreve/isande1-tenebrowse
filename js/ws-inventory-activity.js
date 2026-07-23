/**
 * Tenebrowse - Warehouse Staff | Inventory Activity
 * Page-specific logic for the read-only inventory activity history view.
 * Records here cannot be edited or deleted from this page.
 */

function transitionTo(url) {
    document.body.classList.add('page-exit');
    setTimeout(() => window.location.href = url, 300);
}

document.addEventListener('DOMContentLoaded', () => {

    // --------------------------------------------------------
    // SAMPLE ACTIVITY DATA (Read-Only History)
    // --------------------------------------------------------
    const activityData = [
        {
            id: 'ACT-8801',
            material: 'Portland Cement (Type I)',
            type: 'Stock Received',
            prevQty: 1040,
            updatedQty: 1240,
            warehouse: 'Warehouse 2',
            updatedBy: 'Miguel Reyes',
            date: '2026-07-22',
            time: '09:14 AM',
            reference: 'DR-2026-451',
            remarks: 'Full delivery received and verified against purchase order PO-2026-750.'
        },
        {
            id: 'ACT-8802',
            material: 'Steel Reinforcement Bar 12mm',
            type: 'Material Transferred',
            prevQty: 340,
            updatedQty: 255,
            warehouse: 'Warehouse 2',
            updatedBy: 'Ana Villanueva',
            date: '2026-07-22',
            time: '11:02 AM',
            reference: 'TRF-2026-118',
            remarks: '85 pieces transferred out to Warehouse 2 project allocation for Site Alpha.'
        },
        {
            id: 'ACT-8803',
            material: 'Marine Plywood 3/4"',
            type: 'Damaged Material Recorded',
            prevQty: 62,
            updatedQty: 50,
            warehouse: 'Warehouse 3',
            updatedBy: 'Miguel Reyes',
            date: '2026-07-21',
            time: '02:47 PM',
            reference: 'DMG-2026-039',
            remarks: '12 sheets moved to Warehouse 3 after water damage found during inspection.'
        },
        {
            id: 'ACT-8804',
            material: 'PVC Pipe 4-inch',
            type: 'Inventory Correction',
            prevQty: 598,
            updatedQty: 620,
            warehouse: 'Warehouse 1',
            updatedBy: 'Jorge Dizon',
            date: '2026-07-21',
            time: '04:20 PM',
            reference: 'COR-2026-072',
            remarks: 'Physical recount found 22 additional lengths not reflected in system count.'
        },
        {
            id: 'ACT-8805',
            material: 'Electrical Wire THHN 3.5mm',
            type: 'Missing Material Reported',
            prevQty: 260,
            updatedQty: 210,
            warehouse: 'Warehouse 1',
            updatedBy: 'Ana Villanueva',
            date: '2026-07-21',
            time: '08:35 AM',
            reference: 'MSG-2026-015',
            remarks: '50 rolls unaccounted for during weekly cycle count. Flagged for investigation.'
        },
        {
            id: 'ACT-8806',
            material: 'Roofing Sheets (Corrugated)',
            type: 'Delivery Verified',
            prevQty: 0,
            updatedQty: 480,
            warehouse: 'Warehouse 2',
            updatedBy: 'Miguel Reyes',
            date: '2026-07-20',
            time: '10:58 AM',
            reference: 'DR-2026-447',
            remarks: 'Supplier delivery partially verified - 480 of 520 sheets accepted, remainder short-shipped.'
        },
        {
            id: 'ACT-8807',
            material: 'Concrete Hollow Blocks 6"',
            type: 'Quantity Updated',
            prevQty: 3200,
            updatedQty: 3400,
            warehouse: 'Warehouse 2',
            updatedBy: 'Jorge Dizon',
            date: '2026-07-18',
            time: '01:15 PM',
            reference: 'UPD-2026-201',
            remarks: 'Manual quantity update following batch production intake.'
        },
        {
            id: 'ACT-8808',
            material: 'Structural Bolts M16',
            type: 'Stock Received',
            prevQty: 5,
            updatedQty: 15,
            warehouse: 'Warehouse 1',
            updatedBy: 'Ana Villanueva',
            date: '2026-07-22',
            time: '03:40 PM',
            reference: 'DR-2026-453',
            remarks: 'Partial restock of 10 boxes received against backorder.'
        },
        {
            id: 'ACT-8809',
            material: 'PVC Pipe 4-inch',
            type: 'Material Transferred',
            prevQty: 640,
            updatedQty: 620,
            warehouse: 'Warehouse 1',
            updatedBy: 'Jorge Dizon',
            date: '2026-07-19',
            time: '09:50 AM',
            reference: 'TRF-2026-110',
            remarks: '20 lengths transferred to Warehouse 3 for quality inspection.'
        },
        {
            id: 'ACT-8810',
            material: 'Marine Plywood 3/4"',
            type: 'Inventory Correction',
            prevQty: 55,
            updatedQty: 50,
            warehouse: 'Warehouse 3',
            updatedBy: 'Miguel Reyes',
            date: '2026-07-17',
            time: '05:05 PM',
            reference: 'COR-2026-068',
            remarks: 'Recount adjustment after damaged batch relocation was finalized.'
        }
    ];

    // --------------------------------------------------------
    // STATE & ELEMENT REFERENCES
    // --------------------------------------------------------
    let currentPage = 1;
    const itemsPerPage = 5;

    const tableBody = document.getElementById('activityTableBody');
    const searchInput = document.getElementById('searchInput');
    const activityTypeFilter = document.getElementById('activityTypeFilter');
    const warehouseFilter = document.getElementById('warehouseFilter');
    const dateFilter = document.getElementById('dateFilter');
    const btnExport = document.getElementById('btnExport');
    const paginationInfo = document.getElementById('paginationInfo');
    const prevPageBtn = document.getElementById('prevPageBtn');
    const nextPageBtn = document.getElementById('nextPageBtn');

    // --------------------------------------------------------
    // SUMMARY METRICS
    // --------------------------------------------------------
    const renderSummary = () => {
        const today = '2026-07-22';

        const updatesToday = activityData.filter(a => a.date === today).length;
        const stockReceived = activityData.filter(a => a.type === 'Stock Received').length;
        const transfers = activityData.filter(a => a.type === 'Material Transferred').length;
        const discrepancies = activityData.filter(a =>
            a.type === 'Damaged Material Recorded' ||
            a.type === 'Missing Material Reported' ||
            a.type === 'Inventory Correction'
        ).length;

        document.getElementById('summaryUpdatesToday').textContent = updatesToday;
        document.getElementById('summaryStockReceived').textContent = stockReceived;
        document.getElementById('summaryTransfers').textContent = transfers;
        document.getElementById('summaryDiscrepancies').textContent = discrepancies;
    };

    // --------------------------------------------------------
    // BADGE STYLING FOR ACTIVITY TYPES
    // --------------------------------------------------------
    const getBadgeClass = (type) => {
        switch (type) {
            case 'Stock Received':
            case 'Delivery Verified':
                return 'badge-success';
            case 'Quantity Updated':
            case 'Material Transferred':
                return 'badge-info';
            case 'Inventory Correction':
                return 'badge-warning';
            case 'Damaged Material Recorded':
            case 'Missing Material Reported':
                return 'badge-danger';
            default:
                return 'badge-info';
        }
    };

    // --------------------------------------------------------
    // FILTERING & TABLE RENDER
    // --------------------------------------------------------
    const getFilteredData = () => {
        const searchTerm = searchInput.value.toLowerCase();
        const filterType = activityTypeFilter.value;
        const filterWarehouse = warehouseFilter.value;
        const filterDate = dateFilter.value;

        return activityData.filter(a => {
            const matchesSearch =
                a.id.toLowerCase().includes(searchTerm) ||
                a.material.toLowerCase().includes(searchTerm) ||
                a.reference.toLowerCase().includes(searchTerm);
            const matchesType = filterType === 'All' || a.type === filterType;
            const matchesWarehouse = filterWarehouse === 'All' || a.warehouse === filterWarehouse;
            const matchesDate = !filterDate || a.date === filterDate;
            return matchesSearch && matchesType && matchesWarehouse && matchesDate;
        });
    };

    const renderTable = () => {
        const filteredData = getFilteredData();
        const totalItems = filteredData.length;
        const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

        if (currentPage > totalPages) currentPage = totalPages;
        if (currentPage < 1) currentPage = 1;

        const startIndex = (currentPage - 1) * itemsPerPage;
        const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

        tableBody.innerHTML = '';

        if (paginatedData.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="10" class="empty-state-row">No inventory activity records found matching your criteria.</td></tr>`;
            paginationInfo.textContent = 'Showing 0-0 of 0 records';
            prevPageBtn.disabled = true;
            nextPageBtn.disabled = true;
            return;
        }

        paginatedData.forEach(a => {
            const badgeClass = getBadgeClass(a.type);
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong>${a.id}</strong></td>
                <td>${a.material}</td>
                <td><span class="badge ${badgeClass}">${a.type}</span></td>
                <td>${a.prevQty.toLocaleString()}</td>
                <td class="font-semibold">${a.updatedQty.toLocaleString()}</td>
                <td>${a.warehouse}</td>
                <td>${a.updatedBy}</td>
                <td>${a.date} ${a.time}</td>
                <td>${a.reference}</td>
                <td class="text-right">
                    <button class="action-btn" onclick="viewActivityDetails('${a.id}')" title="View Details"><i class="fas fa-eye"></i></button>
                </td>
            `;
            tableBody.appendChild(tr);
        });

        const endItem = Math.min(startIndex + itemsPerPage, totalItems);
        paginationInfo.textContent = `Showing ${startIndex + 1}-${endItem} of ${totalItems} records`;

        prevPageBtn.disabled = currentPage === 1;
        nextPageBtn.disabled = currentPage === totalPages;
    };

    // --------------------------------------------------------
    // VIEW DETAILS (READ-ONLY MODAL)
    // --------------------------------------------------------
    window.viewActivityDetails = (id) => {
        const record = activityData.find(a => a.id === id);
        if (!record) return;

        document.getElementById('detActivityIdBadge').textContent = record.id;
        document.getElementById('detMaterial').textContent = record.material;
        document.getElementById('detActivityType').textContent = record.type;
        document.getElementById('detPrevQty').textContent = record.prevQty.toLocaleString();
        document.getElementById('detUpdatedQty').textContent = record.updatedQty.toLocaleString();
        document.getElementById('detWarehouse').textContent = record.warehouse;
        document.getElementById('detUpdatedBy').textContent = record.updatedBy;
        document.getElementById('detDateTime').textContent = `${record.date} ${record.time}`;
        document.getElementById('detReference').textContent = record.reference;
        document.getElementById('detRemarks').textContent = record.remarks || 'No remarks recorded.';

        document.getElementById('viewActivityModal').classList.add('active');
    };

    // --------------------------------------------------------
    // EVENTS
    // --------------------------------------------------------
    searchInput.addEventListener('input', () => { currentPage = 1; renderTable(); });
    activityTypeFilter.addEventListener('change', () => { currentPage = 1; renderTable(); });
    warehouseFilter.addEventListener('change', () => { currentPage = 1; renderTable(); });
    dateFilter.addEventListener('change', () => { currentPage = 1; renderTable(); });

    prevPageBtn.addEventListener('click', () => { if (currentPage > 1) { currentPage--; renderTable(); } });
    nextPageBtn.addEventListener('click', () => {
        const totalPages = Math.max(1, Math.ceil(getFilteredData().length / itemsPerPage));
        if (currentPage < totalPages) { currentPage++; renderTable(); }
    });

    btnExport.addEventListener('click', () => {
        if (window.showToast) window.showToast('Report Export Initiated', 'Inventory activity history downloading as CSV...', 'primary');
    });

    // --------------------------------------------------------
    // INITIAL LOAD
    // --------------------------------------------------------
    renderSummary();
    renderTable();
});
