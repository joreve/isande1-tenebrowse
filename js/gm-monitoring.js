/**
 * Tenebrowse - General Manager Monitoring
 * Read-only Purchase Orders and Inventory Overview in one tabbed page.
 */

document.addEventListener('DOMContentLoaded', () => {
    const purchaseOrders = [
        {
            poNumber: 'PO-2026-770', poStatus: 'Partially Delivered', orderedQty: 1000, unit: 'pcs', material: 'Plumbing & Structural Piping Supply Set', requestId: 'REQ-2026-1052',
            deliveryReceipts: [
                {
                    batchNumber: 'Batch #1', deliveryRefNumber: 'DEL-3298', receiptNumber: 'DR-770-01', supplier: 'Global Logistics Foundry', deliveryDate: 'Jul 23, 2026', warehouse: 'Warehouse 1', drStatus: 'Verified with Discrepancy', remarks: 'Shortage and minor PVC damage recorded during inspection.',
                    materials: [
                        { materialId: 'MAT-101', description: '12-inch PVC Pipe Class 1000', unit: 'piece', unitPrice: 250, expectedQty: 200, acceptedQty: 194 },
                        { materialId: 'MAT-102', description: '50kg Portland Cement Bag Type I', unit: 'bag', unitPrice: 280, expectedQty: 100, acceptedQty: 95 },
                        { materialId: 'MAT-103', description: 'Steel Reinforcement Bar 16mm x 6m', unit: 'rod', unitPrice: 420, expectedQty: 200, acceptedQty: 200 }
                    ]
                },
                {
                    batchNumber: 'Batch #2', deliveryRefNumber: 'DEL-3305', receiptNumber: 'DR-770-02', supplier: 'Timberland Suppliers', deliveryDate: 'Jul 24, 2026', warehouse: 'Warehouse 1', drStatus: 'Arrived', remarks: 'Arrived at loading dock and awaiting verification.',
                    materials: [
                        { materialId: 'MAT-101', description: '12-inch PVC Pipe Class 1000', unit: 'piece', unitPrice: 250, expectedQty: 150, acceptedQty: 0 },
                        { materialId: 'MAT-104', description: 'Galvanized Iron Elbow 1/2 inch', unit: 'piece', unitPrice: 45, expectedQty: 150, acceptedQty: 0 }
                    ]
                },
                {
                    batchNumber: 'Batch #3', deliveryRefNumber: 'DEL-3312', receiptNumber: 'DR-770-03', supplier: 'Global Logistics Foundry', deliveryDate: 'Jul 25, 2026 (Expected)', warehouse: 'Warehouse 1', drStatus: 'Expected', remarks: 'Final structural steel batch scheduled for delivery.',
                    materials: [
                        { materialId: 'MAT-103', description: 'Steel Reinforcement Bar 16mm x 6m', unit: 'rod', unitPrice: 420, expectedQty: 200, acceptedQty: 0 }
                    ]
                }
            ]
        },
        {
            poNumber: 'PO-2026-782', poStatus: 'Ordered', orderedQty: 300, unit: 'units', material: 'Marine Plywood & Structural Timber Set', requestId: 'REQ-2026-1048',
            deliveryReceipts: [
                {
                    batchNumber: 'Batch #1', deliveryRefNumber: 'DEL-3301', receiptNumber: 'DR-782-01', supplier: 'Timberland Suppliers', deliveryDate: 'Jul 24, 2026 (Expected)', warehouse: 'Warehouse 2', drStatus: 'Expected', remarks: 'Full timber and plywood set expected in one batch.',
                    materials: [
                        { materialId: 'MAT-201', description: 'Marine Plywood 3/4" x 4x8', unit: 'sheet', unitPrice: 1450, expectedQty: 200, acceptedQty: 0 },
                        { materialId: 'MAT-202', description: 'Rough Sawn Lumber 2x4x10', unit: 'piece', unitPrice: 380, expectedQty: 100, acceptedQty: 0 }
                    ]
                }
            ]
        },
        {
            poNumber: 'PO-2026-750', poStatus: 'Partially Delivered', orderedQty: 400, unit: 'units', material: 'Portland Cement & Waterproofing Additives', requestId: 'REQ-2026-1041',
            deliveryReceipts: [
                {
                    batchNumber: 'Batch #1', deliveryRefNumber: 'DEL-3285', receiptNumber: 'DR-750-01', supplier: 'Prime Cement Corp', deliveryDate: 'Jul 18, 2026', warehouse: 'Warehouse 2', drStatus: 'Verified', remarks: 'First batch verified intact.',
                    materials: [
                        { materialId: 'MAT-102', description: '50kg Portland Cement Bag Type I', unit: 'bag', unitPrice: 280, expectedQty: 300, acceptedQty: 300 },
                        { materialId: 'MAT-301', description: 'Liquid Waterproofing Compound 4L', unit: 'gallon', unitPrice: 650, expectedQty: 50, acceptedQty: 50 }
                    ]
                },
                {
                    batchNumber: 'Batch #2', deliveryRefNumber: 'DEL-3290', receiptNumber: 'DR-750-02', supplier: 'Prime Cement Corp', deliveryDate: 'Jul 22, 2026 (Expected)', warehouse: 'Warehouse 2', drStatus: 'Expected', remarks: 'Remaining balance scheduled for delivery.',
                    materials: [
                        { materialId: 'MAT-102', description: '50kg Portland Cement Bag Type I', unit: 'bag', unitPrice: 280, expectedQty: 50, acceptedQty: 0 }
                    ]
                }
            ]
        },
        {
            poNumber: 'PO-2026-745', poStatus: 'Completed', orderedQty: 200, unit: 'rolls', material: 'Electrical Rough-In Supply', requestId: 'REQ-2026-1039',
            deliveryReceipts: [
                {
                    batchNumber: 'Batch #1', deliveryRefNumber: 'DEL-3260', receiptNumber: 'DR-745-01', supplier: 'Electra Wire Solutions', deliveryDate: 'Jul 02, 2026', warehouse: 'Warehouse 1', drStatus: 'Verified', remarks: 'Complete quantity received and verified in good condition.',
                    materials: [
                        { materialId: 'MAT-410', description: 'THHN Copper Wire 3.5mm', unit: 'roll', unitPrice: 3200, expectedQty: 120, acceptedQty: 120 },
                        { materialId: 'MAT-411', description: 'THHN Copper Wire 5.5mm', unit: 'roll', unitPrice: 4800, expectedQty: 80, acceptedQty: 80 }
                    ]
                }
            ]
        },
        {
            poNumber: 'PO-2026-730', poStatus: 'Closed with Outstanding Quantity', orderedQty: 500, unit: 'pieces', material: 'Finishing Materials Set', requestId: 'REQ-2026-1028',
            deliveryReceipts: [
                {
                    batchNumber: 'Batch #1', deliveryRefNumber: 'DEL-3244', receiptNumber: 'DR-730-01', supplier: 'Metro Build Supply', deliveryDate: 'Jun 25, 2026', warehouse: 'Warehouse 2', drStatus: 'Verified with Discrepancy', remarks: 'Supplier closed the order with an outstanding quantity after final reconciliation.',
                    materials: [
                        { materialId: 'MAT-501', description: 'Ceramic Tiles 60x60', unit: 'piece', unitPrice: 210, expectedQty: 500, acceptedQty: 420 }
                    ]
                }
            ]
        }
    ];

    const inventory = [
        { id: 'MAT-S101', name: 'Wood Screws 1.5"', category: 'Hardware', qty: 5000, unit: 'Pieces', warehouse: 'Warehouse 1', min: 1000, status: 'In Stock', lastUpdated: '2026-07-20' },
        { id: 'MAT-S102', name: 'Common Nails 3"', category: 'Hardware', qty: 3200, unit: 'Pieces', warehouse: 'Warehouse 1', min: 500, status: 'In Stock', lastUpdated: '2026-07-19' },
        { id: 'MAT-S103', name: 'Circuit Breaker 20A', category: 'Electrical', qty: 45, unit: 'Pieces', warehouse: 'Warehouse 1', min: 100, status: 'Low Stock', lastUpdated: '2026-07-21' },
        { id: 'MAT-S104', name: 'Electrical Wire THHN 3.5mm', category: 'Electrical', qty: 210, unit: 'Rolls', warehouse: 'Warehouse 1', min: 250, status: 'Low Stock', lastUpdated: '2026-07-21' },
        { id: 'MAT-S105', name: 'PVC Elbow Fitting 1/2"', category: 'Plumbing', qty: 800, unit: 'Pieces', warehouse: 'Warehouse 1', min: 200, status: 'Overstocked', lastUpdated: '2026-07-15' },
        { id: 'MAT-S106', name: 'Structural Bolts M16', category: 'Structural', qty: 15, unit: 'Boxes', warehouse: 'Warehouse 1', min: 40, status: 'Low Stock', lastUpdated: '2026-07-22' },
        { id: 'MAT-L201', name: 'Portland Cement (Type I)', category: 'Structural', qty: 1240, unit: 'Bags (40kg)', warehouse: 'Warehouse 2', min: 500, status: 'In Stock', lastUpdated: '2026-07-20' },
        { id: 'MAT-L202', name: 'Steel Reinforcement Bar 12mm', category: 'Structural', qty: 85, unit: 'Pieces', warehouse: 'Warehouse 2', min: 300, status: 'Low Stock', lastUpdated: '2026-07-21' },
        { id: 'MAT-L203', name: 'Marine Plywood 3/4"', category: 'Finishing', qty: 0, unit: 'Sheets', warehouse: 'Warehouse 2', min: 50, status: 'Out of Stock', lastUpdated: '2026-07-19' },
        { id: 'MAT-L204', name: 'PVC Pipe 4-inch', category: 'Plumbing', qty: 620, unit: 'Lengths', warehouse: 'Warehouse 2', min: 100, status: 'Overstocked', lastUpdated: '2026-07-22' },
        { id: 'MAT-L205', name: 'Concrete Hollow Blocks 6"', category: 'Structural', qty: 3400, unit: 'Pieces', warehouse: 'Warehouse 2', min: 1000, status: 'In Stock', lastUpdated: '2026-07-18' },
        { id: 'MAT-L206', name: 'Roofing Sheets (Corrugated)', category: 'Finishing', qty: 480, unit: 'Sheets', warehouse: 'Warehouse 2', min: 150, status: 'In Stock', lastUpdated: '2026-07-17' },
        { id: 'MAT-D301', name: 'Water-Damaged Gypsum Board', category: 'Finishing', qty: 12, unit: 'Sheets', warehouse: 'Warehouse 3', min: 0, status: 'Damaged', lastUpdated: '2026-07-20' },
        { id: 'MAT-D302', name: 'Defective Circuit Breaker', category: 'Electrical', qty: 5, unit: 'Pieces', warehouse: 'Warehouse 3', min: 0, status: 'Damaged', lastUpdated: '2026-07-18' },
        { id: 'MAT-D303', name: 'Cracked PVC Pipes 4"', category: 'Plumbing', qty: 8, unit: 'Lengths', warehouse: 'Warehouse 3', min: 0, status: 'Damaged', lastUpdated: '2026-07-21' }
    ];

    const escapeHtml = (value) => String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');

    const formatPeso = (value) => '₱' + Number(value || 0).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const showToast = (title, message, type = 'primary') => { if (typeof window.showToast === 'function') window.showToast(title, message, type); };
    const openModal = (id) => { if (typeof window.openModal === 'function') window.openModal(id); };

    const tabButtons = document.querySelectorAll('.tabs-nav .tab-btn[data-tab]');
    const tabPanels = document.querySelectorAll('.tab-content[data-tab-content]');
    const activateTab = (name) => {
        tabButtons.forEach((button) => {
            const active = button.dataset.tab === name;
            button.classList.toggle('active', active);
            button.setAttribute('aria-selected', String(active));
        });
        tabPanels.forEach((panel) => panel.classList.toggle('active', panel.dataset.tabContent === name));
    };
    tabButtons.forEach((button) => button.addEventListener('click', () => activateTab(button.dataset.tab)));
    const requestedTab = new URLSearchParams(window.location.search).get('tab');
    if (requestedTab === 'inventory') activateTab('inventory-overview');

    const poBadgeClass = (status) => {
        if (status === 'Completed') return 'badge-success';
        if (status === 'Partially Delivered') return 'badge-warning';
        if (status === 'Closed with Outstanding Quantity') return 'badge-danger';
        return 'badge-info';
    };
    const receiptBadgeClass = (status) => {
        if (status === 'Verified') return 'badge-success';
        if (status === 'Verified with Discrepancy' || status === 'Return Required') return 'badge-danger';
        if (status === 'Arrived') return 'badge-warning';
        return 'badge-info';
    };
    const inventoryBadgeClass = (status) => {
        if (status === 'In Stock') return 'badge-success';
        if (status === 'Low Stock') return 'badge-warning';
        if (status === 'Out of Stock' || status === 'Damaged') return 'badge-danger';
        return 'badge-info';
    };

    const acceptedQty = (po) => po.deliveryReceipts.reduce((sum, receipt) => sum + receipt.materials.reduce((sub, item) => sub + Number(item.acceptedQty || 0), 0), 0);
    const suppliersForPo = (po) => [...new Set(po.deliveryReceipts.map((receipt) => receipt.supplier))];

    // ---------------------------------------------------------------------
    // Purchase Orders
    // ---------------------------------------------------------------------
    const poBody = document.getElementById('gmPurchaseOrdersBody');
    const poSearch = document.getElementById('poSearchInput');
    const poStatus = document.getElementById('poStatusFilter');
    const poSupplier = document.getElementById('poSupplierFilter');

    const supplierList = [...new Set(purchaseOrders.flatMap(suppliersForPo))].sort();
    poSupplier.innerHTML += supplierList.map((supplier) => `<option value="${escapeHtml(supplier)}">${escapeHtml(supplier)}</option>`).join('');

    const updatePoSummary = () => {
        const completed = purchaseOrders.filter((po) => po.poStatus === 'Completed').length;
        const orderedTotal = purchaseOrders.reduce((sum, po) => sum + po.orderedQty, 0);
        const remainingTotal = purchaseOrders.reduce((sum, po) => sum + Math.max(0, po.orderedQty - acceptedQty(po)), 0);
        document.getElementById('poOpenCount').textContent = String(purchaseOrders.length - completed);
        document.getElementById('poCompletedCount').textContent = String(completed);
        document.getElementById('poOrderedQuantity').textContent = orderedTotal.toLocaleString();
        document.getElementById('poRemainingQuantity').textContent = remainingTotal.toLocaleString();
    };

    const renderPurchaseOrders = () => {
        const term = poSearch.value.trim().toLowerCase();
        const rows = purchaseOrders.filter((po) => {
            const suppliers = suppliersForPo(po);
            const matchesSearch = po.poNumber.toLowerCase().includes(term) || suppliers.join(' ').toLowerCase().includes(term) || po.requestId.toLowerCase().includes(term);
            const matchesStatus = poStatus.value === 'All' || po.poStatus === poStatus.value;
            const matchesSupplier = poSupplier.value === 'All' || suppliers.includes(poSupplier.value);
            return matchesSearch && matchesStatus && matchesSupplier;
        });

        if (!rows.length) {
            poBody.innerHTML = '<tr><td colspan="8" class="empty-state-row">No purchase orders match your criteria.</td></tr>';
            return;
        }

        poBody.innerHTML = rows.map((po) => {
            const accepted = acceptedQty(po);
            const remaining = Math.max(0, po.orderedQty - accepted);
            const progress = po.orderedQty ? Math.min(100, Math.round((accepted / po.orderedQty) * 100)) : 0;
            return `
                <tr>
                    <td><strong>${escapeHtml(po.poNumber)}</strong></td>
                    <td>${suppliersForPo(po).length}</td>
                    <td>${Number(po.orderedQty).toLocaleString()} ${escapeHtml(po.unit)}</td>
                    <td>${Number(accepted).toLocaleString()} ${escapeHtml(po.unit)}</td>
                    <td>${Number(remaining).toLocaleString()} ${escapeHtml(po.unit)}</td>
                    <td>
                        <div class="po-table-progress-bar">
                            <div class="po-table-progress-track"><div class="po-table-progress-fill" style="width:${progress}%"></div></div>
                            <span class="po-table-progress-text">${progress}%</span>
                        </div>
                    </td>
                    <td><span class="badge ${poBadgeClass(po.poStatus)}">${escapeHtml(po.poStatus)}</span></td>
                    <td class="text-center"><button type="button" class="gm-view-action" data-po-view="${escapeHtml(po.poNumber)}" aria-label="View ${escapeHtml(po.poNumber)} details" title="View details"><i class="fas fa-eye"></i></button></td>
                </tr>`;
        }).join('');
    };

    const showPoDetails = (poNumber) => {
        const po = purchaseOrders.find((item) => item.poNumber === poNumber);
        if (!po) return;
        const accepted = acceptedQty(po);
        const remaining = Math.max(0, po.orderedQty - accepted);
        const progress = po.orderedQty ? Math.min(100, Math.round((accepted / po.orderedQty) * 100)) : 0;
        const suppliers = suppliersForPo(po);
        const allMaterials = po.deliveryReceipts.flatMap((receipt) => receipt.materials.map((material) => ({ ...material, batch: receipt.batchNumber, status: receipt.drStatus })));
        const estimatedValue = allMaterials.reduce((sum, material) => sum + Number(material.expectedQty || 0) * Number(material.unitPrice || 0), 0);

        const receiptRows = po.deliveryReceipts.map((receipt) => `
            <tr>
                <td class="font-semibold">${escapeHtml(receipt.batchNumber)}</td>
                <td>${escapeHtml(receipt.deliveryRefNumber)}</td>
                <td>${escapeHtml(receipt.receiptNumber)}</td>
                <td>${escapeHtml(receipt.supplier)}</td>
                <td>${escapeHtml(receipt.deliveryDate)}</td>
                <td>${escapeHtml(receipt.warehouse)}</td>
                <td><span class="badge ${receiptBadgeClass(receipt.drStatus)}">${escapeHtml(receipt.drStatus)}</span></td>
                <td>${escapeHtml(receipt.remarks || '—')}</td>
            </tr>`).join('');

        const materialRows = allMaterials.map((material) => `
            <tr>
                <td>${escapeHtml(material.batch)}</td>
                <td class="font-semibold">${escapeHtml(material.materialId)}</td>
                <td>${escapeHtml(material.description)}</td>
                <td class="text-right">${Number(material.expectedQty).toLocaleString()}</td>
                <td>${escapeHtml(material.unit)}</td>
                <td class="text-right">${formatPeso(material.unitPrice)}</td>
                <td class="text-right">${formatPeso(Number(material.expectedQty) * Number(material.unitPrice))}</td>
                <td><span class="badge ${receiptBadgeClass(material.status)}">${escapeHtml(material.status)}</span></td>
            </tr>`).join('');

        document.getElementById('gmPoDetailsBody').innerHTML = `
            <div class="po-progress-card mb-3">
                <div class="po-progress-header">
                    <span class="po-progress-title"><i class="fas fa-box-open icon-primary"></i> ${escapeHtml(po.poNumber)} — ${escapeHtml(po.material)}</span>
                    <span class="badge ${poBadgeClass(po.poStatus)}">${escapeHtml(po.poStatus)}</span>
                </div>
                <div class="po-progress-stats">
                    <div class="po-stat-box"><div class="po-stat-label">Ordered Quantity</div><div class="po-stat-value">${Number(po.orderedQty).toLocaleString()} ${escapeHtml(po.unit)}</div></div>
                    <div class="po-stat-box"><div class="po-stat-label">Accepted Quantity</div><div class="po-stat-value text-success">${Number(accepted).toLocaleString()} ${escapeHtml(po.unit)}</div></div>
                    <div class="po-stat-box"><div class="po-stat-label">Remaining Quantity</div><div class="po-stat-value">${Number(remaining).toLocaleString()} ${escapeHtml(po.unit)}</div></div>
                </div>
                <div class="po-progress-bar-wrapper"><div class="po-progress-track"><div class="po-progress-fill" style="width:${progress}%"></div></div><span class="po-progress-percentage">${progress}%</span></div>
            </div>
            <div class="grid grid-cols-3 mb-3">
                <div class="po-detail-card"><span>Related Material Request</span><strong>${escapeHtml(po.requestId)}</strong></div>
                <div class="po-detail-card"><span>Supplier${suppliers.length === 1 ? '' : 's'}</span><strong>${escapeHtml(suppliers.join(', '))}</strong></div>
                <div class="po-detail-card"><span>Estimated PO Value</span><strong>${formatPeso(estimatedValue)}</strong></div>
            </div>
            <div class="section-title mb-2"><i class="fas fa-history icon-primary"></i> Delivery Receipt History</div>
            <div class="table-wrapper mb-3"><table class="table gm-po-receipt-table"><thead><tr><th>Batch #</th><th>Delivery Ref</th><th>Receipt Number</th><th>Supplier</th><th>Delivery Date</th><th>Warehouse</th><th>Receipt Status</th><th>Remarks</th></tr></thead><tbody>${receiptRows}</tbody></table></div>
            <div class="section-title mb-2"><i class="fas fa-tags icon-secondary"></i> Material Pricing per Delivery</div>
            <div class="table-wrapper"><table class="table gm-po-pricing-table"><thead><tr><th>Batch</th><th>Material ID</th><th>Material</th><th class="text-right">Expected Qty</th><th>Unit</th><th class="text-right">Unit Price</th><th class="text-right">Estimated Value</th><th>Status</th></tr></thead><tbody>${materialRows}</tbody></table></div>`;
        openModal('gmPoDetailsModal');
    };

    poBody.addEventListener('click', (event) => {
        const button = event.target.closest('[data-po-view]');
        if (button) showPoDetails(button.dataset.poView);
    });
    poSearch.addEventListener('input', renderPurchaseOrders);
    poStatus.addEventListener('change', renderPurchaseOrders);
    poSupplier.addEventListener('change', renderPurchaseOrders);
    document.getElementById('poExportBtn').addEventListener('click', () => showToast('Export Started', 'Generating the General Manager purchase order report...', 'primary'));

    // ---------------------------------------------------------------------
    // Inventory Overview
    // ---------------------------------------------------------------------
    const inventoryBody = document.getElementById('gmInventoryBody');
    const inventorySearch = document.getElementById('inventorySearchInput');
    const inventoryCategory = document.getElementById('inventoryCategoryFilter');
    const inventoryWarehouse = document.getElementById('inventoryWarehouseFilter');
    const inventoryStatus = document.getElementById('inventoryStatusFilter');

    const updateInventorySummary = () => {
        document.getElementById('inventoryTotalCount').textContent = String(inventory.length);
        document.getElementById('inventoryAvailableCount').textContent = String(inventory.filter((item) => item.status === 'In Stock' || item.status === 'Overstocked').length);
        document.getElementById('inventoryLowCount').textContent = String(inventory.filter((item) => item.status === 'Low Stock').length);
        document.getElementById('inventoryOutCount').textContent = String(inventory.filter((item) => item.status === 'Out of Stock').length);
    };

    const renderInventory = () => {
        const term = inventorySearch.value.trim().toLowerCase();
        const rows = inventory.filter((item) => {
            const matchesSearch = item.id.toLowerCase().includes(term) || item.name.toLowerCase().includes(term);
            const matchesCategory = inventoryCategory.value === 'All' || item.category === inventoryCategory.value;
            const matchesWarehouse = inventoryWarehouse.value === 'All' || item.warehouse === inventoryWarehouse.value;
            const matchesStatus = inventoryStatus.value === 'All' || item.status === inventoryStatus.value;
            return matchesSearch && matchesCategory && matchesWarehouse && matchesStatus;
        });

        document.getElementById('inventoryWarehouseBadge').textContent = inventoryWarehouse.value === 'All' ? 'All Warehouses' : inventoryWarehouse.value;
        if (!rows.length) {
            inventoryBody.innerHTML = '<tr><td colspan="9" class="empty-state-row">No inventory records match your criteria.</td></tr>';
            return;
        }
        inventoryBody.innerHTML = rows.map((item) => `
            <tr>
                <td><strong>${escapeHtml(item.id)}</strong></td>
                <td>${escapeHtml(item.name)}</td>
                <td>${escapeHtml(item.category)}</td>
                <td class="font-semibold">${Number(item.qty).toLocaleString()}</td>
                <td>${escapeHtml(item.unit)}</td>
                <td>${escapeHtml(item.warehouse)}</td>
                <td>${Number(item.min).toLocaleString()}</td>
                <td><span class="badge ${inventoryBadgeClass(item.status)}">${escapeHtml(item.status)}</span></td>
                <td>${escapeHtml(item.lastUpdated)}</td>
            </tr>`).join('');
    };

    inventorySearch.addEventListener('input', renderInventory);
    inventoryCategory.addEventListener('change', renderInventory);
    inventoryWarehouse.addEventListener('change', renderInventory);
    inventoryStatus.addEventListener('change', renderInventory);
    document.getElementById('inventoryExportBtn').addEventListener('click', () => showToast('Export Started', 'Generating the General Manager inventory overview report...', 'primary'));

    updatePoSummary();
    renderPurchaseOrders();
    updateInventorySummary();
    renderInventory();
});
