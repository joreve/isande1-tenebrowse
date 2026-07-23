/**
 * Warehouse Facilities Module Logic
 * Handles Warehouse selection, descriptions, Guided Access workflow steps,
 * material transfers, damage logs, stock updates, and activity feeds.
 */

document.addEventListener('DOMContentLoaded', () => {

    // Warehouse Facility Definitions
    const warehouseMap = {
        'W1': {
            code: 'W1',
            label: 'Warehouse 1',
            name: 'Small Items',
            fullTitle: 'Warehouse 1 — Small Items',
            description: 'Stores small construction items, tools, fittings, and electrical supplies.',
            usable: true
        },
        'W2': {
            code: 'W2',
            label: 'Warehouse 2',
            name: 'Large Materials',
            fullTitle: 'Warehouse 2 — Large Materials',
            description: 'Stores large and heavy construction materials.',
            usable: true
        },
        'W3': {
            code: 'W3',
            label: 'Warehouse 3',
            name: 'Damaged & Quarantined',
            fullTitle: 'Warehouse 3 — Damaged & Quarantined',
            description: 'Stores damaged, defective, or quarantined materials that are not available for normal use.',
            usable: false
        }
    };

    // Initial Inventory Dataset
    let inventoryData = [
        // Warehouse 1 (Small Items)
        { id: 'MAT-S101', name: 'Wood Screws 1.5"', category: 'Hardware', qty: 5000, unit: 'Pieces', min: 1000, status: 'In Stock', warehouse: 'W1', lastUpdated: '2026-07-20' },
        { id: 'MAT-S102', name: 'Common Nails 3"', category: 'Hardware', qty: 3200, unit: 'Pieces', min: 500, status: 'In Stock', warehouse: 'W1', lastUpdated: '2026-07-19' },
        { id: 'MAT-S103', name: 'Circuit Breaker 20A', category: 'Electrical', qty: 45, unit: 'Pieces', min: 100, status: 'Low Stock', warehouse: 'W1', lastUpdated: '2026-07-21' },
        { id: 'MAT-S104', name: 'Claw Hammer 16oz', category: 'Tools', qty: 60, unit: 'Pieces', min: 20, status: 'In Stock', warehouse: 'W1', lastUpdated: '2026-07-18' },
        { id: 'MAT-S105', name: 'PVC Elbow Fitting 1/2"', category: 'Plumbing', qty: 800, unit: 'Pieces', min: 200, status: 'Overstocked', warehouse: 'W1', lastUpdated: '2026-07-15' },
        { id: 'MAT-S106', name: 'Safety Helmet', category: 'Safety', qty: 12, unit: 'Pieces', min: 30, status: 'Low Stock', warehouse: 'W1', lastUpdated: '2026-07-22' },
        { id: 'MAT-S107', name: 'Safety Goggles', category: 'Safety', qty: 0, unit: 'Pieces', min: 25, status: 'Out of Stock', warehouse: 'W1', lastUpdated: '2026-07-22' },
        { id: 'MAT-S108', name: 'Electrical Tape', category: 'Electrical', qty: 500, unit: 'Rolls', min: 100, status: 'In Stock', warehouse: 'W1', lastUpdated: '2026-07-17' },

        // Warehouse 2 (Large Materials)
        { id: 'MAT-L201', name: 'Portland Cement Type I', category: 'Masonry', qty: 320, unit: 'Bags', min: 100, status: 'In Stock', warehouse: 'W2', lastUpdated: '2026-07-21' },
        { id: 'MAT-L202', name: 'Steel Rebar 12mm', category: 'Metals', qty: 45, unit: 'Pieces', min: 150, status: 'Low Stock', warehouse: 'W2', lastUpdated: '2026-07-20' },
        { id: 'MAT-L203', name: 'Marine Plywood 3/4"', category: 'Woodwork', qty: 150, unit: 'Sheets', min: 50, status: 'In Stock', warehouse: 'W2', lastUpdated: '2026-07-19' },
        { id: 'MAT-L204', name: 'Roofing Sheet Corrugated', category: 'Roofing', qty: 0, unit: 'Sheets', min: 40, status: 'Out of Stock', warehouse: 'W2', lastUpdated: '2026-07-16' },
        { id: 'MAT-L205', name: 'PVC Pipe 4"', category: 'Plumbing', qty: 900, unit: 'Lengths', min: 200, status: 'Overstocked', warehouse: 'W2', lastUpdated: '2026-07-14' },
        { id: 'MAT-L206', name: 'Concrete Hollow Block 4"', category: 'Masonry', qty: 20, unit: 'Pieces', min: 500, status: 'Low Stock', warehouse: 'W2', lastUpdated: '2026-07-22' },

        // Warehouse 3 (Damaged & Quarantined)
        { id: 'MAT-D301', name: 'Water-Damaged Gypsum Board', category: 'Damaged Materials', qty: 12, unit: 'Sheets', min: 0, status: 'Damaged', warehouse: 'W3', lastUpdated: '2026-07-20' },
        { id: 'MAT-D302', name: 'Defective Circuit Breaker', category: 'Defective Materials', qty: 5, unit: 'Pieces', min: 0, status: 'Defective', warehouse: 'W3', lastUpdated: '2026-07-18' },
        { id: 'MAT-D303', name: 'Cracked PVC Pipes', category: 'Materials Awaiting Inspection', qty: 8, unit: 'Lengths', min: 0, status: 'Awaiting Inspection', warehouse: 'W3', lastUpdated: '2026-07-21' },
        { id: 'MAT-D304', name: 'Mismatched Roofing Sheets', category: 'Materials Awaiting Supplier Return', qty: 15, unit: 'Sheets', min: 0, status: 'Awaiting Return', warehouse: 'W3', lastUpdated: '2026-07-17' }
    ];

    // Activity Log Feed Data
    let activityLog = [
        { icon: 'fa-check-circle', type: 'success', title: 'Stock Received', desc: 'Portland Cement Type I received at Warehouse 2.', time: 'Today' },
        { icon: 'fa-exchange-alt', type: 'info', title: 'Material Transferred', desc: 'Safety Helmets moved from Warehouse 1 to Warehouse 2.', time: 'Yesterday' },
        { icon: 'fa-exclamation-triangle', type: 'warning', title: 'Damage Recorded', desc: '12 sheets of Gypsum Board moved to Warehouse 3.', time: '3 days ago' }
    ];

    // Active Application State
    let currentWarehouse = 'W1';
    let activeMaterial = null;
    let currentStep = 1; // 1: Select Warehouse, 2: Select Material, 3: Choose Action, 4: Review Changes, 5: Save
    let currentPage = 1;
    const pageSize = 5;

    // Helper: Detect Guided Access Mode State
    const isGuidedAccessMode = () => {
        return localStorage.getItem('tenebrowseWarehouseGuidedAccess') === 'true' ||
               document.body.classList.contains('guided-access-enabled');
    };

    // Update Banner Visibility and Progress Elements
    const updateGuidedAccessUI = () => {
        const guided = isGuidedAccessMode();
        const guidedBanner = document.getElementById('guidedAccessBanner');
        const guidedSteps = document.getElementById('guidedStepsProgress');
        const guidanceBox = document.getElementById('actionGuidanceBox');

        if (guidedBanner) guidedBanner.style.display = guided ? 'block' : 'none';
        if (guidedSteps) guidedSteps.style.display = guided ? 'block' : 'none';
        if (guidanceBox) guidanceBox.style.display = guided ? 'flex' : 'none';
    };

    // Update Guided Progress Steps Badges
    const updateProgressSteps = (stepNum) => {
        currentStep = stepNum;
        if (!isGuidedAccessMode()) return;

        const steps = [
            document.getElementById('step1Badge'),
            document.getElementById('step2Badge'),
            document.getElementById('step3Badge'),
            document.getElementById('step4Badge'),
            document.getElementById('step5Badge')
        ];

        steps.forEach((badge, index) => {
            if (!badge) return;
            const num = index + 1;
            badge.className = 'badge';
            if (num < stepNum) {
                badge.classList.add('badge-success');
            } else if (num === stepNum) {
                badge.classList.add('badge-warning');
            } else {
                badge.classList.add('badge-info');
            }
        });
    };

    // Helper: Compute Badge Class from Status Text
    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'In Stock': case 'Optimal': return 'badge-success';
            case 'Low Stock': case 'Awaiting Inspection': return 'badge-warning';
            case 'Out of Stock': case 'Damaged': case 'Defective': return 'badge-danger';
            case 'Overstocked': case 'Awaiting Return': return 'badge-info';
            default: return 'badge-info';
        }
    };

    // Render Summary Metrics Block
    const renderSummaryMetrics = () => {
        const items = inventoryData.filter(item => item.warehouse === currentWarehouse);

        const totalSKUs = items.length;
        const totalQty = items.reduce((sum, item) => sum + item.qty, 0);
        const lowStockCount = items.filter(item => item.status === 'Low Stock' || item.status === 'Out of Stock').length;
        const damagedCount = currentWarehouse === 'W3' 
            ? items.length 
            : items.filter(item => item.status === 'Damaged' || item.status === 'Defective').length;

        document.getElementById('summaryTotalMaterials').textContent = totalSKUs;
        document.getElementById('summaryTotalQuantity').textContent = totalQty.toLocaleString();
        document.getElementById('summaryLowStock').textContent = lowStockCount;
        document.getElementById('summaryDamaged').textContent = damagedCount;
    };

    // Populate Category and Status Dropdowns
    const renderFilterOptions = () => {
        const categorySelect = document.getElementById('categoryFilter');
        const statusSelect = document.getElementById('statusFilter');

        const items = inventoryData.filter(item => item.warehouse === currentWarehouse);

        const currentCat = categorySelect.value || 'All';
        const currentStat = statusSelect.value || 'All';

        const categories = ['All', ...new Set(items.map(i => i.category))];
        const statuses = ['All', ...new Set(items.map(i => i.status))];

        categorySelect.innerHTML = categories.map(c => `<option value="${c}">${c === 'All' ? 'All Categories' : c}</option>`).join('');
        statusSelect.innerHTML = statuses.map(s => `<option value="${s}">${s === 'All' ? 'All Statuses' : s}</option>`).join('');

        categorySelect.value = categories.includes(currentCat) ? currentCat : 'All';
        statusSelect.value = statuses.includes(currentStat) ? currentStat : 'All';
    };

    // Render Inventory Activity Feed
    const renderActivityFeed = () => {
        const container = document.getElementById('activityFeed');
        if (!container) return;

        container.innerHTML = activityLog.map(act => `
            <div class="feed-item ${act.type}">
                <div class="feed-icon"><i class="fas ${act.icon}"></i></div>
                <div class="feed-body">
                    <div class="feed-title">${act.title}</div>
                    <div class="feed-meta">${act.desc}</div>
                </div>
            </div>
        `).join('');
    };

    // Filter and Paginate Table Data
    const getFilteredInventory = () => {
        const searchVal = (document.getElementById('searchInput').value || '').toLowerCase().trim();
        const catVal = document.getElementById('categoryFilter').value || 'All';
        const statusVal = document.getElementById('statusFilter').value || 'All';

        return inventoryData.filter(item => {
            if (item.warehouse !== currentWarehouse) return false;
            if (catVal !== 'All' && item.category !== catVal) return false;
            if (statusVal !== 'All' && item.status !== statusVal) return false;
            if (searchVal) {
                const matchId = item.id.toLowerCase().includes(searchVal);
                const matchName = item.name.toLowerCase().includes(searchVal);
                return matchId || matchName;
            }
            return true;
        });
    };

    // Render Main Table
    const renderTable = () => {
        const tableBody = document.getElementById('warehouseTableBody');
        const paginationInfo = document.getElementById('paginationInfo');
        const prevBtn = document.getElementById('prevPageBtn');
        const nextBtn = document.getElementById('nextPageBtn');

        const filtered = getFilteredInventory();
        const totalItems = filtered.length;
        const totalPages = Math.ceil(totalItems / pageSize) || 1;

        if (currentPage > totalPages) currentPage = totalPages;

        const startIndex = (currentPage - 1) * pageSize;
        const pageItems = filtered.slice(startIndex, startIndex + pageSize);

        if (pageItems.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="8" class="text-center py-3 text-muted">No materials found in ${warehouseMap[currentWarehouse].fullTitle}.</td>
                </tr>
            `;
            paginationInfo.textContent = `Showing 0-0 of 0 records`;
            prevBtn.disabled = true;
            nextBtn.disabled = true;
            return;
        }

        tableBody.innerHTML = pageItems.map(item => `
            <tr data-id="${item.id}">
                <td class="font-semibold">${item.id}</td>
                <td>${item.name}</td>
                <td>${item.category}</td>
                <td class="font-semibold">${item.qty.toLocaleString()}</td>
                <td>${item.unit}</td>
                <td><span class="badge ${getStatusBadgeClass(item.status)}">${item.status}</span></td>
                <td class="text-muted-sm">${item.lastUpdated}</td>
                <td class="text-left">
                    <div class="action-list">
                        <button class="action-item-btn action-view" data-id="${item.id}" title="View Material">
                            <i class="fas fa-eye"></i> <span class="action-label">View</span>
                        </button>
                        <button class="action-item-btn action-update" data-id="${item.id}" title="Update Stock">
                            <i class="fas fa-cubes"></i> <span class="action-label">Update Stock</span>
                        </button>
                        <button class="action-item-btn action-transfer" data-id="${item.id}" title="Transfer Material">
                            <i class="fas fa-exchange-alt"></i> <span class="action-label">Transfer</span>
                        </button>
                        <button class="action-item-btn action-damage" data-id="${item.id}" title="Record Damage">
                            <i class="fas fa-exclamation-triangle"></i> <span class="action-label">Record Damage</span>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');

        paginationInfo.textContent = `Showing ${startIndex + 1}-${Math.min(startIndex + pageSize, totalItems)} of ${totalItems} records`;
        prevBtn.disabled = currentPage === 1;
        nextBtn.disabled = currentPage >= totalPages;

        // Attach Row Action Handlers
        tableBody.querySelectorAll('.action-view').forEach(btn => {
            btn.addEventListener('click', () => openViewModal(btn.dataset.id));
        });

        tableBody.querySelectorAll('.action-update').forEach(btn => {
            btn.addEventListener('click', () => openActionModal(btn.dataset.id, 'Update Stock'));
        });

        tableBody.querySelectorAll('.action-transfer').forEach(btn => {
            btn.addEventListener('click', () => openActionModal(btn.dataset.id, 'Transfer Material'));
        });

        tableBody.querySelectorAll('.action-damage').forEach(btn => {
            btn.addEventListener('click', () => openActionModal(btn.dataset.id, 'Record Damage'));
        });
    };

    // Initialize Warehouse Card Click Handlers
    const initWarehouseSelection = () => {
        const cards = document.querySelectorAll('.warehouse-select-card');
        const banner = document.getElementById('warehouseBanner');
        const tableTitle = document.getElementById('tableTitle');

        cards.forEach(card => {
            card.addEventListener('click', () => {
                const code = card.dataset.warehouse;
                if (!warehouseMap[code]) return;

                currentWarehouse = code;

                // Toggle active styling
                cards.forEach(c => c.classList.remove('active'));
                card.classList.add('active');

                // Toggle Warehouse 3 Warning Banner
                if (banner) {
                    banner.style.display = currentWarehouse === 'W3' ? 'flex' : 'none';
                }

                if (tableTitle) {
                    tableTitle.textContent = `${warehouseMap[currentWarehouse].fullTitle} Inventory`;
                }

                currentPage = 1;
                updateProgressSteps(2); // Step 2: Select Material
                renderSummaryMetrics();
                renderFilterOptions();
                renderTable();
            });
        });
    };

    // Read-Only View Modal
    const openViewModal = (id) => {
        const item = inventoryData.find(i => i.id === id);
        if (!item) return;

        document.getElementById('viewName').value = item.name;
        document.getElementById('viewId').value = item.id;
        document.getElementById('viewCategory').value = item.category;
        document.getElementById('viewQty').value = item.qty.toLocaleString();
        document.getElementById('viewUnit').value = item.unit;
        document.getElementById('viewWarehouse').value = warehouseMap[item.warehouse].fullTitle;
        document.getElementById('viewStatus').value = item.status;
        document.getElementById('viewLastUpdated').value = item.lastUpdated;

        if (typeof openModal === 'function') {
            openModal('viewModal');
        } else {
            document.getElementById('viewModal').classList.add('active');
        }
    };

    // Action Workflow Modal Handling
    const actionModalTitle = document.getElementById('actionModalTitle');
    const actionTypeSelect = document.getElementById('actionTypeSelect');
    const actionMaterialName = document.getElementById('actionMaterialName');
    const actionCurrentWarehouse = document.getElementById('actionCurrentWarehouse');
    const actionAvailableQty = document.getElementById('actionAvailableQty');
    const actionGuidanceText = document.getElementById('actionGuidanceText');

    const actionDestGroup = document.getElementById('actionDestGroup');
    const actionDestination = document.getElementById('actionDestination');
    const actionDestError = document.getElementById('actionDestError');

    const actionQtyGroup = document.getElementById('actionQtyGroup');
    const actionQtyLabel = document.getElementById('actionQtyLabel');
    const actionQty = document.getElementById('actionQty');
    const actionQtyError = document.getElementById('actionQtyError');

    const actionReasonGroup = document.getElementById('actionReasonGroup');
    const actionReasonLabel = document.getElementById('actionReasonLabel');
    const actionReason = document.getElementById('actionReason');
    const actionReasonError = document.getElementById('actionReasonError');

    const actionRemarks = document.getElementById('actionRemarks');

    // Section containers
    const actionFormSection = document.getElementById('actionFormSection');
    const actionReviewSection = document.getElementById('actionReviewSection');
    const actionConfirmSection = document.getElementById('actionConfirmSection');

    // Footers
    const actionFormFooter = document.getElementById('actionFormFooter');
    const actionReviewFooter = document.getElementById('actionReviewFooter');
    const actionConfirmFooter = document.getElementById('actionConfirmFooter');

    const btnReviewAction = document.getElementById('btnReviewAction');
    const btnSaveDirect = document.getElementById('btnSaveDirect');
    const btnBackToForm = document.getElementById('btnBackToForm');
    const btnProceedToConfirm = document.getElementById('btnProceedToConfirm');
    const btnBackToReview = document.getElementById('btnBackToReview');
    const btnFinalSave = document.getElementById('btnFinalSave');

    // Display correct Workflow Modal View Section
    const showModalSection = (section) => {
        actionFormSection.style.display = section === 'form' ? 'block' : 'none';
        actionReviewSection.style.display = section === 'review' ? 'block' : 'none';
        actionConfirmSection.style.display = section === 'confirm' ? 'block' : 'none';

        actionFormFooter.style.display = section === 'form' ? 'flex' : 'none';
        actionReviewFooter.style.display = section === 'review' ? 'flex' : 'none';
        actionConfirmFooter.style.display = section === 'confirm' ? 'flex' : 'none';

        if (section === 'form') updateProgressSteps(3); // Choose Action
        if (section === 'review') updateProgressSteps(4); // Review
        if (section === 'confirm') updateProgressSteps(5); // Save
    };

    // Populate Dynamic Action Reasons Options
    const populateReasonOptions = (actionType) => {
        actionReason.innerHTML = '';
        let options = [];

        if (actionType === 'Transfer Material') {
            options = [
                { val: '', text: 'Select transfer reason...' },
                { val: 'Stock Rebalancing', text: 'Stock Rebalancing' },
                { val: 'Project Requirement', text: 'Project Requirement' },
                { val: 'Damage Relocation', text: 'Damage Relocation' },
                { val: 'Quarantine', text: 'Quarantine' },
                { val: 'Defective Stock', text: 'Defective Stock' },
                { val: 'Other', text: 'Other' }
            ];
        } else if (actionType === 'Record Damage') {
            options = [
                { val: '', text: 'Select damage or defect reason...' },
                { val: 'Water Damage', text: 'Water Damage' },
                { val: 'Physical Breakage', text: 'Physical Breakage' },
                { val: 'Manufacturing Defect', text: 'Manufacturing Defect' },
                { val: 'Expired or Deteriorated', text: 'Expired or Deteriorated' },
                { val: 'Awaiting Inspection', text: 'Awaiting Inspection' },
                { val: 'Other', text: 'Other' }
            ];
        } else {
            options = [
                { val: '', text: 'Select adjustment reason...' },
                { val: 'Stock Count Adjustment', text: 'Stock Count Adjustment' },
                { val: 'Received New Stock', text: 'Received New Stock' },
                { val: 'Physical Discrepancy Correction', text: 'Physical Discrepancy Correction' },
                { val: 'Other', text: 'Other' }
            ];
        }

        options.forEach(opt => {
            const el = document.createElement('option');
            el.value = opt.val;
            el.textContent = opt.text;
            actionReason.appendChild(el);
        });
    };

    // Dynamic Form UI Updates Based on Action Type Selection
    const syncActionFormUI = () => {
        const actionType = actionTypeSelect.value;

        // Reset errors
        actionQtyError.textContent = '';
        actionDestError.textContent = '';
        actionReasonError.textContent = '';

        populateReasonOptions(actionType);

        if (actionType === 'Transfer Material') {
            actionModalTitle.textContent = 'Transfer Material Workflow';
            actionGuidanceText.textContent = 'Transfer quantity from the current warehouse to a designated target facility.';
            actionDestGroup.style.display = 'block';
            actionQtyLabel.textContent = 'Transfer Quantity';
            actionReasonLabel.textContent = 'Transfer Reason';

            // Populate destination warehouses excluding current
            actionDestination.innerHTML = '<option value="">Select destination warehouse...</option>';
            Object.keys(warehouseMap).forEach(code => {
                if (code !== currentWarehouse) {
                    const opt = document.createElement('option');
                    opt.value = code;
                    opt.textContent = warehouseMap[code].fullTitle;
                    actionDestination.appendChild(opt);
                }
            });

        } else if (actionType === 'Record Damage') {
            actionModalTitle.textContent = 'Record Damaged Stock Workflow';
            actionGuidanceText.textContent = 'Record damaged or defective materials and move them to Warehouse 3 (Quarantine).';
            actionDestGroup.style.display = 'none';
            actionDestination.value = 'W3';
            actionQtyLabel.textContent = 'Damaged Quantity';
            actionReasonLabel.textContent = 'Damage / Quarantine Reason';

        } else {
            // Update Stock
            actionModalTitle.textContent = 'Update Stock Quantity Workflow';
            actionGuidanceText.textContent = 'Update the stock quantity on hand for this material in the selected warehouse.';
            actionDestGroup.style.display = 'none';
            actionDestination.value = '';
            actionQtyLabel.textContent = 'New Total Quantity';
            actionReasonLabel.textContent = 'Adjustment Reason';
        }

        updateLiveCalculations();
    };

    // Live Calculation Preview Computation
    const updateLiveCalculations = () => {
        if (!activeMaterial) return;

        const actionType = actionTypeSelect.value;
        const enteredQty = parseInt(actionQty.value, 10) || 0;

        const currentQty = activeMaterial.qty;
        let qtyChange = 0;
        let remainingQty = currentQty;

        if (actionType === 'Transfer Material' || actionType === 'Record Damage') {
            qtyChange = -enteredQty;
            remainingQty = currentQty - enteredQty;
        } else {
            qtyChange = enteredQty - currentQty;
            remainingQty = enteredQty;
        }

        document.getElementById('previewCurrentStock').textContent = currentQty.toLocaleString();
        document.getElementById('previewQuantityChange').textContent = (qtyChange > 0 ? '+' : '') + qtyChange.toLocaleString();
        document.getElementById('previewRemainingStock').textContent = remainingQty.toLocaleString();
    };

    // Form Validation Rules
    const validateActionForm = (showErrors = false) => {
        if (!activeMaterial) return false;

        let isValid = true;
        const actionType = actionTypeSelect.value;
        const enteredQty = parseInt(actionQty.value, 10);
        const destCode = actionType === 'Record Damage' ? 'W3' : actionDestination.value;
        const reasonVal = actionReason.value;

        // Clear error text
        actionQtyError.textContent = '';
        actionDestError.textContent = '';
        actionReasonError.textContent = '';

        // Quantity Validation
        if (isNaN(enteredQty) || enteredQty <= 0) {
            if (showErrors) actionQtyError.textContent = 'Quantity must be greater than zero.';
            isValid = false;
        } else if ((actionType === 'Transfer Material' || actionType === 'Record Damage') && enteredQty > activeMaterial.qty) {
            if (showErrors) actionQtyError.textContent = 'Quantity cannot exceed available stock.';
            isValid = false;
        }

        // Destination Validation for Transfers
        if (actionType === 'Transfer Material') {
            if (!destCode) {
                if (showErrors) actionDestError.textContent = 'Destination warehouse is required.';
                isValid = false;
            } else if (destCode === currentWarehouse) {
                if (showErrors) actionDestError.textContent = 'Destination cannot match current warehouse.';
                isValid = false;
            }
        }

        // Reason Validation
        if ((actionType === 'Record Damage' || destCode === 'W3') && !reasonVal) {
            if (showErrors) actionReasonError.textContent = 'Transfers or moves to Warehouse 3 require a reason.';
            isValid = false;
        }

        return isValid;
    };

    // Open Action Modal Setup
    const openActionModal = (id, defaultAction = 'Transfer Material') => {
        activeMaterial = inventoryData.find(i => i.id === id);
        if (!activeMaterial) return;

        actionMaterialName.value = `${activeMaterial.name} (${activeMaterial.id})`;
        actionCurrentWarehouse.value = warehouseMap[activeMaterial.warehouse].fullTitle;
        actionAvailableQty.value = `${activeMaterial.qty.toLocaleString()} ${activeMaterial.unit}`;

        actionTypeSelect.value = defaultAction;
        actionQty.value = '';
        actionRemarks.value = '';

        syncActionFormUI();
        showModalSection('form');

        // Toggle button visibility based on Guided Access mode
        const isGuided = isGuidedAccessMode();
        btnReviewAction.style.display = isGuided ? 'inline-block' : 'none';
        btnSaveDirect.style.display = isGuided ? 'none' : 'inline-block';

        if (typeof openModal === 'function') {
            openModal('actionWorkflowModal');
        } else {
            document.getElementById('actionWorkflowModal').classList.add('active');
        }
    };

    // Populate Step 4: Review Summary View
    const populateReviewSummary = () => {
        const actionType = actionTypeSelect.value;
        const enteredQty = parseInt(actionQty.value, 10);
        const destCode = actionType === 'Record Damage' ? 'W3' : actionDestination.value;

        document.getElementById('reviewMaterialName').textContent = `${activeMaterial.name} (${activeMaterial.id})`;
        document.getElementById('reviewCurrentWarehouse').textContent = warehouseMap[activeMaterial.warehouse].fullTitle;

        const destGroup = document.getElementById('reviewDestinationGroup');
        if (actionType === 'Update Stock') {
            destGroup.style.display = 'none';
        } else {
            destGroup.style.display = 'block';
            document.getElementById('reviewDestinationWarehouse').textContent = warehouseMap[destCode].fullTitle;
        }

        const currentQty = activeMaterial.qty;
        let qtyChange = 0;
        let remainingQty = currentQty;

        if (actionType === 'Transfer Material' || actionType === 'Record Damage') {
            qtyChange = enteredQty;
            remainingQty = currentQty - enteredQty;
            document.getElementById('reviewQtyChangeLabel').textContent = 'Transfer Quantity';
            document.getElementById('reviewRemainingQtyLabel').textContent = 'Remaining Quantity';
        } else {
            qtyChange = Math.abs(enteredQty - currentQty);
            remainingQty = enteredQty;
            document.getElementById('reviewQtyChangeLabel').textContent = 'New Quantity';
            document.getElementById('reviewRemainingQtyLabel').textContent = 'Updated Quantity';
        }

        document.getElementById('reviewCurrentQty').textContent = `${currentQty.toLocaleString()} ${activeMaterial.unit}`;
        document.getElementById('reviewQtyChange').textContent = `${qtyChange.toLocaleString()} ${activeMaterial.unit}`;
        document.getElementById('reviewRemainingQty').textContent = `${remainingQty.toLocaleString()} ${activeMaterial.unit}`;

        document.getElementById('reviewReason').textContent = actionReason.value || 'N/A';
        document.getElementById('reviewRemarks').textContent = actionRemarks.value.trim() || '-';

        // Usable Stock Impact Notice
        const impactBox = document.getElementById('reviewUsableImpactBox');
        if (destCode === 'W3' || actionType === 'Record Damage') {
            impactBox.style.display = 'flex';
        } else {
            impactBox.style.display = 'none';
        }
    };

    // Populate Step 5: Final Confirmation View
    const populateFinalConfirmation = () => {
        const actionType = actionTypeSelect.value;
        const enteredQty = parseInt(actionQty.value, 10);
        const destCode = actionType === 'Record Damage' ? 'W3' : actionDestination.value;
        const sourceTitle = warehouseMap[activeMaterial.warehouse].fullTitle;
        const confirmMsgEl = document.getElementById('actionConfirmMessage');

        if (actionType === 'Transfer Material') {
            const destTitle = warehouseMap[destCode].fullTitle;
            if (destCode === 'W3') {
                confirmMsgEl.textContent = `You are transferring ${enteredQty} ${activeMaterial.unit} of ${activeMaterial.name} from ${sourceTitle} to ${destTitle}. These items will no longer be counted as usable inventory. Continue?`;
            } else {
                confirmMsgEl.textContent = `You are transferring ${enteredQty} ${activeMaterial.unit} of ${activeMaterial.name} from ${sourceTitle} to ${destTitle}. Continue?`;
            }
        } else if (actionType === 'Record Damage') {
            confirmMsgEl.textContent = `You are recording ${enteredQty} ${activeMaterial.unit} of ${activeMaterial.name} as damaged and moving them to Warehouse 3 (Quarantine). These items will no longer be counted as usable inventory. Continue?`;
        } else {
            confirmMsgEl.textContent = `You are updating ${activeMaterial.name} stock in ${sourceTitle} from ${activeMaterial.qty} ${activeMaterial.unit} to ${enteredQty} ${activeMaterial.unit}. Continue?`;
        }
    };

    // Execute Final Data Changes
    const executeSave = () => {
        if (!activeMaterial) return;

        const actionType = actionTypeSelect.value;
        const enteredQty = parseInt(actionQty.value, 10);
        const destCode = actionType === 'Record Damage' ? 'W3' : actionDestination.value;
        const todayStr = new Date().toISOString().split('T')[0];

        let toastMsg = '';
        let activityTitle = '';
        let activityDesc = '';

        if (actionType === 'Update Stock') {
            activeMaterial.qty = enteredQty;
            activeMaterial.lastUpdated = todayStr;
            activeMaterial.status = enteredQty === 0 ? 'Out of Stock' : (enteredQty < activeMaterial.min ? 'Low Stock' : 'In Stock');

            toastMsg = 'Warehouse stock updated successfully.';
            activityTitle = 'Stock Updated';
            activityDesc = `${activeMaterial.name} updated to ${enteredQty} ${activeMaterial.unit} in ${warehouseMap[currentWarehouse].label}.`;

        } else {
            // Transfer Material or Record Damage
            activeMaterial.qty -= enteredQty;
            activeMaterial.lastUpdated = todayStr;
            if (activeMaterial.qty === 0) activeMaterial.status = 'Out of Stock';
            else if (activeMaterial.qty < activeMaterial.min) activeMaterial.status = 'Low Stock';

            // Find or create target material in destination warehouse
            let targetItem = inventoryData.find(i => i.warehouse === destCode && i.name === activeMaterial.name);

            if (targetItem) {
                targetItem.qty += enteredQty;
                targetItem.lastUpdated = todayStr;
            } else {
                const newId = `MAT-${destCode}${Math.floor(100 + Math.random() * 900)}`;
                inventoryData.push({
                    id: newId,
                    name: activeMaterial.name,
                    category: destCode === 'W3' ? 'Damaged Materials' : activeMaterial.category,
                    qty: enteredQty,
                    unit: activeMaterial.unit,
                    min: activeMaterial.min || 10,
                    status: destCode === 'W3' ? 'Damaged' : 'In Stock',
                    warehouse: destCode,
                    lastUpdated: todayStr
                });
            }

            if (destCode === 'W3' || actionType === 'Record Damage') {
                toastMsg = 'Damaged materials were moved to Warehouse 3.';
                activityTitle = 'Damage Recorded';
                activityDesc = `${enteredQty} ${activeMaterial.unit} of ${activeMaterial.name} moved from ${warehouseMap[currentWarehouse].label} to Warehouse 3.`;
            } else {
                toastMsg = 'Material transfer completed.';
                activityTitle = 'Material Transferred';
                activityDesc = `${enteredQty} ${activeMaterial.unit} of ${activeMaterial.name} moved from ${warehouseMap[currentWarehouse].label} to ${warehouseMap[destCode].label}.`;
            }
        }

        // Add to Activity Feed Log
        activityLog.unshift({
            icon: actionType === 'Record Damage' || destCode === 'W3' ? 'fa-exclamation-triangle' : 'fa-exchange-alt',
            type: actionType === 'Record Damage' || destCode === 'W3' ? 'warning' : 'info',
            title: activityTitle,
            desc: activityDesc,
            time: 'Just now'
        });

        // Display Success Toast Notification
        if (typeof showToast === 'function') {
            showToast('Success', toastMsg, 'success');
        } else {
            alert(toastMsg);
        }

        // Close Modal & Reset Workflow Step
        if (typeof closeModal === 'function') {
            closeModal('actionWorkflowModal');
        } else {
            document.getElementById('actionWorkflowModal').classList.remove('active');
        }

        updateProgressSteps(2); // Reset back to Step 2: Select Material
        renderSummaryMetrics();
        renderFilterOptions();
        renderTable();
        renderActivityFeed();
    };

    // Attach Event Listeners to Form Fields & Action Buttons
    actionTypeSelect.addEventListener('change', syncActionFormUI);
    actionQty.addEventListener('input', () => {
        validateActionForm(false);
        updateLiveCalculations();
    });
    actionDestination.addEventListener('change', () => validateActionForm(false));
    actionReason.addEventListener('change', () => validateActionForm(false));

    btnReviewAction.addEventListener('click', () => {
        if (validateActionForm(true)) {
            populateReviewSummary();
            showModalSection('review');
        }
    });

    btnSaveDirect.addEventListener('click', () => {
        if (validateActionForm(true)) {
            executeSave();
        }
    });

    btnBackToForm.addEventListener('click', () => showModalSection('form'));

    btnProceedToConfirm.addEventListener('click', () => {
        populateFinalConfirmation();
        showModalSection('confirm');
    });

    btnBackToReview.addEventListener('click', () => showModalSection('review'));

    btnFinalSave.addEventListener('click', executeSave);

    // Filter controls listeners
    document.getElementById('searchInput').addEventListener('input', () => {
        currentPage = 1;
        renderTable();
    });

    document.getElementById('categoryFilter').addEventListener('change', () => {
        currentPage = 1;
        renderTable();
    });

    document.getElementById('statusFilter').addEventListener('change', () => {
        currentPage = 1;
        renderTable();
    });

    // Pagination buttons
    document.getElementById('prevPageBtn').addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderTable();
        }
    });

    document.getElementById('nextPageBtn').addEventListener('click', () => {
        const filtered = getFilteredInventory();
        const totalPages = Math.ceil(filtered.length / pageSize);
        if (currentPage < totalPages) {
            currentPage++;
            renderTable();
        }
    });

    // Export Button Handler
    document.getElementById('btnExport').addEventListener('click', () => {
        if (typeof showToast === 'function') {
            showToast('Report Exported', `${warehouseMap[currentWarehouse].fullTitle} inventory report has been generated.`, 'info');
        } else {
            alert('Warehouse Report Exported');
        }
    });

    // Initial Execution & UI Rendering
    updateGuidedAccessUI();
    updateProgressSteps(1); // Initial Step: Select Warehouse
    initWarehouseSelection();
    renderSummaryMetrics();
    renderFilterOptions();
    renderTable();
    renderActivityFeed();
});