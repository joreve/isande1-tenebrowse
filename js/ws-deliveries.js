/**
 * Tenebrowse - Warehouse Staff
 * Deliveries Page Logic (v4.3.2 – Deliveries Navigation and Action Repair)
 *
 * Extends the Purchase Order-centric Deliveries workflow by implementing:
 * - Fixed tab-switching behavior between Purchase Orders and Delivery Activity
 * - Complete modal close actions across every Deliveries modal with body scroll lock
 * - Itemized materials arrays per Delivery Receipt (Packing List / Supplier Invoice model)
 * - Material Pricing in Philippine Peso (₱) with locale-aware formatting
 * - Itemized Warehouse Verification Table with automatic derived calculations
 * - Real-Time Delivery Receipt Financial Summary
 * - Itemized Return Request integration
 * - Fully restored event delegation and global window exposure for all action buttons
 */

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // Reference Date & Locale Helper Functions
    // ==========================================
    const TODAY_LABEL = 'Jul 23, 2026';

    /**
     * Formats numeric amounts to Philippine Peso (₱) using locale-aware formatting.
     * Prevents NaN values and displays ₱0.00 when applicable.
     */
    const formatPeso = (value) => {
        const num = parseFloat(value);
        const safeNum = isNaN(num) ? 0 : num;
        return '₱' + safeNum.toLocaleString('en-PH', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    };

    /**
     * Parses numeric inputs safely without NaN
     */
    const parseSafeInt = (val) => {
        const num = parseInt(val, 10);
        return (isNaN(num) || num < 0) ? 0 : num;
    };


    /**
     * Delivery Receipt actions are opened as child modals of Purchase Order
     * Details. The parent stays active (but visually suspended) so closing,
     * cancelling, clicking the backdrop, or pressing Escape in a child modal
     * returns the user to the same Purchase Order Details view and scroll state.
     */
    const purchaseOrderChildModalIds = new Set([
        'viewReceiptItemsModal',
        'verifyModal',
        'verifyConfirmModal',
        'returnRequestModal',
        'discrepancyModal',
        'discrepancyDetailsModal'
    ]);

    const syncPurchaseOrderParentModal = () => {
        const purchaseOrderModal = document.getElementById('viewModal');
        if (!purchaseOrderModal) return;

        const hasOpenChild = Array.from(purchaseOrderChildModalIds).some((childId) =>
            document.getElementById(childId)?.classList.contains('active')
        );

        purchaseOrderModal.classList.toggle(
            'modal-parent-suspended',
            purchaseOrderModal.classList.contains('active') && hasOpenChild
        );
    };

    const openExclusiveModal = (modalId) => {
        const openingPurchaseOrderChild = purchaseOrderChildModalIds.has(modalId);

        document.querySelectorAll('.modal-overlay.active').forEach((modal) => {
            const preservePurchaseOrderParent = openingPurchaseOrderChild && modal.id === 'viewModal';
            if (modal.id !== modalId && !preservePurchaseOrderParent && typeof window.closeModal === 'function') {
                window.closeModal(modal.id);
            }
        });

        if (typeof window.openModal === 'function') {
            window.openModal(modalId);
        }

        syncPurchaseOrderParentModal();
    };

    // Shared app.js owns modal close, backdrop, and Escape behavior. Observe the
    // resulting active-class changes so the parent is restored automatically.
    document.querySelectorAll('.modal-overlay').forEach((modal) => {
        new MutationObserver(syncPurchaseOrderParentModal).observe(modal, {
            attributes: true,
            attributeFilter: ['class']
        });
    });

    // ==========================================
    // Seed Data: Purchase Order-Centric Architecture with Multi-Material Batches
    // ==========================================
    let purchaseOrdersData = [
        {
            poNumber: 'PO-2026-770',
            orderedQty: 1000,
            unit: 'pcs',
            poStatus: 'Partially Delivered',
            material: 'Plumbing & Structural Piping Supply Set',
            deliveryReceipts: [
                {
                    batchNumber: 'Batch #1',
                    deliveryRefNumber: 'DEL-3298',
                    receiptNumber: 'DR-770-01',
                    supplier: 'Global Logistics Foundry',
                    deliveryDate: 'Jul 23, 2026',
                    warehouse: 'Warehouse 1',
                    remarks: 'Shortage of 4 pcs PVC and 5 cement bags recorded during inspection.',
                    drStatus: 'Verified with Discrepancy',
                    materials: [
                        {
                            materialId: 'MAT-101',
                            description: '12-inch PVC Pipe Class 1000',
                            unit: 'piece',
                            unitPrice: 250.00,
                            expectedQty: 200,
                            receivedQty: 196,
                            damagedQty: 2,
                            acceptedQty: 194,
                            missingQty: 4,
                            warehouse: 'Warehouse 1',
                            remarks: '2 pieces cracked on end bell'
                        },
                        {
                            materialId: 'MAT-102',
                            description: '50kg Portland Cement Bag Type I',
                            unit: 'bag',
                            unitPrice: 280.00,
                            expectedQty: 100,
                            receivedQty: 95,
                            damagedQty: 0,
                            acceptedQty: 95,
                            missingQty: 5,
                            warehouse: 'Warehouse 1',
                            remarks: '5 bags short shipped from truck'
                        },
                        {
                            materialId: 'MAT-103',
                            description: 'Steel Reinforcement Bar 16mm x 6m',
                            unit: 'rod',
                            unitPrice: 420.00,
                            expectedQty: 200,
                            receivedQty: 200,
                            damagedQty: 0,
                            acceptedQty: 200,
                            missingQty: 0,
                            warehouse: 'Warehouse 1',
                            remarks: 'In good condition'
                        }
                    ]
                },
                {
                    batchNumber: 'Batch #2',
                    deliveryRefNumber: 'DEL-3305',
                    receiptNumber: 'DR-770-02',
                    supplier: 'Timberland Suppliers',
                    deliveryDate: 'Jul 24, 2026 (Expected)',
                    warehouse: 'Warehouse 1',
                    remarks: 'Arrived at loading dock awaiting inspection.',
                    drStatus: 'Arrived',
                    materials: [
                        {
                            materialId: 'MAT-101',
                            description: '12-inch PVC Pipe Class 1000',
                            unit: 'piece',
                            unitPrice: 250.00,
                            expectedQty: 150,
                            receivedQty: 150,
                            damagedQty: 0,
                            acceptedQty: 150,
                            missingQty: 0,
                            warehouse: 'Warehouse 1',
                            remarks: ''
                        },
                        {
                            materialId: 'MAT-104',
                            description: 'Galvanized Iron Elbow 1/2 inch',
                            unit: 'piece',
                            unitPrice: 45.00,
                            expectedQty: 150,
                            receivedQty: 150,
                            damagedQty: 0,
                            acceptedQty: 150,
                            missingQty: 0,
                            warehouse: 'Warehouse 1',
                            remarks: ''
                        }
                    ]
                },
                {
                    batchNumber: 'Batch #3',
                    deliveryRefNumber: 'DEL-3312',
                    receiptNumber: 'DR-770-03',
                    supplier: 'Global Logistics Foundry',
                    deliveryDate: 'Jul 25, 2026 (Expected)',
                    warehouse: 'Warehouse 1',
                    remarks: '',
                    drStatus: 'Expected',
                    materials: [
                        {
                            materialId: 'MAT-103',
                            description: 'Steel Reinforcement Bar 16mm x 6m',
                            unit: 'rod',
                            unitPrice: 420.00,
                            expectedQty: 200,
                            receivedQty: null,
                            damagedQty: 0,
                            acceptedQty: 0,
                            missingQty: 0,
                            warehouse: 'Warehouse 1',
                            remarks: ''
                        }
                    ]
                }
            ]
        },
        {
            poNumber: 'PO-2026-782',
            orderedQty: 300,
            unit: 'Sheets',
            poStatus: 'Ordered',
            material: 'Marine Plywood & Structural Timber Set',
            deliveryReceipts: [
                {
                    batchNumber: 'Batch #1',
                    deliveryRefNumber: 'DEL-3301',
                    receiptNumber: 'DR-782-01',
                    supplier: 'Timberland Suppliers',
                    deliveryDate: 'Jul 24, 2026',
                    warehouse: 'Warehouse 2',
                    remarks: '',
                    drStatus: 'Expected',
                    materials: [
                        {
                            materialId: 'MAT-201',
                            description: 'Marine Plywood 3/4" x 4x8',
                            unit: 'sheet',
                            unitPrice: 1450.00,
                            expectedQty: 200,
                            receivedQty: null,
                            damagedQty: 0,
                            acceptedQty: 0,
                            missingQty: 0,
                            warehouse: 'Warehouse 2',
                            remarks: ''
                        },
                        {
                            materialId: 'MAT-202',
                            description: 'Rough Sawn Lumber 2x4x10',
                            unit: 'piece',
                            unitPrice: 380.00,
                            expectedQty: 100,
                            receivedQty: null,
                            damagedQty: 0,
                            acceptedQty: 0,
                            missingQty: 0,
                            warehouse: 'Warehouse 2',
                            remarks: ''
                        }
                    ]
                }
            ]
        },
        {
            poNumber: 'PO-2026-750',
            orderedQty: 400,
            unit: 'Bags',
            poStatus: 'Partially Delivered',
            material: 'Portland Cement & Waterproofing Additives',
            deliveryReceipts: [
                {
                    batchNumber: 'Batch #1',
                    deliveryRefNumber: 'DEL-3285',
                    receiptNumber: 'DR-750-01',
                    supplier: 'Prime Cement Corp',
                    deliveryDate: 'Jul 18, 2026',
                    warehouse: 'Warehouse 2',
                    remarks: 'First batch verified intact.',
                    drStatus: 'Verified',
                    materials: [
                        {
                            materialId: 'MAT-102',
                            description: '50kg Portland Cement Bag Type I',
                            unit: 'bag',
                            unitPrice: 280.00,
                            expectedQty: 300,
                            receivedQty: 300,
                            damagedQty: 0,
                            acceptedQty: 300,
                            missingQty: 0,
                            warehouse: 'Warehouse 2',
                            remarks: 'All cement bags dry and intact'
                        },
                        {
                            materialId: 'MAT-301',
                            description: 'Liquid Waterproofing Compound 4L',
                            unit: 'gallon',
                            unitPrice: 650.00,
                            expectedQty: 50,
                            receivedQty: 50,
                            damagedQty: 0,
                            acceptedQty: 50,
                            missingQty: 0,
                            warehouse: 'Warehouse 2',
                            remarks: ''
                        }
                    ]
                },
                {
                    batchNumber: 'Batch #2',
                    deliveryRefNumber: 'DEL-3290',
                    receiptNumber: 'DR-750-02',
                    supplier: 'Prime Cement Corp',
                    deliveryDate: 'Jul 23, 2026',
                    warehouse: 'Warehouse 2',
                    remarks: 'Arrived at loading dock.',
                    drStatus: 'Arrived',
                    materials: [
                        {
                            materialId: 'MAT-102',
                            description: '50kg Portland Cement Bag Type I',
                            unit: 'bag',
                            unitPrice: 280.00,
                            expectedQty: 50,
                            receivedQty: 50,
                            damagedQty: 0,
                            acceptedQty: 50,
                            missingQty: 0,
                            warehouse: 'Warehouse 2',
                            remarks: ''
                        }
                    ]
                }
            ]
        },
        {
            poNumber: 'PO-2026-745',
            orderedQty: 200,
            unit: 'Rolls',
            poStatus: 'Completed',
            material: 'THHN Copper Wire & Conduit Accessories',
            deliveryReceipts: [
                {
                    batchNumber: 'Batch #1',
                    deliveryRefNumber: 'DEL-3270',
                    receiptNumber: 'DR-745-01',
                    supplier: 'Electra Wire Solutions',
                    deliveryDate: 'Jul 04, 2026',
                    warehouse: 'Warehouse 1',
                    remarks: 'Batch 1 verified without issues.',
                    drStatus: 'Verified',
                    materials: [
                        {
                            materialId: 'MAT-401',
                            description: 'THHN Copper Wire 3.5mm (150m Roll)',
                            unit: 'roll',
                            unitPrice: 3200.00,
                            expectedQty: 80,
                            receivedQty: 80,
                            damagedQty: 0,
                            acceptedQty: 80,
                            missingQty: 0,
                            warehouse: 'Warehouse 1',
                            remarks: ''
                        }
                    ]
                },
                {
                    batchNumber: 'Batch #2',
                    deliveryRefNumber: 'DEL-3275',
                    receiptNumber: 'DR-745-02',
                    supplier: 'Electra Wire Solutions',
                    deliveryDate: 'Jul 10, 2026',
                    warehouse: 'Warehouse 1',
                    remarks: 'Final batch verified without issues.',
                    drStatus: 'Verified',
                    materials: [
                        {
                            materialId: 'MAT-401',
                            description: 'THHN Copper Wire 3.5mm (150m Roll)',
                            unit: 'roll',
                            unitPrice: 3200.00,
                            expectedQty: 120,
                            receivedQty: 120,
                            damagedQty: 0,
                            acceptedQty: 120,
                            missingQty: 0,
                            warehouse: 'Warehouse 1',
                            remarks: ''
                        }
                    ]
                }
            ]
        },
        {
            poNumber: 'PO-2026-735',
            orderedQty: 250,
            unit: 'Sheets',
            poStatus: 'Completed',
            material: 'Roofing Sheet Corrugated GA 26',
            deliveryReceipts: [
                {
                    batchNumber: 'Batch #1',
                    deliveryRefNumber: 'DEL-3260',
                    receiptNumber: 'DR-735-01',
                    supplier: 'Timberland Suppliers',
                    deliveryDate: 'Jul 05, 2026',
                    warehouse: 'Warehouse 2',
                    remarks: 'Delivery matched purchase order exactly.',
                    drStatus: 'Verified',
                    materials: [
                        {
                            materialId: 'MAT-501',
                            description: 'Roofing Sheet Corrugated GA 26 (8ft)',
                            unit: 'sheet',
                            unitPrice: 620.00,
                            expectedQty: 250,
                            receivedQty: 250,
                            damagedQty: 0,
                            acceptedQty: 250,
                            missingQty: 0,
                            warehouse: 'Warehouse 2',
                            remarks: ''
                        }
                    ]
                }
            ]
        }
    ];

    let activityLog = [
        {
            id: 'DLV-ACT-1005',
            icon: 'fa-truck-loading',
            severity: 'info',
            activityType: 'Delivery Receipt Arrived',
            poNumber: 'PO-2026-770',
            receiptNumber: 'DR-770-02',
            batchNumber: 'Batch #2',
            previousStatus: 'Expected',
            updatedStatus: 'Arrived',
            supplier: 'Timberland Suppliers',
            warehouse: 'Warehouse 1',
            updatedBy: 'Arnie Velasco',
            date: '2026-07-23',
            time: '10:18 AM',
            reference: 'DEL-3305',
            remarks: 'Delivery receipt recorded at the loading dock and queued for itemized warehouse verification.'
        },
        {
            id: 'DLV-ACT-1004',
            icon: 'fa-exclamation-triangle',
            severity: 'danger',
            activityType: 'Delivery Verified with Discrepancy',
            poNumber: 'PO-2026-770',
            receiptNumber: 'DR-770-01',
            batchNumber: 'Batch #1',
            previousStatus: 'Arrived',
            updatedStatus: 'Verified with Discrepancy',
            supplier: 'Global Logistics Foundry',
            warehouse: 'Warehouse 1',
            updatedBy: 'Arnie Velasco',
            date: '2026-07-23',
            time: '09:42 AM',
            reference: 'DEL-3298',
            remarks: 'Itemized verification recorded two damaged PVC pipes and shortages of four PVC pipes and five cement bags.'
        },
        {
            id: 'DLV-ACT-1003',
            icon: 'fa-truck-loading',
            severity: 'info',
            activityType: 'Delivery Receipt Arrived',
            poNumber: 'PO-2026-750',
            receiptNumber: 'DR-750-02',
            batchNumber: 'Batch #2',
            previousStatus: 'Expected',
            updatedStatus: 'Arrived',
            supplier: 'Prime Cement Corp',
            warehouse: 'Warehouse 2',
            updatedBy: 'Arnie Velasco',
            date: '2026-07-23',
            time: '08:50 AM',
            reference: 'DEL-3290',
            remarks: 'Second cement delivery batch arrived and is awaiting warehouse verification.'
        },
        {
            id: 'DLV-ACT-1002',
            icon: 'fa-check-circle',
            severity: 'success',
            activityType: 'Delivery Receipt Verified',
            poNumber: 'PO-2026-745',
            receiptNumber: 'DR-745-02',
            batchNumber: 'Batch #2',
            previousStatus: 'Arrived',
            updatedStatus: 'Verified',
            supplier: 'Electra Wire Solutions',
            warehouse: 'Warehouse 1',
            updatedBy: 'Arnie Velasco',
            date: '2026-07-10',
            time: '02:14 PM',
            reference: 'DEL-3275',
            remarks: 'Final receipt was verified without discrepancies. Purchase order PO-2026-745 was completed.'
        },
        {
            id: 'DLV-ACT-1001',
            icon: 'fa-check-circle',
            severity: 'success',
            activityType: 'Delivery Receipt Verified',
            poNumber: 'PO-2026-735',
            receiptNumber: 'DR-735-01',
            batchNumber: 'Batch #1',
            previousStatus: 'Arrived',
            updatedStatus: 'Verified',
            supplier: 'Timberland Suppliers',
            warehouse: 'Warehouse 2',
            updatedBy: 'Arnie Velasco',
            date: '2026-07-05',
            time: '11:06 AM',
            reference: 'DEL-3260',
            remarks: 'All corrugated roofing sheets matched the purchase order and were accepted into Warehouse 2.'
        }
    ];

    // ==========================================
    // Application State Variables
    // ==========================================
    let currentPage = 1;
    const pageSize = 5;
    let activityPage = 1;
    const activityPageSize = 5;
    let nextDeliveryActivityId = 1006;
    let selectedPoNumber = null;
    let selectedDrRefNumber = null;

    // ==========================================
    // DOM Element References
    // ==========================================
    const summaryExpectedToday = document.getElementById('summaryExpectedToday');
    const summaryAwaitingVerification = document.getElementById('summaryAwaitingVerification');
    const summaryPartiallyReceived = document.getElementById('summaryPartiallyReceived');
    const summaryVerified = document.getElementById('summaryVerified');
    const summaryDiscrepancies = document.getElementById('summaryDiscrepancies');

    const tableBody = document.getElementById('deliveriesTableBody');
    const searchInput = document.getElementById('searchInput');
    const statusFilter = document.getElementById('statusFilter');
    const supplierFilter = document.getElementById('supplierFilter');
    const dateFilter = document.getElementById('dateFilter');
    const btnExport = document.getElementById('btnExport');

    const paginationInfo = document.getElementById('paginationInfo');
    const prevPageBtn = document.getElementById('prevPageBtn');
    const nextPageBtn = document.getElementById('nextPageBtn');

    const purchaseOrderToolbar = document.getElementById('purchaseOrderToolbar');

    const deliveryActivityTableBody = document.getElementById('deliveryActivityTableBody');
    const deliveryActivitySearchInput = document.getElementById('deliveryActivitySearchInput');
    const deliveryActivityTypeFilter = document.getElementById('deliveryActivityTypeFilter');
    const deliveryActivityWarehouseFilter = document.getElementById('deliveryActivityWarehouseFilter');
    const deliveryActivityDateFilter = document.getElementById('deliveryActivityDateFilter');
    const btnExportDeliveryActivity = document.getElementById('btnExportDeliveryActivity');
    const deliveryActivityPaginationInfo = document.getElementById('deliveryActivityPaginationInfo');
    const deliveryActivityPrevBtn = document.getElementById('deliveryActivityPrevBtn');
    const deliveryActivityNextBtn = document.getElementById('deliveryActivityNextBtn');

    const deliveryActivityUpdatesToday = document.getElementById('deliveryActivityUpdatesToday');
    const deliveryActivityVerified = document.getElementById('deliveryActivityVerified');
    const deliveryActivityArrivals = document.getElementById('deliveryActivityArrivals');
    const deliveryActivityExceptions = document.getElementById('deliveryActivityExceptions');

    const deliveriesGuidedHelper = document.getElementById('deliveriesGuidedHelper');
    const btnCollapseGuide = document.getElementById('btnCollapseGuide');
    const btnHideGuide = document.getElementById('btnHideGuide');
    const btnRestoreGuide = document.getElementById('btnRestoreGuide');
    const guidedSubbadge = document.getElementById('guidedSubbadge');

    // ==========================================
    // Helpers & Badge Style Selectors
    // ==========================================
    const badgeClassForPo = (status) => {
        switch (status) {
            case 'Ordered': return 'badge-po-ordered';
            case 'Partially Delivered': return 'badge-po-partial';
            case 'Completed': return 'badge-po-completed';
            case 'Closed with Outstanding Quantity': return 'badge-po-closed';
            default: return 'badge-info';
        }
    };

    const badgeClassForDr = (status) => {
        switch (status) {
            case 'Expected': return 'badge-dr-expected';
            case 'Arrived': return 'badge-dr-arrived';
            case 'Verified': return 'badge-dr-verified';
            case 'Verified with Discrepancy': return 'badge-dr-discrepancy';
            case 'Return Required': return 'badge-dr-return';
            default: return 'badge-info';
        }
    };

    const escapeHtml = (value) => String(value ?? '')
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');

    const getDeliveryActivityBadgeClass = (activityType) => {
        if (activityType === 'Delivery Receipt Verified') return 'badge-success';
        if (activityType === 'Delivery Receipt Arrived') return 'badge-info';
        if (activityType === 'Return Request Submitted') return 'badge-warning';
        if (activityType === 'Delivery Verified with Discrepancy' ||
            activityType === 'Delivery Discrepancy Reported') return 'badge-danger';
        return 'badge-info';
    };

    const getActivityDateParts = () => {
        const now = new Date();
        const localDate = [
            now.getFullYear(),
            String(now.getMonth() + 1).padStart(2, '0'),
            String(now.getDate()).padStart(2, '0')
        ].join('-');
        const localTime = now.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
        return { date: localDate, time: localTime };
    };

    const logActivity = (icon, severity, title, desc, details = {}) => {
        const poNumber = details.poNumber || selectedPoNumber || '-';
        const po = purchaseOrdersData.find((item) => item.poNumber === poNumber);
        const receiptNumber = details.receiptNumber || selectedDrRefNumber || '-';
        const receipt = po?.deliveryReceipts.find((item) =>
            item.receiptNumber === receiptNumber || item.deliveryRefNumber === receiptNumber
        );
        const now = getActivityDateParts();

        activityLog.unshift({
            id: `DLV-ACT-${nextDeliveryActivityId++}`,
            icon,
            severity,
            activityType: details.activityType || title,
            poNumber,
            receiptNumber: receipt?.receiptNumber || receiptNumber,
            batchNumber: details.batchNumber || receipt?.batchNumber || '-',
            previousStatus: details.previousStatus || '-',
            updatedStatus: details.updatedStatus || receipt?.drStatus || '-',
            supplier: details.supplier || receipt?.supplier || '-',
            warehouse: details.warehouse || receipt?.warehouse || '-',
            updatedBy: details.updatedBy || 'Arnie Velasco',
            date: details.date || now.date,
            time: details.time || now.time,
            reference: details.reference || receipt?.deliveryRefNumber || poNumber,
            remarks: details.remarks || desc
        });

        activityLog = activityLog.slice(0, 100);
        activityPage = 1;
        renderDeliveryActivitySummary();
        renderDeliveryActivityTable();
    };

    const renderDeliveryActivitySummary = () => {
        const summaryReferenceDate = '2026-07-23';
        const updatesToday = activityLog.filter((item) => item.date === summaryReferenceDate).length;
        const verified = activityLog.filter((item) =>
            item.activityType === 'Delivery Receipt Verified' ||
            item.activityType === 'Delivery Verified with Discrepancy'
        ).length;
        const arrivals = activityLog.filter((item) =>
            item.activityType === 'Delivery Receipt Arrived'
        ).length;
        const exceptions = activityLog.filter((item) =>
            item.activityType === 'Delivery Verified with Discrepancy' ||
            item.activityType === 'Delivery Discrepancy Reported' ||
            item.activityType === 'Return Request Submitted'
        ).length;

        if (deliveryActivityUpdatesToday) deliveryActivityUpdatesToday.textContent = updatesToday;
        if (deliveryActivityVerified) deliveryActivityVerified.textContent = verified;
        if (deliveryActivityArrivals) deliveryActivityArrivals.textContent = arrivals;
        if (deliveryActivityExceptions) deliveryActivityExceptions.textContent = exceptions;
    };

    const getFilteredDeliveryActivity = () => {
        const searchTerm = deliveryActivitySearchInput?.value.toLowerCase().trim() || '';
        const activityType = deliveryActivityTypeFilter?.value || 'All';
        const warehouse = deliveryActivityWarehouseFilter?.value || 'All';
        const date = deliveryActivityDateFilter?.value || '';

        return activityLog.filter((item) => {
            const searchableText = [
                item.id,
                item.poNumber,
                item.receiptNumber,
                item.batchNumber,
                item.activityType,
                item.supplier,
                item.reference,
                item.updatedBy
            ].join(' ').toLowerCase();

            const matchesSearch = searchableText.includes(searchTerm);
            const matchesType = activityType === 'All' || item.activityType === activityType;
            const matchesWarehouse = warehouse === 'All' || item.warehouse === warehouse;
            const matchesDate = !date || item.date === date;

            return matchesSearch && matchesType && matchesWarehouse && matchesDate;
        });
    };

    const renderDeliveryActivityTable = () => {
        if (!deliveryActivityTableBody) return;

        const filtered = getFilteredDeliveryActivity();
        const totalItems = filtered.length;
        const totalPages = Math.max(1, Math.ceil(totalItems / activityPageSize));
        if (activityPage > totalPages) activityPage = totalPages;

        const startIndex = (activityPage - 1) * activityPageSize;
        const records = filtered.slice(startIndex, startIndex + activityPageSize);

        if (records.length === 0) {
            deliveryActivityTableBody.innerHTML = `
                <tr>
                    <td colspan="12" class="empty-state-row">
                        No delivery activity records match your criteria.
                    </td>
                </tr>
            `;
            if (deliveryActivityPaginationInfo) {
                deliveryActivityPaginationInfo.textContent = 'Showing 0-0 of 0 records';
            }
            if (deliveryActivityPrevBtn) deliveryActivityPrevBtn.disabled = true;
            if (deliveryActivityNextBtn) deliveryActivityNextBtn.disabled = true;
            return;
        }

        deliveryActivityTableBody.innerHTML = records.map((item) => {
            const activityBadgeClass = getDeliveryActivityBadgeClass(item.activityType);
            const previousStatus = item.previousStatus && item.previousStatus !== '-'
                ? `<span class="badge ${badgeClassForDr(item.previousStatus)}">${escapeHtml(item.previousStatus)}</span>`
                : '<span class="text-muted-sm">—</span>';
            const updatedStatus = item.updatedStatus && item.updatedStatus !== '-'
                ? `<span class="badge ${badgeClassForDr(item.updatedStatus)}">${escapeHtml(item.updatedStatus)}</span>`
                : '<span class="text-muted-sm">—</span>';

            return `
                <tr>
                    <td><strong>${escapeHtml(item.id)}</strong></td>
                    <td>${escapeHtml(item.poNumber)}</td>
                    <td>
                        <div class="font-semibold">${escapeHtml(item.receiptNumber)}</div>
                        <div class="text-muted-sm">${escapeHtml(item.batchNumber)}</div>
                    </td>
                    <td><span class="badge ${activityBadgeClass}">${escapeHtml(item.activityType)}</span></td>
                    <td>${previousStatus}</td>
                    <td>${updatedStatus}</td>
                    <td>${escapeHtml(item.supplier)}</td>
                    <td>${escapeHtml(item.warehouse)}</td>
                    <td>${escapeHtml(item.updatedBy)}</td>
                    <td>
                        <div>${escapeHtml(item.date)}</div>
                        <div class="text-muted-sm">${escapeHtml(item.time)}</div>
                    </td>
                    <td>${escapeHtml(item.reference || '-')}</td>
                    <td>
                        <div class="action-list">
                            <button
                                type="button"
                                class="action-item-btn"
                                data-action="view-delivery-activity"
                                data-activity-id="${escapeHtml(item.id)}"
                                title="View Delivery Activity"
                                aria-label="View Delivery Activity">
                                <i class="fas fa-eye"></i>
                                <span class="action-label">View</span>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');

        const endItem = Math.min(startIndex + activityPageSize, totalItems);
        if (deliveryActivityPaginationInfo) {
            deliveryActivityPaginationInfo.textContent =
                `Showing ${startIndex + 1}-${endItem} of ${totalItems} records`;
        }
        if (deliveryActivityPrevBtn) deliveryActivityPrevBtn.disabled = activityPage === 1;
        if (deliveryActivityNextBtn) deliveryActivityNextBtn.disabled = activityPage === totalPages;
    };

    const openDeliveryActivityDetails = (activityId) => {
        const item = activityLog.find((record) => record.id === activityId);
        if (!item) return;

        const idBadge = document.getElementById('deliveryActivityDetailsId');
        const body = document.getElementById('deliveryActivityDetailsBody');
        if (idBadge) idBadge.textContent = item.id;
        if (!body) return;

        const activityBadgeClass = getDeliveryActivityBadgeClass(item.activityType);
        const previousStatus = item.previousStatus && item.previousStatus !== '-'
            ? `<span class="badge ${badgeClassForDr(item.previousStatus)}">${escapeHtml(item.previousStatus)}</span>`
            : '<span class="text-muted-sm">Not applicable</span>';
        const updatedStatus = item.updatedStatus && item.updatedStatus !== '-'
            ? `<span class="badge ${badgeClassForDr(item.updatedStatus)}">${escapeHtml(item.updatedStatus)}</span>`
            : '<span class="text-muted-sm">Not applicable</span>';

        body.innerHTML = `
            <div class="delivery-activity-hero">
                <div class="delivery-activity-hero-icon">
                    <i class="fas ${escapeHtml(item.icon || 'fa-history')}"></i>
                </div>
                <div>
                    <div class="text-muted-sm">Activity Type</div>
                    <div class="delivery-activity-hero-title">${escapeHtml(item.activityType)}</div>
                </div>
                <span class="badge ${activityBadgeClass}">${escapeHtml(item.activityType)}</span>
            </div>

            <div class="delivery-activity-detail-grid">
                <div class="delivery-activity-detail-card">
                    <span>Purchase Order</span>
                    <strong>${escapeHtml(item.poNumber)}</strong>
                </div>
                <div class="delivery-activity-detail-card">
                    <span>Delivery Receipt</span>
                    <strong>${escapeHtml(item.receiptNumber)}</strong>
                </div>
                <div class="delivery-activity-detail-card">
                    <span>Batch Number</span>
                    <strong>${escapeHtml(item.batchNumber)}</strong>
                </div>
                <div class="delivery-activity-detail-card">
                    <span>Reference Number</span>
                    <strong>${escapeHtml(item.reference || '-')}</strong>
                </div>
                <div class="delivery-activity-detail-card">
                    <span>Supplier</span>
                    <strong>${escapeHtml(item.supplier)}</strong>
                </div>
                <div class="delivery-activity-detail-card">
                    <span>Warehouse</span>
                    <strong>${escapeHtml(item.warehouse)}</strong>
                </div>
                <div class="delivery-activity-detail-card">
                    <span>Updated By</span>
                    <strong>${escapeHtml(item.updatedBy)}</strong>
                </div>
                <div class="delivery-activity-detail-card">
                    <span>Date &amp; Time</span>
                    <strong>${escapeHtml(item.date)} ${escapeHtml(item.time)}</strong>
                </div>
                <div class="delivery-activity-detail-card">
                    <span>Previous Status</span>
                    <div>${previousStatus}</div>
                </div>
                <div class="delivery-activity-detail-card">
                    <span>Updated Status</span>
                    <div>${updatedStatus}</div>
                </div>
            </div>

            <div class="delivery-activity-remarks">
                <div class="delivery-activity-remarks-title">
                    <i class="fas fa-align-left"></i> Remarks
                </div>
                <p>${escapeHtml(item.remarks || 'No remarks recorded.')}</p>
            </div>
        `;

        openExclusiveModal('deliveryActivityDetailsModal');
    };

    // ==========================================
    // Guided Access — State & Progress Helper
    // ==========================================
    const isGuidedAccessMode = () => {
        return localStorage.getItem('tenebrowseWarehouseGuidedAccess') === 'true' ||
            document.body.classList.contains('guided-access-enabled');
    };

    const updateGuidedAccessUI = () => {
        const guided = isGuidedAccessMode();
        if (guided) {
            document.body.classList.add('guided-access-enabled');
        } else {
            document.body.classList.remove('guided-access-enabled');
        }

        const isHidden = sessionStorage.getItem('tenebrowseDeliveriesGuideHidden') === 'true';
        const isCollapsed = sessionStorage.getItem('tenebrowseDeliveriesGuideCollapsed') === 'true';

        if (deliveriesGuidedHelper) {
            if (!guided || isHidden) {
                deliveriesGuidedHelper.classList.add('hidden');
            } else {
                deliveriesGuidedHelper.classList.remove('hidden');
                if (isCollapsed) {
                    deliveriesGuidedHelper.classList.add('collapsed');
                    if (btnCollapseGuide) btnCollapseGuide.innerHTML = '<i class="fas fa-chevron-up"></i>';
                } else {
                    deliveriesGuidedHelper.classList.remove('collapsed');
                    if (btnCollapseGuide) btnCollapseGuide.innerHTML = '<i class="fas fa-chevron-down"></i>';
                }
            }
        }

        if (btnRestoreGuide) {
            if (guided && isHidden) {
                btnRestoreGuide.classList.remove('hidden');
            } else {
                btnRestoreGuide.classList.add('hidden');
            }
        }
    };

    const initGuidedAccessControls = () => {
        if (btnCollapseGuide) {
            btnCollapseGuide.addEventListener('click', () => {
                const isCollapsed = deliveriesGuidedHelper.classList.toggle('collapsed');
                sessionStorage.setItem('tenebrowseDeliveriesGuideCollapsed', isCollapsed ? 'true' : 'false');
                btnCollapseGuide.innerHTML = isCollapsed ? '<i class="fas fa-chevron-up"></i>' : '<i class="fas fa-chevron-down"></i>';
            });
        }

        if (btnHideGuide) {
            btnHideGuide.addEventListener('click', () => {
                sessionStorage.setItem('tenebrowseDeliveriesGuideHidden', 'true');
                updateGuidedAccessUI();
            });
        }

        if (btnRestoreGuide) {
            btnRestoreGuide.addEventListener('click', () => {
                sessionStorage.setItem('tenebrowseDeliveriesGuideHidden', 'false');
                updateGuidedAccessUI();
            });
        }

        window.addEventListener('storage', (e) => {
            if (e.key === 'tenebrowseWarehouseGuidedAccess') {
                updateGuidedAccessUI();
                renderDeliveriesTable();
            }
        });
    };

    const setGuidedStep = (activeStep) => {
        for (let i = 1; i <= 6; i++) {
            const el = document.getElementById(`step${i}Badge`);
            if (!el) continue;
            el.classList.remove('active', 'completed');
            if (i < activeStep) {
                el.classList.add('completed');
            } else if (i === activeStep) {
                el.classList.add('active');
            }
        }
        if (guidedSubbadge) {
            guidedSubbadge.textContent = `Step ${activeStep} of 6`;
        }
    };

    // ==========================================
    // 1. Tab Switching Controller
    // ==========================================
    const switchDeliveriesTab = (tabId) => {
        const tabButtons = document.querySelectorAll('.tabs-nav .tab-btn[data-tab]');
        const tabPanels = document.querySelectorAll('.tab-content');

        tabButtons.forEach(btn => {
            const isMatch = btn.getAttribute('data-tab') === tabId;
            btn.classList.toggle('active', isMatch);
            btn.setAttribute('aria-selected', isMatch ? 'true' : 'false');
        });

        tabPanels.forEach(p => {
            p.classList.remove('active');
        });

        const targetPanel = document.getElementById(`${tabId}-tab`) ||
            document.querySelector(`[data-tab-content="${tabId}"]`);

        if (targetPanel) {
            targetPanel.classList.add('active');
        }

        if (purchaseOrderToolbar) {
            purchaseOrderToolbar.style.display = tabId === 'delivery-activity' ? 'none' : '';
        }

        if (tabId === 'delivery-activity') {
            renderDeliveryActivitySummary();
            renderDeliveryActivityTable();
        }
    };

    const initTabs = () => {
        const tabButtons = document.querySelectorAll('.tabs-nav .tab-btn[data-tab]');
        tabButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetTab = btn.getAttribute('data-tab');
                switchDeliveriesTab(targetTab);
            });
        });
    };

    // ==========================================
    // 2. Summary Metric Calculations
    // ==========================================
    const updateSummaryMetrics = () => {
        let expectedTodayCount = 0;
        let awaitingVerificationCount = 0;
        let partiallyReceivedCount = 0;
        let verifiedCount = 0;
        let discrepancyCount = 0;

        purchaseOrdersData.forEach(po => {
            if (po.poStatus === 'Partially Delivered' || po.poStatus === 'Ordered') {
                partiallyReceivedCount++;
            } else if (po.poStatus === 'Completed') {
                verifiedCount++;
            }

            po.deliveryReceipts.forEach(dr => {
                if (dr.deliveryDate && dr.deliveryDate.includes(TODAY_LABEL)) {
                    expectedTodayCount++;
                }
                if (dr.drStatus === 'Arrived') {
                    awaitingVerificationCount++;
                }
                if (dr.drStatus === 'Verified with Discrepancy' || dr.drStatus === 'Return Required') {
                    discrepancyCount++;
                }
            });
        });

        if (summaryExpectedToday) summaryExpectedToday.textContent = expectedTodayCount;
        if (summaryAwaitingVerification) summaryAwaitingVerification.textContent = awaitingVerificationCount;
        if (summaryPartiallyReceived) summaryPartiallyReceived.textContent = partiallyReceivedCount;
        if (summaryVerified) summaryVerified.textContent = verifiedCount;
        if (summaryDiscrepancies) summaryDiscrepancies.textContent = discrepancyCount;
    };

    // ==========================================
    // 3. Purchase Order Table Rendering
    // ==========================================
    const populateSupplierFilters = () => {
        if (!supplierFilter) return;
        const currentVal = supplierFilter.value;
        const suppliers = new Set();

        purchaseOrdersData.forEach(po => {
            po.deliveryReceipts.forEach(dr => {
                if (dr.supplier) suppliers.add(dr.supplier);
            });
        });

        const sortedSuppliers = Array.from(suppliers).sort();
        supplierFilter.innerHTML = '<option value="All">All Suppliers</option>' +
            sortedSuppliers.map(s => `<option value="${s}">${s}</option>`).join('');

        if (sortedSuppliers.includes(currentVal)) {
            supplierFilter.value = currentVal;
        }
    };

    const renderDeliveriesTable = () => {
        if (!tableBody) return;

        const searchTerm = searchInput ? searchInput.value.trim().toLowerCase() : '';
        const selectedStatus = statusFilter ? statusFilter.value : 'All';
        const selectedSupplier = supplierFilter ? supplierFilter.value : 'All';
        const selectedDate = dateFilter ? dateFilter.value : '';

        const filteredPOs = purchaseOrdersData.filter(po => {
            const matchesSearch = !searchTerm ||
                po.poNumber.toLowerCase().includes(searchTerm) ||
                po.deliveryReceipts.some(dr => dr.supplier && dr.supplier.toLowerCase().includes(searchTerm));

            const matchesStatus = (selectedStatus === 'All') || (po.poStatus === selectedStatus);

            const matchesSupplier = (selectedSupplier === 'All') ||
                po.deliveryReceipts.some(dr => dr.supplier === selectedSupplier);

            const matchesDate = !selectedDate ||
                po.deliveryReceipts.some(dr => dr.deliveryDate && dr.deliveryDate.includes(selectedDate));

            return matchesSearch && matchesStatus && matchesSupplier && matchesDate;
        });

        const totalRecords = filteredPOs.length;
        const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize));
        if (currentPage > totalPages) currentPage = totalPages;

        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = Math.min(startIndex + pageSize, totalRecords);
        const paginatedPOs = filteredPOs.slice(startIndex, endIndex);

        if (paginationInfo) {
            paginationInfo.textContent = totalRecords === 0
                ? 'Showing 0-0 of 0 records'
                : `Showing ${startIndex + 1}-${endIndex} of ${totalRecords} records`;
        }

        if (prevPageBtn) prevPageBtn.disabled = (currentPage <= 1);
        if (nextPageBtn) nextPageBtn.disabled = (currentPage >= totalPages);

        if (totalRecords === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="8" class="empty-state-row">
                        <i class="fas fa-search mb-1" style="font-size: 1.5rem;"></i>
                        <div>No purchase orders found matching the current criteria.</div>
                    </td>
                </tr>
            `;
            return;
        }

        tableBody.innerHTML = paginatedPOs.map(po => {
            const suppliers = new Set(po.deliveryReceipts.map(dr => dr.supplier));
            const numSuppliers = suppliers.size;

            let totalAcceptedQty = 0;
            po.deliveryReceipts.forEach(dr => {
                if (dr.drStatus === 'Verified' || dr.drStatus === 'Verified with Discrepancy') {
                    dr.materials.forEach(mat => {
                        totalAcceptedQty += (mat.acceptedQty || 0);
                    });
                }
            });

            const remainingQty = Math.max(0, po.orderedQty - totalAcceptedQty);
            const progressPercent = Math.min(100, Math.round((totalAcceptedQty / po.orderedQty) * 100));

            const poBadge = badgeClassForPo(po.poStatus);

            return `
                <tr>
                    <td class="font-semibold text-main">${po.poNumber}</td>
                    <td>${numSuppliers} Supplier${numSuppliers !== 1 ? 's' : ''}</td>
                    <td class="text-right">${po.orderedQty} ${po.unit}</td>
                    <td class="text-right text-success font-semibold">${totalAcceptedQty} ${po.unit}</td>
                    <td class="text-right">${remainingQty} ${po.unit}</td>
                    <td>
                        <div class="po-table-progress-bar">
                            <div class="po-table-progress-track">
                                <div class="po-table-progress-fill" style="width: ${progressPercent}%;"></div>
                            </div>
                            <span class="po-table-progress-text">${progressPercent}%</span>
                        </div>
                    </td>
                    <td><span class="badge ${poBadge}">${po.poStatus}</span></td>
                    <td>
                        <div class="action-list" aria-label="Purchase order actions">
                            <button
                                type="button"
                                class="action-item-btn"
                                data-action="view-purchase-order"
                                data-po-id="${po.poNumber}"
                                title="View Details"
                                aria-label="View Details">
                                <i class="fas fa-eye" aria-hidden="true"></i>
                                <span class="action-label">View Details</span>
                            </button>
                            <button
                                type="button"
                                class="action-item-btn"
                                data-action="export-purchase-order"
                                data-po-id="${po.poNumber}"
                                title="Export Report"
                                aria-label="Export Report">
                                <i class="fas fa-file-export" aria-hidden="true"></i>
                                <span class="action-label">Export Report</span>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    };

    // ==========================================
    // 4. Modal Controllers: View Details & Receipt History
    // ==========================================
    const viewPurchaseOrder = (poNumber) => {
        const po = purchaseOrdersData.find(p => p.poNumber === poNumber);
        if (!po) return;

        selectedPoNumber = poNumber;
        setGuidedStep(2);

        const viewBody = document.getElementById('viewBody');
        if (!viewBody) return;

        let totalAcceptedQty = 0;
        let totalExpectedValue = 0;
        let totalAcceptedValue = 0;

        po.deliveryReceipts.forEach(dr => {
            dr.materials.forEach(mat => {
                totalExpectedValue += (mat.expectedQty * mat.unitPrice);
                if (dr.drStatus === 'Verified' || dr.drStatus === 'Verified with Discrepancy') {
                    totalAcceptedQty += (mat.acceptedQty || 0);
                    totalAcceptedValue += ((mat.acceptedQty || 0) * mat.unitPrice);
                }
            });
        });

        const remainingQty = Math.max(0, po.orderedQty - totalAcceptedQty);
        const progressPercent = Math.min(100, Math.round((totalAcceptedQty / po.orderedQty) * 100));

        const drRows = po.deliveryReceipts.map(dr => {
            const drBadge = badgeClassForDr(dr.drStatus);

            let receiptValue = 0;
            dr.materials.forEach(mat => {
                receiptValue += (mat.expectedQty * mat.unitPrice);
            });

            const hasDiscrepancy = dr.drStatus === 'Verified with Discrepancy' ||
                dr.drStatus === 'Return Required' ||
                dr.materials.some((material) =>
                    (material.damagedQty || 0) > 0 || (material.missingQty || 0) > 0
                );

            let actionBtns = `
                <div class="action-list receipt-action-list" aria-label="${dr.receiptNumber} actions">
                    <button
                        type="button"
                        class="action-item-btn"
                        data-action="view-receipt-items"
                        data-po-id="${po.poNumber}"
                        data-receipt-id="${dr.receiptNumber}"
                        title="View Items"
                        aria-label="View Items">
                        <i class="fas fa-list-alt" aria-hidden="true"></i>
                        <span class="action-label">View Items</span>
                    </button>
            `;

            if (dr.drStatus === 'Arrived' || dr.drStatus === 'Expected') {
                actionBtns += `
                    <button
                        type="button"
                        class="action-item-btn"
                        data-action="open-verify-receipt"
                        data-po-id="${po.poNumber}"
                        data-receipt-id="${dr.receiptNumber}"
                        title="Verify Delivery"
                        aria-label="Verify Delivery">
                        <i class="fas fa-clipboard-check" aria-hidden="true"></i>
                        <span class="action-label">Verify Delivery</span>
                    </button>
                `;
            }

            if (hasDiscrepancy && dr.drStatus !== 'Return Required') {
                actionBtns += `
                    <button
                        type="button"
                        class="action-item-btn"
                        data-action="open-return-request"
                        data-po-id="${po.poNumber}"
                        data-receipt-id="${dr.receiptNumber}"
                        title="Return Request"
                        aria-label="Return Request">
                        <i class="fas fa-undo-alt" aria-hidden="true"></i>
                        <span class="action-label">Return Request</span>
                    </button>
                `;
            } else if (dr.drStatus === 'Return Required') {
                actionBtns += `
                    <button
                        type="button"
                        class="action-item-btn"
                        data-action="view-return-request"
                        data-po-id="${po.poNumber}"
                        data-receipt-id="${dr.receiptNumber}"
                        title="View Return Request"
                        aria-label="View Return Request">
                        <i class="fas fa-undo-alt" aria-hidden="true"></i>
                        <span class="action-label">View Return Request</span>
                    </button>
                `;
            }

            if (hasDiscrepancy) {
                actionBtns += `
                    <button
                        type="button"
                        class="action-item-btn"
                        data-action="view-discrepancy"
                        data-po-id="${po.poNumber}"
                        data-receipt-id="${dr.receiptNumber}"
                        title="View Discrepancy"
                        aria-label="View Discrepancy">
                        <i class="fas fa-exclamation-triangle" aria-hidden="true"></i>
                        <span class="action-label">View Discrepancy</span>
                    </button>
                `;
            }

            actionBtns += '</div>';

            return `
                <tr>
                    <td class="font-semibold text-main">${dr.batchNumber}</td>
                    <td>${dr.deliveryRefNumber}</td>
                    <td>${dr.receiptNumber}</td>
                    <td>${dr.supplier}</td>
                    <td>${dr.deliveryDate}</td>
                    <td>${dr.warehouse}</td>
                    <td class="text-right font-semibold">${formatPeso(receiptValue)}</td>
                    <td><span class="badge ${drBadge}">${dr.drStatus}</span></td>
                    <td>${actionBtns}</td>
                </tr>
            `;
        }).join('');

        viewBody.innerHTML = `
            <div class="po-progress-card mb-3">
                <div class="po-progress-header">
                    <span class="po-progress-title">
                        <i class="fas fa-box-open icon-primary"></i> ${po.poNumber} — ${po.material}
                    </span>
                    <span class="badge ${badgeClassForPo(po.poStatus)}">${po.poStatus}</span>
                </div>

                <div class="po-progress-stats">
                    <div class="po-stat-box">
                        <div class="po-stat-label">Ordered Quantity</div>
                        <div class="po-stat-value">${po.orderedQty} ${po.unit}</div>
                    </div>
                    <div class="po-stat-box">
                        <div class="po-stat-label">Accepted Quantity</div>
                        <div class="po-stat-value text-success">${totalAcceptedQty} ${po.unit}</div>
                    </div>
                    <div class="po-stat-box">
                        <div class="po-stat-label">Remaining Quantity</div>
                        <div class="po-stat-value">${remainingQty} ${po.unit}</div>
                    </div>
                </div>

                <div class="po-progress-bar-wrapper">
                    <div class="po-progress-track">
                        <div class="po-progress-fill" style="width: ${progressPercent}%;"></div>
                    </div>
                    <span class="po-progress-percentage">${progressPercent}%</span>
                </div>
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
                            <th class="text-right">Expected Batch Value</th>
                            <th>Receipt Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${drRows}
                    </tbody>
                </table>
            </div>
        `;

        openExclusiveModal('viewModal');
    };

    const openDeliveryReceipt = (poNumber, receiptNumber) => {
        const po = purchaseOrdersData.find(p => p.poNumber === poNumber);
        if (!po) return;

        const dr = po.deliveryReceipts.find(r => r.receiptNumber === receiptNumber);
        if (!dr) return;

        const itemsBody = document.getElementById('viewReceiptItemsBody');
        if (!itemsBody) return;

        let totalExpectedVal = 0;
        let totalAcceptedVal = 0;
        let totalDamagedVal = 0;
        let totalMissingVal = 0;

        const materialRows = dr.materials.map(mat => {
            const expectedVal = mat.expectedQty * mat.unitPrice;
            const acceptedVal = (mat.acceptedQty || 0) * mat.unitPrice;
            const damagedVal = (mat.damagedQty || 0) * mat.unitPrice;
            const missingVal = (mat.missingQty || 0) * mat.unitPrice;

            totalExpectedVal += expectedVal;
            totalAcceptedVal += acceptedVal;
            totalDamagedVal += damagedVal;
            totalMissingVal += missingVal;

            return `
                <tr>
                    <td class="font-semibold text-main">${mat.materialId}</td>
                    <td>${mat.description}</td>
                    <td class="text-right">${formatPeso(mat.unitPrice)}</td>
                    <td class="text-right">${mat.expectedQty} ${mat.unit}</td>
                    <td class="text-right">${mat.receivedQty !== null ? mat.receivedQty : '-'}</td>
                    <td class="text-right text-danger">${mat.damagedQty || 0}</td>
                    <td class="text-right text-success font-semibold">${mat.acceptedQty || 0}</td>
                    <td class="text-right text-danger">${mat.missingQty || 0}</td>
                    <td class="text-right">${formatPeso(acceptedVal)}</td>
                    <td>${mat.remarks || '<span class="text-muted-sm">None</span>'}</td>
                </tr>
            `;
        }).join('');

        itemsBody.innerHTML = `
            <div class="dr-readonly-section mb-3">
                <div class="sub-form-grid">
                    <div><span class="text-muted-sm">Purchase Order</span><div class="font-semibold">${po.poNumber}</div></div>
                    <div><span class="text-muted-sm">Receipt Number</span><div class="font-semibold">${dr.receiptNumber}</div></div>
                    <div><span class="text-muted-sm">Delivery Ref</span><div class="font-semibold">${dr.deliveryRefNumber}</div></div>
                    <div><span class="text-muted-sm">Supplier</span><div class="font-semibold">${dr.supplier}</div></div>
                    <div><span class="text-muted-sm">Delivery Date</span><div class="font-semibold">${dr.deliveryDate}</div></div>
                    <div><span class="text-muted-sm">Receipt Status</span><div><span class="badge ${badgeClassForDr(dr.drStatus)}">${dr.drStatus}</span></div></div>
                </div>
            </div>

            <div class="section-title mb-2">
                <i class="fas fa-boxes icon-secondary"></i>
                <span>Itemized Materials Packing List</span>
            </div>

            <div class="table-wrapper mb-3">
                <table class="table">
                    <thead>
                        <tr>
                            <th>Material ID</th>
                            <th>Description</th>
                            <th class="text-right">Unit Price</th>
                            <th class="text-right">Expected Qty</th>
                            <th class="text-right">Received Qty</th>
                            <th class="text-right">Damaged Qty</th>
                            <th class="text-right">Accepted Qty</th>
                            <th class="text-right">Missing Qty</th>
                            <th class="text-right">Accepted Value</th>
                            <th>Remarks</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${materialRows}
                    </tbody>
                </table>
            </div>

            <div class="po-progress-card">
                <div class="po-progress-header">
                    <span class="po-progress-title">
                        <i class="fas fa-calculator icon-primary"></i> Receipt Financial Breakdown
                    </span>
                </div>
                <div class="financial-summary-grid">
                    <div class="po-stat-box">
                        <div class="po-stat-label">Total Expected Value</div>
                        <div class="po-stat-value">${formatPeso(totalExpectedVal)}</div>
                    </div>
                    <div class="po-stat-box">
                        <div class="po-stat-label">Total Accepted Value</div>
                        <div class="po-stat-value text-success">${formatPeso(totalAcceptedVal)}</div>
                    </div>
                    <div class="po-stat-box">
                        <div class="po-stat-label">Total Damaged Value</div>
                        <div class="po-stat-value text-danger">${formatPeso(totalDamagedVal)}</div>
                    </div>
                    <div class="po-stat-box">
                        <div class="po-stat-label">Total Missing Value</div>
                        <div class="po-stat-value text-danger">${formatPeso(totalMissingVal)}</div>
                    </div>
                </div>
            </div>
        `;

        openExclusiveModal('viewReceiptItemsModal');
    };

    // ==========================================
    // 5. Itemized Verification Modal Controller & Calculations
    // ==========================================
    const recalculateVerificationTotals = () => {
        const rows = document.querySelectorAll('#verifyMaterialsTableBody tr[data-material-id]');
        let numMaterials = 0;
        let totalExpectedVal = 0;
        let totalAcceptedVal = 0;
        let totalDamagedVal = 0;
        let totalMissingVal = 0;

        rows.forEach(row => {
            numMaterials++;
            const unitPrice = parseFloat(row.getAttribute('data-unit-price')) || 0;
            const expectedQty = parseInt(row.getAttribute('data-expected-qty'), 10) || 0;

            const rcvInput = row.querySelector('.input-received-qty');
            const dmgInput = row.querySelector('.input-damaged-qty');

            const receivedQty = parseSafeInt(rcvInput ? rcvInput.value : 0);
            const damagedQty = parseSafeInt(dmgInput ? dmgInput.value : 0);

            const acceptedQty = Math.max(0, receivedQty - damagedQty);
            const missingQty = Math.max(0, expectedQty - receivedQty);

            const acceptedVal = acceptedQty * unitPrice;
            const damagedVal = damagedQty * unitPrice;
            const missingVal = missingQty * unitPrice;
            const expectedVal = expectedQty * unitPrice;

            totalExpectedVal += expectedVal;
            totalAcceptedVal += acceptedVal;
            totalDamagedVal += damagedVal;
            totalMissingVal += missingVal;

            const accCell = row.querySelector('.cell-accepted-qty');
            const missCell = row.querySelector('.cell-missing-qty');
            const accValCell = row.querySelector('.cell-accepted-value');
            const dmgValCell = row.querySelector('.cell-damaged-value');
            const missValCell = row.querySelector('.cell-missing-value');

            if (accCell) accCell.textContent = acceptedQty;
            if (missCell) missCell.textContent = missingQty;
            if (accValCell) accValCell.textContent = formatPeso(acceptedVal);
            if (dmgValCell) dmgValCell.textContent = formatPeso(damagedVal);
            if (missValCell) missValCell.textContent = formatPeso(missingVal);
        });

        const sumNumMaterials = document.getElementById('sumNumMaterials');
        const sumExpectedValue = document.getElementById('sumExpectedValue');
        const sumAcceptedValue = document.getElementById('sumAcceptedValue');
        const sumDamagedValue = document.getElementById('sumDamagedValue');
        const sumMissingValue = document.getElementById('sumMissingValue');
        const sumRefundValue = document.getElementById('sumRefundValue');
        const sumReplacementValue = document.getElementById('sumReplacementValue');
        const sumFinancialImpact = document.getElementById('sumFinancialImpact');

        const totalImpact = totalDamagedVal + totalMissingVal;

        if (sumNumMaterials) sumNumMaterials.textContent = numMaterials;
        if (sumExpectedValue) sumExpectedValue.textContent = formatPeso(totalExpectedVal);
        if (sumAcceptedValue) sumAcceptedValue.textContent = formatPeso(totalAcceptedVal);
        if (sumDamagedValue) sumDamagedValue.textContent = formatPeso(totalDamagedVal);
        if (sumMissingValue) sumMissingValue.textContent = formatPeso(totalMissingVal);
        if (sumRefundValue) sumRefundValue.textContent = formatPeso(totalImpact);
        if (sumReplacementValue) sumReplacementValue.textContent = formatPeso(totalDamagedVal);
        if (sumFinancialImpact) sumFinancialImpact.textContent = formatPeso(totalImpact);
    };

    const openVerifyReceipt = (poNumber, receiptNumber) => {
        const po = purchaseOrdersData.find(p => p.poNumber === poNumber);
        if (!po) return;

        let dr = null;
        if (receiptNumber) {
            dr = po.deliveryReceipts.find(r => r.receiptNumber === receiptNumber);
        }
        if (!dr) {
            dr = po.deliveryReceipts.find(r => r.drStatus === 'Arrived' || r.drStatus === 'Expected') || po.deliveryReceipts[0];
        }
        if (!dr) return;

        selectedPoNumber = poNumber;
        selectedDrRefNumber = dr.receiptNumber;
        setGuidedStep(3);

        const verifyPoNumberDisplay = document.getElementById('verifyPoNumberDisplay');
        const verifyPoStatusBadge = document.getElementById('verifyPoStatusBadge');
        const verifyDrBatchNumber = document.getElementById('verifyDrBatchNumber');
        const verifyDrRefNumber = document.getElementById('verifyDrRefNumber');
        const verifyDrReceiptNumber = document.getElementById('verifyDrReceiptNumber');
        const verifyDrSupplier = document.getElementById('verifyDrSupplier');
        const verifyDrExpectedDate = document.getElementById('verifyDrExpectedDate');
        const verifyDrStatusBadge = document.getElementById('verifyDrStatusBadge');

        if (verifyPoNumberDisplay) verifyPoNumberDisplay.textContent = po.poNumber;
        if (verifyPoStatusBadge) {
            verifyPoStatusBadge.className = `badge ${badgeClassForPo(po.poStatus)}`;
            verifyPoStatusBadge.textContent = po.poStatus;
        }
        if (verifyDrBatchNumber) verifyDrBatchNumber.textContent = dr.batchNumber;
        if (verifyDrRefNumber) verifyDrRefNumber.textContent = dr.deliveryRefNumber;
        if (verifyDrReceiptNumber) verifyDrReceiptNumber.textContent = dr.receiptNumber;
        if (verifyDrSupplier) verifyDrSupplier.textContent = dr.supplier;
        if (verifyDrExpectedDate) verifyDrExpectedDate.textContent = dr.deliveryDate;
        if (verifyDrStatusBadge) {
            verifyDrStatusBadge.className = `badge ${badgeClassForDr(dr.drStatus)}`;
            verifyDrStatusBadge.textContent = dr.drStatus;
        }

        const verifyMaterialsTableBody = document.getElementById('verifyMaterialsTableBody');
        if (!verifyMaterialsTableBody) return;

        verifyMaterialsTableBody.innerHTML = dr.materials.map(mat => {
            const initReceived = (mat.receivedQty !== null && mat.receivedQty !== undefined)
                ? mat.receivedQty
                : mat.expectedQty;
            const initDamaged = mat.damagedQty || 0;
            const initAccepted = Math.max(0, initReceived - initDamaged);
            const initMissing = Math.max(0, mat.expectedQty - initReceived);

            const accValue = initAccepted * mat.unitPrice;
            const dmgValue = initDamaged * mat.unitPrice;
            const missValue = initMissing * mat.unitPrice;

            return `
                <tr data-material-id="${mat.materialId}" data-unit-price="${mat.unitPrice}" data-expected-qty="${mat.expectedQty}">
                    <td class="font-semibold text-main">${mat.materialId}</td>
                    <td>${mat.description}</td>
                    <td class="text-right font-semibold">${mat.expectedQty}</td>
                    <td>${mat.unit}</td>
                    <td class="text-right">${formatPeso(mat.unitPrice)}</td>
                    <td class="text-right">
                        <input type="number" class="form-control table-input-number input-received-qty" min="0" value="${initReceived}">
                    </td>
                    <td class="text-right">
                        <input type="number" class="form-control table-input-number input-damaged-qty" min="0" value="${initDamaged}">
                    </td>
                    <td class="text-right text-success font-semibold cell-accepted-qty">${initAccepted}</td>
                    <td class="text-right text-danger font-semibold cell-missing-qty">${initMissing}</td>
                    <td class="text-right cell-accepted-value">${formatPeso(accValue)}</td>
                    <td class="text-right text-danger cell-damaged-value">${formatPeso(dmgValue)}</td>
                    <td class="text-right text-danger cell-missing-value">${formatPeso(missValue)}</td>
                    <td>
                        <select class="form-control table-select input-warehouse">
                            <option value="Warehouse 1" ${mat.warehouse === 'Warehouse 1' ? 'selected' : ''}>Warehouse 1</option>
                            <option value="Warehouse 2" ${mat.warehouse === 'Warehouse 2' ? 'selected' : ''}>Warehouse 2</option>
                            <option value="Warehouse 3" ${mat.warehouse === 'Warehouse 3' ? 'selected' : ''}>Warehouse 3</option>
                        </select>
                    </td>
                    <td>
                        <input type="text" class="form-control table-input-text input-remarks" value="${mat.remarks || ''}" placeholder="Remarks...">
                    </td>
                </tr>
            `;
        }).join('');

        const numericInputs = verifyMaterialsTableBody.querySelectorAll('input[type="number"]');
        numericInputs.forEach(input => {
            input.addEventListener('input', recalculateVerificationTotals);
            input.addEventListener('change', recalculateVerificationTotals);
        });

        recalculateVerificationTotals();

        openExclusiveModal('verifyModal');
    };

    const confirmVerification = () => {
        const po = purchaseOrdersData.find(p => p.poNumber === selectedPoNumber);
        if (!po) return;

        const dr = po.deliveryReceipts.find(r => r.receiptNumber === selectedDrRefNumber);
        if (!dr) return;

        const rows = document.querySelectorAll('#verifyMaterialsTableBody tr[data-material-id]');
        let hasDiscrepancy = false;

        rows.forEach(row => {
            const matId = row.getAttribute('data-material-id');
            const mat = dr.materials.find(m => m.materialId === matId);
            if (!mat) return;

            const rcvInput = row.querySelector('.input-received-qty');
            const dmgInput = row.querySelector('.input-damaged-qty');
            const whSelect = row.querySelector('.input-warehouse');
            const rmkInput = row.querySelector('.input-remarks');

            mat.receivedQty = parseSafeInt(rcvInput ? rcvInput.value : 0);
            mat.damagedQty = parseSafeInt(dmgInput ? dmgInput.value : 0);
            mat.acceptedQty = Math.max(0, mat.receivedQty - mat.damagedQty);
            mat.missingQty = Math.max(0, mat.expectedQty - mat.receivedQty);
            mat.warehouse = whSelect ? whSelect.value : mat.warehouse;
            mat.remarks = rmkInput ? rmkInput.value.trim() : mat.remarks;

            if (mat.damagedQty > 0 || mat.missingQty > 0) {
                hasDiscrepancy = true;
            }
        });

        dr.drStatus = hasDiscrepancy ? 'Verified with Discrepancy' : 'Verified';

        let allVerified = true;
        let totalPoAccepted = 0;
        po.deliveryReceipts.forEach(r => {
            if (r.drStatus !== 'Verified' && r.drStatus !== 'Verified with Discrepancy') {
                allVerified = false;
            }
            r.materials.forEach(m => {
                totalPoAccepted += (m.acceptedQty || 0);
            });
        });

        const moreReceiptsExpected = document.getElementById('poMoreReceiptsSelect')?.value !== 'No';
        const outstandingReason = document.getElementById('poOutstandingReasonSelect')?.value || '';

        if (allVerified && totalPoAccepted >= po.orderedQty) {
            po.poStatus = 'Completed';
        } else if (!moreReceiptsExpected && outstandingReason) {
            po.poStatus = 'Closed with Outstanding Quantity';
        } else if (totalPoAccepted > 0) {
            po.poStatus = 'Partially Delivered';
        } else {
            po.poStatus = 'Ordered';
        }

        logActivity(
            hasDiscrepancy ? 'fa-exclamation-triangle' : 'fa-check-circle',
            hasDiscrepancy ? 'danger' : 'success',
            hasDiscrepancy ? 'Delivery Verified with Discrepancy' : 'Delivery Receipt Verified',
            `Delivery verification completed for ${po.poNumber}. Status set to ${dr.drStatus}.`,
            {
                activityType: hasDiscrepancy ? 'Delivery Verified with Discrepancy' : 'Delivery Receipt Verified',
                poNumber: po.poNumber,
                receiptNumber: dr.receiptNumber,
                batchNumber: dr.batchNumber,
                previousStatus: 'Arrived',
                updatedStatus: dr.drStatus,
                supplier: dr.supplier,
                warehouse: dr.warehouse,
                reference: dr.deliveryRefNumber,
                remarks: `Itemized verification completed. Receipt status changed to ${dr.drStatus}.`
            }
        );

        if (typeof window.closeModal === 'function') {
            window.closeModal('verifyModal');
            window.closeModal('verifyConfirmModal');
        }

        if (typeof window.showToast === 'function') {
            window.showToast(
                'Delivery Verified',
                `Receipt ${dr.receiptNumber} verification recorded successfully.`,
                'success'
            );
        }

        renderDeliveriesTable();
        updateSummaryMetrics();
        setGuidedStep(4);
    };

    // ==========================================
    // 6. Return Request & Discrepancy Workflows
    // ==========================================
    const recalculateReturnRequestTotals = () => {
        const rows = document.querySelectorAll('#returnMaterialsTableBody tr[data-material-id]');
        let selectedCount = 0;
        let totalValue = 0;

        rows.forEach((row) => {
            const checkbox = row.querySelector('.return-item-checkbox');
            const qtyInput = row.querySelector('.return-qty-input');
            const valueCell = row.querySelector('.return-value-cell');
            const unitPrice = parseFloat(row.getAttribute('data-unit-price')) || 0;
            const maxQty = parseSafeInt(row.getAttribute('data-max-return-qty'));
            const selected = Boolean(checkbox && checkbox.checked);

            if (qtyInput) {
                qtyInput.disabled = !selected;
                const safeQty = Math.min(parseSafeInt(qtyInput.value), maxQty);
                if (String(safeQty) !== qtyInput.value) qtyInput.value = safeQty;
                const rowValue = selected ? safeQty * unitPrice : 0;
                if (valueCell) valueCell.textContent = formatPeso(rowValue);
                if (selected) {
                    selectedCount += 1;
                    totalValue += rowValue;
                }
            }
        });

        const countDisplay = document.getElementById('returnSelectedCount');
        const totalDisplay = document.getElementById('returnTotalValueDisplay');
        if (countDisplay) countDisplay.textContent = `${selectedCount} Material${selectedCount === 1 ? '' : 's'}`;
        if (totalDisplay) totalDisplay.textContent = formatPeso(totalValue);
    };

    const openReturnRequest = (poNumber, receiptNumber) => {
        const po = purchaseOrdersData.find((item) => item.poNumber === poNumber);
        if (!po) return;

        let dr = receiptNumber
            ? po.deliveryReceipts.find((item) => item.receiptNumber === receiptNumber)
            : null;

        if (!dr) {
            dr = po.deliveryReceipts.find((item) =>
                item.drStatus === 'Verified with Discrepancy' || item.drStatus === 'Verified'
            ) || po.deliveryReceipts[0];
        }
        if (!dr) return;

        selectedPoNumber = po.poNumber;
        selectedDrRefNumber = dr.receiptNumber;

        const poDisplay = document.getElementById('retPoNumberDisplay');
        const receiptDisplay = document.getElementById('retDrReceiptDisplay');
        const supplierDisplay = document.getElementById('retSupplierDisplay');
        const deliveryRefDisplay = document.getElementById('retDeliveryRefDisplay');
        const table = document.getElementById('returnMaterialsTableBody');
        const formError = document.getElementById('returnFormError');
        const notes = document.getElementById('returnGeneralNotes');
        const selectAll = document.getElementById('selectAllReturnItems');

        if (poDisplay) poDisplay.textContent = po.poNumber;
        if (receiptDisplay) receiptDisplay.textContent = dr.receiptNumber;
        if (supplierDisplay) supplierDisplay.textContent = dr.supplier;
        if (deliveryRefDisplay) deliveryRefDisplay.textContent = dr.deliveryRefNumber;
        if (formError) {
            formError.textContent = '';
            formError.style.display = 'none';
        }
        if (notes) notes.value = '';
        if (selectAll) selectAll.checked = false;

        if (!table) return;

        const eligibleMaterials = dr.materials.filter((material) =>
            (material.damagedQty || 0) + (material.missingQty || 0) > 0
        );

        if (eligibleMaterials.length === 0) {
            table.innerHTML = `
                <tr>
                    <td colspan="9" class="empty-state-row">
                        <i class="fas fa-info-circle mb-1"></i>
                        <div>No damaged or missing quantities are eligible for return on this receipt.</div>
                    </td>
                </tr>
            `;
        } else {
            table.innerHTML = eligibleMaterials.map((material) => {
                const maxQty = (material.damagedQty || 0) + (material.missingQty || 0);
                return `
                    <tr data-material-id="${material.materialId}"
                        data-unit-price="${material.unitPrice}"
                        data-max-return-qty="${maxQty}">
                        <td>
                            <input type="checkbox" class="return-item-checkbox" aria-label="Select ${material.description}">
                        </td>
                        <td class="font-semibold text-main">${material.materialId}</td>
                        <td>${material.description}</td>
                        <td class="text-right">${formatPeso(material.unitPrice)}</td>
                        <td class="text-right text-danger">${material.damagedQty || 0}</td>
                        <td class="text-right text-danger">${material.missingQty || 0}</td>
                        <td class="text-right">
                            <input type="number" class="form-control table-input-number return-qty-input"
                                   min="1" max="${maxQty}" value="${maxQty}" disabled>
                        </td>
                        <td class="text-right font-semibold return-value-cell">${formatPeso(0)}</td>
                        <td>
                            <select class="form-control table-select return-resolution-select" disabled>
                                <option value="Replacement">Replacement</option>
                                <option value="Refund">Refund</option>
                                <option value="Supplier Credit">Supplier Credit</option>
                            </select>
                        </td>
                    </tr>
                `;
            }).join('');
        }

        table.querySelectorAll('.return-item-checkbox').forEach((checkbox) => {
            checkbox.addEventListener('change', () => {
                const row = checkbox.closest('tr');
                const resolution = row ? row.querySelector('.return-resolution-select') : null;
                if (resolution) resolution.disabled = !checkbox.checked;
                recalculateReturnRequestTotals();
            });
        });
        table.querySelectorAll('.return-qty-input').forEach((input) => {
            input.addEventListener('input', recalculateReturnRequestTotals);
            input.addEventListener('change', recalculateReturnRequestTotals);
        });

        recalculateReturnRequestTotals();
        openExclusiveModal('returnRequestModal');
    };

    const viewReturnRequest = (poNumber, receiptNumber) => {
        openReturnRequest(poNumber, receiptNumber);
    };

    const openDiscrepancy = (poNumber, receiptNumber) => {
        const po = purchaseOrdersData.find((item) => item.poNumber === poNumber);
        if (!po) return;

        const dr = (receiptNumber
            ? po.deliveryReceipts.find((item) => item.receiptNumber === receiptNumber)
            : null) || po.deliveryReceipts.find((item) =>
                item.drStatus === 'Verified with Discrepancy' || item.drStatus === 'Return Required'
            ) || po.deliveryReceipts[0];
        if (!dr) return;

        selectedPoNumber = po.poNumber;
        selectedDrRefNumber = dr.receiptNumber;

        const poInput = document.getElementById('discrepancyPoNumber');
        const refInput = document.getElementById('discrepancyRefNumber');
        const typeInput = document.getElementById('discrepancyType');
        const descInput = document.getElementById('discrepancyDesc');

        if (poInput) poInput.value = po.poNumber;
        if (refInput) refInput.value = dr.deliveryRefNumber;
        if (typeInput) typeInput.value = '';
        if (descInput) descInput.value = '';

        openExclusiveModal('discrepancyModal');
    };

    const viewDiscrepancy = (poNumber, receiptNumber) => {
        const po = purchaseOrdersData.find((item) => item.poNumber === poNumber);
        if (!po) return;

        const dr = po.deliveryReceipts.find((item) => item.receiptNumber === receiptNumber);
        if (!dr) return;

        const detailsBody = document.getElementById('discrepancyDetailsBody');
        if (!detailsBody) return;

        const affectedMaterials = dr.materials.filter((material) =>
            (material.damagedQty || 0) > 0 || (material.missingQty || 0) > 0
        );

        let totalDamagedValue = 0;
        let totalMissingValue = 0;

        const rows = affectedMaterials.length > 0
            ? affectedMaterials.map((material) => {
                const damagedValue = (material.damagedQty || 0) * material.unitPrice;
                const missingValue = (material.missingQty || 0) * material.unitPrice;
                totalDamagedValue += damagedValue;
                totalMissingValue += missingValue;

                return `
                    <tr>
                        <td class="font-semibold text-main">${material.materialId}</td>
                        <td>${material.description}</td>
                        <td class="text-right">${material.damagedQty || 0} ${material.unit}</td>
                        <td class="text-right">${material.missingQty || 0} ${material.unit}</td>
                        <td class="text-right text-danger">${formatPeso(damagedValue)}</td>
                        <td class="text-right text-danger">${formatPeso(missingValue)}</td>
                        <td>${material.remarks || 'No additional remarks provided.'}</td>
                    </tr>
                `;
            }).join('')
            : `
                <tr>
                    <td colspan="7" class="empty-state-row">
                        <i class="fas fa-check-circle mb-1"></i>
                        <div>No damaged or missing quantities are recorded for this receipt.</div>
                    </td>
                </tr>
            `;

        detailsBody.innerHTML = `
            <div class="dr-readonly-section mb-3">
                <div class="sub-form-grid">
                    <div>
                        <span class="text-muted-sm">Purchase Order</span>
                        <div class="font-semibold">${po.poNumber}</div>
                    </div>
                    <div>
                        <span class="text-muted-sm">Delivery Receipt</span>
                        <div class="font-semibold">${dr.receiptNumber}</div>
                    </div>
                    <div>
                        <span class="text-muted-sm">Delivery Reference</span>
                        <div class="font-semibold">${dr.deliveryRefNumber}</div>
                    </div>
                    <div>
                        <span class="text-muted-sm">Supplier</span>
                        <div class="font-semibold">${dr.supplier}</div>
                    </div>
                    <div>
                        <span class="text-muted-sm">Receipt Status</span>
                        <div><span class="badge ${badgeClassForDr(dr.drStatus)}">${dr.drStatus}</span></div>
                    </div>
                    <div>
                        <span class="text-muted-sm">Receipt Remarks</span>
                        <div class="font-semibold">${dr.remarks || 'No general remarks provided.'}</div>
                    </div>
                </div>
            </div>

            <div class="section-title mb-2">
                <i class="fas fa-exclamation-triangle icon-danger"></i>
                <span>Affected Materials</span>
            </div>

            <div class="table-wrapper mb-3">
                <table class="table">
                    <thead>
                        <tr>
                            <th>Material ID</th>
                            <th>Material Description</th>
                            <th class="text-right">Damaged Qty</th>
                            <th class="text-right">Missing Qty</th>
                            <th class="text-right">Damaged Value</th>
                            <th class="text-right">Missing Value</th>
                            <th>Remarks</th>
                        </tr>
                    </thead>
                    <tbody>${rows}</tbody>
                </table>
            </div>

            <div class="po-progress-card">
                <div class="financial-summary-grid">
                    <div class="po-stat-box">
                        <div class="po-stat-label">Total Damaged Value</div>
                        <div class="po-stat-value text-danger">${formatPeso(totalDamagedValue)}</div>
                    </div>
                    <div class="po-stat-box">
                        <div class="po-stat-label">Total Missing Value</div>
                        <div class="po-stat-value text-danger">${formatPeso(totalMissingValue)}</div>
                    </div>
                    <div class="po-stat-box">
                        <div class="po-stat-label">Total Financial Impact</div>
                        <div class="po-stat-value text-danger">${formatPeso(totalDamagedValue + totalMissingValue)}</div>
                    </div>
                </div>
            </div>
        `;

        openExclusiveModal('discrepancyDetailsModal');
    };

    // ==========================================
    // 7. Export Purchase Order Logic
    // ==========================================
    const exportPurchaseOrder = (poNumber) => {
        const po = purchaseOrdersData.find(p => p.poNumber === poNumber);
        const targetNumber = po ? po.poNumber : (poNumber || 'Deliveries');

        logActivity(
            'fa-file-export',
            'info',
            'Report Exported',
            `Exported delivery ledger records for ${targetNumber}.`,
            {
                activityType: 'Report Exported',
                poNumber: po?.poNumber || targetNumber,
                receiptNumber: '-',
                batchNumber: '-',
                previousStatus: '-',
                updatedStatus: '-',
                supplier: '-',
                warehouse: '-',
                reference: targetNumber,
                remarks: `Delivery activity report generated for ${targetNumber}.`
            }
        );

        if (typeof window.showToast === 'function') {
            window.showToast(
                'Export Complete',
                `Delivery activity ledger for ${targetNumber} exported successfully.`,
                'success'
            );
        }
    };

    const validateVerificationRows = () => {
        const rows = document.querySelectorAll('#verifyMaterialsTableBody tr[data-material-id]');
        for (const row of rows) {
            const expected = parseSafeInt(row.getAttribute('data-expected-qty'));
            const received = parseSafeInt(row.querySelector('.input-received-qty')?.value);
            const damaged = parseSafeInt(row.querySelector('.input-damaged-qty')?.value);
            const warehouse = row.querySelector('.input-warehouse')?.value;

            if (received > expected) {
                return { valid: false, message: 'Received quantity cannot exceed the quantity listed on the Delivery Receipt.' };
            }
            if (damaged > received) {
                return { valid: false, message: 'Damaged quantity cannot exceed the physically received quantity.' };
            }
            if (!warehouse) {
                return { valid: false, message: 'Select an assigned warehouse for every material.' };
            }
        }
        return { valid: true, message: '' };
    };

    const buildVerificationConfirmation = () => {
        const po = purchaseOrdersData.find((item) => item.poNumber === selectedPoNumber);
        const dr = po?.deliveryReceipts.find((item) => item.receiptNumber === selectedDrRefNumber);
        const summary = document.getElementById('confirmVerifySummary');
        if (!po || !dr || !summary) return 0;

        let currentAccepted = 0;
        const rows = Array.from(document.querySelectorAll('#verifyMaterialsTableBody tr[data-material-id]'));
        const itemRows = rows.map((row) => {
            const description = row.children[1]?.textContent?.trim() || row.getAttribute('data-material-id');
            const expected = parseSafeInt(row.getAttribute('data-expected-qty'));
            const received = parseSafeInt(row.querySelector('.input-received-qty')?.value);
            const damaged = parseSafeInt(row.querySelector('.input-damaged-qty')?.value);
            const accepted = Math.max(0, received - damaged);
            const missing = Math.max(0, expected - received);
            currentAccepted += accepted;
            return `<tr><td>${description}</td><td class="text-right">${expected}</td><td class="text-right">${received}</td><td class="text-right text-danger">${damaged}</td><td class="text-right text-success">${accepted}</td><td class="text-right text-danger">${missing}</td></tr>`;
        }).join('');

        let previouslyAccepted = 0;
        po.deliveryReceipts.forEach((receipt) => {
            if (receipt.receiptNumber === dr.receiptNumber) return;
            if (receipt.drStatus === 'Verified' || receipt.drStatus === 'Verified with Discrepancy' || receipt.drStatus === 'Return Required') {
                receipt.materials.forEach((material) => { previouslyAccepted += material.acceptedQty || 0; });
            }
        });

        const remaining = Math.max(0, po.orderedQty - previouslyAccepted - currentAccepted);
        summary.innerHTML = `
            <div class="dr-readonly-section mb-3">
                <div class="sub-form-grid">
                    <div><span class="text-muted-sm">Purchase Order</span><div class="font-semibold">${po.poNumber}</div></div>
                    <div><span class="text-muted-sm">Delivery Receipt</span><div class="font-semibold">${dr.receiptNumber}</div></div>
                    <div><span class="text-muted-sm">Accepted This Batch</span><div class="font-semibold text-success">${currentAccepted}</div></div>
                    <div><span class="text-muted-sm">PO Remaining After Batch</span><div class="font-semibold">${remaining}</div></div>
                </div>
            </div>
            <div class="table-wrapper">
                <table class="table">
                    <thead><tr><th>Material</th><th class="text-right">Expected</th><th class="text-right">Received</th><th class="text-right">Damaged</th><th class="text-right">Accepted</th><th class="text-right">Missing</th></tr></thead>
                    <tbody>${itemRows}</tbody>
                </table>
            </div>
        `;

        const remainingDisplay = document.getElementById('poOutstandingQtyDisplay');
        if (remainingDisplay) remainingDisplay.textContent = remaining;
        return remaining;
    };

    const initWorkflowForms = () => {
        const verifyForm = document.getElementById('verifyForm');
        const verifyError = document.getElementById('verifyFormError');
        const verifyConfirmModal = document.getElementById('verifyConfirmModal');
        const closeConfirm = document.getElementById('btnCloseConfirmModal');
        const verifyBack = document.getElementById('btnVerifyBack');
        const confirmCheckbox = document.getElementById('confirmReviewCheckbox');
        const confirmButton = document.getElementById('confirmVerifyBtn');
        const moreReceipts = document.getElementById('poMoreReceiptsSelect');
        const outstandingGroup = document.getElementById('poOutstandingClassificationGroup');
        const outstandingReason = document.getElementById('poOutstandingReasonSelect');
        const outstandingError = document.getElementById('poOutstandingError');

        verifyForm?.addEventListener('submit', (event) => {
            event.preventDefault();
            const result = validateVerificationRows();
            if (!result.valid) {
                if (verifyError) {
                    verifyError.textContent = result.message;
                    verifyError.style.display = 'block';
                }
                return;
            }
            if (verifyError) verifyError.style.display = 'none';
            buildVerificationConfirmation();
            if (confirmCheckbox) confirmCheckbox.checked = false;
            if (confirmButton) confirmButton.disabled = true;
            if (moreReceipts) moreReceipts.value = 'Yes';
            if (outstandingGroup) outstandingGroup.style.display = 'none';
            openExclusiveModal('verifyConfirmModal');
        });

        closeConfirm?.addEventListener('click', () => {
            if (verifyConfirmModal && typeof window.closeModal === 'function') window.closeModal('verifyConfirmModal');
        });
        verifyBack?.addEventListener('click', () => openExclusiveModal('verifyModal'));
        confirmCheckbox?.addEventListener('change', () => {
            if (confirmButton) confirmButton.disabled = !confirmCheckbox.checked;
        });
        moreReceipts?.addEventListener('change', () => {
            const remaining = parseSafeInt(document.getElementById('poOutstandingQtyDisplay')?.textContent);
            if (outstandingGroup) outstandingGroup.style.display = moreReceipts.value === 'No' && remaining > 0 ? 'block' : 'none';
            if (outstandingError) outstandingError.style.display = 'none';
        });
        confirmButton?.addEventListener('click', () => {
            const remaining = parseSafeInt(document.getElementById('poOutstandingQtyDisplay')?.textContent);
            if (moreReceipts?.value === 'No' && remaining > 0 && !outstandingReason?.value) {
                if (outstandingError) outstandingError.style.display = 'block';
                return;
            }
            confirmVerification();
        });

        const selectAll = document.getElementById('selectAllReturnItems');
        selectAll?.addEventListener('change', () => {
            document.querySelectorAll('#returnMaterialsTableBody .return-item-checkbox').forEach((checkbox) => {
                checkbox.checked = selectAll.checked;
                checkbox.dispatchEvent(new Event('change'));
            });
            recalculateReturnRequestTotals();
        });

        document.getElementById('returnRequestForm')?.addEventListener('submit', (event) => {
            event.preventDefault();
            const po = purchaseOrdersData.find((item) => item.poNumber === selectedPoNumber);
            const dr = po?.deliveryReceipts.find((item) => item.receiptNumber === selectedDrRefNumber);
            const error = document.getElementById('returnFormError');
            const selectedRows = Array.from(document.querySelectorAll('#returnMaterialsTableBody tr[data-material-id]'))
                .filter((row) => row.querySelector('.return-item-checkbox')?.checked);

            if (!po || !dr || selectedRows.length === 0) {
                if (error) {
                    error.textContent = 'Select at least one affected material for the return request.';
                    error.style.display = 'block';
                }
                return;
            }

            for (const row of selectedRows) {
                const qty = parseSafeInt(row.querySelector('.return-qty-input')?.value);
                const maxQty = parseSafeInt(row.getAttribute('data-max-return-qty'));
                if (qty < 1 || qty > maxQty) {
                    if (error) {
                        error.textContent = 'Return quantity must be between 1 and the affected quantity.';
                        error.style.display = 'block';
                    }
                    return;
                }
            }

            if (error) error.style.display = 'none';
            dr.drStatus = 'Return Required';
            logActivity(
                'fa-undo-alt',
                'warning',
                'Return Request Submitted',
                `Return request submitted for ${dr.receiptNumber} under ${po.poNumber}.`,
                {
                    activityType: 'Return Request Submitted',
                    poNumber: po.poNumber,
                    receiptNumber: dr.receiptNumber,
                    batchNumber: dr.batchNumber,
                    previousStatus: 'Verified with Discrepancy',
                    updatedStatus: 'Return Required',
                    supplier: dr.supplier,
                    warehouse: dr.warehouse,
                    reference: dr.deliveryRefNumber,
                    remarks: `Return request recorded for affected materials under ${dr.receiptNumber}.`
                }
            );
            window.closeModal?.('returnRequestModal');
            window.showToast?.('Return Request Submitted', `Return request for ${dr.receiptNumber} was recorded.`, 'success');
            renderDeliveriesTable();
            updateSummaryMetrics();
        });

        document.getElementById('discrepancyForm')?.addEventListener('submit', (event) => {
            event.preventDefault();
            const type = document.getElementById('discrepancyType')?.value;
            const description = document.getElementById('discrepancyDesc')?.value.trim();
            if (!type || !description) return;
            const po = purchaseOrdersData.find((item) => item.poNumber === selectedPoNumber);
            const dr = po?.deliveryReceipts.find((item) => item.receiptNumber === selectedDrRefNumber);
            if (dr) dr.drStatus = 'Verified with Discrepancy';
            logActivity(
                'fa-exclamation-triangle',
                'danger',
                'Delivery Discrepancy Reported',
                `${type} reported for ${selectedDrRefNumber || 'delivery receipt'}.`,
                {
                    activityType: 'Delivery Discrepancy Reported',
                    poNumber: po?.poNumber || selectedPoNumber,
                    receiptNumber: dr?.receiptNumber || selectedDrRefNumber,
                    batchNumber: dr?.batchNumber || '-',
                    previousStatus: dr?.drStatus || 'Arrived',
                    updatedStatus: 'Verified with Discrepancy',
                    supplier: dr?.supplier || '-',
                    warehouse: dr?.warehouse || '-',
                    reference: dr?.deliveryRefNumber || selectedDrRefNumber,
                    remarks: description
                }
            );
            window.closeModal?.('discrepancyModal');
            window.showToast?.('Discrepancy Reported', 'Purchasing has been notified for review.', 'success');
            renderDeliveriesTable();
            updateSummaryMetrics();
        });
    };

    // ==========================================
    // 8. Event Delegation for All Deliveries Actions
    // ==========================================
    const initDeliveriesActions = () => {
        document.body.addEventListener('click', (e) => {
            const actionBtn = e.target.closest('[data-action]');
            if (!actionBtn) return;

            e.preventDefault();
            e.stopPropagation();

            const action = actionBtn.getAttribute('data-action');
            const poId = actionBtn.getAttribute('data-po-id');
            const receiptId = actionBtn.getAttribute('data-receipt-id');

            switch (action) {
                case 'view-purchase-order':
                    viewPurchaseOrder(poId);
                    break;
                case 'open-delivery-receipt':
                case 'view-receipt-items':
                    openDeliveryReceipt(poId, receiptId);
                    break;
                case 'open-verify-receipt':
                    openVerifyReceipt(poId, receiptId);
                    break;
                case 'open-return-request':
                    openReturnRequest(poId, receiptId);
                    break;
                case 'view-return-request':
                    viewReturnRequest(poId, receiptId);
                    break;
                case 'open-discrepancy':
                    openDiscrepancy(poId, receiptId);
                    break;
                case 'view-discrepancy':
                    viewDiscrepancy(poId, receiptId);
                    break;
                case 'export-purchase-order':
                    exportPurchaseOrder(poId);
                    break;
                case 'view-delivery-activity':
                    openDeliveryActivityDetails(actionBtn.getAttribute('data-activity-id'));
                    break;
                default:
                    break;
            }
        });
    };

    // ==========================================
    // 9. Filters, Search & Pagination Event Binding
    // ==========================================
    const initFilterListeners = () => {
        if (searchInput) {
            searchInput.addEventListener('input', () => {
                currentPage = 1;
                renderDeliveriesTable();
            });
        }
        if (statusFilter) {
            statusFilter.addEventListener('change', () => {
                currentPage = 1;
                renderDeliveriesTable();
            });
        }
        if (supplierFilter) {
            supplierFilter.addEventListener('change', () => {
                currentPage = 1;
                renderDeliveriesTable();
            });
        }
        if (dateFilter) {
            dateFilter.addEventListener('change', () => {
                currentPage = 1;
                renderDeliveriesTable();
            });
        }
        if (btnExport) {
            btnExport.addEventListener('click', () => {
                exportPurchaseOrder('All Deliveries');
            });
        }

        const refreshDeliveryActivity = () => {
            activityPage = 1;
            renderDeliveryActivityTable();
        };

        deliveryActivitySearchInput?.addEventListener('input', refreshDeliveryActivity);
        deliveryActivityTypeFilter?.addEventListener('change', refreshDeliveryActivity);
        deliveryActivityWarehouseFilter?.addEventListener('change', refreshDeliveryActivity);
        deliveryActivityDateFilter?.addEventListener('change', refreshDeliveryActivity);

        deliveryActivityPrevBtn?.addEventListener('click', () => {
            if (activityPage > 1) {
                activityPage--;
                renderDeliveryActivityTable();
            }
        });

        deliveryActivityNextBtn?.addEventListener('click', () => {
            const totalPages = Math.max(
                1,
                Math.ceil(getFilteredDeliveryActivity().length / activityPageSize)
            );
            if (activityPage < totalPages) {
                activityPage++;
                renderDeliveryActivityTable();
            }
        });

        btnExportDeliveryActivity?.addEventListener('click', () => {
            if (typeof window.showToast === 'function') {
                window.showToast(
                    'Activity Exported',
                    'Downloading delivery activity audit history as CSV...',
                    'primary'
                );
            }
        });

        if (prevPageBtn) {
            prevPageBtn.addEventListener('click', () => {
                if (currentPage > 1) {
                    currentPage--;
                    renderDeliveriesTable();
                }
            });
        }
        if (nextPageBtn) {
            nextPageBtn.addEventListener('click', () => {
                currentPage++;
                renderDeliveriesTable();
            });
        }
    };

    // ==========================================
    // 10. Global Window Exposure
    // ==========================================
    window.viewPurchaseOrder = viewPurchaseOrder;
    window.openViewModal = viewPurchaseOrder;
    window.openDeliveryReceipt = openDeliveryReceipt;
    window.openReceiptItemsModal = openDeliveryReceipt;
    window.openVerifyReceipt = openVerifyReceipt;
    window.openVerifyModal = openVerifyReceipt;
    window.openReturnRequest = openReturnRequest;
    window.openReturnModal = openReturnRequest;
    window.viewReturnRequest = viewReturnRequest;
    window.openDiscrepancy = openDiscrepancy;
    window.viewDiscrepancy = viewDiscrepancy;
    window.exportPurchaseOrder = exportPurchaseOrder;
    window.switchDeliveriesTab = switchDeliveriesTab;
    window.recalculateVerificationTotals = recalculateVerificationTotals;
    window.confirmVerification = confirmVerification;
    window.openDeliveryActivityDetails = openDeliveryActivityDetails;

    // ==========================================
    // 11. Page Initialization Flow
    // ==========================================
    updateGuidedAccessUI();
    initGuidedAccessControls();
    initTabs();
    populateSupplierFilters();
    updateSummaryMetrics();
    renderDeliveriesTable();
    renderDeliveryActivitySummary();
    renderDeliveryActivityTable();
    initDeliveriesActions();
    initFilterListeners();
    initWorkflowForms();
});