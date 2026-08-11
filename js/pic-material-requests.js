/**
 * Tenebrowse - Project-in-Charge Material Requests
 * Page-specific logic only. Shared navigation, modals, and toasts live in app.js.
 */

document.addEventListener('DOMContentLoaded', () => {
    const REQUEST_HISTORY_STORAGE_KEY = 'tenebrowsePicRequestHistoryV3';
    const CUSTOM_MATERIAL_CATALOG_KEY = 'tenebrowsePicCustomMaterialCatalogV1';

    const baseMaterialCatalog = [
        { name: 'Portland Cement Type 1', category: 'Masonry', unit: 'Bags (50kg)' },
        { name: 'Portland Cement High Early Strength', category: 'Masonry', unit: 'Bags (50kg)' },
        { name: 'Deformed Rebar 16mm x 6m', category: 'Metals', unit: 'Pieces' },
        { name: 'Deformed Rebar 20mm x 6m', category: 'Metals', unit: 'Pieces' },
        { name: 'PVC Pipe 4" Series 1000', category: 'Plumbing', unit: 'Lengths' },
        { name: 'PVC Pipe 4" Series 1500', category: 'Plumbing', unit: 'Lengths' },
        { name: 'Marine Plywood 3/4"', category: 'Woodwork', unit: 'Sheets' },
        { name: 'Phenolic Plywood 3/4"', category: 'Woodwork', unit: 'Sheets' },
        { name: 'THHN Copper Wire 3.5mm', category: 'Electrical', unit: 'Rolls' },
        { name: 'THHN Copper Wire 5.5mm', category: 'Electrical', unit: 'Rolls' }
    ];

    const loadCustomMaterialCatalog = () => {
        try {
            const stored = JSON.parse(localStorage.getItem(CUSTOM_MATERIAL_CATALOG_KEY));
            return Array.isArray(stored)
                ? stored.filter((item) => item && item.name && item.category && item.unit)
                : [];
        } catch (error) {
            return [];
        }
    };

    const materialCatalog = [...baseMaterialCatalog, ...loadCustomMaterialCatalog()];

    let materialList = [
        { id: 'MAT-8012', name: 'Portland Cement Type 1', category: 'Masonry', unit: 'Bags (50kg)', qty: 450, remarks: 'Site A Foundation Pour' },
        { id: 'MAT-8013', name: 'Deformed Rebar 16mm x 6m', category: 'Metals', unit: 'Pieces', qty: 1200, remarks: 'Structural Columns' },
        { id: 'MAT-8014', name: 'PVC Pipe 4" Series 1000', category: 'Plumbing', unit: 'Lengths', qty: 85, remarks: 'Underground Drainage' },
        { id: 'MAT-8015', name: 'Marine Plywood 3/4"', category: 'Woodwork', unit: 'Sheets', qty: 150, remarks: 'Concrete Formworks' }
    ];

    const defaultRequestHistory = [
        {
            id: 'REQ-2026-104',
            type: 'Material Request',
            dateSubmitted: 'Aug 09, 2026',
            status: 'Pending',
            reviewedBy: '—',
            lastUpdated: 'Aug 09, 2026',
            comment: 'Awaiting General Manager review.',
            items: [
                { id: 'MAT-7101', name: 'Portland Cement Type 1', category: 'Masonry', unit: 'Bags (50kg)', qty: 300, remarks: 'Foundation works' },
                { id: 'MAT-7102', name: 'Deformed Rebar 16mm x 6m', category: 'Metals', unit: 'Pieces', qty: 600, remarks: 'Column reinforcement' },
                { id: 'MAT-7103', name: 'PVC Pipe 4" Series 1000', category: 'Plumbing', unit: 'Lengths', qty: 50, remarks: 'Drainage line' }
            ]
        },
        {
            id: 'REQ-2026-103',
            type: 'Material Request',
            dateSubmitted: 'Aug 08, 2026',
            status: 'Pending',
            reviewedBy: '—',
            lastUpdated: 'Aug 08, 2026',
            comment: 'Awaiting General Manager review.',
            items: [
                { id: 'MAT-7098', name: 'Marine Plywood 3/4"', category: 'Woodwork', unit: 'Sheets', qty: 120, remarks: 'Formworks' },
                { id: 'MAT-7099', name: 'Portland Cement High Early Strength', category: 'Masonry', unit: 'Bags (50kg)', qty: 180, remarks: 'Accelerated slab works' },
                { id: 'MAT-7100', name: 'THHN Copper Wire 3.5mm', category: 'Electrical', unit: 'Rolls', qty: 18, remarks: 'Temporary power installation' }
            ]
        },
        {
            id: 'REQ-2026-102',
            type: 'Material Request',
            dateSubmitted: 'Aug 08, 2026',
            status: 'Pending',
            reviewedBy: '—',
            lastUpdated: 'Aug 08, 2026',
            comment: 'Awaiting General Manager review.',
            items: [
                { id: 'MAT-7094', name: 'THHN Copper Wire 3.5mm', category: 'Electrical', unit: 'Rolls', qty: 24, remarks: 'Electrical rough-in' },
                { id: 'MAT-7095', name: 'PVC Pipe 4" Series 1500', category: 'Plumbing', unit: 'Lengths', qty: 40, remarks: 'Pressure line installation' },
                { id: 'MAT-7096', name: 'Deformed Rebar 16mm x 6m', category: 'Metals', unit: 'Pieces', qty: 150, remarks: 'Secondary reinforcement' }
            ]
        },
        {
            id: 'REQ-2026-101',
            type: 'Material Request',
            dateSubmitted: 'Aug 07, 2026',
            status: 'Approved',
            reviewedBy: 'General Manager',
            lastUpdated: 'Aug 08, 2026',
            comment: 'Approved for procurement. Quantities are aligned with the current project schedule.',
            items: [
                { id: 'MAT-7088', name: 'Deformed Rebar 20mm x 6m', category: 'Metals', unit: 'Pieces', qty: 350, remarks: 'Beam reinforcement' },
                { id: 'MAT-7089', name: 'Portland Cement Type 1', category: 'Masonry', unit: 'Bags (50kg)', qty: 220, remarks: 'Concrete works' },
                { id: 'MAT-7090', name: 'Marine Plywood 3/4"', category: 'Woodwork', unit: 'Sheets', qty: 90, remarks: 'Formwork panels' }
            ]
        },
        {
            id: 'REQ-2026-100',
            type: 'Material Request',
            dateSubmitted: 'Aug 06, 2026',
            status: 'Approved',
            reviewedBy: 'General Manager',
            lastUpdated: 'Aug 07, 2026',
            comment: 'Approved for procurement and released for supplier sourcing.',
            items: [
                { id: 'MAT-7084', name: 'Deformed Rebar 16mm x 6m', category: 'Metals', unit: 'Pieces', qty: 480, remarks: 'Column reinforcement' },
                { id: 'MAT-7085', name: 'PVC Pipe 4" Series 1000', category: 'Plumbing', unit: 'Lengths', qty: 75, remarks: 'Drainage works' },
                { id: 'MAT-7086', name: 'THHN Copper Wire 5.5mm', category: 'Electrical', unit: 'Rolls', qty: 20, remarks: 'Main feeder installation' }
            ]
        },
        {
            id: 'REQ-2026-098',
            type: 'Material Request',
            dateSubmitted: 'Aug 05, 2026',
            status: 'Rejected',
            reviewedBy: 'General Manager',
            lastUpdated: 'Aug 06, 2026',
            comment: 'Rejected because an active request already covers the same material requirement. Please consolidate with REQ-2026-094.',
            items: [
                { id: 'MAT-7071', name: 'Portland Cement Type 1', category: 'Masonry', unit: 'Bags (50kg)', qty: 200, remarks: 'Additional cement' },
                { id: 'MAT-7072', name: 'Marine Plywood 3/4"', category: 'Woodwork', unit: 'Sheets', qty: 60, remarks: 'Additional formworks' },
                { id: 'MAT-7073', name: 'THHN Copper Wire 3.5mm', category: 'Electrical', unit: 'Rolls', qty: 10, remarks: 'Additional branch circuits' }
            ]
        },
        {
            id: 'REQ-2026-095',
            type: 'Material Request',
            dateSubmitted: 'Aug 03, 2026',
            status: 'Needs Revision',
            reviewedBy: 'General Manager',
            lastUpdated: 'Aug 04, 2026',
            comment: 'Please confirm the required quantities and add the specific work package in the remarks before resubmission.',
            items: [
                { id: 'MAT-7055', name: 'PVC Pipe 4" Series 1500', category: 'Plumbing', unit: 'Lengths', qty: 120, remarks: '' },
                { id: 'MAT-7056', name: 'Deformed Rebar 20mm x 6m', category: 'Metals', unit: 'Pieces', qty: 200, remarks: '' },
                { id: 'MAT-7057', name: 'Phenolic Plywood 3/4"', category: 'Woodwork', unit: 'Sheets', qty: 80, remarks: '' }
            ]
        },
        {
            id: 'SUB-2026-021',
            type: 'Substitution Request',
            dateSubmitted: 'Aug 08, 2026',
            status: 'Pending',
            reviewedBy: '—',
            lastUpdated: 'Aug 08, 2026',
            comment: 'Awaiting General Manager review.',
            sourceRequest: 'REQ-2026-100',
            reason: 'Supply Chain Delay',
            notes: 'Two approved materials are delayed by the supplier and require alternatives to keep the current work package on schedule.',
            substitutions: [
                {
                    sourceMaterialId: 'MAT-7084',
                    originalMaterial: 'Deformed Rebar 16mm x 6m',
                    replacementMaterial: 'Deformed Rebar 20mm x 6m',
                    qty: 120,
                    unit: 'Pieces'
                },
                {
                    sourceMaterialId: 'MAT-7085',
                    originalMaterial: 'PVC Pipe 4" Series 1000',
                    replacementMaterial: 'PVC Pipe 4" Series 1500',
                    qty: 30,
                    unit: 'Lengths'
                }
            ]
        }
    ];

    let requestHistory = loadRequestHistory();
    let nextIdCounter = 8016;
    let activeEditId = null;
    let pendingDeleteId = null;
    let activeRequestDetailsId = null;
    let activeSubstitutionContext = null;

    // Tabs
    const tabButtons = document.querySelectorAll('.tabs-nav .tab-btn[data-tab]');
    const tabPanels = document.querySelectorAll('.tab-content[data-tab-content]');

    // Material request controls
    const tableBody = document.getElementById('tableBody');
    const materialForm = document.getElementById('materialForm');
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');
    const btnExport = document.getElementById('btnExport');
    const btnSaveDraft = document.getElementById('btnSaveDraft');
    const btnOpenSubmitReq = document.getElementById('btnOpenSubmitReq');
    const confirmSubmitBtn = document.getElementById('confirmSubmitBtn');

    // Pending status card
    const pendingRequestStatusCard = document.getElementById('pendingRequestStatusCard');
    const pendingRequestCountDisplay = document.getElementById('pendingRequestCount');
    const pendingRequestStatusText = document.getElementById('pendingRequestStatusText');
    const submitPendingCurrent = document.getElementById('submitPendingCurrent');
    const submitPendingAfter = document.getElementById('submitPendingAfter');
    const btnViewPendingRequests = document.getElementById('btnViewPendingRequests');

    // Add form
    const inName = document.getElementById('matName');
    const materialCatalogOptions = document.getElementById('materialCatalogOptions');
    const inCategory = document.getElementById('matCategory');
    const inUnit = document.getElementById('matUnit');
    const inQty = document.getElementById('matQty');
    const inRemarks = document.getElementById('matRemarks');

    // Edit/Delete modals
    const editMaterialForm = document.getElementById('editMaterialForm');
    const editMaterialIdDisplay = document.getElementById('editMaterialIdDisplay');
    const editMatName = document.getElementById('editMatName');
    const editMatCategory = document.getElementById('editMatCategory');
    const editMatUnit = document.getElementById('editMatUnit');
    const editMatQty = document.getElementById('editMatQty');
    const editMatRemarks = document.getElementById('editMatRemarks');
    const deleteMaterialName = document.getElementById('deleteMaterialName');
    const confirmDeleteMaterialBtn = document.getElementById('confirmDeleteMaterialBtn');

    // Contextual substitution request modal controls
    const substitutionRequestForm = document.getElementById('substitutionRequestForm');
    const substitutionRequestModal = document.getElementById('substitutionRequestModal');
    const subSourceRequestId = document.getElementById('subSourceRequestId');
    const substitutionItemsBody = document.getElementById('substitutionItemsBody');
    const substitutionSelectionCount = document.getElementById('substitutionSelectionCount');
    const subReason = document.getElementById('subReason');
    const subNotes = document.getElementById('subNotes');
    const confirmSubBtn = document.getElementById('confirmSubBtn');

    // Tracking controls
    const requestTrackingTableBody = document.getElementById('requestTrackingTableBody');
    const trackingSearchInput = document.getElementById('trackingSearchInput');
    const trackingTypeFilter = document.getElementById('trackingTypeFilter');
    const trackingStatusFilter = document.getElementById('trackingStatusFilter');
    const btnExportTracking = document.getElementById('btnExportTracking');
    const trackingPendingCount = document.getElementById('trackingPendingCount');
    const trackingApprovedCount = document.getElementById('trackingApprovedCount');
    const trackingRevisionCount = document.getElementById('trackingRevisionCount');
    const trackingRejectedCount = document.getElementById('trackingRejectedCount');

    // Tracking details modal
    const requestDetailsId = document.getElementById('requestDetailsId');
    const requestDetailsStatus = document.getElementById('requestDetailsStatus');
    const requestDetailsType = document.getElementById('requestDetailsType');
    const requestDetailsDate = document.getElementById('requestDetailsDate');
    const requestDetailsReviewer = document.getElementById('requestDetailsReviewer');
    const requestDetailsUpdated = document.getElementById('requestDetailsUpdated');
    const requestDetailsContent = document.getElementById('requestDetailsContent');
    const requestDetailsHelper = document.getElementById('requestDetailsHelper');
    const requestDetailsComment = document.getElementById('requestDetailsComment');

    function loadRequestHistory() {
        try {
            const stored = JSON.parse(localStorage.getItem(REQUEST_HISTORY_STORAGE_KEY));
            if (Array.isArray(stored) && stored.length) return stored;
        } catch (error) {
            // Local storage may be restricted when opening a prototype as file://.
        }
        return structuredCloneSafe(defaultRequestHistory);
    }

    function persistRequestHistory() {
        try {
            localStorage.setItem(REQUEST_HISTORY_STORAGE_KEY, JSON.stringify(requestHistory));
        } catch (error) {
            // Persistence is optional for this front-end prototype.
        }
    }

    function structuredCloneSafe(value) {
        return JSON.parse(JSON.stringify(value));
    }

    const escapeHtml = (value) => String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');

    const showToast = (title, message, type = 'primary') => {
        if (typeof window.showToast === 'function') window.showToast(title, message, type);
    };

    const openModal = (id) => {
        if (typeof window.openModal === 'function') window.openModal(id);
    };

    const closeModal = (id) => {
        if (typeof window.closeModal === 'function') window.closeModal(id);
    };

    const formatPrototypeDate = () => new Intl.DateTimeFormat('en-US', {
        month: 'short', day: '2-digit', year: 'numeric'
    }).format(new Date());

    const normalizeMaterialName = (value) => String(value || '').trim().toLowerCase();

    const getCatalogItem = (name) => {
        const normalized = normalizeMaterialName(name);
        return materialCatalog.find((item) => normalizeMaterialName(item.name) === normalized) || null;
    };

    const populateMaterialDatalist = () => {
        if (!materialCatalogOptions) return;
        materialCatalogOptions.innerHTML = materialCatalog
            .map((item) => `<option value="${escapeHtml(item.name)}"></option>`)
            .join('');
    };

    const persistCustomMaterialCatalog = () => {
        try {
            const baseNames = new Set(baseMaterialCatalog.map((item) => normalizeMaterialName(item.name)));
            const customItems = materialCatalog.filter((item) => !baseNames.has(normalizeMaterialName(item.name)));
            localStorage.setItem(CUSTOM_MATERIAL_CATALOG_KEY, JSON.stringify(customItems));
        } catch (error) {
            // Persistence is optional for this front-end prototype.
        }
    };

    const rememberCustomMaterial = (item) => {
        if (!item?.name || !item?.category || !item?.unit || getCatalogItem(item.name)) return;
        materialCatalog.push({
            name: item.name.trim(),
            category: item.category.trim(),
            unit: item.unit.trim()
        });
        persistCustomMaterialCatalog();
        populateMaterialDatalist();
    };

    const syncMaterialMetadataMode = (nameInput, categoryInput, unitInput, preserveCustomValues = false) => {
        const catalogItem = getCatalogItem(nameInput.value);

        if (catalogItem) {
            categoryInput.value = catalogItem.category;
            unitInput.value = catalogItem.unit;
            categoryInput.readOnly = true;
            unitInput.readOnly = true;
            categoryInput.dataset.catalogSource = catalogItem.name;
            unitInput.dataset.catalogSource = catalogItem.name;
            categoryInput.placeholder = 'Auto-filled from material list';
            unitInput.placeholder = 'Auto-filled from material list';
            return;
        }

        const previouslyCatalogBased = Boolean(categoryInput.dataset.catalogSource || unitInput.dataset.catalogSource);
        if (previouslyCatalogBased && !preserveCustomValues) {
            categoryInput.value = '';
            unitInput.value = '';
        }

        categoryInput.readOnly = false;
        unitInput.readOnly = false;
        categoryInput.dataset.catalogSource = '';
        unitInput.dataset.catalogSource = '';
        categoryInput.placeholder = 'Enter category for new material';
        unitInput.placeholder = 'Enter unit for new material';
    };

    const statusBadgeClass = (status) => {
        if (status === 'Approved') return 'badge-success';
        if (status === 'Rejected') return 'badge-danger';
        if (status === 'Needs Revision') return 'badge-info';
        return 'badge-warning';
    };

    const typeBadgeClass = (type) => type === 'Substitution Request' ? 'badge-warning' : 'badge-info';

    const activateTab = (tabName) => {
        tabButtons.forEach((button) => {
            const active = button.dataset.tab === tabName;
            button.classList.toggle('active', active);
            button.setAttribute('aria-selected', String(active));
        });
        tabPanels.forEach((panel) => panel.classList.toggle('active', panel.dataset.tabContent === tabName));
    };

    tabButtons.forEach((button) => {
        button.addEventListener('click', () => activateTab(button.dataset.tab));
    });

    const getPendingMaterialRequests = () => requestHistory.filter(
        (request) => request.type === 'Material Request' && request.status === 'Pending'
    );

    const updatePendingRequestState = () => {
        const pendingCount = getPendingMaterialRequests().length;
        pendingRequestCountDisplay.textContent = String(pendingCount);

        if (pendingCount === 0) {
            pendingRequestStatusText.textContent = 'You have no material requests waiting for General Manager approval.';
        } else {
            const noun = pendingCount === 1 ? 'request is' : 'requests are';
            pendingRequestStatusText.innerHTML =
                `<strong>${pendingCount}</strong> material ${noun} currently awaiting General Manager approval. ` +
                'You may still submit another legitimate request; review pending requests first to avoid duplicates.';
        }

        pendingRequestStatusCard.classList.toggle('has-pending', pendingCount > 0);
        pendingRequestStatusCard.classList.toggle('has-multiple-pending', pendingCount >= 3);
        submitPendingCurrent.textContent = String(pendingCount);
        submitPendingAfter.textContent = String(pendingCount + 1);
    };

    const renderTrackingSummary = () => {
        const countStatus = (status) => requestHistory.filter((request) => request.status === status).length;
        trackingPendingCount.textContent = String(countStatus('Pending'));
        trackingApprovedCount.textContent = String(countStatus('Approved'));
        trackingRevisionCount.textContent = String(countStatus('Needs Revision'));
        trackingRejectedCount.textContent = String(countStatus('Rejected'));
    };

    const getSubstitutionLines = (request) => {
        if (Array.isArray(request.substitutions)) return request.substitutions;

        // Backward-compatible normalization for older prototype records.
        if (request.originalMaterial || request.replacementMaterial) {
            return [{
                sourceMaterialId: request.sourceMaterialId || '',
                originalMaterial: request.originalMaterial || '—',
                replacementMaterial: request.replacementMaterial || '—',
                qty: Number(request.qty) || 0,
                unit: request.unit || ''
            }];
        }

        return [];
    };

    const requestSummary = (request) => {
        if (request.type === 'Material Request') {
            const names = (request.items || []).map((item) => item.name);
            if (names.length === 0) return 'No materials listed';
            if (names.length === 1) return names[0];
            return `${names[0]} + ${names.length - 1} more material${names.length - 1 === 1 ? '' : 's'}`;
        }

        const lines = getSubstitutionLines(request);
        if (lines.length === 0) return `Substitution for ${request.sourceRequest || 'material request'}`;
        if (lines.length === 1) return `${lines[0].originalMaterial} → ${lines[0].replacementMaterial}`;
        return `${lines.length} material substitutions for ${request.sourceRequest || 'one request'}`;
    };

    const renderRequestTracking = () => {
        const searchTerm = trackingSearchInput.value.trim().toLowerCase();
        const typeFilter = trackingTypeFilter.value;
        const statusFilter = trackingStatusFilter.value;

        const filtered = requestHistory.filter((request) => {
            const searchable = [request.id, request.type, requestSummary(request), request.status, request.reviewedBy]
                .join(' ').toLowerCase();
            return (!searchTerm || searchable.includes(searchTerm)) &&
                (typeFilter === 'All' || request.type === typeFilter) &&
                (statusFilter === 'All' || request.status === statusFilter);
        });

        requestTrackingTableBody.innerHTML = '';

        if (filtered.length === 0) {
            requestTrackingTableBody.innerHTML = '<tr><td colspan="8" class="empty-state-row">No submitted requests match the selected filters.</td></tr>';
            return;
        }

        filtered.forEach((request) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong>${escapeHtml(request.id)}</strong></td>
                <td><span class="badge ${typeBadgeClass(request.type)}">${escapeHtml(request.type)}</span></td>
                <td>${escapeHtml(request.dateSubmitted)}</td>
                <td>${escapeHtml(requestSummary(request))}</td>
                <td><span class="badge ${statusBadgeClass(request.status)}">${escapeHtml(request.status)}</span></td>
                <td>${escapeHtml(request.reviewedBy || '—')}</td>
                <td>${escapeHtml(request.lastUpdated)}</td>
                <td>
                    <button type="button" class="action-btn view" data-action="view-request" data-id="${escapeHtml(request.id)}"
                            title="View request details" aria-label="View ${escapeHtml(request.id)}">
                        <i class="fas fa-eye"></i>
                    </button>
                </td>`;
            requestTrackingTableBody.appendChild(tr);
        });
    };

    const getSubstitutionForRequest = (requestId) => requestHistory.find((request) =>
        request.type === 'Substitution Request' && request.sourceRequest === requestId
    );

    const renderRequestDetails = (request) => {
        activeRequestDetailsId = request.id;
        requestDetailsId.textContent = request.id;
        requestDetailsStatus.textContent = request.status;
        requestDetailsStatus.className = `badge ${statusBadgeClass(request.status)}`;
        requestDetailsType.textContent = request.type;
        requestDetailsDate.textContent = request.dateSubmitted;
        requestDetailsReviewer.textContent = request.reviewedBy || '—';
        requestDetailsUpdated.textContent = request.lastUpdated;
        requestDetailsComment.textContent = request.comment || 'No review comments yet.';

        if (request.type === 'Material Request') {
            const canRequestSubstitution = request.status === 'Approved';
            const existingSubstitution = getSubstitutionForRequest(request.id);

            if (!canRequestSubstitution) {
                requestDetailsHelper.textContent = 'A substitution request can only be created after the General Manager approves this material request.';
            } else if (existingSubstitution) {
                requestDetailsHelper.textContent = `${existingSubstitution.id} is already linked to this material request. Only one substitution request is allowed per material request.`;
            } else {
                requestDetailsHelper.textContent = 'If one or more approved materials need alternatives, create one substitution request for this material request and include all affected materials together.';
            }

            requestDetailsContent.innerHTML = `
                <div class="table-wrapper">
                    <table class="table request-details-table">
                        <thead>
                            <tr>
                                <th>Material</th>
                                <th>Category</th>
                                <th>Unit</th>
                                <th>Quantity</th>
                                <th>Remarks</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${(request.items || []).map((item) => `
                                <tr>
                                    <td><strong>${escapeHtml(item.name)}</strong><div class="text-muted-sm">${escapeHtml(item.id || '')}</div></td>
                                    <td>${escapeHtml(item.category)}</td>
                                    <td>${escapeHtml(item.unit)}</td>
                                    <td>${Number(item.qty).toLocaleString()}</td>
                                    <td>${escapeHtml(item.remarks || '—')}</td>
                                </tr>`).join('')}
                        </tbody>
                    </table>
                </div>
                ${canRequestSubstitution ? `
                    <div class="request-level-substitution-action">
                        ${existingSubstitution
                            ? `<div class="request-substitution-existing">
                                    <div>
                                        <span class="text-muted-sm">Linked Substitution Request</span>
                                        <strong>${escapeHtml(existingSubstitution.id)}</strong>
                                    </div>
                                    <span class="badge ${statusBadgeClass(existingSubstitution.status)}">${escapeHtml(existingSubstitution.status)}</span>
                               </div>`
                            : `<button type="button" class="btn btn-primary"
                                       data-action="request-substitution"
                                       data-request-id="${escapeHtml(request.id)}">
                                    <i class="fas fa-exchange-alt"></i>
                                    Request Substitution
                               </button>`}
                    </div>` : ''}`;
        } else {
            const lines = getSubstitutionLines(request);
            requestDetailsHelper.textContent = 'This substitution request is linked to one approved material request and may contain multiple material substitutions.';
            requestDetailsContent.innerHTML = `
                <div class="request-detail-grid mb-3">
                    <div class="request-detail-field"><span>Source Material Request</span><strong>${escapeHtml(request.sourceRequest || '—')}</strong></div>
                    <div class="request-detail-field"><span>Materials Included</span><strong>${lines.length}</strong></div>
                    <div class="request-detail-field"><span>Reason</span><strong>${escapeHtml(request.reason || '—')}</strong></div>
                    <div class="request-detail-field"><span>Supporting Notes</span><strong>${escapeHtml(request.notes || '—')}</strong></div>
                </div>
                <div class="table-wrapper">
                    <table class="table request-details-table">
                        <thead>
                            <tr>
                                <th>Original Material</th>
                                <th>Replacement Material</th>
                                <th>Quantity</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${lines.map((line) => `
                                <tr>
                                    <td><strong>${escapeHtml(line.originalMaterial)}</strong>${line.sourceMaterialId ? `<div class="text-muted-sm">${escapeHtml(line.sourceMaterialId)}</div>` : ''}</td>
                                    <td>${escapeHtml(line.replacementMaterial)}</td>
                                    <td>${Number(line.qty).toLocaleString()} ${escapeHtml(line.unit || '')}</td>
                                </tr>`).join('')}
                        </tbody>
                    </table>
                </div>`;
        }

        openModal('requestDetailsModal');
    };

    const getNextRequestId = (prefix) => {
        const matching = requestHistory
            .map((request) => request.id)
            .filter((id) => id.startsWith(`${prefix}-2026-`))
            .map((id) => Number.parseInt(id.split('-').pop(), 10))
            .filter(Number.isInteger);
        const next = (matching.length ? Math.max(...matching) : 100) + 1;
        return `${prefix}-2026-${String(next).padStart(3, '0')}`;
    };

    const refreshAllRequestUI = () => {
        updatePendingRequestState();
        renderTrackingSummary();
        renderRequestTracking();
    };

    const replacementInputFor = (originalMaterialName) => `
        <input type="text"
               class="form-control table-material-combobox substitution-replacement-input"
               list="materialCatalogOptions"
               placeholder="Select or enter replacement..."
               autocomplete="off"
               data-original-material="${escapeHtml(originalMaterialName)}"
               disabled>`;

    const updateSubstitutionSelectionCount = () => {
        const selected = substitutionItemsBody.querySelectorAll('.substitution-line-select:checked').length;
        substitutionSelectionCount.textContent = `${selected} material${selected === 1 ? '' : 's'} selected`;
    };

    const setSubstitutionRowEnabled = (row, enabled) => {
        row.classList.toggle('is-selected', enabled);
        const replacement = row.querySelector('.substitution-replacement-input');
        const qtyInput = row.querySelector('.substitution-qty-input');

        replacement.disabled = !enabled;
        qtyInput.disabled = !enabled;

        if (!enabled) {
            replacement.value = '';
            qtyInput.value = '';
        }
    };

    const renderSubstitutionItems = (request) => {
        substitutionItemsBody.innerHTML = (request.items || []).map((material) => `
            <tr data-material-id="${escapeHtml(material.id)}">
                <td class="substitution-select-cell">
                    <input type="checkbox" class="substitution-line-select"
                           aria-label="Include ${escapeHtml(material.name)} in substitution request">
                </td>
                <td>
                    <strong>${escapeHtml(material.name)}</strong>
                    <div class="text-muted-sm">${escapeHtml(material.id)}</div>
                </td>
                <td>${Number(material.qty).toLocaleString()} ${escapeHtml(material.unit)}</td>
                <td>
                    ${replacementInputFor(material.name)}
                </td>
                <td>
                    <input type="number" class="form-control table-input-number substitution-qty-input"
                           min="1" max="${Number(material.qty)}" placeholder="0" disabled>
                    <div class="text-muted-sm">Max ${Number(material.qty).toLocaleString()} ${escapeHtml(material.unit)}</div>
                </td>
            </tr>`).join('');

        updateSubstitutionSelectionCount();
    };

    const openSubstitutionRequest = (requestId) => {
        const request = requestHistory.find((item) => item.id === requestId && item.type === 'Material Request');

        if (!request) {
            showToast('Unable to Open Request', 'The selected material request could not be found.', 'danger');
            return;
        }

        if (request.status !== 'Approved') {
            showToast('Approval Required', 'Only an approved material request can have a substitution request.', 'danger');
            return;
        }

        const existing = getSubstitutionForRequest(request.id);
        if (existing) {
            showToast(
                'Substitution Already Exists',
                `${existing.id} is already linked to ${request.id}. Only one substitution request is allowed per material request.`,
                'info'
            );
            return;
        }

        activeSubstitutionContext = {
            requestId: request.id,
            items: structuredCloneSafe(request.items || [])
        };

        subSourceRequestId.textContent = request.id;
        subReason.value = '';
        subNotes.value = '';
        renderSubstitutionItems(request);

        // Request Details stays active underneath. Because the child modal is later
        // in the DOM and has a higher overlay z-index, it appears above the source view.
        openModal('substitutionRequestModal');
    };

    const getSelectedSubstitutionLines = () => {
        if (!activeSubstitutionContext) return [];

        return Array.from(substitutionItemsBody.querySelectorAll('tr'))
            .filter((row) => row.querySelector('.substitution-line-select')?.checked)
            .map((row) => {
                const material = activeSubstitutionContext.items.find((item) => item.id === row.dataset.materialId);
                return {
                    material,
                    replacementMaterial: row.querySelector('.substitution-replacement-input')?.value || '',
                    qty: Number.parseInt(row.querySelector('.substitution-qty-input')?.value, 10)
                };
            });
    };

    const validateSubstitution = () => {
        if (!activeSubstitutionContext) {
            showToast('Source Request Missing', 'Open an approved material request first.', 'danger');
            return false;
        }

        const selected = getSelectedSubstitutionLines();

        if (selected.length === 0) {
            showToast('No Materials Selected', 'Select at least one material to include in the substitution request.', 'danger');
            return false;
        }

        for (const line of selected) {
            if (!line.material || !line.replacementMaterial.trim() || !Number.isInteger(line.qty) || line.qty < 1) {
                showToast('Incomplete Material Substitution', 'Every selected material needs a replacement material and a valid quantity.', 'danger');
                return false;
            }

            if (normalizeMaterialName(line.replacementMaterial) === normalizeMaterialName(line.material.name)) {
                showToast('Invalid Replacement', `${line.material.name} cannot be substituted with the same material.`, 'danger');
                return false;
            }

            if (line.qty > Number(line.material.qty)) {
                showToast(
                    'Quantity Exceeds Approval',
                    `${line.material.name} cannot exceed the approved quantity of ${Number(line.material.qty).toLocaleString()} ${line.material.unit}.`,
                    'danger'
                );
                return false;
            }
        }

        if (!subReason.value) {
            showToast('Reason Required', 'Select a reason for this substitution request.', 'danger');
            return false;
        }

        return true;
    };

    const renderTable = () => {
        const searchTerm = searchInput.value.trim().toLowerCase();
        const filterCat = categoryFilter.value;
        tableBody.innerHTML = '';

        const filteredData = materialList.filter((item) => {
            const matchesSearch = item.name.toLowerCase().includes(searchTerm) || item.id.toLowerCase().includes(searchTerm);
            const matchesCat = filterCat === 'All' || item.category === filterCat;
            return matchesSearch && matchesCat;
        });

        if (filteredData.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="7" class="empty-state-row">No materials found matching your criteria.</td></tr>';
        } else {
            filteredData.forEach((item) => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td><strong>${escapeHtml(item.id)}</strong></td>
                    <td>${escapeHtml(item.name)}</td>
                    <td><span class="badge badge-info">${escapeHtml(item.category)}</span></td>
                    <td>${escapeHtml(item.unit)}</td>
                    <td class="font-semibold">${Number(item.qty).toLocaleString()}</td>
                    <td class="text-muted-sm">${escapeHtml(item.remarks || '-')}</td>
                    <td class="text-right">
                        <div class="inline-table-actions">
                            <button type="button" class="action-btn edit" data-action="edit-material" data-id="${escapeHtml(item.id)}" title="Edit material"><i class="fas fa-edit"></i></button>
                            <button type="button" class="action-btn delete" data-action="delete-material" data-id="${escapeHtml(item.id)}" title="Remove material"><i class="fas fa-trash-alt"></i></button>
                        </div>
                    </td>`;
                tableBody.appendChild(tr);
            });
        }

    };

    const resetAddForm = () => {
        materialForm.reset();
        inCategory.value = '';
        inUnit.value = '';
        inCategory.dataset.catalogSource = '';
        inUnit.dataset.catalogSource = '';
        inCategory.readOnly = true;
        inUnit.readOnly = true;
        inCategory.placeholder = 'Auto-filled for listed materials';
        inUnit.placeholder = 'Auto-filled for listed materials';
    };

    const openEditMaterial = (id) => {
        const item = materialList.find((material) => material.id === id);
        if (!item) return;
        activeEditId = id;
        editMaterialIdDisplay.textContent = item.id;
        editMatName.value = item.name;
        editMatCategory.value = item.category;
        editMatUnit.value = item.unit;
        editMatCategory.dataset.catalogSource = '';
        editMatUnit.dataset.catalogSource = '';

        if (getCatalogItem(item.name)) {
            syncMaterialMetadataMode(editMatName, editMatCategory, editMatUnit);
        } else {
            syncMaterialMetadataMode(editMatName, editMatCategory, editMatUnit, true);
        }

        editMatQty.value = item.qty;
        editMatRemarks.value = item.remarks || '';
        openModal('editMaterialModal');
    };

    const openDeleteMaterial = (id) => {
        const item = materialList.find((material) => material.id === id);
        if (!item) return;
        pendingDeleteId = id;
        deleteMaterialName.textContent = `${item.name} (${item.id})`;
        openModal('deleteMaterialModal');
    };

    const syncAddMaterialMetadata = () => syncMaterialMetadataMode(inName, inCategory, inUnit);
    const syncEditMaterialMetadata = () => syncMaterialMetadataMode(editMatName, editMatCategory, editMatUnit);

    inName.addEventListener('input', syncAddMaterialMetadata);
    inName.addEventListener('change', syncAddMaterialMetadata);
    editMatName.addEventListener('input', syncEditMaterialMetadata);
    editMatName.addEventListener('change', syncEditMaterialMetadata);

    materialForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const materialName = inName.value.trim();
        const catalogItem = getCatalogItem(materialName);
        const category = catalogItem?.category || inCategory.value.trim();
        const unit = catalogItem?.unit || inUnit.value.trim();
        const qty = Number.parseInt(inQty.value, 10);

        if (!materialName || !category || !unit || !Number.isInteger(qty) || qty < 1) {
            showToast(
                'Incomplete Material',
                'Enter a material name, category, unit, and valid quantity. Existing materials will auto-fill their category and unit.',
                'danger'
            );
            return;
        }

        const newItem = {
            id: `MAT-${nextIdCounter++}`,
            name: catalogItem?.name || materialName,
            category,
            unit,
            qty,
            remarks: inRemarks.value.trim()
        };

        if (!catalogItem) rememberCustomMaterial(newItem);

        materialList.push(newItem);
        resetAddForm();
        renderTable();
        showToast('Material Added', `${newItem.name} was added to the request manifest.`, 'success');
    });

    tableBody.addEventListener('click', (event) => {
        const button = event.target.closest('[data-action]');
        if (!button) return;
        const id = button.dataset.id;
        if (button.dataset.action === 'edit-material') openEditMaterial(id);
        if (button.dataset.action === 'delete-material') openDeleteMaterial(id);
    });

    editMaterialForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const item = materialList.find((material) => material.id === activeEditId);
        const materialName = editMatName.value.trim();
        const catalogItem = getCatalogItem(materialName);
        const category = catalogItem?.category || editMatCategory.value.trim();
        const unit = catalogItem?.unit || editMatUnit.value.trim();
        const qty = Number.parseInt(editMatQty.value, 10);

        if (!item || !materialName || !category || !unit || !Number.isInteger(qty) || qty < 1) {
            showToast('Unable to Save', 'Please provide a material name, category, unit, and valid quantity.', 'danger');
            return;
        }

        item.name = catalogItem?.name || materialName;
        item.category = category;
        item.unit = unit;
        item.qty = qty;
        item.remarks = editMatRemarks.value.trim();

        if (!catalogItem) rememberCustomMaterial(item);

        renderTable();
        closeModal('editMaterialModal');
        showToast('Material Updated', `${item.id} was updated successfully.`, 'success');
        activeEditId = null;
    });

    confirmDeleteMaterialBtn.addEventListener('click', () => {
        const item = materialList.find((material) => material.id === pendingDeleteId);
        if (!item) {
            closeModal('deleteMaterialModal');
            return;
        }
        materialList = materialList.filter((material) => material.id !== pendingDeleteId);
        renderTable();
        closeModal('deleteMaterialModal');
        showToast('Material Removed', `${item.name} was removed from the draft requisition.`, 'info');
        pendingDeleteId = null;
    });

    searchInput.addEventListener('input', renderTable);
    categoryFilter.addEventListener('change', renderTable);
    btnExport.addEventListener('click', () => showToast('Export Initiated', 'Manifest is downloading as CSV format...', 'primary'));
    btnSaveDraft.addEventListener('click', () => showToast('Draft Saved', 'Your requisition progress has been securely cached.', 'success'));

    btnOpenSubmitReq.addEventListener('click', () => {
        if (materialList.length === 0) {
            showToast('Submission Failed', 'Cannot submit an empty requisition manifest.', 'danger');
            return;
        }
        updatePendingRequestState();
        openModal('submitReqModal');
    });

    confirmSubmitBtn.addEventListener('click', () => {
        if (materialList.length === 0) {
            showToast('Submission Failed', 'Cannot submit an empty requisition manifest.', 'danger');
            return;
        }

        const requestId = getNextRequestId('REQ');
        const date = formatPrototypeDate();
        requestHistory.unshift({
            id: requestId,
            type: 'Material Request',
            dateSubmitted: date,
            status: 'Pending',
            reviewedBy: '—',
            lastUpdated: date,
            comment: 'Awaiting General Manager review.',
            items: structuredCloneSafe(materialList)
        });
        persistRequestHistory();

        materialList = [];
        renderTable();
        closeModal('submitReqModal');
        refreshAllRequestUI();

        const pendingCount = getPendingMaterialRequests().length;
        showToast('Request Submitted', `${requestId} was routed to the General Manager. You now have ${pendingCount} pending material request${pendingCount === 1 ? '' : 's'}.`, 'success');
    });

    requestDetailsContent.addEventListener('click', (event) => {
        const button = event.target.closest('[data-action="request-substitution"]');
        if (!button) return;
        openSubstitutionRequest(button.dataset.requestId);
    });

    substitutionItemsBody.addEventListener('change', (event) => {
        const checkbox = event.target.closest('.substitution-line-select');
        if (!checkbox) return;

        const row = checkbox.closest('tr');
        setSubstitutionRowEnabled(row, checkbox.checked);
        updateSubstitutionSelectionCount();
    });

    substitutionRequestForm.addEventListener('submit', (event) => {
        event.preventDefault();
        if (!validateSubstitution()) return;

        const requestId = getNextRequestId('SUB');
        const date = formatPrototypeDate();
        const sourceRequest = requestHistory.find((request) => request.id === activeSubstitutionContext.requestId);
        const selectedLines = getSelectedSubstitutionLines();

        const substitutions = selectedLines.map((line) => ({
            sourceMaterialId: line.material.id,
            originalMaterial: line.material.name,
            replacementMaterial: line.replacementMaterial.trim(),
            qty: line.qty,
            unit: line.material.unit
        }));

        requestHistory.unshift({
            id: requestId,
            type: 'Substitution Request',
            dateSubmitted: date,
            status: 'Pending',
            reviewedBy: '—',
            lastUpdated: date,
            comment: 'Awaiting General Manager review.',
            sourceRequest: activeSubstitutionContext.requestId,
            reason: subReason.value,
            notes: subNotes.value.trim(),
            substitutions
        });
        persistRequestHistory();

        substitutionRequestForm.reset();
        closeModal('substitutionRequestModal');
        refreshAllRequestUI();

        if (sourceRequest) {
            renderRequestDetails(sourceRequest);
        }

        const materialCount = substitutions.length;
        activeSubstitutionContext = null;
        showToast(
            'Substitution Submitted',
            `${requestId} was sent to the General Manager with ${materialCount} material substitution${materialCount === 1 ? '' : 's'}.`,
            'success'
        );
    });

    substitutionRequestModal.addEventListener('click', (event) => {
        if (event.target.closest('[data-modal-close]') || event.target.id === 'substitutionRequestModal') {
            window.setTimeout(() => {
                if (!substitutionRequestModal.classList.contains('active')) {
                    substitutionRequestForm.reset();
                    substitutionItemsBody.innerHTML = '';
                    substitutionSelectionCount.textContent = '0 materials selected';
                    activeSubstitutionContext = null;
                }
            }, 0);
        }
    });

    trackingSearchInput.addEventListener('input', renderRequestTracking);
    trackingTypeFilter.addEventListener('change', renderRequestTracking);
    trackingStatusFilter.addEventListener('change', renderRequestTracking);
    btnExportTracking.addEventListener('click', () => showToast('Export Started', 'Generating request tracking report...', 'primary'));

    requestTrackingTableBody.addEventListener('click', (event) => {
        const button = event.target.closest('[data-action="view-request"]');
        if (!button) return;
        const request = requestHistory.find((item) => item.id === button.dataset.id);
        if (request) renderRequestDetails(request);
    });

    btnViewPendingRequests.addEventListener('click', () => {
        trackingTypeFilter.value = 'Material Request';
        trackingStatusFilter.value = 'Pending';
        trackingSearchInput.value = '';
        activateTab('request-tracking');
        renderRequestTracking();
    });

    populateMaterialDatalist();
    resetAddForm();
    renderTable();
    refreshAllRequestUI();
});
