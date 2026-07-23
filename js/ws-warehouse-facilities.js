/**
 * Tenebrowse - Warehouse Staff
 * Warehouse Facilities Page Logic
 */

function transitionTo(url) {
    document.body.classList.add('page-exit');
    setTimeout(() => window.location.href = url, 300);
}

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // Warehouse Definitions
    // ==========================================
    const warehouses = {
        W1: {
            label: 'Warehouse 1',
            name: 'Small Items',
            icon: 'fa-toolbox',
            desc: 'Screws, Nails, Electrical Components, Hand Tools, Plumbing Fittings, Safety Equipment',
            usable: true
        },
        W2: {
            label: 'Warehouse 2',
            name: 'Large Materials',
            icon: 'fa-warehouse',
            desc: 'Portland Cement, Steel Reinforcement Bars, Marine Plywood, Roofing Sheets, PVC Pipes, Concrete Hollow Blocks',
            usable: true
        },
        W3: {
            label: 'Warehouse 3',
            name: 'Damaged & Quarantined Items',
            icon: 'fa-ban',
            desc: 'Damaged Materials, Defective Materials, Materials Awaiting Inspection, Materials Awaiting Supplier Return',
            usable: false
        }
    };

    // ==========================================
    // Seed Inventory Data
    // ==========================================
    let inventoryData = [
        // Warehouse 1 - Small Items
        { id: 'MAT-S101', name: 'Wood Screws 1.5"', category: 'Hardware', qty: 5000, unit: 'Pieces', status: 'Optimal', warehouse: 'W1', updated: '2026-07-20' },
        { id: 'MAT-S102', name: 'Common Nails 3"', category: 'Hardware', qty: 3200, unit: 'Pieces', status: 'Optimal', warehouse: 'W1', updated: '2026-07-19' },
        { id: 'MAT-S103', name: 'Circuit Breaker 20A', category: 'Electrical', qty: 45, unit: 'Pieces', status: 'Low Stock', warehouse: 'W1', updated: '2026-07-21' },
        { id: 'MAT-S104', name: 'Claw Hammer 16oz', category: 'Tools', qty: 60, unit: 'Pieces', status: 'Optimal', warehouse: 'W1', updated: '2026-07-18' },
        { id: 'MAT-S105', name: 'PVC Elbow Fitting 1/2"', category: 'Plumbing', qty: 800, unit: 'Pieces', status: 'Overstocked', warehouse: 'W1', updated: '2026-07-15' },
        { id: 'MAT-S106', name: 'Safety Helmet', category: 'Safety', qty: 12, unit: 'Pieces', status: 'Low Stock', warehouse: 'W1', updated: '2026-07-22' },
        { id: 'MAT-S107', name: 'Safety Goggles', category: 'Safety', qty: 0, unit: 'Pieces', status: 'Out of Stock', warehouse: 'W1', updated: '2026-07-22' },
        { id: 'MAT-S108', name: 'Electrical Tape', category: 'Electrical', qty: 500, unit: 'Rolls', status: 'Optimal', warehouse: 'W1', updated: '2026-07-17' },

        // Warehouse 2 - Large Materials
        { id: 'MAT-L201', name: 'Portland Cement Type I', category: 'Masonry', qty: 320, unit: 'Bags', status: 'Optimal', warehouse: 'W2', updated: '2026-07-21' },
        { id: 'MAT-L202', name: 'Steel Rebar 12mm', category: 'Metals', qty: 45, unit: 'Pieces', status: 'Low Stock', warehouse: 'W2', updated: '2026-07-20' },
        { id: 'MAT-L203', name: 'Marine Plywood 3/4"', category: 'Woodwork', qty: 150, unit: 'Sheets', status: 'Optimal', warehouse: 'W2', updated: '2026-07-19' },
        { id: 'MAT-L204', name: 'Roofing Sheet Corrugated', category: 'Roofing', qty: 0, unit: 'Sheets', status: 'Out of Stock', warehouse: 'W2', updated: '2026-07-16' },
        { id: 'MAT-L205', name: 'PVC Pipe 4"', category: 'Plumbing', qty: 900, unit: 'Lengths', status: 'Overstocked', warehouse: 'W2', updated: '2026-07-14' },
        { id: 'MAT-L206', name: 'Concrete Hollow Block 4"', category: 'Masonry', qty: 20, unit: 'Pieces', status: 'Low Stock', warehouse: 'W2', updated: '2026-07-22' },

        // Warehouse 3 - Damaged & Quarantined
        { id: 'MAT-D301', name: 'Water-Damaged Gypsum Board', category: 'Damaged Materials', qty: 12, unit: 'Sheets', status: 'Damaged', warehouse: 'W3', updated: '2026-07-20' },
        { id: 'MAT-D302', name: 'Defective Circuit Breaker', category: 'Defective Materials', qty: 5, unit: 'Pieces', status: 'Defective', warehouse: 'W3', updated: '2026-07-18' },
        { id: 'MAT-D303', name: 'Cracked PVC Pipes', category: 'Materials Awaiting Inspection', qty: 8, unit: 'Lengths', status: 'Awaiting Inspection', warehouse: 'W3', updated: '2026-07-21' },
        { id: 'MAT-D304', name: 'Mismatched Roofing Sheets', category: 'Materials Awaiting Supplier Return', qty: 15, unit: 'Sheets', status: 'Awaiting Return', warehouse: 'W3', updated: '2026-07-17' }
    ];

    let nextIdCounter = { W1: 109, W2: 207, W3: 305 };
    let activityLog = [
        { icon: 'fa-check-circle', type: 'success', title: 'Stock Received', desc: 'Portland Cement Type I replenished at Warehouse 2.', time: 'Yesterday' },
        { icon: 'fa-exchange-alt', type: 'info', title: 'Material Transferred', desc: 'Safety Helmets moved from Warehouse 1 to Site Requisition.', time: '2 days ago' }
    ];

    // ==========================================
    // State
    // ==========================================
    let currentWarehouse = 'W1';
    let currentPage = 1;
    const pageSize = 5;

    // ==========================================
    // Element References
    // ==========================================
    const warehouseCards = document.querySelectorAll('.warehouse-select-card');
    const warehouseBanner = document.getElementById('warehouseBanner');
    const summaryTotalMaterials = document.getElementById('summaryTotalMaterials');
    const summaryTotalQuantity = document.getElementById('summaryTotalQuantity');
    const summaryLowStock = document.getElementById('summaryLowStock');
    const summaryDamaged = document.getElementById('summaryDamaged');
    const tableTitle = document.getElementById('tableTitle');
    const tableBody = document.getElementById('warehouseTableBody');
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');
    const statusFilter = document.getElementById('statusFilter');
    const btnExport = document.getElementById('btnExport');
    const paginationInfo = document.getElementById('paginationInfo');
    const prevPageBtn = document.getElementById('prevPageBtn');
    const nextPageBtn = document.getElementById('nextPageBtn');
    const activityFeed = document.getElementById('activityFeed');

    // ==========================================
    // Helpers
    // ==========================================
    const badgeClassFor = (status) => {
        switch (status) {
            case 'Optimal': return 'badge-success';
            case 'Low Stock': return 'badge-warning';
            case 'Out of Stock': return 'badge-danger';
            case 'Overstocked': return 'badge-info';
            case 'Damaged': return 'badge-danger';
            case 'Defective': return 'badge-danger';
            case 'Awaiting Inspection': return 'badge-warning';
            case 'Awaiting Return': return 'badge-info';
            default: return 'badge-info';
        }
    };

    const todayStr = () => new Date().toISOString().slice(0, 10);

    const logActivity = (icon, type, title, desc) => {
        activityLog.unshift({ icon, type, title, desc, time: 'Just now' });
        activityLog = activityLog.slice(0, 6);
        renderActivityFeed();
    };

    const renderActivityFeed = () => {
        if (!activityFeed) return;
        activityFeed.innerHTML = activityLog.map(a => `
            <div class="feed-item ${a.type}">
                <div class="feed-icon"><i class="fas ${a.icon}"></i></div>
                <div class="feed-body">
                    <div class="feed-title">${a.title}</div>
                    <div class="feed-meta">${a.desc} &mdash; ${a.time}</div>
                </div>
            </div>
        `).join('');
    };

    // ==========================================
    // Warehouse Selection
    // ==========================================
    const selectWarehouse = (code) => {
        currentWarehouse = code;
        currentPage = 1;

        warehouseCards.forEach(card => {
            card.classList.toggle('card-highlight-secondary', card.dataset.warehouse === code);
        });

        const wh = warehouses[code];
        tableTitle.textContent = `${wh.label} Inventory \u2014 ${wh.name}`;

        if (wh.usable) {
            warehouseBanner.style.display = 'none';
        } else {
            warehouseBanner.style.display = 'flex';
        }

        populateCategoryFilter();
        populateStatusFilter();
        renderSummary();
        renderTable();
    };

    // ==========================================
    // Filters
    // ==========================================
    const populateCategoryFilter = () => {
        const cats = [...new Set(inventoryData.filter(i => i.warehouse === currentWarehouse).map(i => i.category))].sort();
        categoryFilter.innerHTML = '<option value="All">All Categories</option>' +
            cats.map(c => `<option value="${c}">${c}</option>`).join('');
    };

    const populateStatusFilter = () => {
        const statuses = [...new Set(inventoryData.filter(i => i.warehouse === currentWarehouse).map(i => i.status))].sort();
        statusFilter.innerHTML = '<option value="All">All Status</option>' +
            statuses.map(s => `<option value="${s}">${s}</option>`).join('');
    };

    // ==========================================
    // Summary
    // ==========================================
    const renderSummary = () => {
        const items = inventoryData.filter(i => i.warehouse === currentWarehouse);
        const totalMaterials = items.length;
        const totalQuantity = items.reduce((sum, i) => sum + i.qty, 0);
        const lowStock = items.filter(i => i.status === 'Low Stock').length;
        const damaged = currentWarehouse === 'W3'
            ? items.length
            : items.filter(i => ['Damaged', 'Defective', 'Awaiting Inspection', 'Awaiting Return'].includes(i.status)).length;

        summaryTotalMaterials.textContent = totalMaterials.toLocaleString();
        summaryTotalQuantity.textContent = totalQuantity.toLocaleString();
        summaryLowStock.textContent = lowStock.toLocaleString();
        summaryDamaged.textContent = damaged.toLocaleString();
    };

    // ==========================================
    // Table Rendering
    // ==========================================
    const getFilteredData = () => {
        const searchTerm = searchInput.value.toLowerCase();
        const filterCategory = categoryFilter.value;
        const filterStatus = statusFilter.value;

        return inventoryData.filter(item => {
            if (item.warehouse !== currentWarehouse) return false;
            const matchesSearch = item.id.toLowerCase().includes(searchTerm) || item.name.toLowerCase().includes(searchTerm);
            const matchesCategory = filterCategory === 'All' || item.category === filterCategory;
            const matchesStatus = filterStatus === 'All' || item.status === filterStatus;
            return matchesSearch && matchesCategory && matchesStatus;
        });
    };

    const renderTable = () => {
        const filteredData = getFilteredData();
        const totalPages = Math.max(1, Math.ceil(filteredData.length / pageSize));
        if (currentPage > totalPages) currentPage = totalPages;

        const start = (currentPage - 1) * pageSize;
        const pageData = filteredData.slice(start, start + pageSize);

        tableBody.innerHTML = '';

        if (pageData.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="8" class="empty-state-row">No inventory records match your criteria.</td></tr>`;
        } else {
            pageData.forEach(item => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td><strong>${item.id}</strong></td>
                    <td>${item.name}</td>
                    <td>${item.category}</td>
                    <td class="font-semibold">${item.qty.toLocaleString()}</td>
                    <td>${item.unit}</td>
                    <td><span class="badge ${badgeClassFor(item.status)}">${item.status}</span></td>
                    <td class="text-muted-sm">${item.updated}</td>
                    <td class="text-right">
                        <button class="action-btn" onclick="viewMaterial('${item.id}')" title="View"><i class="fas fa-eye"></i></button>
                        <button class="action-btn edit" onclick="openUpdateStock('${item.id}')" title="Update Stock"><i class="fas fa-boxes"></i></button>
                        <button class="action-btn edit" onclick="openTransfer('${item.id}')" title="Transfer Material"><i class="fas fa-exchange-alt"></i></button>
                        <button class="action-btn delete" onclick="openRecordDamage('${item.id}')" title="Record Damage"><i class="fas fa-exclamation-triangle"></i></button>
                    </td>
                `;
                tableBody.appendChild(tr);
            });
        }

        const showingStart = filteredData.length === 0 ? 0 : start + 1;
        const showingEnd = Math.min(start + pageSize, filteredData.length);
        paginationInfo.textContent = `Showing ${showingStart}-${showingEnd} of ${filteredData.length} records`;
        prevPageBtn.disabled = currentPage <= 1;
        nextPageBtn.disabled = currentPage >= totalPages;
    };

    // ==========================================
    // View Material
    // ==========================================
    window.viewMaterial = (id) => {
        const item = inventoryData.find(i => i.id === id);
        if (!item) return;
        document.getElementById('viewBody').innerHTML = `
            <div class="sub-form-grid">
                <div><span class="text-muted-sm">Material ID</span><div class="font-semibold">${item.id}</div></div>
                <div><span class="text-muted-sm">Material Name</span><div class="font-semibold">${item.name}</div></div>
                <div><span class="text-muted-sm">Category</span><div class="font-semibold">${item.category}</div></div>
                <div><span class="text-muted-sm">Warehouse</span><div class="font-semibold">${warehouses[item.warehouse].label}</div></div>
                <div><span class="text-muted-sm">Quantity</span><div class="font-semibold">${item.qty.toLocaleString()} ${item.unit}</div></div>
                <div><span class="text-muted-sm">Status</span><div><span class="badge ${badgeClassFor(item.status)}">${item.status}</span></div></div>
                <div><span class="text-muted-sm">Last Updated</span><div class="font-semibold">${item.updated}</div></div>
            </div>
        `;
        document.getElementById('viewModal').classList.add('active');
    };

    // ==========================================
    // Update Stock
    // ==========================================
    let updateStockTargetId = null;

    window.openUpdateStock = (id) => {
        const item = inventoryData.find(i => i.id === id);
        if (!item) return;
        updateStockTargetId = id;
        document.getElementById('updateStockMaterialName').textContent = `${item.name} (${item.id})`;
        document.getElementById('updateStockCurrentQty').textContent = `${item.qty.toLocaleString()} ${item.unit}`;
        document.getElementById('updateStockNewQty').value = item.qty;
        document.getElementById('updateStockReason').value = '';
        document.getElementById('updateStockModal').classList.add('active');
    };

    document.getElementById('updateStockForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const item = inventoryData.find(i => i.id === updateStockTargetId);
        if (!item) return;

        const newQty = parseInt(document.getElementById('updateStockNewQty').value, 10);
        if (isNaN(newQty) || newQty < 0) {
            window.showToast('Invalid Quantity', 'Please enter a valid non-negative quantity.', 'danger');
            return;
        }

        const oldQty = item.qty;
        item.qty = newQty;
        item.updated = todayStr();
        if (newQty === 0) item.status = 'Out of Stock';
        else if (item.status === 'Out of Stock' && newQty > 0) item.status = 'Optimal';

        document.getElementById('updateStockModal').classList.remove('active');
        logActivity('fa-boxes', 'info', 'Stock Updated', `${item.name} adjusted from ${oldQty} to ${newQty} ${item.unit}.`);
        window.showToast('Stock Updated', `${item.name} quantity updated to ${newQty} ${item.unit}.`, 'success');
        renderSummary();
        renderTable();
    });

    // ==========================================
    // Transfer Material
    // ==========================================
    let transferTargetId = null;

    window.openTransfer = (id) => {
        const item = inventoryData.find(i => i.id === id);
        if (!item) return;
        transferTargetId = id;

        document.getElementById('transferMaterialName').value = `${item.name} (${item.id})`;
        document.getElementById('transferCurrentWarehouse').value = `${warehouses[item.warehouse].label} - ${warehouses[item.warehouse].name}`;
        document.getElementById('transferAvailableQty').value = `${item.qty.toLocaleString()} ${item.unit}`;
        document.getElementById('transferQty').value = '';
        document.getElementById('transferQty').max = item.qty;
        document.getElementById('transferReason').value = '';
        document.getElementById('transferRemarks').value = '';

        const destSelect = document.getElementById('transferDestination');
        destSelect.innerHTML = Object.keys(warehouses)
            .filter(code => code !== item.warehouse)
            .map(code => `<option value="${code}">${warehouses[code].label} - ${warehouses[code].name}</option>`)
            .join('');

        document.getElementById('transferModal').classList.add('active');
    };

    document.getElementById('transferForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const item = inventoryData.find(i => i.id === transferTargetId);
        if (!item) return;

        const qty = parseInt(document.getElementById('transferQty').value, 10);
        const destination = document.getElementById('transferDestination').value;
        const reason = document.getElementById('transferReason').value;

        if (isNaN(qty) || qty <= 0) {
            window.showToast('Invalid Quantity', 'Transfer quantity must be greater than zero.', 'danger');
            return;
        }
        if (qty > item.qty) {
            window.showToast('Transfer Exceeds Stock', `Only ${item.qty.toLocaleString()} ${item.unit} available for transfer.`, 'danger');
            return;
        }
        if (!destination || !reason) {
            window.showToast('Missing Information', 'Please complete all required transfer fields.', 'danger');
            return;
        }

        // Populate confirmation summary
        const remarks = document.getElementById('transferRemarks').value.trim();
        document.getElementById('confirmSummary').innerHTML = `
            <div class="sub-form-grid">
                <div><span class="text-muted-sm">Material</span><div class="font-semibold">${item.name}</div></div>
                <div><span class="text-muted-sm">Quantity</span><div class="font-semibold">${qty.toLocaleString()} ${item.unit}</div></div>
                <div><span class="text-muted-sm">From</span><div class="font-semibold">${warehouses[item.warehouse].label}</div></div>
                <div><span class="text-muted-sm">To</span><div class="font-semibold">${warehouses[destination].label}${!warehouses[destination].usable ? ' (Quarantine)' : ''}</div></div>
                <div><span class="text-muted-sm">Reason</span><div class="font-semibold">${reason}</div></div>
                <div><span class="text-muted-sm">Remarks</span><div class="font-semibold">${remarks || '-'}</div></div>
            </div>
        `;
        window.pendingTransfer = { qty, destination, reason, remarks };

        document.getElementById('transferModal').classList.remove('active');
        document.getElementById('transferConfirmModal').classList.add('active');
    });

    document.getElementById('confirmTransferBtn').addEventListener('click', () => {
        const item = inventoryData.find(i => i.id === transferTargetId);
        const pending = window.pendingTransfer;
        if (!item || !pending) return;

        const { qty, destination, reason, remarks } = pending;
        const destWh = warehouses[destination];

        // Deduct from source
        item.qty -= qty;
        item.updated = todayStr();
        if (item.qty === 0) item.status = 'Out of Stock';

        // Add to destination
        const destStatus = destWh.usable ? 'Optimal' : 'Damaged';
        const newId = `MAT-${destination === 'W1' ? 'S' : destination === 'W2' ? 'L' : 'D'}${nextIdCounter[destination]++}`;
        inventoryData.push({
            id: newId,
            name: item.name,
            category: destWh.usable ? item.category : 'Damaged Materials',
            qty: qty,
            unit: item.unit,
            status: destStatus,
            warehouse: destination,
            updated: todayStr()
        });

        document.getElementById('transferConfirmModal').classList.remove('active');
        logActivity('fa-exchange-alt', 'info', 'Material Transferred', `${qty.toLocaleString()} ${item.unit} of ${item.name} moved from ${warehouses[item.warehouse].label} to ${destWh.label}.`);
        window.showToast('Transfer Completed', `${item.name} transferred to ${destWh.label}.`, 'success');
        window.pendingTransfer = null;

        renderSummary();
        renderTable();
    });

    // ==========================================
    // Record Damage
    // ==========================================
    let damageTargetId = null;

    window.openRecordDamage = (id) => {
        const item = inventoryData.find(i => i.id === id);
        if (!item) return;
        if (item.warehouse === 'W3') {
            window.showToast('Already Quarantined', 'This material is already in Warehouse 3.', 'info');
            return;
        }
        damageTargetId = id;
        document.getElementById('damageMaterialName').textContent = `${item.name} (${item.id})`;
        document.getElementById('damageAvailableQty').textContent = `${item.qty.toLocaleString()} ${item.unit}`;
        document.getElementById('damageQty').value = '';
        document.getElementById('damageQty').max = item.qty;
        document.getElementById('damageReason').value = '';
        document.getElementById('damageRemarks').value = '';
        document.getElementById('damageModal').classList.add('active');
    };

    document.getElementById('damageForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const item = inventoryData.find(i => i.id === damageTargetId);
        if (!item) return;

        const qty = parseInt(document.getElementById('damageQty').value, 10);
        const reason = document.getElementById('damageReason').value;

        if (isNaN(qty) || qty <= 0) {
            window.showToast('Invalid Quantity', 'Damage quantity must be greater than zero.', 'danger');
            return;
        }
        if (qty > item.qty) {
            window.showToast('Quantity Exceeds Stock', `Only ${item.qty.toLocaleString()} ${item.unit} available.`, 'danger');
            return;
        }
        if (!reason) {
            window.showToast('Missing Information', 'Please select a reason.', 'danger');
            return;
        }

        item.qty -= qty;
        item.updated = todayStr();
        if (item.qty === 0) item.status = 'Out of Stock';

        const newId = `MAT-D${nextIdCounter.W3++}`;
        inventoryData.push({
            id: newId,
            name: item.name,
            category: 'Damaged Materials',
            qty: qty,
            unit: item.unit,
            status: 'Damaged',
            warehouse: 'W3',
            updated: todayStr()
        });

        document.getElementById('damageModal').classList.remove('active');
        logActivity('fa-heart-broken', 'danger', 'Damage Recorded', `${qty.toLocaleString()} ${item.unit} of ${item.name} marked as damaged and quarantined.`);
        window.showToast('Damage Recorded', `${item.name} moved to Warehouse 3 (Quarantine).`, 'danger');

        renderSummary();
        renderTable();
    });

    // ==========================================
    // Toolbar & Pagination Events
    // ==========================================
    searchInput.addEventListener('input', () => { currentPage = 1; renderTable(); });
    categoryFilter.addEventListener('change', () => { currentPage = 1; renderTable(); });
    statusFilter.addEventListener('change', () => { currentPage = 1; renderTable(); });

    btnExport.addEventListener('click', () => {
        if (window.showToast) window.showToast('Export Triggered', `Generating ${warehouses[currentWarehouse].label} report in CSV format...`, 'primary');
    });

    prevPageBtn.addEventListener('click', () => {
        if (currentPage > 1) { currentPage--; renderTable(); }
    });

    nextPageBtn.addEventListener('click', () => {
        const totalPages = Math.max(1, Math.ceil(getFilteredData().length / pageSize));
        if (currentPage < totalPages) { currentPage++; renderTable(); }
    });

    // ==========================================
    // Warehouse Card Click Binding
    // ==========================================
    warehouseCards.forEach(card => {
        card.addEventListener('click', () => selectWarehouse(card.dataset.warehouse));
    });

    // ==========================================
    // Initial Render
    // ==========================================
    renderActivityFeed();
    selectWarehouse('W1');
});
