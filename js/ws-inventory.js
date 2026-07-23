/**
 * Tenebrowse - Warehouse Staff Inventory Management (v3.1)
 * Guided Access Workflow, Validations, Inventory Actions, and Data Updates
 */

document.addEventListener('DOMContentLoaded', () => {
    // Inventory Data Store
    let inventoryData = [
        { id: 'MAT-1001', name: 'Portland Cement (Type I)', category: 'Structural', qty: 1240, unit: 'Bags (40kg)', warehouse: 'Warehouse 2', min: 500, status: 'In Stock', lastUpdated: '2026-07-20' },
        { id: 'MAT-1002', name: 'Steel Reinforcement Bar 12mm', category: 'Structural', qty: 85, unit: 'Pieces', warehouse: 'Warehouse 2', min: 300, status: 'Low Stock', lastUpdated: '2026-07-21' },
        { id: 'MAT-1003', name: 'Marine Plywood 3/4"', category: 'Finishing', qty: 0, unit: 'Sheets', warehouse: 'Warehouse 2', min: 50, status: 'Out of Stock', lastUpdated: '2026-07-19' },
        { id: 'MAT-1004', name: 'PVC Pipe 4-inch', category: 'Plumbing', qty: 620, unit: 'Lengths', warehouse: 'Warehouse 1', min: 100, status: 'Overstocked', lastUpdated: '2026-07-22' },
        { id: 'MAT-1005', name: 'Concrete Hollow Blocks 6"', category: 'Structural', qty: 3400, unit: 'Pieces', warehouse: 'Warehouse 2', min: 1000, status: 'In Stock', lastUpdated: '2026-07-18' },
        { id: 'MAT-1006', name: 'Electrical Wire THHN 3.5mm', category: 'Electrical', qty: 210, unit: 'Rolls', warehouse: 'Warehouse 1', min: 250, status: 'Low Stock', lastUpdated: '2026-07-21' },
        { id: 'MAT-1007', name: 'Roofing Sheets (Corrugated)', category: 'Finishing', qty: 480, unit: 'Sheets', warehouse: 'Warehouse 2', min: 150, status: 'In Stock', lastUpdated: '2026-07-17' },
        { id: 'MAT-1008', name: 'Structural Bolts M16', category: 'Structural', qty: 15, unit: 'Boxes', warehouse: 'Warehouse 1', min: 40, status: 'Low Stock', lastUpdated: '2026-07-22' }
    ];

    let inventoryActivityLog = [];
    let activeMaterialId = null;

    // DOM Elements
    const guidedAccessBanner = document.getElementById('guidedAccessBanner');
    const guidedStepsProgress = document.getElementById('guidedStepsProgress');
    const tableBody = document.getElementById('inventoryTableBody');
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');
    const warehouseFilter = document.getElementById('warehouseFilter');
    const statusFilter = document.getElementById('statusFilter');
    const btnExport = document.getElementById('btnExport');

    // Metrics
    const metricTotalMaterials = document.getElementById('metricTotalMaterials');
    const metricAvailableStock = document.getElementById('metricAvailableStock');
    const metricLowStock = document.getElementById('metricLowStock');
    const metricOutOfStock = document.getElementById('metricOutOfStock');

    // Modal Components
    const updateModal = document.getElementById('updateQtyModal');
    const updateFormSection = document.getElementById('updateFormSection');
    const updateReviewSection = document.getElementById('updateReviewSection');
    const updateConfirmSection = document.getElementById('updateConfirmSection');

    // Footers & Controls
    const updateFormFooter = document.getElementById('updateFormFooter');
    const updateReviewFooter = document.getElementById('updateReviewFooter');
    const updateConfirmFooter = document.getElementById('updateConfirmFooter');

    const btnReviewUpdate = document.getElementById('btnReviewUpdate');
    const btnSaveDirect = document.getElementById('btnSaveDirect');
    const btnGoBack = document.getElementById('btnGoBack');
    const btnProceedConfirm = document.getElementById('btnProceedConfirm');
    const btnGoBackConfirm = document.getElementById('btnGoBackConfirm');
    const btnFinalConfirm = document.getElementById('btnFinalConfirm');

    // Form Inputs
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

    // Preview
    const previewPrevQty = document.getElementById('previewPrevQty');
    const previewChangeQty = document.getElementById('previewChangeQty');
    const previewNewQty = document.getElementById('previewNewQty');

    // Check Guided Access State
    const isGuidedAccessMode = () => {
        return localStorage.getItem('tenebrowseWarehouseGuidedAccess') === 'true' ||
               document.body.classList.contains('guided-access-enabled');
    };

    // Toggle Page Elements for Guided Access Mode
    const updateGuidedAccessUI = () => {
        const guided = isGuidedAccessMode();

        if (guidedAccessBanner) guidedAccessBanner.style.display = guided ? 'block' : 'none';
        if (guidedStepsProgress) guidedStepsProgress.style.display = guided ? 'block' : 'none';
        if (updateTypeExplanationBox) updateTypeExplanationBox.style.display = guided ? 'flex' : 'none';
    };

    // Update Guided Progress Steps Badges (Matches Warehouse Facilities badge styling)
    const updateProgressSteps = (stepNum) => {
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

    const updateExplanations = () => {
        const selectedType = updateType.value;
        let text = '';
        switch (selectedType) {
            case 'Add Received Stock':
                text = 'Use this when new materials have arrived and should be added to inventory.';
                break;
            case 'Reduce Stock':
                text = 'Use this when materials were released, used, or removed from storage.';
                break;
            case 'Correct Inventory Count':
                text = 'Use this when the recorded quantity does not match the physical count.';
                break;
            case 'Record Damaged Stock':
                text = 'Use this when materials are damaged and should be removed from usable inventory.';
                break;
            case 'Transfer Material':
                text = 'Use this when materials are being moved to another warehouse.';
                break;
            default:
                text = '';
        }
        if (updateTypeExplanationText) {
            updateTypeExplanationText.textContent = text;
        }
    };

    const updateMetrics = () => {
        const total = inventoryData.length;
        const available = inventoryData.filter(i => i.status === 'In Stock' || i.status === 'Overstocked').length;
        const low = inventoryData.filter(i => i.status === 'Low Stock').length;
        const out = inventoryData.filter(i => i.status === 'Out of Stock').length;

        if (metricTotalMaterials) metricTotalMaterials.textContent = total;
        if (metricAvailableStock) metricAvailableStock.textContent = available;
        if (metricLowStock) metricLowStock.textContent = low;
        if (metricOutOfStock) metricOutOfStock.textContent = out;
    };

    const getBadgeClass = (status) => {
        if (status === 'In Stock') return 'badge-success';
        if (status === 'Low Stock') return 'badge-warning';
        if (status === 'Out of Stock') return 'badge-danger';
        if (status === 'Overstocked') return 'badge-info';
        return 'badge-info';
    };

    // Render Table Action Buttons (Matches Warehouse Facilities action-list style)
    const renderInventoryTable = () => {
        const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
        const filterCategory = categoryFilter ? categoryFilter.value : 'All';
        const filterWarehouse = warehouseFilter ? warehouseFilter.value : 'All';
        const filterStatus = statusFilter ? statusFilter.value : 'All';

        if (!tableBody) return;
        tableBody.innerHTML = '';

        const filtered = inventoryData.filter(item => {
            const matchesSearch = item.id.toLowerCase().includes(searchTerm) || item.name.toLowerCase().includes(searchTerm);
            const matchesCategory = filterCategory === 'All' || item.category === filterCategory;
            const matchesWarehouse = filterWarehouse === 'All' || item.warehouse === filterWarehouse;
            const matchesStatus = filterStatus === 'All' || item.status === filterStatus;
            return matchesSearch && matchesCategory && matchesWarehouse && matchesStatus;
        });

        if (filtered.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="10" class="empty-state-row">No inventory records match your criteria.</td></tr>`;
            return;
        }

        filtered.forEach(item => {
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
            tableBody.appendChild(tr);
        });

        updateMetrics();
    };

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
                qtyError.textContent = 'Enter a quantity greater than zero.';
                qtyError.style.display = 'block';
            }
        } else {
            let computedNewQty = item.qty;
            if (typeVal === 'Add Received Stock') {
                computedNewQty = item.qty + changeVal;
            } else if (typeVal === 'Reduce Stock' || typeVal === 'Record Damaged Stock') {
                computedNewQty = item.qty - changeVal;
            } else if (typeVal === 'Transfer Material') {
                if (changeVal > item.qty) {
                    isValid = false;
                    if (showErrors && qtyGroup && qtyError) {
                        qtyGroup.classList.add('has-error');
                        qtyError.textContent = 'The transfer quantity cannot exceed the available quantity.';
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
                    qtyError.textContent = 'The new quantity cannot be negative.';
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
                    destinationWarehouseError.textContent = 'Select a warehouse location.';
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
                    refNumberError.textContent = 'Enter the delivery or reference number.';
                    refNumberError.style.display = 'block';
                }
            }
        }

        if (typeVal === 'Correct Inventory Count') {
            if (!correctionReason.value.trim()) {
                isValid = false;
                if (showErrors && correctionReasonGroup && correctionReasonError) {
                    correctionReasonGroup.classList.add('has-error');
                    correctionReasonError.textContent = 'Provide a reason for this inventory correction.';
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
            } else if (typeVal === 'Reduce Stock' || typeVal === 'Record Damaged Stock' || typeVal === 'Transfer Material') {
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

    const updateVisibleFields = () => {
        const typeVal = updateType.value;

        if (destinationWarehouseGroup) destinationWarehouseGroup.style.display = (typeVal === 'Transfer Material') ? 'block' : 'none';
        if (refNumberGroup) refNumberGroup.style.display = (typeVal === 'Add Received Stock') ? 'block' : 'none';
        if (correctionReasonGroup) correctionReasonGroup.style.display = (typeVal === 'Correct Inventory Count') ? 'block' : 'none';

        updateExplanations();
        validateForm(false);
    };

    const openActionModal = (id, actionType) => {
        const item = inventoryData.find(m => m.id === id);
        if (!item) return;

        activeMaterialId = id;
        clearFormErrors();
        updateProgressSteps(1); // Step 1: Select Material (material chosen from the table)

        if (updateMaterialName) updateMaterialName.value = `${item.name} (${item.id})`;
        if (updateCurrentQty) updateCurrentQty.value = `${item.qty.toLocaleString()} ${item.unit}`;
        if (updateCurrentWarehouse) updateCurrentWarehouse.value = item.warehouse;

        let defaultType = 'Correct Inventory Count';
        if (actionType === 'received') defaultType = 'Add Received Stock';
        else if (actionType === 'damaged') defaultType = 'Record Damaged Stock';
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

            updateProgressSteps(2); // Step 2: Choose Type / Enter Qty
        } else if (section === 'review') {
            if (updateFormSection) updateFormSection.style.display = 'none';
            if (updateReviewSection) updateReviewSection.style.display = 'block';
            if (updateConfirmSection) updateConfirmSection.style.display = 'none';

            if (updateFormFooter) updateFormFooter.style.display = 'none';
            if (updateReviewFooter) updateReviewFooter.style.display = 'flex';
            if (updateConfirmFooter) updateConfirmFooter.style.display = 'none';

            populateReviewSummary();
            updateProgressSteps(4); // Step 4: Review Changes
        } else if (section === 'confirm') {
            if (updateFormSection) updateFormSection.style.display = 'none';
            if (updateReviewSection) updateReviewSection.style.display = 'none';
            if (updateConfirmSection) updateConfirmSection.style.display = 'block';

            if (updateFormFooter) updateFormFooter.style.display = 'none';
            if (updateReviewFooter) updateReviewFooter.style.display = 'none';
            if (updateConfirmFooter) updateConfirmFooter.style.display = 'flex';

            populateConfirmSummary();
            updateProgressSteps(5); // Step 5: Save & Confirm
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
        } else if (typeVal === 'Reduce Stock' || typeVal === 'Record Damaged Stock' || typeVal === 'Transfer Material') {
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
            reviewReasonRow.style.display = (typeVal === 'Correct Inventory Count') ? 'block' : 'none';
            document.getElementById('reviewReason').textContent = correctionReason.value.trim() || '-';
        }

        if (reviewRemarksRow) {
            reviewRemarksRow.style.display = updateRemarks.value.trim() ? 'block' : 'none';
            document.getElementById('reviewRemarks').textContent = updateRemarks.value.trim() || '-';
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
        } else if (typeVal === 'Reduce Stock' || typeVal === 'Record Damaged Stock' || typeVal === 'Transfer Material') {
            newQty = prevQty - changeVal;
        } else if (typeVal === 'Correct Inventory Count') {
            newQty = changeVal;
        }

        newQty = Math.max(0, newQty);

        const confirmMsg = `You are changing ${item.name} from ${prevQty.toLocaleString()} ${item.unit} to ${newQty.toLocaleString()} ${item.unit}. This update will be recorded in Inventory Activity. Continue?`;
        
        const confirmTextEl = document.getElementById('confirmDynamicMessage');
        if (confirmTextEl) confirmTextEl.textContent = confirmMsg;
    };

    const executeSave = () => {
        const item = inventoryData.find(m => m.id === activeMaterialId);
        if (!item) return;

        const typeVal = updateType.value;
        const changeVal = parseFloat(qtyChange.value) || 0;

        let prevQty = item.qty;
        let newQty = prevQty;

        if (typeVal === 'Add Received Stock') {
            newQty = prevQty + changeVal;
        } else if (typeVal === 'Reduce Stock' || typeVal === 'Record Damaged Stock' || typeVal === 'Transfer Material') {
            newQty = prevQty - changeVal;
        } else if (typeVal === 'Correct Inventory Count') {
            newQty = changeVal;
        }

        newQty = Math.max(0, newQty);
        const today = new Date().toISOString().split('T')[0];

        item.qty = newQty;
        item.lastUpdated = today;

        if (newQty === 0) item.status = 'Out of Stock';
        else if (newQty < item.min) item.status = 'Low Stock';
        else if (newQty > item.min * 3) item.status = 'Overstocked';
        else item.status = 'In Stock';

        inventoryActivityLog.push({
            id: 'ACT-' + Math.floor(100000 + Math.random() * 900000),
            materialId: item.id,
            materialName: item.name,
            updateType: typeVal,
            previousQty: prevQty,
            newQty: newQty,
            changeQty: newQty - prevQty,
            warehouse: typeVal === 'Transfer Material' ? destinationWarehouse.value : item.warehouse,
            refNumber: refNumber.value.trim(),
            reason: correctionReason.value.trim(),
            remarks: updateRemarks.value.trim(),
            date: today
        });

        if (updateModal) updateModal.classList.remove('active');

        renderInventoryTable();
        updateProgressSteps(1); // Reset back to Step 1

        let successMessage = 'Inventory quantity updated successfully.';
        if (typeVal === 'Add Received Stock') successMessage = 'Received materials were added to inventory.';
        else if (typeVal === 'Record Damaged Stock') successMessage = 'Damaged materials were recorded.';
        else if (typeVal === 'Transfer Material') successMessage = 'Material transfer completed.';

        if (typeof window.showToast === 'function') {
            window.showToast('Inventory Updated', successMessage, 'success');
        }
    };

    const openViewModal = (id) => {
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

    if (tableBody) {
        tableBody.addEventListener('click', (e) => {
            const btn = e.target.closest('[data-action]');
            if (!btn) return;

            const action = btn.getAttribute('data-action');
            const id = btn.getAttribute('data-id');

            if (action === 'view') {
                openViewModal(id);
            } else {
                openActionModal(id, action);
            }
        });
    }

    if (updateType) updateType.addEventListener('change', updateVisibleFields);
    if (qtyChange) qtyChange.addEventListener('input', () => validateForm(false));
    if (destinationWarehouse) destinationWarehouse.addEventListener('change', () => validateForm(false));
    if (refNumber) refNumber.addEventListener('input', () => validateForm(false));
    if (correctionReason) correctionReason.addEventListener('input', () => validateForm(false));

    if (btnReviewUpdate) {
        btnReviewUpdate.addEventListener('click', () => {
            if (validateForm(true)) showSection('review');
        });
    }

    if (btnSaveDirect) {
        btnSaveDirect.addEventListener('click', () => {
            if (validateForm(true)) executeSave();
        });
    }

    if (btnGoBack) btnGoBack.addEventListener('click', () => showSection('form'));
    if (btnProceedConfirm) btnProceedConfirm.addEventListener('click', () => showSection('confirm'));
    if (btnGoBackConfirm) btnGoBackConfirm.addEventListener('click', () => showSection('review'));
    if (btnFinalConfirm) btnFinalConfirm.addEventListener('click', executeSave);

    if (searchInput) searchInput.addEventListener('input', renderInventoryTable);
    if (categoryFilter) categoryFilter.addEventListener('change', renderInventoryTable);
    if (warehouseFilter) warehouseFilter.addEventListener('change', renderInventoryTable);
    if (statusFilter) statusFilter.addEventListener('change', renderInventoryTable);

    if (btnExport) {
        btnExport.addEventListener('click', () => {
            if (typeof window.showToast === 'function') {
                window.showToast('Export Started', 'Generating inventory report export...', 'primary');
            }
        });
    }

    // Initial Render
    updateGuidedAccessUI();
    renderInventoryTable();
    updateProgressSteps(1);
});