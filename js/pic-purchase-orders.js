/**
 * Tenebrowse - Project-in-Charge Purchase Orders
 * Read-only purchase order visibility for Project-in-Charge users.
 * Shared navigation, modals, and toasts live in app.js.
 */

document.addEventListener('DOMContentLoaded', () => {
    const poData = [
        {
            id: 'PO-2026-770',
            requestId: 'REQ-2026-904',
            material: 'Plumbing & Structural Piping Supply Set',
            dateOrdered: 'Jul 10, 2026',
            expDelivery: 'Jul 25, 2026',
            status: 'Partially Delivered',
            remarks: 'Initial delivery batches received; remaining structural items are still in transit.',
            orderedQty: 1000,
            unit: 'pcs',
            items: [
                { materialId: 'MAT-101', material: '12-inch PVC Pipe Class 1000', category: 'Plumbing', qty: 350, unit: 'Pieces' },
                { materialId: 'MAT-102', material: '50kg Portland Cement Bag Type I', category: 'Masonry', qty: 100, unit: 'Bags' },
                { materialId: 'MAT-103', material: 'Steel Reinforcement Bar 16mm x 6m', category: 'Metals', qty: 400, unit: 'Rods' },
                { materialId: 'MAT-104', material: 'Galvanized Iron Elbow 1/2 inch', category: 'Plumbing', qty: 150, unit: 'Pieces' }
            ],
            deliveryReceipts: [
                {
                    batchNumber: 'Batch #1', deliveryRefNumber: 'DEL-3298', receiptNumber: 'DR-770-01',
                    supplier: 'Global Logistics Foundry', deliveryDate: 'Jul 23, 2026', warehouse: 'Warehouse 1',
                    drStatus: 'Verified with Discrepancy', acceptedQty: 489,
                    remarks: 'Shortage and minor PVC damage recorded during inspection.'
                },
                {
                    batchNumber: 'Batch #2', deliveryRefNumber: 'DEL-3305', receiptNumber: 'DR-770-02',
                    supplier: 'Timberland Suppliers', deliveryDate: 'Jul 24, 2026', warehouse: 'Warehouse 1',
                    drStatus: 'Arrived', acceptedQty: 0,
                    remarks: 'Arrived at loading dock and awaiting warehouse verification.'
                },
                {
                    batchNumber: 'Batch #3', deliveryRefNumber: 'DEL-3312', receiptNumber: 'DR-770-03',
                    supplier: 'Global Logistics Foundry', deliveryDate: 'Jul 25, 2026 (Expected)', warehouse: 'Warehouse 1',
                    drStatus: 'Expected', acceptedQty: 0,
                    remarks: 'Final structural steel batch scheduled for delivery.'
                }
            ]
        },
        {
            id: 'PO-2026-768',
            requestId: 'REQ-2026-899',
            material: 'Structural Reinforcement Supply',
            dateOrdered: 'Jul 08, 2026',
            expDelivery: 'Jul 14, 2026',
            status: 'Ordered',
            remarks: 'Supplier confirmed order; dispatch schedule is being finalized.',
            orderedQty: 320,
            unit: 'Pieces',
            items: [
                { materialId: 'MAT-205', material: 'Deformed Rebar 20mm x 6m', category: 'Metals', qty: 320, unit: 'Pieces' }
            ],
            deliveryReceipts: [
                {
                    batchNumber: 'Batch #1', deliveryRefNumber: 'DEL-3288', receiptNumber: 'DR-768-01',
                    supplier: 'Metro Steelwork', deliveryDate: 'Jul 14, 2026 (Expected)', warehouse: 'Warehouse 2',
                    drStatus: 'Expected', acceptedQty: 0,
                    remarks: 'Full order expected in one delivery batch.'
                }
            ]
        },
        {
            id: 'PO-2026-750',
            requestId: 'REQ-2026-875',
            material: 'Portland Cement & Waterproofing Additives',
            dateOrdered: 'Jul 01, 2026',
            expDelivery: 'Jul 22, 2026',
            status: 'Partially Delivered',
            remarks: 'First batch verified; remaining cement quantity is scheduled for a follow-up delivery.',
            orderedQty: 400,
            unit: 'Bags',
            items: [
                { materialId: 'MAT-102', material: '50kg Portland Cement Bag Type I', category: 'Masonry', qty: 350, unit: 'Bags' },
                { materialId: 'MAT-301', material: 'Liquid Waterproofing Compound 4L', category: 'Masonry', qty: 50, unit: 'Gallons' }
            ],
            deliveryReceipts: [
                {
                    batchNumber: 'Batch #1', deliveryRefNumber: 'DEL-3285', receiptNumber: 'DR-750-01',
                    supplier: 'Prime Cement Corp', deliveryDate: 'Jul 18, 2026', warehouse: 'Warehouse 2',
                    drStatus: 'Verified', acceptedQty: 350,
                    remarks: 'First batch verified intact and transferred to storage.'
                },
                {
                    batchNumber: 'Batch #2', deliveryRefNumber: 'DEL-3290', receiptNumber: 'DR-750-02',
                    supplier: 'Prime Cement Corp', deliveryDate: 'Jul 22, 2026 (Expected)', warehouse: 'Warehouse 2',
                    drStatus: 'Expected', acceptedQty: 0,
                    remarks: 'Remaining balance scheduled for delivery.'
                }
            ]
        },
        {
            id: 'PO-2026-745',
            requestId: 'REQ-2026-861',
            material: 'Electrical Rough-In Supply',
            dateOrdered: 'Jun 28, 2026',
            expDelivery: 'Jul 02, 2026',
            status: 'Completed',
            remarks: 'All ordered electrical materials were received and verified.',
            orderedQty: 200,
            unit: 'Rolls',
            items: [
                { materialId: 'MAT-410', material: 'THHN Copper Wire 3.5mm', category: 'Electrical', qty: 120, unit: 'Rolls' },
                { materialId: 'MAT-411', material: 'THHN Copper Wire 5.5mm', category: 'Electrical', qty: 80, unit: 'Rolls' }
            ],
            deliveryReceipts: [
                {
                    batchNumber: 'Batch #1', deliveryRefNumber: 'DEL-3260', receiptNumber: 'DR-745-01',
                    supplier: 'Electra Wire Solutions', deliveryDate: 'Jul 02, 2026', warehouse: 'Warehouse 1',
                    drStatus: 'Verified', acceptedQty: 200,
                    remarks: 'Complete quantity received and verified in good condition.'
                }
            ]
        },
        {
            id: 'PO-2026-782',
            requestId: 'REQ-2026-917',
            material: 'Marine Plywood & Structural Timber Set',
            dateOrdered: 'Jul 12, 2026',
            expDelivery: 'Jul 24, 2026',
            status: 'Ordered',
            remarks: 'Supplier confirmation received; batch is scheduled for warehouse delivery.',
            orderedQty: 300,
            unit: 'Sheets / Pieces',
            items: [
                { materialId: 'MAT-201', material: 'Marine Plywood 3/4" x 4x8', category: 'Woodwork', qty: 200, unit: 'Sheets' },
                { materialId: 'MAT-202', material: 'Rough Sawn Lumber 2x4x10', category: 'Woodwork', qty: 100, unit: 'Pieces' }
            ],
            deliveryReceipts: [
                {
                    batchNumber: 'Batch #1', deliveryRefNumber: 'DEL-3301', receiptNumber: 'DR-782-01',
                    supplier: 'Timberland Suppliers', deliveryDate: 'Jul 24, 2026 (Expected)', warehouse: 'Warehouse 2',
                    drStatus: 'Expected', acceptedQty: 0,
                    remarks: 'Full timber and plywood set expected in one batch.'
                }
            ]
        }
    ];

    const tableBody = document.getElementById('poTableBody');
    const searchInput = document.getElementById('searchInput');
    const statusFilter = document.getElementById('statusFilter');
    const btnExport = document.getElementById('btnExport');
    const poDetailsBody = document.getElementById('poDetailsBody');

    const escapeHtml = (value) => String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');

    const badgeClassForPo = (status) => {
        if (status === 'Completed') return 'badge-success';
        if (status === 'Partially Delivered') return 'badge-warning';
        if (status === 'Closed with Outstanding Quantity') return 'badge-danger';
        return 'badge-info';
    };

    const badgeClassForReceipt = (status) => {
        if (status === 'Verified') return 'badge-success';
        if (status === 'Verified with Discrepancy' || status === 'Return Required') return 'badge-danger';
        if (status === 'Arrived') return 'badge-warning';
        return 'badge-info';
    };

    const getSuppliers = (po) => [...new Set(po.deliveryReceipts.map((receipt) => receipt.supplier))];

    const getAcceptedQuantity = (po) => po.deliveryReceipts.reduce(
        (total, receipt) => total + Number(receipt.acceptedQty || 0),
        0
    );

    const renderPOTable = () => {
        const searchTerm = searchInput.value.trim().toLowerCase();
        const filterStatus = statusFilter.value;
        tableBody.innerHTML = '';

        const filteredData = poData.filter((po) => {
            const supplierText = getSuppliers(po).join(' ').toLowerCase();
            const matchesSearch = po.id.toLowerCase().includes(searchTerm) ||
                po.requestId.toLowerCase().includes(searchTerm) ||
                supplierText.includes(searchTerm);
            const matchesStatus = filterStatus === 'All' || po.status === filterStatus;
            return matchesSearch && matchesStatus;
        });

        if (filteredData.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="8" class="empty-state-row">No purchase orders match your criteria.</td></tr>';
            return;
        }

        filteredData.forEach((po) => {
            const suppliers = getSuppliers(po);
            const acceptedQty = getAcceptedQuantity(po);
            const remainingQty = Math.max(0, po.orderedQty - acceptedQty);
            const progressPercent = po.orderedQty > 0
                ? Math.min(100, Math.round((acceptedQty / po.orderedQty) * 100))
                : 0;

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong>${escapeHtml(po.id)}</strong></td>
                <td>${suppliers.length}</td>
                <td>${Number(po.orderedQty).toLocaleString()} ${escapeHtml(po.unit)}</td>
                <td>${Number(acceptedQty).toLocaleString()} ${escapeHtml(po.unit)}</td>
                <td>${Number(remainingQty).toLocaleString()} ${escapeHtml(po.unit)}</td>
                <td>
                    <div class="po-table-progress-bar">
                        <div class="po-table-progress-track" aria-label="${progressPercent}% of ordered quantity accepted">
                            <div class="po-table-progress-fill" style="width: ${progressPercent}%;"></div>
                        </div>
                        <span class="po-table-progress-text">${progressPercent}%</span>
                    </div>
                </td>
                <td><span class="badge ${badgeClassForPo(po.status)}">${escapeHtml(po.status)}</span></td>
                <td class="text-center">
                    <button type="button" class="pic-po-view-action" data-action="view-po" data-id="${escapeHtml(po.id)}" aria-label="View ${escapeHtml(po.id)} details" title="View details">
                        <i class="fas fa-eye" aria-hidden="true"></i>
                    </button>
                </td>`;
            tableBody.appendChild(tr);
        });
    };

    const openPurchaseOrderDetails = (id) => {
        const po = poData.find((item) => item.id === id);
        if (!po) return;

        const acceptedQty = getAcceptedQuantity(po);
        const remainingQty = Math.max(0, po.orderedQty - acceptedQty);
        const progressPercent = po.orderedQty > 0
            ? Math.min(100, Math.round((acceptedQty / po.orderedQty) * 100))
            : 0;
        const suppliers = getSuppliers(po);

        const materialRows = po.items.map((item) => `
            <tr>
                <td class="font-semibold text-main">${escapeHtml(item.materialId)}</td>
                <td>${escapeHtml(item.material)}</td>
                <td><span class="badge badge-info">${escapeHtml(item.category)}</span></td>
                <td class="text-right font-semibold">${Number(item.qty).toLocaleString()}</td>
                <td>${escapeHtml(item.unit)}</td>
            </tr>
        `).join('');

        const receiptRows = po.deliveryReceipts.map((receipt) => `
            <tr>
                <td class="font-semibold text-main">${escapeHtml(receipt.batchNumber)}</td>
                <td>${escapeHtml(receipt.deliveryRefNumber)}</td>
                <td>${escapeHtml(receipt.receiptNumber)}</td>
                <td>${escapeHtml(receipt.supplier)}</td>
                <td>${escapeHtml(receipt.deliveryDate)}</td>
                <td>${escapeHtml(receipt.warehouse)}</td>
                <td><span class="badge ${badgeClassForReceipt(receipt.drStatus)}">${escapeHtml(receipt.drStatus)}</span></td>
                <td class="text-muted-sm">${escapeHtml(receipt.remarks || '—')}</td>
            </tr>
        `).join('');

        poDetailsBody.innerHTML = `
            <div class="po-progress-card mb-3">
                <div class="po-progress-header">
                    <span class="po-progress-title">
                        <i class="fas fa-box-open icon-primary"></i> ${escapeHtml(po.id)} — ${escapeHtml(po.material)}
                    </span>
                    <span class="badge ${badgeClassForPo(po.status)}">${escapeHtml(po.status)}</span>
                </div>

                <div class="po-progress-stats">
                    <div class="po-stat-box">
                        <div class="po-stat-label">Ordered Quantity</div>
                        <div class="po-stat-value">${Number(po.orderedQty).toLocaleString()} ${escapeHtml(po.unit)}</div>
                    </div>
                    <div class="po-stat-box">
                        <div class="po-stat-label">Accepted Quantity</div>
                        <div class="po-stat-value text-success">${Number(acceptedQty).toLocaleString()} ${escapeHtml(po.unit)}</div>
                    </div>
                    <div class="po-stat-box">
                        <div class="po-stat-label">Remaining Quantity</div>
                        <div class="po-stat-value">${Number(remainingQty).toLocaleString()} ${escapeHtml(po.unit)}</div>
                    </div>
                </div>

                <div class="po-progress-bar-wrapper">
                    <div class="po-progress-track" aria-label="${progressPercent}% of ordered quantity accepted">
                        <div class="po-progress-fill" style="width: ${progressPercent}%;"></div>
                    </div>
                    <span class="po-progress-percentage">${progressPercent}%</span>
                </div>
            </div>

            <div class="pic-po-readonly-banner mb-3">
                <i class="fas fa-eye"></i>
                <span><strong>Read-only view.</strong> Purchase order receiving, verification, discrepancy, and return actions are managed by Warehouse Staff.</span>
            </div>

            <div class="po-details-grid mb-3">
                <div class="po-detail-card"><span>Related Material Request</span><strong>${escapeHtml(po.requestId)}</strong></div>
                <div class="po-detail-card"><span>Supplier${suppliers.length === 1 ? '' : 's'}</span><strong>${escapeHtml(suppliers.join(', '))}</strong></div>
                <div class="po-detail-card"><span>Date Ordered</span><strong>${escapeHtml(po.dateOrdered)}</strong></div>
                <div class="po-detail-card"><span>Expected Delivery</span><strong>${escapeHtml(po.expDelivery)}</strong></div>
            </div>

            <div class="po-remarks-panel mb-3">
                <span class="text-muted-sm">Purchase Order Remarks</span>
                <div class="font-semibold mt-1">${escapeHtml(po.remarks)}</div>
            </div>

            <div class="section-title mb-2">
                <i class="fas fa-boxes icon-primary"></i>
                <span>Ordered Materials</span>
            </div>
            <div class="table-wrapper mb-3">
                <table class="table po-items-table">
                    <thead>
                        <tr>
                            <th>Material ID</th>
                            <th>Material</th>
                            <th>Category</th>
                            <th class="text-right">Ordered Quantity</th>
                            <th>Unit</th>
                        </tr>
                    </thead>
                    <tbody>${materialRows}</tbody>
                </table>
            </div>

            <div class="section-title mb-2">
                <i class="fas fa-history icon-secondary"></i>
                <span>Delivery Receipt History (Batches)</span>
            </div>
            <div class="table-wrapper">
                <table class="table">
                    <thead>
                        <tr>
                            <th>Batch #</th>
                            <th>Delivery Ref</th>
                            <th>Receipt Number</th>
                            <th>Supplier</th>
                            <th>Delivery Date</th>
                            <th>Warehouse</th>
                            <th>Receipt Status</th>
                            <th>Remarks</th>
                        </tr>
                    </thead>
                    <tbody>${receiptRows}</tbody>
                </table>
            </div>
        `;

        if (typeof window.openModal === 'function') window.openModal('poDetailsModal');
    };

    tableBody.addEventListener('click', (event) => {
        const button = event.target.closest('[data-action="view-po"]');
        if (button) openPurchaseOrderDetails(button.dataset.id);
    });

    searchInput.addEventListener('input', renderPOTable);
    statusFilter.addEventListener('change', renderPOTable);

    btnExport.addEventListener('click', () => {
        if (typeof window.showToast === 'function') {
            window.showToast('Export Started', 'Generating PO tracking report in CSV format...', 'primary');
        }
    });

    renderPOTable();
});
