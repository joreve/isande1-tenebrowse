/**
 * Tenebrowse - Warehouse Staff Consolidated Inventory Management (v4.0)
 * Integrated workflow combining:
 * 1. Warehouse Facilities Scope & Selection
 * 2. Material Inventory Table & Stock Update Action Modal (Guided Workflow)
 * 3. Read-Only Inventory Activity Audit Log & History
 * 4. Persistent Guided Access Helper Card & Session Controls
 */

// Smooth Section Scrolling & Tab Switching Helper for Sidebar Interactivity
function scrollToSection(sectionId) {
    if (typeof window.activateTab === 'function') {
        if (sectionId === 'facilities-section' || sectionId === 'facilities-container') {
            window.activateTab('facilities');
        } else if (sectionId === 'activity-section' || sectionId === 'activity-container') {
            window.activateTab('activity');
        } else if (sectionId === 'inventory-workspace' || sectionId === 'inventory-section' || sectionId === 'materials-container') {
            window.activateTab('materials');
        }
    }
    const el = document.getElementById(sectionId);
    if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}
window.scrollToSection = scrollToSection;

document.addEventListener('DOMContentLoaded', () => {

    // =========================================================================
    // 1. DATA STORES: INVENTORY & ACTIVITY AUDIT LOG
    // =========================================================================
    let inventoryData = [
        // Warehouse 1 (Small Items)
        { id: 'MAT-S101', name: 'Wood Screws 1.5"', category: 'Hardware', qty: 5000, unit: 'Pieces', warehouse: 'Warehouse 1', min: 1000, status: 'In Stock', lastUpdated: '2026-07-20' },
        { id: 'MAT-S102', name: 'Common Nails 3"', category: 'Hardware', qty: 3200, unit: 'Pieces', warehouse: 'Warehouse 1', min: 500, status: 'In Stock', lastUpdated: '2026-07-19' },
        { id: 'MAT-S103', name: 'Circuit Breaker 20A', category: 'Electrical', qty: 45, unit: 'Pieces', warehouse: 'Warehouse 1', min: 100, status: 'Low Stock', lastUpdated: '2026-07-21' },
        { id: 'MAT-S104', name: 'Electrical Wire THHN 3.5mm', category: 'Electrical', qty: 210, unit: 'Rolls', warehouse: 'Warehouse 1', min: 250, status: 'Low Stock', lastUpdated: '2026-07-21' },
        { id: 'MAT-S105', name: 'PVC Elbow Fitting 1/2"', category: 'Plumbing', qty: 800, unit: 'Pieces', warehouse: 'Warehouse 1', min: 200, status: 'Overstocked', lastUpdated: '2026-07-15' },
        { id: 'MAT-S106', name: 'Structural Bolts M16', category: 'Structural', qty: 15, unit: 'Boxes', warehouse: 'Warehouse 1', min: 40, status: 'Low Stock', lastUpdated: '2026-07-22' },

        // Warehouse 2 (Large Materials)
        { id: 'MAT-L201', name: 'Portland Cement (Type I)', category: 'Structural', qty: 1240, unit: 'Bags (40kg)', warehouse: 'Warehouse 2', min: 500, status: 'In Stock', lastUpdated: '2026-07-20' },
        { id: 'MAT-L202', name: 'Steel Reinforcement Bar 12mm', category: 'Structural', qty: 85, unit: 'Pieces', warehouse: 'Warehouse 2', min: 300, status: 'Low Stock', lastUpdated: '2026-07-21' },
        { id: 'MAT-L203', name: 'Marine Plywood 3/4"', category: 'Finishing', qty: 0, unit: 'Sheets', warehouse: 'Warehouse 2', min: 50, status: 'Out of Stock', lastUpdated: '2026-07-19' },
        { id: 'MAT-L204', name: 'PVC Pipe 4-inch', category: 'Plumbing', qty: 620, unit: 'Lengths', warehouse: 'Warehouse 2', min: 100, status: 'Overstocked', lastUpdated: '2026-07-22' },
        { id: 'MAT-L205', name: 'Concrete Hollow Blocks 6"', category: 'Structural', qty: 3400, unit: 'Pieces', warehouse: 'Warehouse 2', min: 1000, status: 'In Stock', lastUpdated: '2026-07-18' },
        { id: 'MAT-L206', name: 'Roofing Sheets (Corrugated)', category: 'Finishing', qty: 480, unit: 'Sheets', warehouse: 'Warehouse 2', min: 150, status: 'In Stock', lastUpdated: '2026-07-17' },

        // Warehouse 3 (Damaged & Quarantined)
        { id: 'MAT-D301', name: 'Water-Damaged Gypsum Board', category: 'Finishing', qty: 12, unit: 'Sheets', warehouse: 'Warehouse 3', min: 0, status: 'Damaged', lastUpdated: '2026-07-20' },
        { id: 'MAT-D302', name: 'Defective Circuit Breaker', category: 'Electrical', qty: 5, unit: 'Pieces', warehouse: 'Warehouse 3', min: 0, status: 'Damaged', lastUpdated: '2026-07-18' },
        { id: 'MAT-D303', name: 'Cracked PVC Pipes 4"', category: 'Plumbing', qty: 8, unit: 'Lengths', warehouse: 'Warehouse 3', min: 0, status: 'Damaged', lastUpdated: '2026-07-21' }
    ];

    let inventoryActivityLog = [
        {
            id: 'ACT-8801',
            material: 'Portland Cement (Type I)',
            type: 'Stock Received',
            prevQty: 1040,
            updatedQty: 1240,
            warehouse: 'Warehouse 2',
            updatedBy: 'Arnie Velasco',
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
            updatedBy: 'Arnie Velasco',
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
        }
    ];

    // =========================================================================
    // 2. STATE VARIABLES
    // =========================================================================
    let selectedWarehouseScope = 'All'; // 'All', 'Warehouse 1', 'Warehouse 2', 'Warehouse 3'
    let activeMaterialId = null;

    // Session Storage Keys for Persistent Guided Access Card State
    const STORAGE_KEY_COLLAPSED = 'tenebrowseInventoryGuideCollapsed';
    const STORAGE_KEY_HIDDEN = 'tenebrowseInventoryGuideHidden';

    // Pagination for Inventory Table
    let inventoryPage = 1;
    const inventoryPageSize = 5;

    // Pagination for Activity Log Table
    let activityPage = 1;
    const activityPageSize = 5;

    // Step labels for synchronization
    const stepNames = [
        'Select Facility & Material',
        'Choose Update Type',
        'Enter Quantity',
        'Review Changes',
        'Confirm and Save'
    ];

    // =========================================================================
    // 3. DOM ELEMENT REFERENCES
    // =========================================================================
    // Guided Access Elements
    const guidedAccessBanner = document.getElementById('guidedAccessBanner');

    // Warehouse Facilities Cards & Banner
    const warehouseSelectCards = document.querySelectorAll('.warehouse-select-card');
    const warehouseBanner = document.getElementById('warehouseBanner');
    const currentWarehouseBadge = document.getElementById('currentWarehouseBadge');

    // Inventory Table & Controls
    const inventoryTableBody = document.getElementById('inventoryTableBody');
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');
    const warehouseFilter = document.getElementById('warehouseFilter');
    const statusFilter = document.getElementById('statusFilter');
    const btnExport = document.getElementById('btnExport');
    const inventoryPaginationInfo = document.getElementById('inventoryPaginationInfo');
    const inventoryPrevBtn = document.getElementById('inventoryPrevBtn');
    const inventoryNextBtn = document.getElementById('inventoryNextBtn');

    // Inventory Summary Metrics
    const metricTotalMaterials = document.getElementById('metricTotalMaterials');
    const metricAvailableStock = document.getElementById('metricAvailableStock');
    const metricLowStock = document.getElementById('metricLowStock');
    const metricOutOfStock = document.getElementById('metricOutOfStock');

    // Activity Log Table & Controls
    const activityTableBody = document.getElementById('activityTableBody');
    const activitySearchInput = document.getElementById('activitySearchInput');
    const activityTypeFilter = document.getElementById('activityTypeFilter');
    const activityWarehouseFilter = document.getElementById('activityWarehouseFilter');
    const activityDateFilter = document.getElementById('activityDateFilter');
    const btnExportActivity = document.getElementById('btnExportActivity');
    const activityPaginationInfo = document.getElementById('activityPaginationInfo');
    const activityPrevBtn = document.getElementById('activityPrevBtn');
    const activityNextBtn = document.getElementById('activityNextBtn');

    // Activity Summary Metrics
    const summaryUpdatesToday = document.getElementById('summaryUpdatesToday');
    const summaryStockReceived = document.getElementById('summaryStockReceived');
    const summaryTransfers = document.getElementById('summaryTransfers');
    const summaryDiscrepancies = document.getElementById('summaryDiscrepancies');

    // Modal Components
    const updateModal = document.getElementById('updateQtyModal');
    const updateFormSection = document.getElementById('updateFormSection');
    const updateReviewSection = document.getElementById('updateReviewSection');
    const updateConfirmSection = document.getElementById('updateConfirmSection');

    // Footers & Buttons
    const updateFormFooter = document.getElementById('updateFormFooter');
    const updateReviewFooter = document.getElementById('updateReviewFooter');
    const updateConfirmFooter = document.getElementById('updateConfirmFooter');
    const btnReviewUpdate = document.getElementById('btnReviewUpdate');
    const btnSaveDirect = document.getElementById('btnSaveDirect');
    const btnGoBack = document.getElementById('btnGoBack');
    const btnProceedConfirm = document.getElementById('btnProceedConfirm');
    const btnGoBackConfirm = document.getElementById('btnGoBackConfirm');
    const btnFinalConfirm = document.getElementById('btnFinalConfirm');

    // Form Fields
    const updateMaterialName = document.getElementById('updateMaterialName');
    const updateCurrentQty = document.getElementById('updateCurrentQty');
    const updateCurrentWarehouse = document.getElementById('updateCurrentWarehouse');
    const updateType = document.getElementById('updateType');
    const updateTypeExplanationBox = document.getElementById('updateTypeExplanationBox');
    const updateTypeExplanationText = document.getElementById('updateTypeExplanationText');
    const qtyGroup = document.getElementById('qtyGroup');
    const qtyChange = document.getElementById('qtyChange');
    const qtyError = document.getElementById('qtyError');
    const destinationWarehouseGroup = document.getElementById('destinationWarehouseGroup');
    const destinationWarehouse = document.getElementById('destinationWarehouse');
    const destinationWarehouseError = document.getElementById('destinationWarehouseError');
    const refNumberGroup = document.getElementById('refNumberGroup');
    const refNumber = document.getElementById('refNumber');
    const refNumberError = document.getElementById('refNumberError');
    const correctionReasonGroup = document.getElementById('correctionReasonGroup');
    const correctionReason = document.getElementById('correctionReason');
    const correctionReasonError = document.getElementById('correctionReasonError');
    const updateRemarks = document.getElementById('updateRemarks');
    const reviewUsableImpactBox = document.getElementById('reviewUsableImpactBox');

    // Live Preview
    const previewPrevQty = document.getElementById('previewPrevQty');
    const previewChangeQty = document.getElementById('previewChangeQty');
    const previewNewQty = document.getElementById('previewNewQty');

    // =========================================================================
    // 4. PERSISTENT GUIDED ACCESS HELPER CARD DOM & SESSION CONTROLLER
    // =========================================================================
    const createGuidedHelperCard = () => {
        let card = document.getElementById('guidedHelperCard');
        let restoreBtn = document.getElementById('guidedRestoreBtn');

        if (card && card.parentElement !== document.body) {
            document.body.appendChild(card);
        }
        if (restoreBtn && restoreBtn.parentElement !== document.body) {
            document.body.appendChild(restoreBtn);
        }

        if (card) return;

        card = document.createElement('div');
        card.id = 'guidedHelperCard';
        card.className = 'guided-helper-card';
        card.innerHTML = `
            <div class="guided-helper-header">
                <div class="guided-helper-title">
                    <i class="fas fa-compass"></i>
                    <span>Guided Access</span>
                </div>
                <span id="guidedHelperSubbadge" class="badge badge-warning guided-helper-subbadge">Step 1: Select Facility &amp; Material</span>
                <div class="guided-helper-actions">
                    <button type="button" id="guidedCollapseBtn" class="guided-helper-btn" title="Collapse/Expand Guide">
                        <i class="fas fa-chevron-down" id="guidedCollapseIcon"></i>
                    </button>
                    <button type="button" id="guidedHideBtn" class="guided-helper-btn" title="Hide Guide Temporarily">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
            <div class="guided-helper-body">
                <div class="guided-helper-steps" id="guidedHelperStepsList">
                    <div class="guided-step-item active" data-step="1">
                        <div class="guided-step-num">1</div>
                        <div class="guided-step-label">Select Facility &amp; Material</div>
                    </div>
                    <div class="guided-step-item" data-step="2">
                        <div class="guided-step-num">2</div>
                        <div class="guided-step-label">Choose Update Type</div>
                    </div>
                    <div class="guided-step-item" data-step="3">
                        <div class="guided-step-num">3</div>
                        <div class="guided-step-label">Enter Quantity</div>
                    </div>
                    <div class="guided-step-item" data-step="4">
                        <div class="guided-step-num">4</div>
                        <div class="guided-step-label">Review Changes</div>
                    </div>
                    <div class="guided-step-item" data-step="5">
                        <div class="guided-step-num">5</div>
                        <div class="guided-step-label">Confirm and Save</div>
                    </div>
                </div>
            </div>
        `;

        restoreBtn = document.createElement('button');
        restoreBtn.id = 'guidedRestoreBtn';
        restoreBtn.type = 'button';
        restoreBtn.className = 'guided-restore-btn hidden';
        restoreBtn.innerHTML = `<i class="fas fa-compass"></i> Show Guided Access`;

        document.body.appendChild(card);
        document.body.appendChild(restoreBtn);

        const collapseBtn = document.getElementById('guidedCollapseBtn');
        const hideBtn = document.getElementById('guidedHideBtn');

        if (collapseBtn) {
            collapseBtn.addEventListener('click', toggleGuidedCardCollapse);
        }
        if (hideBtn) {
            hideBtn.addEventListener('click', hideGuidedCardTemporarily);
        }
        if (restoreBtn) {
            restoreBtn.addEventListener('click', restoreGuidedCard);
        }
    };

    const applySessionGuideState = () => {
        const card = document.getElementById('guidedHelperCard');
        const restoreBtn = document.getElementById('guidedRestoreBtn');
        const collapseIcon = document.getElementById('guidedCollapseIcon');
        if (!card) return;

        const isCollapsed = sessionStorage.getItem(STORAGE_KEY_COLLAPSED) === 'true';
        const isHidden = sessionStorage.getItem(STORAGE_KEY_HIDDEN) === 'true';

        if (isCollapsed) {
            card.classList.add('collapsed');
            if (collapseIcon) collapseIcon.className = 'fas fa-chevron-up';
        } else {
            card.classList.remove('collapsed');
            if (collapseIcon) collapseIcon.className = 'fas fa-chevron-down';
        }

        if (isHidden) {
            card.classList.add('hidden');
            if (restoreBtn && isGuidedAccessMode()) {
                restoreBtn.classList.remove('hidden');
            }
        } else {
            card.classList.remove('hidden');
            if (restoreBtn) {
                restoreBtn.classList.add('hidden');
            }
        }
    };

    const toggleGuidedCardCollapse = () => {
        const card = document.getElementById('guidedHelperCard');
        if (!card) return;
        const currentlyCollapsed = card.classList.contains('collapsed');
        const newCollapsed = !currentlyCollapsed;
        sessionStorage.setItem(STORAGE_KEY_COLLAPSED, newCollapsed ? 'true' : 'false');
        applySessionGuideState();
    };

    const hideGuidedCardTemporarily = () => {
        sessionStorage.setItem(STORAGE_KEY_HIDDEN, 'true');
        applySessionGuideState();
    };

    const restoreGuidedCard = () => {
        sessionStorage.setItem(STORAGE_KEY_HIDDEN, 'false');
        applySessionGuideState();
    };

    // =========================================================================
    // 5. GUIDED ACCESS CONFIGURATION & PROGRESS BADGES
    // =========================================================================
    const isGuidedAccessMode = () => {
        return localStorage.getItem('tenebrowseWarehouseGuidedAccess') === 'true' ||
               document.body.classList.contains('guided-access-enabled');
    };

    const updateGuidedAccessUI = () => {
        const guided = isGuidedAccessMode();
        if (guidedAccessBanner) guidedAccessBanner.style.display = guided ? 'block' : 'none';
        if (updateTypeExplanationBox) updateTypeExplanationBox.style.display = guided ? 'flex' : 'none';

        createGuidedHelperCard();
        const helperCard = document.getElementById('guidedHelperCard');
        const restoreBtn = document.getElementById('guidedRestoreBtn');

        if (guided) {
            applySessionGuideState();
        } else {
            if (helperCard) helperCard.classList.add('hidden');
            if (restoreBtn) restoreBtn.classList.add('hidden');
        }
    };

    const updateProgressSteps = (stepNum) => {
        if (!isGuidedAccessMode()) return;

        // Sync persistent helper card step list
        const stepItems = document.querySelectorAll('#guidedHelperStepsList .guided-step-item');
        stepItems.forEach((item) => {
            const num = parseInt(item.getAttribute('data-step'), 10);
            item.className = 'guided-step-item';
            const numEl = item.querySelector('.guided-step-num');

            if (num < stepNum) {
                item.classList.add('completed');
                if (numEl) numEl.innerHTML = '<i class="fas fa-check"></i>';
            } else if (num === stepNum) {
                item.classList.add('active');
                if (numEl) numEl.textContent = num;
            } else {
                if (numEl) numEl.textContent = num;
            }
        });

        const subbadge = document.getElementById('guidedHelperSubbadge');
        if (subbadge) {
            const stepName = stepNames[stepNum - 1] || `Step ${stepNum}`;
            subbadge.textContent = `Step ${stepNum}: ${stepName}`;
        }
    };

    // =========================================================================
    // 6. HELPER: BADGE CLASSIFICATION
    // =========================================================================
    const getBadgeClass = (statusOrType) => {
        switch (statusOrType) {
            case 'In Stock':
            case 'Stock Received':
            case 'Delivery Verified':
                return 'badge-success';
            case 'Low Stock':
            case 'Inventory Correction':
            case 'Awaiting Inspection':
                return 'badge-warning';
            case 'Out of Stock':
            case 'Damaged':
            case 'Damaged Material Recorded':
            case 'Missing Material Reported':
                return 'badge-danger';
            case 'Overstocked':
            case 'Quantity Updated':
            case 'Material Transferred':
                return 'badge-info';
            default:
                return 'badge-info';
        }
    };

    // =========================================================================
    // 7. WAREHOUSE FACILITIES SELECTION ENGINE
    // =========================================================================
    const setWarehouseScope = (warehouseName) => {
        selectedWarehouseScope = warehouseName;

        // Highlight Active Facility Card
        warehouseSelectCards.forEach(card => {
            const cardScope = card.getAttribute('data-warehouse');
            if (cardScope === warehouseName) {
                card.classList.add('active');
            } else {
                card.classList.remove('active');
            }
        });

        // Sync Toolbar Warehouse Filter
        if (warehouseFilter) {
            warehouseFilter.value = warehouseName;
        }

        // Toggle Quarantined/Damaged Warehouse Banner
        if (warehouseBanner) {
            warehouseBanner.style.display = (warehouseName === 'Warehouse 3') ? 'flex' : 'none';
        }

        // Update Section Badge Title
        if (currentWarehouseBadge) {
            currentWarehouseBadge.textContent = warehouseName === 'All' ? 'All Warehouses' : warehouseName;
            currentWarehouseBadge.className = 'badge ml-2 ' + (warehouseName === 'Warehouse 3' ? 'badge-danger' : 'badge-info');
        }

        inventoryPage = 1;
        renderInventoryTable();
    };

    // Card click events
    warehouseSelectCards.forEach(card => {
        card.addEventListener('click', () => {
            const selected = card.getAttribute('data-warehouse');
            setWarehouseScope(selected);
        });
    });

    // Dropdown change syncs back to cards
    if (warehouseFilter) {
        warehouseFilter.addEventListener('change', () => {
            setWarehouseScope(warehouseFilter.value);
        });
    }

    // =========================================================================
    // 8. INVENTORY TABLE & METRICS RENDER
    // =========================================================================
    const updateInventoryMetrics = (items) => {
        const total = items.length;
        const available = items.filter(i => i.status === 'In Stock' || i.status === 'Overstocked').length;
        const low = items.filter(i => i.status === 'Low Stock').length;
        const outOrDamaged = items.filter(i => i.status === 'Out of Stock' || i.status === 'Damaged').length;

        if (metricTotalMaterials) metricTotalMaterials.textContent = total;
        if (metricAvailableStock) metricAvailableStock.textContent = available;
        if (metricLowStock) metricLowStock.textContent = low;
        if (metricOutOfStock) metricOutOfStock.textContent = outOrDamaged;
    };

    const getFilteredInventory = () => {
        const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';
        const filterCategory = categoryFilter ? categoryFilter.value : 'All';
        const filterStatus = statusFilter ? statusFilter.value : 'All';

        return inventoryData.filter(item => {
            const matchesScope = (selectedWarehouseScope === 'All') || (item.warehouse === selectedWarehouseScope);
            const matchesSearch = item.id.toLowerCase().includes(searchTerm) || item.name.toLowerCase().includes(searchTerm);
            const matchesCategory = filterCategory === 'All' || item.category === filterCategory;
            const matchesStatus = filterStatus === 'All' || item.status === filterStatus;
            return matchesScope && matchesSearch && matchesCategory && matchesStatus;
        });
    };

    const renderInventoryTable = () => {
        if (!inventoryTableBody) return;
        const filtered = getFilteredInventory();
        updateInventoryMetrics(filtered);

        const totalItems = filtered.length;
        const totalPages = Math.max(1, Math.ceil(totalItems / inventoryPageSize));
        if (inventoryPage > totalPages) inventoryPage = totalPages;

        const startIndex = (inventoryPage - 1) * inventoryPageSize;
        const paginated = filtered.slice(startIndex, startIndex + inventoryPageSize);

        inventoryTableBody.innerHTML = '';

        if (paginated.length === 0) {
            inventoryTableBody.innerHTML = `<tr><td colspan="10" class="empty-state-row">No materials match your selected facility scope or filter criteria.</td></tr>`;
            if (inventoryPaginationInfo) inventoryPaginationInfo.textContent = 'Showing 0-0 of 0 records';
            if (inventoryPrevBtn) inventoryPrevBtn.disabled = true;
            if (inventoryNextBtn) inventoryNextBtn.disabled = true;
            return;
        }

        paginated.forEach(item => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong>${item.id}</strong></td>
                <td>${item.name}</td>
                <td>${item.category}</td>
                <td class="font-semibold">${item.qty.toLocaleString()}</td>
                <td>${item.unit}</td>
                <td>${item.warehouse}</td>
                <td class="text-muted-sm">${item.min.toLocaleString()}</td>
                <td><span class="badge ${getBadgeClass(item.status)}">${item.status}</span></td>
                <td class="text-muted-sm">${item.lastUpdated}</td>
                <td class="text-right">
                    <div class="action-list">
                        <button class="action-item-btn" data-action="view" data-id="${item.id}" title="View Material">
                            <i class="fas fa-eye"></i> <span class="action-label">View</span>
                        </button>
                        <button class="action-item-btn" data-action="update" data-id="${item.id}" title="Update Quantity">
                            <i class="fas fa-cubes"></i> <span class="action-label">Update Qty</span>
                        </button>
                        <button class="action-item-btn" data-action="received" data-id="${item.id}" title="Record Received Stock">
                            <i class="fas fa-inbox"></i> <span class="action-label">Received</span>
                        </button>
                        <button class="action-item-btn" data-action="damaged" data-id="${item.id}" title="Record Damaged Stock">
                            <i class="fas fa-exclamation-triangle"></i> <span class="action-label">Damaged</span>
                        </button>
                        <button class="action-item-btn" data-action="transfer" data-id="${item.id}" title="Transfer Material">
                            <i class="fas fa-exchange-alt"></i> <span class="action-label">Transfer</span>
                        </button>
                    </div>
                </td>
            `;
            inventoryTableBody.appendChild(tr);
        });

        const endItem = Math.min(startIndex + inventoryPageSize, totalItems);
        if (inventoryPaginationInfo) inventoryPaginationInfo.textContent = `Showing ${startIndex + 1}-${endItem} of ${totalItems} records`;
        if (inventoryPrevBtn) inventoryPrevBtn.disabled = (inventoryPage === 1);
        if (inventoryNextBtn) inventoryNextBtn.disabled = (inventoryPage === totalPages);
    };

    // =========================================================================
    // 9. INVENTORY ACTIVITY LOG TABLE & METRICS RENDER
    // =========================================================================
    const renderActivitySummary = () => {
        const today = '2026-07-22';
        const updatesToday = inventoryActivityLog.filter(a => a.date === today).length;
        const stockReceived = inventoryActivityLog.filter(a => a.type === 'Stock Received').length;
        const transfers = inventoryActivityLog.filter(a => a.type === 'Material Transferred').length;
        const discrepancies = inventoryActivityLog.filter(a =>
            a.type === 'Damaged Material Recorded' ||
            a.type === 'Missing Material Reported' ||
            a.type === 'Inventory Correction'
        ).length;

        if (summaryUpdatesToday) summaryUpdatesToday.textContent = updatesToday;
        if (summaryStockReceived) summaryStockReceived.textContent = stockReceived;
        if (summaryTransfers) summaryTransfers.textContent = transfers;
        if (summaryDiscrepancies) summaryDiscrepancies.textContent = discrepancies;
    };

    const getFilteredActivityLog = () => {
        const searchTerm = activitySearchInput ? activitySearchInput.value.toLowerCase().trim() : '';
        const filterType = activityTypeFilter ? activityTypeFilter.value : 'All';
        const filterWarehouse = activityWarehouseFilter ? activityWarehouseFilter.value : 'All';
        const filterDate = activityDateFilter ? activityDateFilter.value : '';

        return inventoryActivityLog.filter(a => {
            const matchesSearch =
                a.id.toLowerCase().includes(searchTerm) ||
                a.material.toLowerCase().includes(searchTerm) ||
                (a.reference && a.reference.toLowerCase().includes(searchTerm));
            const matchesType = (filterType === 'All') || (a.type === filterType);
            const matchesWarehouse = (filterWarehouse === 'All') || (a.warehouse === filterWarehouse);
            const matchesDate = !filterDate || (a.date === filterDate);
            return matchesSearch && matchesType && matchesWarehouse && matchesDate;
        });
    };

    const renderActivityTable = () => {
        if (!activityTableBody) return;
        const filtered = getFilteredActivityLog();
        const totalItems = filtered.length;
        const totalPages = Math.max(1, Math.ceil(totalItems / activityPageSize));
        if (activityPage > totalPages) activityPage = totalPages;

        const startIndex = (activityPage - 1) * activityPageSize;
        const paginated = filtered.slice(startIndex, startIndex + activityPageSize);

        activityTableBody.innerHTML = '';

        if (paginated.length === 0) {
            activityTableBody.innerHTML = `<tr><td colspan="10" class="empty-state-row">No inventory activity records match your criteria.</td></tr>`;
            if (activityPaginationInfo) activityPaginationInfo.textContent = 'Showing 0-0 of 0 records';
            if (activityPrevBtn) activityPrevBtn.disabled = true;
            if (activityNextBtn) activityNextBtn.disabled = true;
            return;
        }

        paginated.forEach(a => {
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
                <td>${a.reference || '-'}</td>
                <td class="text-right">
                    <button class="action-btn" data-activity-view="${a.id}" title="View Activity Record"><i class="fas fa-eye"></i></button>
                </td>
            `;
            activityTableBody.appendChild(tr);
        });

        const endItem = Math.min(startIndex + activityPageSize, totalItems);
        if (activityPaginationInfo) activityPaginationInfo.textContent = `Showing ${startIndex + 1}-${endItem} of ${totalItems} records`;
        if (activityPrevBtn) activityPrevBtn.disabled = (activityPage === 1);
        if (activityNextBtn) activityNextBtn.disabled = (activityPage === totalPages);
    };

    // Open Read-Only Activity Modal Details
    const openActivityDetailsModal = (id) => {
        const record = inventoryActivityLog.find(a => a.id === id);
        if (!record) return;

        document.getElementById('detActivityIdBadge').textContent = record.id;
        document.getElementById('detMaterial').textContent = record.material;
        document.getElementById('detActivityType').textContent = record.type;
        document.getElementById('detPrevQty').textContent = record.prevQty.toLocaleString();
        document.getElementById('detUpdatedQty').textContent = record.updatedQty.toLocaleString();
        document.getElementById('detWarehouse').textContent = record.warehouse;
        document.getElementById('detUpdatedBy').textContent = record.updatedBy;
        document.getElementById('detDateTime').textContent = `${record.date} ${record.time}`;
        document.getElementById('detReference').textContent = record.reference || '-';
        document.getElementById('detRemarks').textContent = record.remarks || 'No remarks recorded.';

        const viewActivityModal = document.getElementById('viewActivityModal');
        if (viewActivityModal) viewActivityModal.classList.add('active');
    };

    // =========================================================================
    // 10. MATERIAL DETAILS MODAL (READ-ONLY VIEW)
    // =========================================================================
    const openViewMaterialModal = (id) => {
        const item = inventoryData.find(m => m.id === id);
        if (!item) return;

        document.getElementById('viewName').value = item.name;
        document.getElementById('viewId').value = item.id;
        document.getElementById('viewCategory').value = item.category;
        document.getElementById('viewQty').value = `${item.qty.toLocaleString()} ${item.unit}`;
        document.getElementById('viewMin').value = `${item.min.toLocaleString()} ${item.unit}`;
        document.getElementById('viewWarehouse').value = item.warehouse;
        document.getElementById('viewStatus').value = item.status;
        document.getElementById('viewLastUpdated').value = item.lastUpdated;

        const viewModal = document.getElementById('viewMaterialModal');
        if (viewModal) viewModal.classList.add('active');
    };

    // =========================================================================
    // 11. UNIFIED INVENTORY ACTION WORKFLOW MODAL ENGINE
    // =========================================================================
    const clearFormErrors = () => {
        const groups = [qtyGroup, destinationWarehouseGroup, refNumberGroup, correctionReasonGroup];
        const errors = [qtyError, destinationWarehouseError, refNumberError, correctionReasonError];
        groups.forEach(g => g && g.classList.remove('has-error'));
        errors.forEach(e => {
            if (e) {
                e.textContent = '';
                e.style.display = 'none';
            }
        });
    };

    const updateExplanations = () => {
        const selectedType = updateType ? updateType.value : '';
        let text = '';
        switch (selectedType) {
            case 'Add Received Stock':
                text = 'Use this when new materials arrive from deliveries and should be added to usable inventory.';
                break;
            case 'Reduce Stock':
                text = 'Use this when materials were released, consumed, or removed from project storage.';
                break;
            case 'Correct Inventory Count':
                text = 'Use this when the system recorded quantity does not match the actual physical count.';
                break;
            case 'Record Damaged Stock (Move to Warehouse 3)':
                text = 'Use this when materials are damaged or defective. This automatically relocates the items to Warehouse 3 (Quarantined) and removes them from usable inventory.';
                break;
            case 'Transfer Material':
                text = 'Use this when materials are being moved between storage warehouse facilities.';
                break;
            default:
                text = '';
        }
        if (updateTypeExplanationText) {
            updateTypeExplanationText.textContent = text;
        }
    };

    const updateVisibleFields = () => {
        const typeVal = updateType ? updateType.value : '';
        if (destinationWarehouseGroup) {
            destinationWarehouseGroup.style.display = (typeVal === 'Transfer Material') ? 'block' : 'none';
        }
        if (refNumberGroup) {
            refNumberGroup.style.display = (typeVal === 'Add Received Stock') ? 'block' : 'none';
        }
        if (correctionReasonGroup) {
            correctionReasonGroup.style.display = (typeVal === 'Correct Inventory Count' || typeVal === 'Record Damaged Stock (Move to Warehouse 3)') ? 'block' : 'none';
        }
        updateExplanations();
        validateForm(false);
    };

    const validateForm = (showErrors = false) => {
        const item = inventoryData.find(m => m.id === activeMaterialId);
        if (!item) return false;

        let isValid = true;
        clearFormErrors();

        const typeVal = updateType.value;
        const changeVal = parseFloat(qtyChange.value);

        if (isNaN(changeVal) || changeVal <= 0) {
            isValid = false;
            if (showErrors && qtyGroup && qtyError) {
                qtyGroup.classList.add('has-error');
                qtyError.textContent = 'Enter a valid quantity greater than zero.';
                qtyError.style.display = 'block';
            }
        } else {
            let computedNewQty = item.qty;
            if (typeVal === 'Add Received Stock') {
                computedNewQty = item.qty + changeVal;
            } else if (typeVal === 'Reduce Stock' || typeVal === 'Record Damaged Stock (Move to Warehouse 3)') {
                computedNewQty = item.qty - changeVal;
            } else if (typeVal === 'Transfer Material') {
                if (changeVal > item.qty) {
                    isValid = false;
                    if (showErrors && qtyGroup && qtyError) {
                        qtyGroup.classList.add('has-error');
                        qtyError.textContent = 'Transfer quantity cannot exceed currently available quantity.';
                        qtyError.style.display = 'block';
                    }
                }
                computedNewQty = item.qty - changeVal;
            } else if (typeVal === 'Correct Inventory Count') {
                computedNewQty = changeVal;
            }

            if (isValid && computedNewQty < 0) {
                isValid = false;
                if (showErrors && qtyGroup && qtyError) {
                    qtyGroup.classList.add('has-error');
                    qtyError.textContent = 'New quantity cannot be negative.';
                    qtyError.style.display = 'block';
                }
            }
        }

        if (typeVal === 'Transfer Material') {
            const destVal = destinationWarehouse.value;
            if (!destVal) {
                isValid = false;
                if (showErrors && destinationWarehouseGroup && destinationWarehouseError) {
                    destinationWarehouseGroup.classList.add('has-error');
                    destinationWarehouseError.textContent = 'Select a destination warehouse.';
                    destinationWarehouseError.style.display = 'block';
                }
            } else if (destVal === item.warehouse) {
                isValid = false;
                if (showErrors && destinationWarehouseGroup && destinationWarehouseError) {
                    destinationWarehouseGroup.classList.add('has-error');
                    destinationWarehouseError.textContent = 'Select a different destination warehouse.';
                    destinationWarehouseError.style.display = 'block';
                }
            }
        }

        if (typeVal === 'Add Received Stock') {
            if (!refNumber.value.trim()) {
                isValid = false;
                if (showErrors && refNumberGroup && refNumberError) {
                    refNumberGroup.classList.add('has-error');
                    refNumberError.textContent = 'Enter the delivery or purchase reference number.';
                    refNumberError.style.display = 'block';
                }
            }
        }

        if (typeVal === 'Correct Inventory Count' || typeVal === 'Record Damaged Stock (Move to Warehouse 3)') {
            if (!correctionReason.value.trim()) {
                isValid = false;
                if (showErrors && correctionReasonGroup && correctionReasonError) {
                    correctionReasonGroup.classList.add('has-error');
                    correctionReasonError.textContent = 'Provide a reason or explanation for this record.';
                    correctionReasonError.style.display = 'block';
                }
            }
        }

        if (isGuidedAccessMode() && btnReviewUpdate) {
            btnReviewUpdate.disabled = !isValid;
        }

        updateLivePreview(item, typeVal, changeVal);
        return isValid;
    };

    const updateLivePreview = (item, typeVal, changeVal) => {
        let prev = item.qty;
        let change = 0;
        let newQty = prev;

        if (!isNaN(changeVal) && changeVal > 0) {
            if (typeVal === 'Add Received Stock') {
                change = changeVal;
                newQty = prev + changeVal;
            } else if (typeVal === 'Reduce Stock' || typeVal === 'Record Damaged Stock (Move to Warehouse 3)' || typeVal === 'Transfer Material') {
                change = -changeVal;
                newQty = prev - changeVal;
            } else if (typeVal === 'Correct Inventory Count') {
                newQty = changeVal;
                change = newQty - prev;
            }
        }

        if (previewPrevQty) previewPrevQty.textContent = prev.toLocaleString();
        if (previewChangeQty) previewChangeQty.textContent = (change >= 0 ? '+' : '') + change.toLocaleString();
        if (previewNewQty) previewNewQty.textContent = Math.max(0, newQty).toLocaleString();
    };

    const openActionModal = (id, actionType) => {
        const item = inventoryData.find(m => m.id === id);
        if (!item) return;

        activeMaterialId = id;
        clearFormErrors();

        if (updateMaterialName) updateMaterialName.value = `${item.name} (${item.id})`;
        if (updateCurrentQty) updateCurrentQty.value = `${item.qty.toLocaleString()} ${item.unit}`;
        if (updateCurrentWarehouse) updateCurrentWarehouse.value = item.warehouse;

        let defaultType = 'Correct Inventory Count';
        if (actionType === 'received') defaultType = 'Add Received Stock';
        else if (actionType === 'damaged') defaultType = 'Record Damaged Stock (Move to Warehouse 3)';
        else if (actionType === 'transfer') defaultType = 'Transfer Material';
        else if (actionType === 'update') defaultType = 'Correct Inventory Count';

        if (updateType) updateType.value = defaultType;
        if (qtyChange) qtyChange.value = '';
        if (destinationWarehouse) destinationWarehouse.value = '';
        if (refNumber) refNumber.value = '';
        if (correctionReason) correctionReason.value = '';
        if (updateRemarks) updateRemarks.value = '';

        updateGuidedAccessUI();
        updateVisibleFields();
        showSection('form');

        if (updateModal) updateModal.classList.add('active');
    };

    const showSection = (section) => {
        const guided = isGuidedAccessMode();

        if (section === 'form') {
            if (updateFormSection) updateFormSection.style.display = 'block';
            if (updateReviewSection) updateReviewSection.style.display = 'none';
            if (updateConfirmSection) updateConfirmSection.style.display = 'none';

            if (guided) {
                if (updateFormFooter) updateFormFooter.style.display = 'flex';
                if (btnReviewUpdate) btnReviewUpdate.style.display = 'inline-flex';
                if (btnSaveDirect) btnSaveDirect.style.display = 'none';
            } else {
                if (updateFormFooter) updateFormFooter.style.display = 'flex';
                if (btnReviewUpdate) btnReviewUpdate.style.display = 'none';
                if (btnSaveDirect) btnSaveDirect.style.display = 'inline-flex';
            }

            if (updateReviewFooter) updateReviewFooter.style.display = 'none';
            if (updateConfirmFooter) updateConfirmFooter.style.display = 'none';

            // Active step logic: Step 3 if user filled quantity, otherwise Step 2
            if (qtyChange && qtyChange.value.trim() !== '') {
                updateProgressSteps(3);
            } else {
                updateProgressSteps(2);
            }
        } else if (section === 'review') {
            if (updateFormSection) updateFormSection.style.display = 'none';
            if (updateReviewSection) updateReviewSection.style.display = 'block';
            if (updateConfirmSection) updateConfirmSection.style.display = 'none';

            if (updateFormFooter) updateFormFooter.style.display = 'none';
            if (updateReviewFooter) updateReviewFooter.style.display = 'flex';
            if (updateConfirmFooter) updateConfirmFooter.style.display = 'none';

            populateReviewSummary();
            updateProgressSteps(4);
        } else if (section === 'confirm') {
            if (updateFormSection) updateFormSection.style.display = 'none';
            if (updateReviewSection) updateReviewSection.style.display = 'none';
            if (updateConfirmSection) updateConfirmSection.style.display = 'block';

            if (updateFormFooter) updateFormFooter.style.display = 'none';
            if (updateReviewFooter) updateReviewFooter.style.display = 'none';
            if (updateConfirmFooter) updateConfirmFooter.style.display = 'flex';

            populateConfirmSummary();
            updateProgressSteps(5);
        }
    };

    const populateReviewSummary = () => {
        const item = inventoryData.find(m => m.id === activeMaterialId);
        if (!item) return;

        const typeVal = updateType.value;
        const changeVal = parseFloat(qtyChange.value) || 0;

        let prevQty = item.qty;
        let changeText = '0';
        let newQty = prevQty;

        if (typeVal === 'Add Received Stock') {
            changeText = `+${changeVal.toLocaleString()}`;
            newQty = prevQty + changeVal;
        } else if (typeVal === 'Reduce Stock' || typeVal === 'Record Damaged Stock (Move to Warehouse 3)' || typeVal === 'Transfer Material') {
            changeText = `-${changeVal.toLocaleString()}`;
            newQty = prevQty - changeVal;
        } else if (typeVal === 'Correct Inventory Count') {
            newQty = changeVal;
            const diff = newQty - prevQty;
            changeText = (diff >= 0 ? '+' : '') + diff.toLocaleString();
        }

        document.getElementById('reviewMaterialName').textContent = `${item.name} (${item.id})`;
        document.getElementById('reviewCurrentQty').textContent = `${prevQty.toLocaleString()} ${item.unit}`;
        document.getElementById('reviewUpdateType').textContent = typeVal;
        document.getElementById('reviewQtyChange').textContent = `${changeText} ${item.unit}`;
        document.getElementById('reviewNewQty').textContent = `${Math.max(0, newQty).toLocaleString()} ${item.unit}`;
        document.getElementById('reviewCurrentWarehouse').textContent = item.warehouse;

        const reviewDestRow = document.getElementById('reviewDestinationWarehouseRow');
        const reviewRefRow = document.getElementById('reviewRefNumberRow');
        const reviewReasonRow = document.getElementById('reviewReasonRow');
        const reviewRemarksRow = document.getElementById('reviewRemarksRow');

        if (reviewDestRow) {
            reviewDestRow.style.display = (typeVal === 'Transfer Material') ? 'block' : 'none';
            document.getElementById('reviewDestinationWarehouse').textContent = destinationWarehouse.value || '-';
        }

        if (reviewRefRow) {
            reviewRefRow.style.display = (typeVal === 'Add Received Stock') ? 'block' : 'none';
            document.getElementById('reviewRefNumber').textContent = refNumber.value.trim() || '-';
        }

        if (reviewReasonRow) {
            reviewReasonRow.style.display = (typeVal === 'Correct Inventory Count' || typeVal === 'Record Damaged Stock (Move to Warehouse 3)') ? 'block' : 'none';
            document.getElementById('reviewReason').textContent = correctionReason.value.trim() || '-';
        }

        if (reviewRemarksRow) {
            reviewRemarksRow.style.display = updateRemarks.value.trim() ? 'block' : 'none';
            document.getElementById('reviewRemarks').textContent = updateRemarks.value.trim() || '-';
        }

        if (reviewUsableImpactBox) {
            reviewUsableImpactBox.style.display = (typeVal === 'Record Damaged Stock (Move to Warehouse 3)') ? 'block' : 'none';
        }
    };

    const populateConfirmSummary = () => {
        const item = inventoryData.find(m => m.id === activeMaterialId);
        if (!item) return;

        const typeVal = updateType.value;
        const changeVal = parseFloat(qtyChange.value) || 0;
        let prevQty = item.qty;
        let newQty = prevQty;

        if (typeVal === 'Add Received Stock') {
            newQty = prevQty + changeVal;
        } else if (typeVal === 'Reduce Stock' || typeVal === 'Record Damaged Stock (Move to Warehouse 3)' || typeVal === 'Transfer Material') {
            newQty = prevQty - changeVal;
        } else if (typeVal === 'Correct Inventory Count') {
            newQty = changeVal;
        }
        newQty = Math.max(0, newQty);

        let confirmMsg = `You are updating ${item.name} from ${prevQty.toLocaleString()} ${item.unit} to ${newQty.toLocaleString()} ${item.unit}. This transaction will be logged in the immutable Activity History. Continue?`;
        if (typeVal === 'Record Damaged Stock (Move to Warehouse 3)') {
            confirmMsg = `You are recording ${changeVal.toLocaleString()} ${item.unit} of ${item.name} as damaged and relocating it to Warehouse 3 (Quarantined). Continue?`;
        }
        const confirmTextEl = document.getElementById('confirmDynamicMessage');
        if (confirmTextEl) confirmTextEl.textContent = confirmMsg;
    };

    // Execute Save & Synchronize Across All Integrated Tables & Metrics
    const executeSave = () => {
        const item = inventoryData.find(m => m.id === activeMaterialId);
        if (!item) return;

        const typeVal = updateType.value;
        const changeVal = parseFloat(qtyChange.value) || 0;
        let prevQty = item.qty;
        let newQty = prevQty;
        const today = new Date().toISOString().split('T')[0];
        const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        if (typeVal === 'Add Received Stock') {
            newQty = prevQty + changeVal;
            item.qty = newQty;
        } else if (typeVal === 'Reduce Stock') {
            newQty = Math.max(0, prevQty - changeVal);
            item.qty = newQty;
        } else if (typeVal === 'Correct Inventory Count') {
            newQty = Math.max(0, changeVal);
            item.qty = newQty;
        } else if (typeVal === 'Transfer Material') {
            newQty = Math.max(0, prevQty - changeVal);
            item.qty = newQty;

            // Check if material already exists in destination warehouse; update or create
            const destWh = destinationWarehouse.value;
            const targetItem = inventoryData.find(m => m.name === item.name && m.warehouse === destWh);
            if (targetItem) {
                targetItem.qty += changeVal;
                targetItem.lastUpdated = today;
            } else {
                inventoryData.push({
                    id: 'MAT-' + Math.floor(1000 + Math.random() * 9000),
                    name: item.name,
                    category: item.category,
                    qty: changeVal,
                    unit: item.unit,
                    warehouse: destWh,
                    min: item.min,
                    status: 'In Stock',
                    lastUpdated: today
                });
            }
        } else if (typeVal === 'Record Damaged Stock (Move to Warehouse 3)') {
            newQty = Math.max(0, prevQty - changeVal);
            item.qty = newQty;

            // Automatically move damaged quantity into Warehouse 3 (Quarantined)
            const damagedItem = inventoryData.find(m => m.name.includes(item.name) && m.warehouse === 'Warehouse 3');
            if (damagedItem) {
                damagedItem.qty += changeVal;
                damagedItem.lastUpdated = today;
            } else {
                inventoryData.push({
                    id: 'MAT-D3' + Math.floor(10 + Math.random() * 90),
                    name: `Damaged ${item.name}`,
                    category: item.category,
                    qty: changeVal,
                    unit: item.unit,
                    warehouse: 'Warehouse 3',
                    min: 0,
                    status: 'Damaged',
                    lastUpdated: today
                });
            }
        }

        item.lastUpdated = today;
        if (item.qty === 0) item.status = 'Out of Stock';
        else if (item.qty < item.min) item.status = 'Low Stock';
        else if (item.qty > item.min * 3) item.status = 'Overstocked';
        else item.status = 'In Stock';

        // Log to Activity History Audit Log
        let actTypeLabel = typeVal;
        if (typeVal === 'Add Received Stock') actTypeLabel = 'Stock Received';
        else if (typeVal === 'Reduce Stock') actTypeLabel = 'Quantity Updated';
        else if (typeVal === 'Correct Inventory Count') actTypeLabel = 'Inventory Correction';
        else if (typeVal === 'Transfer Material') actTypeLabel = 'Material Transferred';
        else if (typeVal === 'Record Damaged Stock (Move to Warehouse 3)') actTypeLabel = 'Damaged Material Recorded';

        inventoryActivityLog.unshift({
            id: 'ACT-' + Math.floor(100000 + Math.random() * 900000),
            material: item.name,
            type: actTypeLabel,
            prevQty: prevQty,
            updatedQty: newQty,
            warehouse: (typeVal === 'Transfer Material') ? `${item.warehouse} -> ${destinationWarehouse.value}` : item.warehouse,
            updatedBy: 'Arnie Velasco',
            reference: refNumber.value.trim() || '-',
            remarks: correctionReason.value.trim() || updateRemarks.value.trim() || 'No remarks recorded.',
            date: today,
            time: currentTime
        });

        if (updateModal) updateModal.classList.remove('active');

        // Re-render all integrated sections and reset step back to Step 1
        renderInventoryTable();
        renderActivitySummary();
        renderActivityTable();
        updateProgressSteps(1);

        let successMessage = 'Inventory quantity updated successfully.';
        if (typeVal === 'Add Received Stock') successMessage = 'Received stock added to inventory and logged.';
        else if (typeVal === 'Record Damaged Stock (Move to Warehouse 3)') successMessage = 'Damaged stock quarantined in Warehouse 3.';
        else if (typeVal === 'Transfer Material') successMessage = `Transferred ${changeVal} ${item.unit} to ${destinationWarehouse.value}.`;

        if (typeof window.showToast === 'function') {
            window.showToast('Inventory Updated', successMessage, 'success');
        }
    };

    // =========================================================================
    // 12. EVENT LISTENERS: INVENTORY TABLE, MODALS & STEP SYNC
    // =========================================================================
    if (inventoryTableBody) {
        inventoryTableBody.addEventListener('click', (e) => {
            const btn = e.target.closest('[data-action]');
            if (!btn) return;
            const action = btn.getAttribute('data-action');
            const id = btn.getAttribute('data-id');

            if (action === 'view') {
                openViewMaterialModal(id);
            } else {
                openActionModal(id, action);
            }
        });
    }

    if (activityTableBody) {
        activityTableBody.addEventListener('click', (e) => {
            const btn = e.target.closest('[data-activity-view]');
            if (!btn) return;
            const id = btn.getAttribute('data-activity-view');
            openActivityDetailsModal(id);
        });
    }

    // Synchronize workflow step on input focus & changes
    if (updateType) {
        updateType.addEventListener('change', () => {
            if (updateFormSection && updateFormSection.style.display !== 'none') {
                if (!qtyChange.value.trim()) {
                    updateProgressSteps(2);
                }
            }
            updateVisibleFields();
        });
    }

    if (qtyChange) {
        qtyChange.addEventListener('focus', () => {
            if (updateFormSection && updateFormSection.style.display !== 'none') {
                updateProgressSteps(3);
            }
        });
        qtyChange.addEventListener('input', () => {
            if (updateFormSection && updateFormSection.style.display !== 'none' && qtyChange.value.trim() !== '') {
                updateProgressSteps(3);
            }
            validateForm(false);
        });
    }

    if (destinationWarehouse) destinationWarehouse.addEventListener('change', () => validateForm(false));
    if (refNumber) refNumber.addEventListener('input', () => validateForm(false));
    if (correctionReason) correctionReason.addEventListener('input', () => validateForm(false));

    // Modal navigation buttons
    if (btnReviewUpdate) btnReviewUpdate.addEventListener('click', () => { if (validateForm(true)) showSection('review'); });
    if (btnSaveDirect) btnSaveDirect.addEventListener('click', () => { if (validateForm(true)) executeSave(); });
    if (btnGoBack) btnGoBack.addEventListener('click', () => showSection('form'));
    if (btnProceedConfirm) btnProceedConfirm.addEventListener('click', () => showSection('confirm'));
    if (btnGoBackConfirm) btnGoBackConfirm.addEventListener('click', () => showSection('review'));
    if (btnFinalConfirm) btnFinalConfirm.addEventListener('click', executeSave);

    // Reset helper step when action modal is closed
    if (updateModal) {
        const closeBtns = updateModal.querySelectorAll('[data-modal-close]');
        closeBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                updateProgressSteps(1);
            });
        });

        updateModal.addEventListener('click', (e) => {
            if (e.target === updateModal) {
                updateProgressSteps(1);
            }
        });
    }

    // Inventory filtering events
    if (searchInput) searchInput.addEventListener('input', () => { inventoryPage = 1; renderInventoryTable(); });
    if (categoryFilter) categoryFilter.addEventListener('change', () => { inventoryPage = 1; renderInventoryTable(); });
    if (statusFilter) statusFilter.addEventListener('change', () => { inventoryPage = 1; renderInventoryTable(); });

    // Inventory pagination controls
    if (inventoryPrevBtn) inventoryPrevBtn.addEventListener('click', () => { if (inventoryPage > 1) { inventoryPage--; renderInventoryTable(); } });
    if (inventoryNextBtn) inventoryNextBtn.addEventListener('click', () => {
        const totalPages = Math.ceil(getFilteredInventory().length / inventoryPageSize);
        if (inventoryPage < totalPages) { inventoryPage++; renderInventoryTable(); }
    });

    // Activity log filtering events
    if (activitySearchInput) activitySearchInput.addEventListener('input', () => { activityPage = 1; renderActivityTable(); });
    if (activityTypeFilter) activityTypeFilter.addEventListener('change', () => { activityPage = 1; renderActivityTable(); });
    if (activityWarehouseFilter) activityWarehouseFilter.addEventListener('change', () => { activityPage = 1; renderActivityTable(); });
    if (activityDateFilter) activityDateFilter.addEventListener('change', () => { activityPage = 1; renderActivityTable(); });

    // Activity log pagination controls
    if (activityPrevBtn) activityPrevBtn.addEventListener('click', () => { if (activityPage > 1) { activityPage--; renderActivityTable(); } });
    if (activityNextBtn) activityNextBtn.addEventListener('click', () => {
        const totalPages = Math.ceil(getFilteredActivityLog().length / activityPageSize);
        if (activityPage < totalPages) { activityPage++; renderActivityTable(); }
    });

    // Export Reports
    if (btnExport) {
        btnExport.addEventListener('click', () => {
            if (typeof window.showToast === 'function') {
                window.showToast('Export Started', 'Generating material inventory export report...', 'primary');
            }
        });
    }

    if (btnExportActivity) {
        btnExportActivity.addEventListener('click', () => {
            if (typeof window.showToast === 'function') {
                window.showToast('Activity Exported', 'Downloading inventory activity audit history as CSV...', 'primary');
            }
        });
    }

    // =========================================================================
    // 13. TABBED INTERFACE CONTROLLER
    // =========================================================================
    const initTabs = () => {
        const tabButtons = document.querySelectorAll('.tabs-nav .tab-btn');
        const tabContainers = document.querySelectorAll('.tab-content');

        if (!tabButtons.length || !tabContainers.length) return;

        const activateTab = (tabId) => {
            tabButtons.forEach(btn => {
                const isTarget = btn.getAttribute('data-tab') === tabId;
                btn.classList.toggle('active', isTarget);
                btn.setAttribute('aria-selected', isTarget ? 'true' : 'false');
            });

            tabContainers.forEach(container => {
                const isTarget = container.id === `${tabId}-container`;
                container.classList.toggle('active', isTarget);
            });
        };

        tabButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const tabId = btn.getAttribute('data-tab');
                if (tabId) {
                    activateTab(tabId);
                }
            });
        });

        // Ensure Materials is selected by default on load
        activateTab('materials');

        // Expose globally so sidebar scrollToSection can activate the corresponding tab
        window.activateTab = activateTab;
    };

    // =========================================================================
    // 14. INITIAL RENDER CALLS
    // =========================================================================
    updateGuidedAccessUI();
    setWarehouseScope('All');
    renderActivitySummary();
    renderActivityTable();
    updateProgressSteps(1);
    initTabs();
});