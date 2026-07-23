/**
 * Tenebrowse - Warehouse Staff
 * Deliveries Page Logic
 */

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // Reference "Today" (matches date format used in seed data)
    // ==========================================
    const TODAY_LABEL = 'Jul 23, 2026';

    // ==========================================
    // Seed Delivery Data
    // ==========================================
    let deliveryData = [
        { id: 'DEL-3298', po: 'PO-2026-770', supplier: 'Global Logistics Foundry', expectedDate: 'Jul 23, 2026', actualDate: '-', materialCount: 4, status: 'Expected', material: 'Assorted Hardware Set', unit: 'Pieces', orderedQty: 1000, warehouse: 'Warehouse 1', receivedQty: null, damagedQty: null, missingQty: null, acceptedQty: null, remarks: '' },
        { id: 'DEL-3301', po: 'PO-2026-782', supplier: 'Timberland Suppliers', expectedDate: 'Jul 24, 2026', actualDate: '-', materialCount: 2, status: 'Expected', material: 'Marine Plywood 3/4"', unit: 'Sheets', orderedQty: 300, warehouse: 'Warehouse 2', receivedQty: null, damagedQty: null, missingQty: null, acceptedQty: null, remarks: '' },
        { id: 'DEL-3255', po: 'PO-2026-790', supplier: 'Global Logistics Foundry', expectedDate: 'Jul 25, 2026', actualDate: '-', materialCount: 5, status: 'Expected', material: 'Mixed Electrical Supplies', unit: 'Pieces', orderedQty: 1200, warehouse: 'Warehouse 1', receivedQty: null, damagedQty: null, missingQty: null, acceptedQty: null, remarks: '' },
        { id: 'DEL-3290', po: 'PO-2026-768', supplier: 'Metro Steelwork', expectedDate: 'Jul 20, 2026', actualDate: 'Jul 20, 2026', materialCount: 1, status: 'Arrived', material: 'Steel Rebar 12mm', unit: 'Pieces', orderedQty: 500, warehouse: 'Warehouse 2', receivedQty: null, damagedQty: null, missingQty: null, acceptedQty: null, remarks: '' },
        { id: 'DEL-3285', po: 'PO-2026-750', supplier: 'Prime Cement Corp', expectedDate: 'Jul 18, 2026', actualDate: 'Jul 19, 2026', materialCount: 1, status: 'Partially Received', material: 'Portland Cement Type I', unit: 'Bags', orderedQty: 400, warehouse: 'Warehouse 2', receivedQty: 350, damagedQty: 0, missingQty: 50, acceptedQty: 350, remarks: 'Supplier short-shipped; remaining 50 bags to follow.' },
        { id: 'DEL-3270', po: 'PO-2026-745', supplier: 'Electra Wire Solutions', expectedDate: 'Jul 10, 2026', actualDate: 'Jul 10, 2026', materialCount: 2, status: 'Verified', material: 'THHN Copper Wire 3.5mm', unit: 'Rolls', orderedQty: 200, warehouse: 'Warehouse 1', receivedQty: 200, damagedQty: 0, missingQty: 0, acceptedQty: 200, remarks: 'All items verified in good condition.' },
        { id: 'DEL-3260', po: 'PO-2026-735', supplier: 'Timberland Suppliers', expectedDate: 'Jul 05, 2026', actualDate: 'Jul 05, 2026', materialCount: 1, status: 'Verified', material: 'Roofing Sheet Corrugated', unit: 'Sheets', orderedQty: 250, warehouse: 'Warehouse 2', receivedQty: 250, damagedQty: 0, missingQty: 0, acceptedQty: 250, remarks: 'Delivery matched purchase order exactly.' },
        { id: 'DEL-3265', po: 'PO-2026-740', supplier: 'Apex Safety Gear Co.', expectedDate: 'Jul 08, 2026', actualDate: 'Jul 09, 2026', materialCount: 1, status: 'Discrepancy Reported', material: 'Safety Helmets', unit: 'Pieces', orderedQty: 100, warehouse: 'Warehouse 1', receivedQty: 85, damagedQty: 10, missingQty: 5, acceptedQty: 75, remarks: 'Shortage and crushed packaging noted upon inspection. PO flagged for supplier follow-up.' }
    ];

    let activityLog = [
        { icon: 'fa-check-circle', type: 'success', title: 'Delivery Verified', desc: 'Roofing Sheet Corrugated (DEL-3260) confirmed with no discrepancies.', time: 'Jul 05, 2026' },
        { icon: 'fa-exclamation-triangle', type: 'danger', title: 'Discrepancy Reported', desc: 'Safety Helmets (DEL-3265) flagged for shortage and damage.', time: 'Jul 09, 2026' }
    ];

    // ==========================================
    // State
    // ==========================================
    let currentPage = 1;
    const pageSize = 5;

    // ==========================================
    // Element References
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

    const activityFeed = document.getElementById('activityFeed');

    const verifyReceivedGroup = document.getElementById('verifyReceivedGroup');
    const verifyDamagedGroup = document.getElementById('verifyDamagedGroup');
    const verifyMissingGroup = document.getElementById('verifyMissingGroup');
    const verifyAcceptedGroup = document.getElementById('verifyAcceptedGroup');
    const verifyWarehouseGroup = document.getElementById('verifyWarehouseGroup');
    const verifyRemarksGroup = document.getElementById('verifyRemarksGroup');

    const verifyReceivedError = document.getElementById('verifyReceivedError');
    const verifyDamagedError = document.getElementById('verifyDamagedError');
    const verifyMissingError = document.getElementById('verifyMissingError');
    const verifyAcceptedError = document.getElementById('verifyAcceptedError');
    const verifyWarehouseError = document.getElementById('verifyWarehouseError');
    const verifyRemarksError = document.getElementById('verifyRemarksError');

    const guidedAccessBanner = document.getElementById('guidedAccessBanner');
    const guidedStepsProgress = document.getElementById('guidedStepsProgress');
    const confirmReviewCheckbox = document.getElementById('confirmReviewCheckbox');
    const btnVerifyBack = document.getElementById('btnVerifyBack');
    const btnVerifyCancel = document.getElementById('btnVerifyCancel');
    // ==========================================
    // Helpers
    // ==========================================
    const badgeClassFor = (status) => {
        switch (status) {
            case 'Expected': return 'badge-info';
            case 'Arrived': return 'badge-warning';
            case 'Partially Received': return 'badge-warning';
            case 'Verified': return 'badge-success';
            case 'Discrepancy Reported': return 'badge-danger';
            default: return 'badge-info';
        }
    };

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
    // Guided Access — State & Progress
    // ==========================================
    const isGuidedAccessMode = () => {
        return localStorage.getItem('tenebrowseWarehouseGuidedAccess') === 'true' ||
            document.body.classList.contains('guided-access-enabled');
    };

    const updateGuidedAccessUI = () => {
        const guided = isGuidedAccessMode();
        if (guidedAccessBanner) guidedAccessBanner.style.display = guided ? 'block' : 'none';
        if (guidedStepsProgress) guidedStepsProgress.style.display = guided ? 'block' : 'none';
    };

    const updateProgressSteps = (stepNum) => {
        if (!isGuidedAccessMode()) return;

        const steps = [
            document.getElementById('step1Badge'),
            document.getElementById('step2Badge'),
            document.getElementById('step3Badge'),
            document.getElementById('step4Badge'),
            document.getElementById('step5Badge'),
            document.getElementById('step6Badge')
        ];

        steps.forEach((badge, index) => {
            if (!badge) return;
            const num = index + 1;
            badge.className = 'badge';
            if (num < stepNum) badge.classList.add('badge-success');
            else if (num === stepNum) badge.classList.add('badge-warning');
            else badge.classList.add('badge-info');
        });
    };

    const resetProgressSteps = () => updateProgressSteps(1);

    // ==========================================
    // Filters (populated from data)
    // ==========================================
    const populateSupplierFilter = () => {
        const suppliers = [...new Set(deliveryData.map(d => d.supplier))].sort();
        supplierFilter.innerHTML = '<option value="All">All Suppliers</option>' +
            suppliers.map(s => `<option value="${s}">${s}</option>`).join('');
    };

    // ==========================================
    // Summary
    // ==========================================
    const renderSummary = () => {
        summaryExpectedToday.textContent = deliveryData.filter(d => d.status === 'Expected' && d.expectedDate === TODAY_LABEL).length;
        summaryAwaitingVerification.textContent = deliveryData.filter(d => d.status === 'Arrived').length;
        summaryPartiallyReceived.textContent = deliveryData.filter(d => d.status === 'Partially Received').length;
        summaryVerified.textContent = deliveryData.filter(d => d.status === 'Verified').length;
        summaryDiscrepancies.textContent = deliveryData.filter(d => d.status === 'Discrepancy Reported').length;
    };

    // ==========================================
    // Table Rendering
    // ==========================================
    const getFilteredData = () => {
        const searchTerm = searchInput.value.toLowerCase();
        const filterStatus = statusFilter.value;
        const filterSupplier = supplierFilter.value;
        const filterDate = dateFilter.value;

        return deliveryData.filter(d => {
            const matchesSearch = d.id.toLowerCase().includes(searchTerm) || d.po.toLowerCase().includes(searchTerm);
            const matchesStatus = filterStatus === 'All' || d.status === filterStatus;
            const matchesSupplier = filterSupplier === 'All' || d.supplier === filterSupplier;
            const matchesDate = !filterDate || d.expectedDate === formatDateForCompare(filterDate);
            return matchesSearch && matchesStatus && matchesSupplier && matchesDate;
        });
    };

    // Convert an <input type="date"> value (YYYY-MM-DD) to the "Mon DD, YYYY" label format used in the seed data
    const formatDateForCompare = (isoDate) => {
        const [y, m, d] = isoDate.split('-');
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return `${months[parseInt(m, 10) - 1]} ${d}, ${y}`;
    };

    const renderTable = () => {
        const filteredData = getFilteredData();
        const totalPages = Math.max(1, Math.ceil(filteredData.length / pageSize));
        if (currentPage > totalPages) currentPage = totalPages;

        const start = (currentPage - 1) * pageSize;
        const pageData = filteredData.slice(start, start + pageSize);

        tableBody.innerHTML = '';

        if (pageData.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="8" class="empty-state-row">No deliveries match your criteria.</td></tr>`;
        } else {
            pageData.forEach(d => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td><strong>${d.id}</strong></td>
                    <td>${d.po}</td>
                    <td>${d.supplier}</td>
                    <td>${d.expectedDate}</td>
                    <td class="text-muted-sm">${d.actualDate}</td>
                    <td class="font-semibold">${d.materialCount}</td>
                    <td><span class="badge ${badgeClassFor(d.status)}">${d.status}</span></td>
                    <td class="text-right">
                        <button class="action-btn" onclick="viewDelivery('${d.id}')" title="View Delivery"><i class="fas fa-eye"></i></button>
                        <button class="action-btn edit" onclick="openVerify('${d.id}')" title="Verify Delivery"><i class="fas fa-clipboard-check"></i></button>
                        <button class="action-btn delete" onclick="openDiscrepancy('${d.id}')" title="Report Discrepancy"><i class="fas fa-exclamation-triangle"></i></button>
                        <button class="action-btn" onclick="exportDelivery('${d.id}')" title="Export Delivery Record"><i class="fas fa-file-export"></i></button>
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
    // View Delivery
    // ==========================================
    window.viewDelivery = (id) => {
        const d = deliveryData.find(x => x.id === id);
        if (!d) return;
        document.getElementById('viewBody').innerHTML = `
            <div class="sub-form-grid">
                <div><span class="text-muted-sm">Delivery Reference</span><div class="font-semibold">${d.id}</div></div>
                <div><span class="text-muted-sm">Purchase Order</span><div class="font-semibold">${d.po}</div></div>
                <div><span class="text-muted-sm">Supplier</span><div class="font-semibold">${d.supplier}</div></div>
                <div><span class="text-muted-sm">Status</span><div><span class="badge ${badgeClassFor(d.status)}">${d.status}</span></div></div>
                <div><span class="text-muted-sm">Expected Date</span><div class="font-semibold">${d.expectedDate}</div></div>
                <div><span class="text-muted-sm">Actual Date</span><div class="font-semibold">${d.actualDate}</div></div>
                <div><span class="text-muted-sm">Material</span><div class="font-semibold">${d.material}</div></div>
                <div><span class="text-muted-sm">Ordered Quantity</span><div class="font-semibold">${d.orderedQty.toLocaleString()} ${d.unit}</div></div>
                <div><span class="text-muted-sm">Received Quantity</span><div class="font-semibold">${d.receivedQty !== null ? d.receivedQty.toLocaleString() + ' ' + d.unit : 'Not yet recorded'}</div></div>
                <div><span class="text-muted-sm">Accepted Quantity</span><div class="font-semibold">${d.acceptedQty !== null ? d.acceptedQty.toLocaleString() + ' ' + d.unit : 'Not yet recorded'}</div></div>
                <div><span class="text-muted-sm">Assigned Warehouse</span><div class="font-semibold">${d.warehouse}</div></div>
                <div><span class="text-muted-sm">Remarks</span><div class="font-semibold">${d.remarks || '-'}</div></div>
            </div>
        `;
        document.getElementById('viewModal').classList.add('active');
    };

    // ==========================================
    // Export Single Delivery Record
    // ==========================================
    window.exportDelivery = (id) => {
        const d = deliveryData.find(x => x.id === id);
        if (!d) return;
        if (window.showToast) window.showToast('Export Started', `Generating delivery record for ${d.id} (${d.po})...`, 'primary');
    };

    // ==========================================
    // Verify Delivery
    // ==========================================
    let verifyTargetId = null;

    // ==========================================
    // Derived Quantity Calculations (Missing & Accepted)
    // ==========================================
    const recalcDerivedQuantities = () => {
        const d = deliveryData.find(x => x.id === verifyTargetId);
        if (!d) return;

        const received = parseInt(document.getElementById('verifyReceivedQty').value, 10);
        const damaged = parseInt(document.getElementById('verifyDamagedQty').value, 10);

        const safeReceived = isNaN(received) || received < 0 ? 0 : received;
        const safeDamaged = isNaN(damaged) || damaged < 0 ? 0 : damaged;

        document.getElementById('verifyMissingQty').value = Math.max(0, d.orderedQty - safeReceived);
        document.getElementById('verifyAcceptedQty').value = Math.max(0, safeReceived - safeDamaged);
    };

    // ==========================================
    // Verification Confirmation Message Builder
    // ==========================================
    const buildVerificationConfirmMessage = (d) => {
        return `You are verifying delivery ${d.id} from ${d.supplier}. Accepted materials will be added to inventory and all discrepancies will be recorded. Continue?`;
    };

    window.openVerify = (id) => {
        const d = deliveryData.find(x => x.id === id);
        if (!d) return;
        verifyTargetId = id;

        document.getElementById('verifyPoNumber').value = d.po;
        document.getElementById('verifySupplier').value = d.supplier;
        document.getElementById('verifyRefNumber').value = d.id;
        document.getElementById('verifyMaterialName').value = d.material;
        document.getElementById('verifyOrderedQty').value = `${d.orderedQty.toLocaleString()} ${d.unit}`;
        document.getElementById('verifyReceivedQty').value = d.receivedQty !== null ? d.receivedQty : d.orderedQty;
        document.getElementById('verifyDamagedQty').value = d.damagedQty !== null ? d.damagedQty : 0;
        document.getElementById('verifyWarehouse').value = d.warehouse;
        document.getElementById('verifyRemarks').value = d.remarks || '';

        clearVerifyErrors();
        recalcDerivedQuantities();

        updateGuidedAccessUI();
        updateProgressSteps(2); // Step 1 (Select Delivery) complete, now on Step 2 (Compare Ordered Items)

        document.getElementById('verifyModal').classList.add('active');
    };

    document.getElementById('verifyReceivedQty').addEventListener('input', () => {
        recalcDerivedQuantities();
        validateVerifyForm(false);
        updateProgressSteps(3);
    });

    document.getElementById('verifyDamagedQty').addEventListener('input', () => {
        recalcDerivedQuantities();
        validateVerifyForm(false);
        updateProgressSteps(4);
    });
    
    document.getElementById('verifyWarehouse').addEventListener('change', () => validateVerifyForm(false));
    document.getElementById('verifyRemarks').addEventListener('input', () => validateVerifyForm(false));

    document.getElementById('verifyForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const d = deliveryData.find(x => x.id === verifyTargetId);
        if (!d) return;

        if (!validateVerifyForm(true)) return;

        const received = parseInt(document.getElementById('verifyReceivedQty').value, 10);
        const damaged = parseInt(document.getElementById('verifyDamagedQty').value, 10);
        const missing = parseInt(document.getElementById('verifyMissingQty').value, 10);
        const accepted = parseInt(document.getElementById('verifyAcceptedQty').value, 10);
        const warehouse = document.getElementById('verifyWarehouse').value;
        const remarks = document.getElementById('verifyRemarks').value.trim();

        let newStatus;
        if (damaged > 0 || missing > 0) newStatus = 'Discrepancy Reported';
        else if (received < d.orderedQty) newStatus = 'Partially Received';
        else newStatus = 'Verified';

        window.pendingVerification = { received, damaged, missing, accepted, warehouse, remarks, newStatus };

        document.getElementById('confirmVerifySummary').innerHTML = `
            <div class="sub-form-grid">
                <div><span class="text-muted-sm">Supplier</span><div class="font-semibold">${d.supplier}</div></div>
                <div><span class="text-muted-sm">Purchase Order Number</span><div class="font-semibold">${d.po}</div></div>
                <div><span class="text-muted-sm">Delivery Reference</span><div class="font-semibold">${d.id}</div></div>
                <div><span class="text-muted-sm">Material</span><div class="font-semibold">${d.material}</div></div>
                <div><span class="text-muted-sm">Ordered Quantity</span><div class="font-semibold">${d.orderedQty.toLocaleString()} ${d.unit}</div></div>
                <div><span class="text-muted-sm">Received Quantity</span><div class="font-semibold">${received.toLocaleString()} ${d.unit}</div></div>
                <div><span class="text-muted-sm">Accepted Quantity</span><div class="font-semibold">${accepted.toLocaleString()} ${d.unit}</div></div>
                <div><span class="text-muted-sm">Damaged Quantity</span><div class="font-semibold">${damaged.toLocaleString()} ${d.unit}</div></div>
                <div><span class="text-muted-sm">Missing Quantity</span><div class="font-semibold">${missing.toLocaleString()} ${d.unit}</div></div>
                <div><span class="text-muted-sm">Assigned Warehouse</span><div class="font-semibold">${warehouse}</div></div>
                <div class="full-width"><span class="text-muted-sm">Remarks</span><div class="font-semibold">${remarks || '-'}</div></div>
                <div class="full-width"><span class="text-muted-sm">New Status</span><div><span class="badge ${badgeClassFor(newStatus)}">${newStatus}</span></div></div>
            </div>
            ${damaged > 0 || missing > 0 ? '<div class="feed-item danger mt-3"><div class="feed-icon"><i class="fas fa-exclamation-triangle"></i></div><div class="feed-body"><div class="feed-title">Discrepancy Detected</div><div class="feed-meta">This delivery has damaged or missing items. The Purchasing Officer and General Manager will be notified.</div></div></div>' : ''}
        `;

        if (confirmReviewCheckbox) confirmReviewCheckbox.checked = false;
        const confirmBtn = document.getElementById('confirmVerifyBtn');
        if (confirmBtn) confirmBtn.disabled = true;

        document.getElementById('verifyModal').classList.remove('active');
        document.getElementById('verifyConfirmModal').classList.add('active');

        updateProgressSteps(5); // Step 5: Review Verification
    });

    // ==========================================
    // Review Screen Controls (Back / Cancel / Checkbox Gate)
    // ==========================================
    if (confirmReviewCheckbox) {
        confirmReviewCheckbox.addEventListener('change', () => {
            const confirmBtn = document.getElementById('confirmVerifyBtn');
            if (confirmBtn) confirmBtn.disabled = !confirmReviewCheckbox.checked;
        });
    }

    if (btnVerifyBack) {
        btnVerifyBack.addEventListener('click', () => {
            // Return to the form without re-populating fields, so entered values are preserved
            document.getElementById('verifyConfirmModal').classList.remove('active');
            document.getElementById('verifyModal').classList.add('active');
            updateProgressSteps(4);
        });
    }

    if (btnVerifyCancel) {
        btnVerifyCancel.addEventListener('click', () => {
            document.getElementById('verifyConfirmModal').classList.remove('active');
            window.pendingVerification = null;
            verifyTargetId = null;
            resetProgressSteps();
        });
    }

    document.getElementById('confirmVerifyBtn').addEventListener('click', () => {
        if (confirmReviewCheckbox && !confirmReviewCheckbox.checked) return;

        const d = deliveryData.find(x => x.id === verifyTargetId);
        const pending = window.pendingVerification;
        if (!d || !pending) return;

        // Final confirmation prompt referencing the actual delivery reference and supplier
        if (!window.confirm(buildVerificationConfirmMessage(d))) return;

        updateProgressSteps(6); // Step 6: Confirm Delivery

        d.receivedQty = pending.received;
        d.damagedQty = pending.damaged;
        d.missingQty = pending.missing;
        d.acceptedQty = pending.accepted;
        d.warehouse = pending.warehouse;
        d.remarks = pending.remarks;
        d.status = pending.newStatus;
        if (d.actualDate === '-') d.actualDate = TODAY_LABEL;

        // Close verification modals
        document.getElementById('verifyConfirmModal').classList.remove('active');
        document.getElementById('verifyModal').classList.remove('active');

        // Simulate downstream effects
        logActivity('fa-boxes', 'info', 'Inventory Updated', `${pending.accepted.toLocaleString()} ${d.unit} of ${d.material} added to inventory at ${pending.warehouse}.`);

        if (pending.damaged > 0) {
            logActivity('fa-dolly', 'danger', 'Damaged Materials Relocated', `${pending.damaged.toLocaleString()} ${d.unit} of ${d.material} moved to Warehouse 3 (Damaged & Quarantined).`);
        }

        logActivity('fa-clipboard-list', 'info', 'Inventory Activity Recorded', `Inventory Activity record created for ${d.id} (${d.po}).`);
        logActivity('fa-clipboard-check', pending.newStatus === 'Discrepancy Reported' ? 'danger' : 'success', `Delivery ${pending.newStatus}`, `${d.id} (${d.po}) marked as ${pending.newStatus}.`);
        logActivity('fa-bell', 'info', 'Purchasing Officer Notified', `Verification results for ${d.id} sent to the Purchasing Officer.`);
        logActivity('fa-bell', 'info', 'General Manager Notified', `Verification results for ${d.id} sent to the General Manager.`);

        // Existing shared toast helper (window.showToast from app.js)
        window.showToast('Delivery Verified', 'Delivery verification completed successfully.', 'success');
        window.pendingVerification = null;

        // Reset the delivery verification form for next use
        const verifyFormEl = document.getElementById('verifyForm');
        if (verifyFormEl) verifyFormEl.reset();
        clearVerifyErrors();

        renderSummary();
        renderTable();
        resetProgressSteps(); // Reset Guided Access progress back to Step 1
    });

    // ==========================================
    // Report Discrepancy (direct, quick flag)
    // ==========================================
    let discrepancyTargetId = null;

    window.openDiscrepancy = (id) => {
        const d = deliveryData.find(x => x.id === id);
        if (!d) return;
        discrepancyTargetId = id;
        document.getElementById('discrepancyRefNumber').value = d.id;
        document.getElementById('discrepancyPoNumber').value = d.po;
        document.getElementById('discrepancyType').value = '';
        document.getElementById('discrepancyDesc').value = '';
        document.getElementById('discrepancyModal').classList.add('active');
    };

    document.getElementById('discrepancyForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const d = deliveryData.find(x => x.id === discrepancyTargetId);
        if (!d) return;

        const issueType = document.getElementById('discrepancyType').value;
        const desc = document.getElementById('discrepancyDesc').value.trim();

        if (!issueType || !desc) {
            window.showToast('Missing Information', 'Please select an issue type and provide a description.', 'danger');
            return;
        }

        d.status = 'Discrepancy Reported';
        d.remarks = desc;
        if (d.actualDate === '-') d.actualDate = TODAY_LABEL;

        document.getElementById('discrepancyModal').classList.remove('active');
        logActivity('fa-exclamation-triangle', 'danger', 'Discrepancy Reported', `${d.id} (${d.po}) flagged: ${issueType}.`);
        logActivity('fa-bell', 'info', 'Purchasing Officer Notified', `Discrepancy report for ${d.id} sent to the Purchasing Officer.`);
        logActivity('fa-bell', 'info', 'General Manager Notified', `Discrepancy report for ${d.id} sent to the General Manager.`);
        window.showToast('Discrepancy Reported', `${d.id} has been flagged and relevant parties notified.`, 'danger');

        renderSummary();
        renderTable();
    });

    // ==========================================
    // Toolbar & Pagination Events
    // ==========================================
    searchInput.addEventListener('input', () => { currentPage = 1; renderTable(); });
    statusFilter.addEventListener('change', () => { currentPage = 1; renderTable(); });
    supplierFilter.addEventListener('change', () => { currentPage = 1; renderTable(); });
    dateFilter.addEventListener('change', () => { currentPage = 1; renderTable(); });

    btnExport.addEventListener('click', () => {
        if (window.showToast) window.showToast('Export Started', 'Generating Deliveries report in CSV format...', 'primary');
    });

    prevPageBtn.addEventListener('click', () => {
        if (currentPage > 1) { currentPage--; renderTable(); }
    });

    nextPageBtn.addEventListener('click', () => {
        const totalPages = Math.max(1, Math.ceil(getFilteredData().length / pageSize));
        if (currentPage < totalPages) { currentPage++; renderTable(); }
    });

    // ==========================================
    // Verify Form Validation
    // ==========================================
    const clearVerifyErrors = () => {
        const groups = [verifyReceivedGroup, verifyDamagedGroup, verifyMissingGroup, verifyAcceptedGroup, verifyWarehouseGroup, verifyRemarksGroup];
        const errors = [verifyReceivedError, verifyDamagedError, verifyMissingError, verifyAcceptedError, verifyWarehouseError, verifyRemarksError];

        groups.forEach(g => g && g.classList.remove('has-error'));
        errors.forEach(e => {
            if (e) {
                e.textContent = '';
                e.style.display = 'none';
            }
        });
    };

    const showVerifyFieldError = (group, errorEl, message) => {
        if (group) group.classList.add('has-error');
        if (errorEl) {
            errorEl.textContent = message;
            errorEl.style.display = 'block';
        }
    };

    const validateVerifyForm = (showErrors = false) => {
        const d = deliveryData.find(x => x.id === verifyTargetId);
        if (!d) return false;

        let isValid = true;
        clearVerifyErrors();

        const received = parseInt(document.getElementById('verifyReceivedQty').value, 10);
        const damaged = parseInt(document.getElementById('verifyDamagedQty').value, 10);
        const missing = parseInt(document.getElementById('verifyMissingQty').value, 10);
        const accepted = parseInt(document.getElementById('verifyAcceptedQty').value, 10);
        const warehouse = document.getElementById('verifyWarehouse').value;
        const remarks = document.getElementById('verifyRemarks').value.trim();

        if (isNaN(received) || received < 0) {
            isValid = false;
            if (showErrors) showVerifyFieldError(verifyReceivedGroup, verifyReceivedError, 'Enter a received quantity of zero or more.');
        }

        if (isNaN(damaged) || damaged < 0) {
            isValid = false;
            if (showErrors) showVerifyFieldError(verifyDamagedGroup, verifyDamagedError, 'Damaged quantity cannot be negative.');
        } else if (!isNaN(received) && damaged > received) {
            isValid = false;
            if (showErrors) showVerifyFieldError(verifyDamagedGroup, verifyDamagedError, 'Damaged quantity cannot exceed received quantity.');
        }

        if (!isNaN(missing) && missing > d.orderedQty) {
            isValid = false;
            if (showErrors) showVerifyFieldError(verifyMissingGroup, verifyMissingError, 'Missing quantity cannot exceed the ordered quantity.');
        }

        if (!isNaN(accepted) && !isNaN(received) && accepted > received) {
            isValid = false;
            if (showErrors) showVerifyFieldError(verifyAcceptedGroup, verifyAcceptedError, 'Accepted quantity cannot exceed received quantity.');
        }

        if (accepted > 0 && !warehouse) {
            isValid = false;
            if (showErrors) showVerifyFieldError(verifyWarehouseGroup, verifyWarehouseError, 'Assigned warehouse is required when accepted quantity is greater than zero.');
        }

        const remarksNeeded = damaged > 0 || missing > 0 || (!isNaN(received) && received !== d.orderedQty);
        if (remarksNeeded && !remarks) {
            isValid = false;
            if (showErrors) {
                let reason = 'Remarks are required when received quantity differs from ordered quantity.';
                if (damaged > 0) reason = 'Remarks are required when damaged quantity is greater than zero.';
                else if (missing > 0) reason = 'Remarks are required when missing quantity is greater than zero.';
                showVerifyFieldError(verifyRemarksGroup, verifyRemarksError, reason);
            }
        }

        return isValid;
    };

    // ==========================================
    // Initial Render
    // ==========================================
    populateSupplierFilter();
    renderActivityFeed();
    renderSummary();
    renderTable();
    updateGuidedAccessUI();
    resetProgressSteps();
});
